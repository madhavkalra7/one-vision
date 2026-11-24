// Set verified business contact details before enabling direct enquiries.
export default {
  name: 'One Vision',
  legalName: 'ONEVISION PROPERTY GROUP PTY LTD',
  abn: '37 700 329 102',
  email: 'admin@onevisionpropertygroup.com.au',
  phone: '+61 423 298 126',
  address: '',
  // Vercel function in api/enquiry.js (needs RESEND_API_KEY in Vercel). Set to '' to fall back to opening the visitor's email app.
  enquiryEndpoint: '/api/enquiry',
  canonicalOrigin: '',
  // Add only verified One Vision information. Empty collections have useful alternatives.
  owners: [
    {name: 'Amandeep Singh', role: 'Owner', phone: '+61 423 298 126', portrait: 'amandeep-singh-portrait', alternatePortrait: 'amandeep-singh-seated'},
    {name: 'Nisha Arora', role: 'Owner', phone: '+61 430 104 542', portrait: 'nisha-arora-portrait', alternatePortrait: 'nisha-arora-standing'}
  ],
  people: [
    {name: 'Amandeep Singh', role: 'Owner', image: '/assets/amandeep-singh-portrait.webp', email: 'admin@onevisionpropertygroup.com.au', phone: '+61 423 298 126'},
    {name: 'Nisha Arora', role: 'Owner', image: '/assets/nisha-arora-portrait.webp', email: 'admin@onevisionpropertygroup.com.au', phone: '+61 430 104 542'}
  ],
  testimonials: [],
  serviceAreas: [],
  properties: [],
  ownerPortalUrl: '',
  tenantPortalUrl: ''
};
