/**
 * Interações do site. Roda a cada navegação (astro:page-load) e
 * desmonta tudo antes da troca de página (astro:before-swap).
 * Nenhum conteúdo depende deste arquivo para ficar visível.
 */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopPointer = () => window.matchMedia('(min-width: 960px) and (hover: hover) and (pointer: fine)').matches;

let teardown: AbortController | null = null;

/* ---------- Revelação de seções ---------- */
function initReveal(signal: AbortSignal) {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
  if (!els.length) return;

  if (!('IntersectionObserver' in window) || reducedMotion()) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));

  // Rede de segurança: se algo falhar, o conteúdo aparece em até 2,5 s.
  const safety = window.setTimeout(() => {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('is-in');
    });
  }, 2500);

  signal.addEventListener('abort', () => {
    io.disconnect();
    window.clearTimeout(safety);
  });
}

/* ---------- Índice com prévia ---------- */
function initIndex(signal: AbortSignal) {
  const list = document.querySelector<HTMLElement>('[data-index]');
  const preview = document.querySelector<HTMLElement>('[data-preview]');
  if (!list) return;

  const rows = Array.from(list.querySelectorAll<HTMLAnchorElement>('[data-row]'));
  const items = new Map<string, HTMLElement>();
  preview?.querySelectorAll<HTMLElement>('[data-preview-item]').forEach((el) => items.set(el.dataset.previewItem!, el));
  const caps = new Map<string, HTMLElement>();
  preview?.querySelectorAll<HTMLElement>('[data-preview-cap]').forEach((el) => caps.set(el.dataset.previewCap!, el));

  // A prévia em repouso já vem marcada no HTML (primeiro projeto).
  let current: string | null =
    preview?.querySelector<HTMLElement>('[data-preview-item][data-active]')?.dataset.previewItem ?? null;
  let intent = 0;
  let settle = 0;

  const setRow = (slug: string | null) => {
    rows.forEach((a) => {
      const li = a.closest('li')!;
      if (a.dataset.slug === slug) li.setAttribute('data-active', '');
      else li.removeAttribute('data-active');
    });
    list.toggleAttribute('data-has-active', slug !== null);
  };

  const setPreview = (slug: string) => {
    if (!preview || slug === current) return;
    const prev = current ? items.get(current) : null;
    current = slug;

    items.forEach((el) => el.removeAttribute('data-prev'));
    // A anterior fica inteira por baixo enquanto a nova sobe por cima.
    prev?.setAttribute('data-prev', '');
    items.forEach((el, key) => el.toggleAttribute('data-active', key === slug));
    caps.forEach((el, key) => el.toggleAttribute('data-active', key === slug));

    window.clearTimeout(settle);
    settle = window.setTimeout(() => {
      items.forEach((el) => el.removeAttribute('data-prev'));
    }, reducedMotion() ? 0 : 460);
  };

  /** slug = null: sai da lista. As linhas voltam ao normal; a prévia fica no último projeto. */
  const activate = (slug: string | null, immediate = false) => {
    if (!desktopPointer()) return;
    setRow(slug);
    window.clearTimeout(intent);
    if (slug === null) return;
    // Pequeno atraso de intenção para não piscar ao varrer a lista.
    if (immediate) setPreview(slug);
    else intent = window.setTimeout(() => setPreview(slug), 60);
  };

  rows.forEach((a) => {
    const slug = a.dataset.slug!;
    a.addEventListener('pointerenter', () => activate(slug), { signal });
    a.addEventListener('focus', () => activate(slug, true), { signal });
    a.addEventListener(
      'click',
      () => {
        // Nomeia só o quadro visível para a transição prévia → capa.
        const frame = desktopPointer()
          ? items.get(slug)?.querySelector<HTMLElement>('.frame')
          : a.querySelector<HTMLElement>('.row-thumb .frame');
        if (frame) {
          frame.style.setProperty('view-transition-name', `media-${slug}`);
          frame.style.setProperty('view-transition-class', 'media');
        }
      },
      { signal },
    );
  });

  list.addEventListener('pointerleave', () => activate(null), { signal });
  list.addEventListener(
    'focusout',
    (e) => {
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (!next || !list.contains(next)) activate(null);
    },
    { signal },
  );

  signal.addEventListener('abort', () => {
    window.clearTimeout(intent);
    window.clearTimeout(settle);
  });
}

/* ---------- Menu mobile ---------- */
function initMenu(signal: AbortSignal) {
  const dialog = document.querySelector<HTMLDialogElement>('[data-menu]');
  const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  if (!dialog || !openBtn) return;

  const unlock = () => {
    document.documentElement.style.removeProperty('overflow');
    openBtn.setAttribute('aria-expanded', 'false');
  };

  const open = () => {
    if (dialog.open) return;
    dialog.classList.remove('is-closing');
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
  };

  const close = (after?: () => void) => {
    if (!dialog.open) return after?.();
    const finish = () => {
      dialog.classList.remove('is-closing');
      dialog.close();
      unlock();
      openBtn.focus({ preventScroll: true });
      after?.();
    };
    if (reducedMotion()) return finish();
    dialog.classList.add('is-closing');
    let done = false;
    const once = () => {
      if (done) return;
      done = true;
      finish();
    };
    dialog.addEventListener('animationend', once, { once: true, signal });
    window.setTimeout(once, 300); // caso a animação não rode
  };

  openBtn.addEventListener('click', open, { signal });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => close(), { signal });

  // Esc: anima o fechamento em vez de fechar seco.
  dialog.addEventListener(
    'cancel',
    (e) => {
      e.preventDefault();
      close();
    },
    { signal },
  );
  dialog.addEventListener('close', unlock, { signal });

  dialog.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((a) => {
    a.addEventListener(
      'click',
      (e) => {
        const href = a.getAttribute('href') ?? '';
        const url = new URL(href, location.href);
        const samePage = url.pathname === location.pathname && url.hash;
        if (samePage) {
          e.preventDefault();
          close(() => {
            const target = document.querySelector<HTMLElement>(url.hash);
            target?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
            history.replaceState(null, '', url.hash);
          });
        } else {
          // Navegação para outra página: fecha sem animar para a transição assumir.
          dialog.close();
          unlock();
        }
      },
      { signal },
    );
  });

  // Ao passar para desktop com o menu aberto, fecha.
  const mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', (e) => e.matches && dialog.open && (dialog.close(), unlock()), { signal });

  signal.addEventListener('abort', () => {
    if (dialog.open) dialog.close();
    unlock();
  });
}

/* ---------- Vídeos ambientes: tocam só quando visíveis e sem movimento reduzido ---------- */
function initAmbientVideo(signal: AbortSignal) {
  const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-ambient]'));
  if (!vids.length || reducedMotion() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }
  });
  vids.forEach((v) => io.observe(v));
  signal.addEventListener('abort', () => io.disconnect());
}

/* ---------- Foco após navegação: leva o leitor de tela ao novo conteúdo ---------- */
function focusMain() {
  if (location.hash) return;
  const main = document.getElementById('conteudo');
  main?.focus({ preventScroll: true });
}

let firstLoad = true;

document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('js');
});

document.addEventListener('astro:page-load', () => {
  teardown?.abort();
  teardown = new AbortController();
  const { signal } = teardown;
  initReveal(signal);
  initIndex(signal);
  initMenu(signal);
  initAmbientVideo(signal);
  if (!firstLoad) focusMain();
  firstLoad = false;
});

document.addEventListener('astro:before-swap', () => teardown?.abort());
