const hero = document.querySelector('#scene');
const stage = document.querySelector('.hero-stage');
const about = document.querySelector('#about');
const projects = document.querySelector('#projects');
const nextProject = document.querySelector('#project-movemate');
const skills = document.querySelector('#skills');
const contact = document.querySelector('#contact');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const fullMotion = new URLSearchParams(location.search).get('motion') === 'full';
const targets = [...document.querySelectorAll('[data-reveal]')];
let observer;
let scrollFrame = 0;
let spiderArea = false;
const progressWindow = (value, start, end) => {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

function updateScroll() {
  scrollFrame = 0;
  const heroRect = hero.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const aboutRect = about.getBoundingClientRect();
  const heroProgress = Math.min(1, Math.max(0, -stageRect.top / heroRect.height));
  const lineProgress = Math.min(1, Math.max(0, (innerHeight - aboutRect.top) / (innerHeight * .55)));
  hero.style.setProperty('--hero-scroll', heroProgress);
  hero.style.setProperty('--transition-progress', heroProgress);
  hero.style.setProperty('--web-draw', Math.min(1, heroProgress / .52));
  hero.style.setProperty('--web-opacity', Math.sin(Math.PI * Math.min(1, heroProgress / .92)) * .85);
  hero.style.setProperty('--web-rays-draw', progressWindow(heroProgress, .02, .5));
  hero.style.setProperty('--web-inner-draw', progressWindow(heroProgress, .12, .58));
  hero.style.setProperty('--web-outer-draw', progressWindow(heroProgress, .2, .75));
  hero.style.setProperty('--web-glint', progressWindow(heroProgress, .08, .85));
  hero.style.setProperty('--web-flare', Math.sin(Math.PI * progressWindow(heroProgress, .15, .85)));
  about.style.setProperty('--transition-progress', heroProgress);
  about.style.setProperty('--cut-height', `${Math.min(280, heroRect.height * .3) * (1 - heroProgress)}px`);
  about.style.setProperty('--line-progress', lineProgress);
  // Hand the web's reveal to the companion once About enters the scene.
  // Notify only at the boundary, using the layout read already above.
  const nextSpiderArea = aboutRect.top <= innerHeight * .55;
  if (nextSpiderArea !== spiderArea) {
    spiderArea = nextSpiderArea;
    document.dispatchEvent(new CustomEvent('portfolio:spider-area', { detail: { active: spiderArea } }));
  }
  // Join the two sections while their boundary crosses the viewport. Keep
  // layout fixed: decorative transforms must not move the scroll trigger.
  const projectTop = projects.getBoundingClientRect().top;
  const handoff = Math.min(1, Math.max(0, (innerHeight * 1.05 - projectTop) / (innerHeight * 1.05)));
  about.style.setProperty('--work-handoff', handoff);
  projects.style.setProperty('--work-handoff', handoff);
  projects.style.setProperty('--work-entry', Math.min(1, handoff / .65));
  projects.style.setProperty('--strand-draw', Math.min(1, handoff / .7));
  projects.style.setProperty('--strand-opacity', Math.sin(Math.PI * handoff) * .9);
  projects.style.setProperty('--strand-detail', progressWindow(handoff, .18, .9));
  projects.style.setProperty('--strand-glint', progressWindow(handoff, .05, .95));
  // The second story entering the viewport swaps the pinned visual. This
  // derives from layout rather than fixed offsets, so resizing stays in sync.
  const nextTop = nextProject.getBoundingClientRect().top;
  const projectBlend = Math.min(1, Math.max(0, (innerHeight * .85 - nextTop) / (innerHeight * .45)));
  projects.style.setProperty('--project-blend', projectBlend);
  const skillTop = skills.getBoundingClientRect().top;
  const skillEntry = Math.min(1, Math.max(0, (innerHeight - skillTop) / (innerHeight * .8)));
  skills.style.setProperty('--toolkit-entry', skillEntry);
  skills.style.setProperty('--toolkit-thread-opacity', Math.sin(Math.PI * skillEntry));
  skills.style.setProperty('--chapter-detail', progressWindow(skillEntry, .2, .9));
  skills.style.setProperty('--chapter-glint', progressWindow(skillEntry, .08, .96));
  const contactTop = contact.getBoundingClientRect().top;
  const contactEntry = Math.min(1, Math.max(0, (innerHeight - contactTop) / (innerHeight * .8)));
  contact.style.setProperty('--contact-entry', contactEntry);
  contact.style.setProperty('--contact-thread-opacity', Math.sin(Math.PI * contactEntry));
  contact.style.setProperty('--chapter-detail', progressWindow(contactEntry, .2, .9));
  contact.style.setProperty('--chapter-glint', progressWindow(contactEntry, .08, .96));
}
function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}
function configureMotion() {
  observer?.disconnect();
  window.removeEventListener('scroll', scheduleScroll);
  window.removeEventListener('resize', scheduleScroll);
  if (!fullMotion && reducedMotion.matches) {
    document.body.classList.remove('cinematic-motion');
    about.classList.remove('motion-ready');
    projects.classList.remove('motion-ready');
    skills.classList.remove('motion-ready');
    contact.classList.remove('motion-ready');
    targets.forEach(target => target.classList.add('is-visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) return;
  document.body.classList.add('cinematic-motion');
  about.classList.add('motion-ready');
  projects.classList.add('motion-ready');
  skills.classList.add('motion-ready');
  contact.classList.add('motion-ready');
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
  targets.filter(target => !target.classList.contains('is-visible')).forEach(target => observer.observe(target));
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  updateScroll();
}
reducedMotion.addEventListener('change', configureMotion);
configureMotion();

const skillExamples = {
  web: { focus: 'JAVA', name: 'E-Book Management System', description: 'Connecting a book catalog, purchase workflow and admin tools with Java and MySQL.', href: '#project-bookstore' },
  mobile: { focus: 'ANDROID', name: 'MoveMate', description: 'Logging runs offline with SQLite, syncing with Firebase and scheduling reminders with WorkManager.', href: '#project-movemate' },
  ai: { focus: 'PYTHON', name: 'SmartML', description: 'Exploring datasets, training machine learning models and comparing results with scikit-learn.', href: '#smartml-title' },
  data: { focus: 'SQL', name: 'E-Book Management System', description: 'Organizing the catalog, orders and transaction history with MySQL and a modular DAO architecture.', href: '#project-bookstore' }
};
const skillButtons = [...document.querySelectorAll('[data-skill]')];
function selectSkill(key) {
  if (skills.dataset.activeSkill === key) return;
  const example = skillExamples[key];
  skills.dataset.activeSkill = key;
  skillButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.skill === key)));
  document.querySelector('#map-focus').textContent = example.focus;
  document.querySelector('#skill-proof-name').textContent = example.name;
  document.querySelector('#skill-proof-description').textContent = example.description;
  document.querySelector('#skill-proof-link').setAttribute('href', example.href);
}
skillButtons.forEach(button => {
  button.addEventListener('click', () => selectSkill(button.dataset.skill));
});

const copyEmail = document.querySelector('#copy-email');
const copyStatus = document.querySelector('#copy-email-status');
if (navigator.clipboard?.writeText) {
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    const email = document.querySelector('#contact-email-link').getAttribute('href').slice(7);
    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = 'Email copied.';
    } catch {
      copyStatus.textContent = 'Select the email above to copy it.';
    }
  });
}
