const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const fullMotion = new URLSearchParams(location.search).get('motion') === 'full';
const allowMotion = () => fullMotion || !motionPreference.matches;
const chapters = [...document.querySelectorAll('#about, #projects, #skills, #contact')];
const titles = [...document.querySelectorAll('#about-title, #projects-title, #skills-title, #contact-title')];

// Preserve each heading's actual text and accent spans; only add line masks.
titles.forEach(title => {
  const children = [...title.childNodes];
  let line = [];
  let index = 0;
  const appendLine = () => {
    if (!line.length) return;
    const mask = document.createElement('span');
    const text = document.createElement('span');
    mask.className = 'chapter-line';
    text.className = 'chapter-text';
    text.style.setProperty('--line-index', index++);
    text.append(...line);
    mask.append(text);
    title.append(mask, document.createTextNode(' '));
    line = [];
  };
  title.replaceChildren();
  children.forEach(child => {
    if (child.nodeName === 'BR') appendLine();
    else line.push(child);
  });
  appendLine();
  title.classList.add('chapter-title');
});

const glyphs = {
  unfold: {
    label: 'Unfold the floating web fragment', caption: 'UNFOLD',
    art: '<path class="glyph-outline" d="M36 8L62 30L45 63L12 49L10 24Z"/><g class="glyph-fragments"><path d="M36 8L36 35L10 24Z"/><path d="M36 8L62 30L36 35Z"/><path d="M62 30L45 63L36 35Z"/><path d="M45 63L12 49L36 35Z"/><path d="M12 49L10 24L36 35Z"/></g>'
  },
  orbit: {
    label: 'Turn the floating orbital web', caption: 'ORBIT',
    art: '<circle class="glyph-outline" cx="36" cy="36" r="25"/><g class="glyph-orbits"><ellipse cx="36" cy="36" rx="30" ry="12"/><ellipse cx="36" cy="36" rx="12" ry="30" transform="rotate(35 36 36)"/><circle class="glyph-node" cx="6" cy="36" r="2.5"/><circle class="glyph-node" cx="55" cy="14" r="2.5"/></g><circle class="glyph-centre" cx="36" cy="36" r="4"/>'
  },
  connect: {
    label: 'Connect the floating web strands', caption: 'CONNECT',
    art: '<path class="glyph-outline" d="M36 7L61 21L61 51L36 65L11 51L11 21Z"/><path class="glyph-knit" pathLength="1" d="M36 7V65M11 21L61 51M61 21L11 51M36 20Q42 29 50 28Q46 37 50 44Q40 43 36 52Q30 43 22 44Q26 35 22 28Q31 29 36 20Z"/><g class="glyph-nodes"><circle cx="36" cy="7" r="2"/><circle cx="61" cy="21" r="2"/><circle cx="11" cy="51" r="2"/></g>'
  }
};
const placements = [['unfold', 'connect'], ['orbit', 'unfold'], ['connect', 'orbit'], ['unfold', 'connect']];
const fields = chapters.map((section, chapter) => {
  const field = document.createElement('div');
  field.className = 'ambient-field';
  placements[chapter].forEach((key, index) => {
    const definition = glyphs[key];
    const drift = document.createElement('div');
    drift.className = `glyph-drift glyph-position-${index + 1}`;
    drift.style.setProperty('--float-duration', `${7 + chapter + index * 2}s`);
    drift.style.setProperty('--float-delay', `${-chapter - index * 3}s`);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `ambient-glyph glyph-${key}`;
    button.setAttribute('aria-label', definition.label);
    button.innerHTML = `<svg class="glyph-art" viewBox="0 0 72 72" fill="none" aria-hidden="true">${definition.art}</svg><span class="glyph-caption" aria-hidden="true">${definition.caption}</span>`;
    let rect;
    let frame = 0;
    let timer;
    let x = 0;
    let y = 0;
    const activate = () => {
      button.classList.add('is-reacting');
      rect = button.getBoundingClientRect();
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      button.classList.remove('is-reacting');
      button.style.setProperty('--hover-x', '0deg');
      button.style.setProperty('--hover-y', '0deg');
    };
    button.addEventListener('pointerenter', activate);
    button.addEventListener('pointermove', event => {
      if (!allowMotion() || !rect) return;
      x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        button.style.setProperty('--hover-x', `${x * 12}deg`);
        button.style.setProperty('--hover-y', `${-y * 12}deg`);
      });
    });
    button.addEventListener('pointerleave', () => { if (!button.matches(':focus-visible')) reset(); });
    button.addEventListener('focus', activate);
    button.addEventListener('blur', () => { if (!button.matches(':hover')) reset(); });
    button.addEventListener('click', () => {
      activate();
      clearTimeout(timer);
      timer = setTimeout(() => { if (!button.matches(':hover, :focus-visible')) reset(); }, 900);
    });
    drift.append(button);
    field.append(drift);
  });
  section.append(field);
  return field;
});

let titleObserver;
let ambientObserver;
function configureDetails() {
  titleObserver?.disconnect();
  ambientObserver?.disconnect();
  if (!allowMotion() || !('IntersectionObserver' in window)) {
    titles.forEach(title => title.classList.add('title-in'));
    fields.forEach(field => {
      field.classList.remove('ambient-visible');
      field.querySelectorAll('.glyph-drift').forEach(glyph => glyph.classList.remove('glyph-visible'));
    });
    return;
  }
  titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('title-in');
      titleObserver.unobserve(entry.target);
    });
  }, { threshold: .15 });
  titles.forEach(title => {
    title.classList.add('title-ready');
    if (!title.classList.contains('title-in')) titleObserver.observe(title);
  });
  ambientObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('glyph-visible', entry.isIntersecting);
      const field = entry.target.parentElement;
      field.classList.toggle('ambient-visible', !!field.querySelector('.glyph-visible'));
    });
  }, { threshold: 0, rootMargin: '64px' });
  fields.forEach(field => field.querySelectorAll('.glyph-drift').forEach(glyph => ambientObserver.observe(glyph)));
}
function pauseAmbient() { document.body.classList.toggle('ambient-paused', document.hidden); }
document.addEventListener('visibilitychange', pauseAmbient);
window.addEventListener('blur', () => document.body.classList.add('ambient-paused'));
window.addEventListener('focus', pauseAmbient);
motionPreference.addEventListener('change', configureDetails);
pauseAmbient();
configureDetails();
