import { actions, facts, savedAnswer } from './public-knowledge.mjs';

export function setupSpidy() {
  const launcher = document.querySelector('#ask-spidy');
  const panel = document.querySelector('#spidy-panel');
  const messages = document.querySelector('#spidy-messages');
  const input = document.querySelector('#spidy-input');
  const send = document.querySelector('#spidy-send');
  const status = document.querySelector('#spidy-status');
  const suggestions = document.querySelector('#spidy-suggestions');
  let history = [], busy = false, request, generation = 0, gateFrame = 0, available = false;
  function area() {
    gateFrame = 0;
    available = document.querySelector('#about').getBoundingClientRect().top <= innerHeight * .55;
    launcher.hidden = !available || panel.open || document.body.classList.contains('play-modal');
    if (!available && panel.open) close(false);
  }
  function scheduleArea() { if (!gateFrame) gateFrame = requestAnimationFrame(area); }
  window.addEventListener('scroll', scheduleArea, { passive: true });
  window.addEventListener('resize', scheduleArea, { passive: true });
  document.addEventListener('portfolio:overlay', scheduleArea);
  function setMode(mode) {
    document.querySelector('#spidy-mode').textContent = mode === 'ai' ? 'AI portfolio guide' : 'Saved portfolio answers';
    document.querySelector('#spidy-note').textContent = mode === 'ai' ? 'AI questions are processed by Groq.' : 'Answers from the public portfolio.';
  }
  function addMessage(role, text, answer) {
    const article = document.createElement('div'); article.className = `spidy-message ${role}`;
    const name = document.createElement('span'); name.className = 'spidy-message-name'; name.textContent = role === 'user' ? 'YOU' : 'SPIDY / PORTFOLIO GUIDE';
    const body = document.createElement('p'); body.textContent = text;
    article.append(name, body);
    if (answer) {
      const links = document.createElement('div'); links.className = 'spidy-message-actions';
      for (const id of [...new Set(answer.actionIds || [])].slice(0, 3)) {
        if (!Object.hasOwn(actions, id)) continue;
        const action = actions[id], link = document.createElement(action.game ? 'button' : 'a');
        link.textContent = `${action.label} ${action.download ? '↓' : '↗'}`;
        if (action.game) { link.type = 'button'; link.addEventListener('click', () => { close(false); document.dispatchEvent(new CustomEvent('portfolio:open-game')); }); }
        else {
          link.href = action.href;
          if (action.download) link.download = 'Ashutosh_Tripathi_Resume.pdf';
          if (action.href.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
          if (action.href.startsWith('#')) link.addEventListener('click', () => {
            close(false);
            const destination = document.querySelector(action.href);
            if (destination) { if (!destination.hasAttribute('tabindex')) destination.tabIndex = -1; destination.focus({ preventScroll: true }); }
          });
        }
        links.append(link);
      }
      if (links.childElementCount) article.append(links);
      const sources = (answer.sourceIds || []).map(id => facts.find(f => f.id === id)?.title).filter(Boolean);
      if (sources.length) { const note = document.createElement('small'); note.textContent = `${answer.mode === 'ai' ? 'Based on' : 'Saved answer from'}: ${sources.slice(0, 3).join(' · ')}`; article.append(note); }
    }
    messages.append(article);
    while (messages.childElementCount > 24) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  function reset() {
    generation++; request?.abort(); request = null; busy = false; send.disabled = false;
    history = []; messages.replaceChildren(); input.value = ''; status.textContent = '';
    suggestions.hidden = false;
    addMessage('assistant', 'Hey! I’m Spidy, your guide to Ashutosh’s corner of the web. Want a quick introduction, a project walkthrough, or a look at his skills?');
  }
  async function open() {
    if (panel.open) return;
    panel.show(); launcher.hidden = true; launcher.setAttribute('aria-expanded', 'true'); input.focus({ preventScroll: true });
    try { const response = await fetch('/api/chat/status', { signal: AbortSignal.timeout(3000) }); if (response.ok) setMode((await response.json()).mode); else setMode('saved'); }
    catch { setMode('saved'); }
  }
  function close(restore = true) {
    panel.close(); launcher.setAttribute('aria-expanded', 'false'); launcher.hidden = !available;
    if (restore && available) launcher.focus({ preventScroll: true });
  }
  async function ask(question) {
    question = question.trim();
    if (busy || !question) return;
    if (question.length > 800) { status.textContent = 'Keep your question under 800 characters.'; return; }
    busy = true; send.disabled = true; suggestions.hidden = true;
    input.value = ''; addMessage('user', question);
    status.textContent = 'Spidy is checking the web…';
    const current = generation;
    const controller = new AbortController();
    request = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    let answer, limited = false;
    try {
      const response = await fetch('/api/chat', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: question, history: history.slice(-6) }) });
      limited = response.status === 429;
      if (!response.ok) throw new Error('Chat unavailable');
      answer = await response.json();
      if (typeof answer.answer !== 'string' || answer.answer.length > 1500 || !Array.isArray(answer.actionIds) || !Array.isArray(answer.sourceIds)) throw new Error('Invalid answer');
    } catch {
      answer = { ...savedAnswer(question, history), mode: 'saved' };
    } finally { clearTimeout(timeout); }
    if (current !== generation) return;
    setMode(answer.mode);
    addMessage('assistant', answer.answer, answer);
    history.push({ role: 'user', content: question }, { role: 'assistant', content: answer.answer.slice(0, 1200) });
    history = history.slice(-6);
    busy = false; send.disabled = false; request = null;
    status.textContent = limited ? 'A saved answer while live chat takes a short break.' : '';
  }
  launcher.addEventListener('click', open);
  document.querySelector('#spidy-close').addEventListener('click', () => close());
  document.addEventListener('portfolio:close-chat', () => { if (panel.open) close(false); });
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); close(); } });
  document.querySelector('#spidy-form').addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); ask(input.value); } });
  suggestions.querySelectorAll('button').forEach(button => button.addEventListener('click', () => ask(button.dataset.question)));
  document.querySelector('#spidy-reset').addEventListener('click', () => { reset(); input.focus({ preventScroll: true }); });
  reset(); setMode('saved'); area();
}
