import { setupSpidy } from './spidy-chat.js?v=2';

const dialog = document.querySelector('#web-swing-dialog');
let game, opening = false, opener;
async function openGame(event) {
  if (opening || dialog.open) return;
  opening = true;
  opener = event?.currentTarget || document.querySelector('[data-open-game]');
  document.dispatchEvent(new CustomEvent('portfolio:close-chat'));
  try {
    const { createWebSwing } = await import('./web-swing.js?v=5');
    game ||= createWebSwing(dialog);
    dialog.showModal();
    document.body.classList.add('play-modal');
    document.querySelector('#play-web-swing').setAttribute('aria-expanded', 'true');
    document.dispatchEvent(new CustomEvent('portfolio:overlay', { detail: { active: true } }));
    game.open();
  } finally { opening = false; }
}
function closeGame() {
  game?.stop();
  dialog.close();
}
dialog.addEventListener('close', () => {
  game?.stop();
  document.body.classList.remove('play-modal');
  document.querySelector('#play-web-swing').setAttribute('aria-expanded', 'false');
  document.dispatchEvent(new CustomEvent('portfolio:overlay', { detail: { active: false } }));
  const target = opener?.closest('#spidy-panel') ? document.querySelector('#ask-spidy') : opener;
  target?.focus({ preventScroll: true });
});
dialog.addEventListener('cancel', event => { event.preventDefault(); closeGame(); });
dialog.querySelector('[data-close-game]').addEventListener('click', closeGame);
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeGame(); } });
document.querySelectorAll('[data-open-game]').forEach(button => button.addEventListener('click', openGame));
document.addEventListener('portfolio:open-game', () => openGame());
setupSpidy();
