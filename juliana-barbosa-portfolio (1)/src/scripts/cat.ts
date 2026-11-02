/**
 * Cursor gatinho. Decorativo: o cursor nativo continua visível e preciso;
 * o gato acompanha ao lado (abaixo e à direita da ponta), com atraso suave.
 * - Só em ponteiro preciso com hover (mouse/trackpad). Nunca em toque.
 * - pointer-events: none e aria-hidden.
 * - Movimento reduzido: sem perseguição nem inclinação; o gato vai direto ao lugar.
 * - O laço de animação só roda enquanto o gato está se movendo.
 */

const SVG = `
<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <g stroke="#f3efe7" stroke-width="1.6" stroke-linejoin="round" paint-order="stroke">
    <path class="cat-ear-l" d="M7.2 13.5 5.6 3.4 13.4 9.2Z" fill="#ff2e9a"/>
    <path class="cat-ear-r" d="M24.8 13.5 26.4 3.4 18.6 9.2Z" fill="#ff2e9a"/>
    <path d="M16 8.4c5.9 0 10.4 3.9 10.4 9.6 0 5.9-4.6 9.6-10.4 9.6S5.6 23.9 5.6 18c0-5.7 4.5-9.6 10.4-9.6Z" fill="#ff2e9a"/>
  </g>
  <g class="cat-eyes" fill="#1c1c1c">
    <ellipse cx="12.2" cy="17.6" rx="1.55" ry="2.15"/>
    <ellipse cx="19.8" cy="17.6" rx="1.55" ry="2.15"/>
  </g>
  <path d="M14.9 21.2h2.2L16 22.5Z" fill="#1c1c1c"/>
</svg>`;

// Distância da ponta do cursor: maior sobre links e projetos, para não cobrir o texto
const OFFSET = { rest: [14, 16], active: [22, 26] } as const;
let ox: number = OFFSET.rest[0];
let oy: number = OFFSET.rest[1];
let tox: number = ox;
let toy: number = oy;

const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

let el: HTMLDivElement | null = null;
let tx = -100;
let ty = -100;
let x = -100;
let y = -100;
let lean = 0;
let raf = 0;
let started = false;

function ensure(): HTMLDivElement {
  if (el && document.body.contains(el)) return el;
  el = document.createElement('div');
  el.className = 'cat';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = SVG;
  document.body.appendChild(el);
  place();
  return el;
}

function place() {
  if (!el) return;
  el.style.transform = `translate3d(${x + ox}px, ${y + oy}px, 0) rotate(${lean}deg)`;
}

function tick() {
  const dx = tx - x;
  const dy = ty - y;
  x += dx * 0.2;
  y += dy * 0.2;
  // Inclina na direção do movimento, devolvendo ao centro aos poucos
  const target = Math.max(-14, Math.min(14, dx * 0.35));
  lean += (target - lean) * 0.2;
  ox += (tox - ox) * 0.2;
  oy += (toy - oy) * 0.2;
  place();
  if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15 || Math.abs(lean) > 0.15 || Math.abs(tox - ox) > 0.15) {
    raf = requestAnimationFrame(tick);
  } else {
    raf = 0;
  }
}

const INTERACTIVE = 'a, button, [role="button"], summary, label, select';

function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
  const cat = ensure();
  tx = e.clientX;
  ty = e.clientY;
  if (!cat.classList.contains('is-on')) {
    x = tx;
    y = ty;
    cat.classList.add('is-on');
  }

  const target = e.target as Element | null;
  const project = target?.closest?.('[data-row]');
  const link = !project && target?.closest?.(INTERACTIVE);
  cat.classList.toggle('is-project', Boolean(project));
  cat.classList.toggle('is-link', Boolean(link));
  [tox, toy] = project || link ? OFFSET.active : OFFSET.rest;

  if (reduced.matches) {
    x = tx;
    y = ty;
    lean = 0;
    ox = tox;
    oy = toy;
    place();
    return;
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

function hide() {
  el?.classList.remove('is-on', 'is-down');
}

export function initCat() {
  if (started || !fine.matches) return;
  started = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', () => el?.classList.add('is-down'), { passive: true });
  window.addEventListener('pointerup', () => el?.classList.remove('is-down'), { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  // A troca de página recria o <body>: o gato volta a ser anexado no próximo movimento.
  document.addEventListener('astro:after-swap', () => {
    el = null;
  });
  fine.addEventListener('change', (e) => {
    if (!e.matches) hide();
  });
}
