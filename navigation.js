const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const links = [...document.querySelectorAll('[data-nav-link]')];
const mobile = matchMedia('(max-width: 760px)');
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let navFrame = 0;

function closeMenu(returnFocus = false) {
  header.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.querySelector('.nav-toggle-label').textContent = 'MENU';
  if (returnFocus) toggle.focus();
}
toggle.hidden = false;
header.classList.add('nav-enhanced');
toggle.addEventListener('click', () => {
  if (header.classList.contains('menu-open')) return closeMenu();
  header.classList.add('menu-open');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.querySelector('.nav-toggle-label').textContent = 'CLOSE';
});
header.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    closeMenu(true);
    event.preventDefault();
  }
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
header.addEventListener('focusout', event => {
  if (!header.contains(event.relatedTarget)) closeMenu();
});
header.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    closeMenu();
    // Move keyboard focus to the destination before the hidden menu link
    // drops out of the tab order. Native anchors still own scrolling/history.
    const focusTarget = target.id === 'home' ? document.querySelector('#scene') : target;
    if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
    focusTarget.focus({ preventScroll: true });
  });
});
mobile.addEventListener('change', () => closeMenu());

function updateNavigation() {
  navFrame = 0;
  const marker = header.getBoundingClientRect().bottom + 35;
  let active = 0;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= marker) active = index;
  });
  links.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleNavigation() {
  if (!navFrame) navFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('hashchange', scheduleNavigation);
updateNavigation();
