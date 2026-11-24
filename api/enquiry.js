// Vercel serverless function: emails website enquiries to the One Vision inbox via Resend.
// Required Vercel environment variables:
//   RESEND_API_KEY  – API key from https://resend.com (keep secret; never commit)
// Optional:
//   ENQUIRY_FROM    – sender address. Defaults to Resend's shared test sender, which can only deliver to the
//                     email address the Resend account was created with. Once a domain is verified in Resend,
//                     set e.g. "One Vision Website <website@yourdomain.com.au>".
//   ENQUIRY_TO      – recipient inbox (defaults to admin@onevisionpropertygroup.com.au)

const LIMITS = {name: 120, email: 200, phone: 40, help: 60, address: 300, message: 5000};
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {RESEND_API_KEY} = process.env;
  const from = process.env.ENQUIRY_FROM || 'One Vision Website <onboarding@resend.dev>';
  const to = process.env.ENQUIRY_TO || 'admin@onevisionpropertygroup.com.au';
  if (!RESEND_API_KEY) return res.status(500).json({error: 'Enquiry service is not configured'});

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({error: 'Invalid request'});

  // Spam trap: real visitors never fill this hidden field. Pretend success for bots.
  if (body.website) return res.status(200).json({ok: true});

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) data[key] = String(body[key] ?? '').trim().slice(0, max);
  if (!data.name || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({error: 'Please provide your name, a valid email address and a message.'});
  }

  const rows = [['Name', data.name], ['Email', data.email], ['Phone', data.phone], ['Enquiry type', data.help], ['Property address', data.address]]
    .filter(([, v]) => v);
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${data.message}`;
  const html = `<h2>New website enquiry</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`).join('')}</table><p><strong>Message</strong></p><p style="white-space:pre-wrap">${esc(data.message)}</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `Website enquiry: ${data.help || 'General enquiry'} – ${data.name}`.replace(/[\r\n]+/g, ' '),
      text,
      html
    })
  });

  if (!response.ok) {
    console.error('Resend error', response.status, await response.text());
    return res.status(502).json({error: 'Your enquiry could not be sent. Please call or email us directly.'});
  }

  // Automatic thank-you to the visitor. Only possible once a domain is verified in Resend
  // (ENQUIRY_FROM set); the shared test sender cannot email visitors. Failure here never
  // blocks the enquiry, which has already been delivered.
  if (process.env.ENQUIRY_FROM) {
    const firstName = data.name.split(/\s+/)[0];
    const replyText = `Hi ${firstName},\n\nThank you for contacting One Vision Property Group. We have received your enquiry and will get back to you shortly.\n\nFor anything urgent, please call Amandeep Singh on +61 423 298 126 or Nisha Arora on +61 430 104 542.\n\nKind regards,\nOne Vision Property Group\n${to}\n\n---\nYour message:\n${data.message}`;
    const replyHtml = `<p>Hi ${esc(firstName)},</p><p>Thank you for contacting One Vision Property Group. We have received your enquiry and will get back to you shortly.</p><p>For anything urgent, please call Amandeep Singh on <a href="tel:+61423298126">+61 423 298 126</a> or Nisha Arora on <a href="tel:+61430104542">+61 430 104 542</a>.</p><p>Kind regards,<br><strong>One Vision Property Group</strong><br><a href="mailto:${esc(to)}">${esc(to)}</a></p><hr><p style="color:#676b65"><strong>Your message:</strong></p><p style="color:#676b65;white-space:pre-wrap">${esc(data.message)}</p>`;
    try {
      const reply = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({from, to: [data.email], reply_to: to, subject: 'Thank you for your enquiry – One Vision Property Group', text: replyText, html: replyHtml})
      });
      if (!reply.ok) console.error('Auto-reply error', reply.status, await reply.text());
    } catch (error) {
      console.error('Auto-reply error', error);
    }
  }
  return res.status(200).json({ok: true});
}
