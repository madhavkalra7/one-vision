'use strict';

// Motion is progressive enhancement: without this file, all content stays visible.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionRoot = document.documentElement;
let revealObserver;
let intro;
let introTimer;
let introVisible = false;
let resumeCarousel = () => {};

function finishIntro() {
  clearTimeout(introTimer);
  document.removeEventListener('focusin', finishIntroOnFocus);
  introVisible = false;
  intro?.remove();
  intro = undefined;
  motionRoot.classList.remove('intro-playing');
  resumeCarousel();
}

function finishIntroOnFocus(event) {
  if (intro && !intro.contains(event.target)) finishIntro();
}

function startIntro() {
  if (!document.querySelector('.hero') || motionPreference.matches) return;
  try {
    if (sessionStorage.getItem('one-vision-intro-seen')) return;
    sessionStorage.setItem('one-vision-intro-seen', '1');
  } catch {
    // Restricted storage should never prevent entering the website.
  }
  intro = document.createElement('div');
  intro.className = 'brand-intro';
  intro.innerHTML = '<div class="intro-words" aria-hidden="true"><span>Your property.</span><span>Our focus.</span><span>One Vision.</span></div><img src="/assets/logo.svg" class="intro-brand" alt="" aria-hidden="true" width="240" height="56"><button class="intro-skip" type="button">Skip intro <span aria-hidden="true">→</span></button>';
  intro.querySelector('button').addEventListener('click', finishIntro);
  intro.addEventListener('animationend', event => {
    if (event.target === intro) finishIntro();
  });
  document.body.prepend(intro);
  document.addEventListener('focusin', finishIntroOnFocus);
  introVisible = true;
  motionRoot.classList.add('intro-playing');
  introTimer = setTimeout(finishIntro, 3300);
}

function setupReveals() {
  const selector = [
    '.block .eyebrow', '.block h2', '.block .split > img',
    '.block .split > div > p', '.block .split > div > .text-link',
    '.block .split > div > .button', '.center > p', '.center > .text-link',
    '.line-card', '.value', '.service-grid > article', '.list-item',
    '.value-row', '.step', '.proof-grid > div', '.faq-grid > div',
    '.statement', '.contact-grid > div', '.contact-grid > form',
    '.cta > img', '.cta-copy > *', '.band-photo > p',
    '.section-heading', '.person-card', '.quote-card', '.commitment-item',
    '.place-card', '.area-form', '.photo-mosaic', '.journal-card',
    '.access-card', '.facts-list', '.comparison-scroll', '.guide-copy > section',
    '.rental-search', '.empty-properties'
  ].join(',');
  // Animate a group or its children, never both, so their delays don't compound.
  const candidates = [...document.querySelectorAll(selector)];
  const elements = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el)));
  const show = el => {
    el.classList.add('is-visible');
    revealObserver?.unobserve(el);
  };
  if (motionPreference.matches || !('IntersectionObserver' in window)) {
    revealObserver?.disconnect();
    elements.forEach(show);
    motionRoot.classList.remove('motion-ready');
    return;
  }
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
  elements.forEach(el => {
    el.classList.add('reveal');
    const group = el.closest('.three, .values, .service-grid, .proof-grid, .steps, .card-rail, .quote-grid, .place-grid, .commitment-list');
    if (group) {
      const index = [...group.children].indexOf(el);
      el.style.setProperty('--reveal-delay', `${Math.max(0, index % 4) * 90}ms`);
    }
    // Hash targets and elements already visible on a restored page stay visible.
    const rect = el.getBoundingClientRect();
    if (rect.top < innerHeight - 35 && rect.bottom > 0) show(el);
    else revealObserver.observe(el);
  });
  motionRoot.classList.add('motion-ready');
  document.addEventListener('focusin', event => {
    event.target.closest('.reveal')?.classList.add('is-visible');
  });
  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    target?.closest('.reveal')?.classList.add('is-visible');
  });
}

function setupCarousel() {
  const hero = document.querySelector('.hero');
  const first = document.querySelector('#hero-image');
  if (!hero || !first) return;
  const slides = [
    ['home', 'Contemporary home with a swimming pool and terrace', 'A fresh perspective on property'],
    ['interior', 'A welcoming open-plan home interior', 'Thoughtful spaces. Everyday living.'],
    ['living', 'A light-filled living room', 'A place to call home']
  ];
  const images = [first];
  slides.slice(1).forEach(([name, alt]) => {
    const image = new Image();
    image.src = `/assets/${name}.webp`;
    image.alt = alt;
    image.width = 1920;
    image.height = 1280;
    image.decoding = 'async';
    image.setAttribute('aria-hidden', 'true');
    hero.insertBefore(image, first);
    images.push(image);
  });
  first.classList.add('is-active');
  hero.classList.add('has-carousel');
  const dots = [...hero.querySelectorAll('[data-slide]')];
  const caption = hero.querySelector('#slide-caption');
  caption.setAttribute('aria-live', 'off');
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'carousel-pause';
  pause.textContent = 'Pause';
  pause.setAttribute('aria-label', 'Pause slideshow');
  hero.querySelector('.dots').before(pause);
  let current = 0;
  let requested = 0;
  let timer;
  let manuallyPaused = false;
  let hovered = false;
  let focused = false;
  let inView = true;
  function schedule() {
    clearTimeout(timer);
    const paused = manuallyPaused || hovered || focused || document.hidden || !inView || introVisible || motionPreference.matches;
    hero.classList.toggle('slideshow-paused', paused);
    if (!paused) timer = setTimeout(() => showSlide((current + 1) % slides.length), 6500);
  }
  async function showSlide(index) {
    const request = ++requested;
    clearTimeout(timer);
    try { await images[index].decode(); } catch { schedule(); return; }
    if (request !== requested) return;
    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === index);
      image.setAttribute('aria-hidden', String(i !== index));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    caption.textContent = slides[index][2];
    current = index;
    schedule();
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  pause.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    pause.textContent = manuallyPaused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', manuallyPaused ? 'Play slideshow' : 'Pause slideshow');
    schedule();
  });
  hero.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  hero.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', event => { focused = hero.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }).observe(hero);
  }
  motionPreference.addEventListener('change', schedule);
  resumeCarousel = schedule;
  schedule();
}

function setupAccordions() {
  if (!Element.prototype.animate) return;
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    let animation;
    let targetOpen = details.open;
    summary.addEventListener('click', event => {
      if (motionPreference.matches) return;
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      animation?.cancel();
      targetOpen = !targetOpen;
      details.open = false;
      const closedHeight = details.getBoundingClientRect().height;
      details.open = true;
      const to = targetOpen ? details.getBoundingClientRect().height : closedHeight;
      details.style.overflow = 'hidden';
      animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)'
      });
      animation.onfinish = () => {
        details.open = targetOpen;
        details.style.overflow = '';
        animation = undefined;
      };
    });
    motionPreference.addEventListener('change', () => {
      animation?.cancel();
      animation = undefined;
      details.open = targetOpen;
      details.style.overflow = '';
    });
    details.addEventListener('toggle', () => { if (!animation) targetOpen = details.open; });
  });
}

startIntro();
setupReveals();
setupCarousel();
setupAccordions();
motionRoot.classList.add('motion-enabled');
const header = document.querySelector('header');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
motionPreference.addEventListener('change', () => {
  if (motionPreference.matches) {
    finishIntro();
    revealObserver?.disconnect();
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    motionRoot.classList.remove('motion-ready');
  }
});
