import type { MotionConfig } from './types';

type GSAPInstance = typeof import('gsap').gsap;

function observe(
  selector: string,
  callback: () => void,
  options: IntersectionObserverInit = {}
): void {
  const el = document.querySelector(selector);
  if (!el) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      }
    },
    { threshold: 0.15, ...options }
  );
  observer.observe(el);
}

function heroTimeline(gsap: GSAPInstance, config: MotionConfig): void {
  const tl = gsap.timeline({ delay: 0.3 });

  if (config.personality === 'energetic') {
    // 上から鋭く飛び込む — expo.out の加速感のみ、squash なし
    tl.fromTo(
      '.hero-content',
      { opacity: 0, y: config.yFrom },
      { opacity: 1, y: 0, duration: config.duration.slow, ease: config.ease }
    );
  } else if (config.personality === 'playful') {
    // スケールバウンス + 軽い回転
    tl.fromTo(
      '.hero-content',
      { opacity: 0, scale: 0.65, rotation: -4 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: config.duration.slow,
        ease: config.ease,
      }
    );
  } else {
    // premium / corporate: 位置スライド
    tl.fromTo(
      '.hero-content',
      { opacity: 0, y: config.yFrom, x: config.xFrom },
      { opacity: 1, y: 0, x: 0, duration: config.duration.slow, ease: config.ease }
    );
  }

  // secondary: ラベルとアクセントライン
  tl.fromTo(
    '.hero-shadow',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: config.duration.slow * 0.7, ease: config.ease },
    config.personality === 'premium' ? '-=0.4' : '-=0.2'
  );
}

function cardStagger(
  gsap: GSAPInstance,
  config: MotionConfig,
  options: { squash?: boolean; rotate?: boolean } = {}
): void {
  if (config.personality === 'energetic') {
    // 下からバウンド + スクワッシュ
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: config.duration.slow,
        ease: config.ease,
        stagger: config.stagger,
      }
    );
  } else if (config.personality === 'playful') {
    // スケール + 回転バウンス
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, scale: 0.7, rotation: options.rotate ? 6 : 0, y: 30 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        y: 0,
        duration: config.duration.slow,
        ease: config.ease,
        stagger: config.stagger,
      }
    );
  } else if (config.personality === 'corporate') {
    // opacity + x スライドのみ
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: config.duration.slow,
        ease: config.ease,
        stagger: config.stagger,
      }
    );
  } else {
    // premium: y + opacity、scale なし
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: config.duration.slow,
        ease: config.ease,
        stagger: config.stagger,
      }
    );
  }
}

function ctaTimeline(gsap: GSAPInstance, config: MotionConfig): void {
  if (config.personality === 'energetic') {
    gsap.fromTo(
      '.cta-banner',
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease }
    );
  } else if (config.personality === 'playful') {
    gsap.fromTo(
      '.cta-banner',
      { opacity: 0, scale: 0.88, rotation: -2 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: config.duration.slow,
        ease: config.ease,
      }
    );
  } else if (config.personality === 'corporate') {
    gsap.fromTo(
      '.cta-banner',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: config.duration.slow, ease: config.ease }
    );
  } else {
    // premium: ゆっくり上昇
    gsap.fromTo(
      '.cta-banner',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: config.duration.slow * 1.2, ease: config.ease }
    );
  }
}

export function bindButtonInteraction(
  gsap: GSAPInstance,
  config: MotionConfig,
  selector: string
): void {
  const buttons = document.querySelectorAll<HTMLElement>(selector);

  for (const btn of buttons) {
    const bg = btn.querySelector<HTMLElement>('.btn-bg');
    const arrow = btn.querySelector<HTMLElement>('.btn-arrow');
    const label = btn.querySelector<HTMLElement>('.btn-label');

    // ボタンごとの初期テキスト色を保持してリセット色として使う。
    // Hero ボタンは "var(--color-ink)"、CTABanner ボタンは config.textOnAccent と
    // テンプレート側で異なる値を inline style に持つため、それを読み取ることで
    // 同一関数で両ボタンに正しい色を返せる。
    const baseColor = btn.style.color || 'var(--color-ink)';

    if (config.personality === 'premium') {
      // 背景: 左から横展開 (scaleX 0→1) → ゆっくりフェード
      // 矢印: x +6 に移動、ラベルと同色で遷移
      btn.addEventListener('mouseenter', () => {
        if (bg) gsap.fromTo(bg, { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: config.duration.slow, ease: 'power2.inOut' });
        if (label) gsap.to(label, { color: '#ffffff', duration: config.duration.slow, ease: 'power2.inOut' });
        if (arrow) gsap.to(arrow, { x: 6, color: '#ffffff', duration: config.duration.slow, ease: 'power2.inOut' });
      });
      btn.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { scaleX: 0, opacity: 0, duration: config.duration.slow, ease: 'power2.inOut' });
        if (label) gsap.to(label, { color: baseColor, duration: config.duration.slow, ease: 'power2.inOut' });
        if (arrow) gsap.to(arrow, { x: 0, color: baseColor, duration: config.duration.slow, ease: 'power2.inOut' });
      });
    } else if (config.personality === 'energetic') {
      // 背景: 瞬間フラッシュ
      // 矢印: x +8 に素早くダート → x +4 に収束、色はラベルと同タイミング
      btn.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: 0.08, ease: 'expo.out' });
        if (label) gsap.to(label, { color: '#ffffff', duration: 0.08, ease: 'expo.out' });
        if (arrow) {
          gsap.to(arrow, { color: '#ffffff', duration: 0.08, ease: 'expo.out' });
          gsap.timeline()
            .to(arrow, { x: 8, duration: 0.1, ease: 'expo.out' })
            .to(arrow, { x: 4, duration: 0.14, ease: 'expo.out' });
        }
      });
      btn.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: 0.12, ease: 'expo.out' });
        if (label) gsap.to(label, { color: baseColor, duration: 0.12, ease: 'expo.out' });
        if (arrow) gsap.to(arrow, { x: 0, color: baseColor, duration: 0.12, ease: 'expo.out' });
      });
    } else if (config.personality === 'playful') {
      // 背景: フェードイン
      // 矢印: x +10 に back.out でオーバーシュート、色はラベルと同タイミング
      btn.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.fast, ease: config.ease });
        if (label) gsap.to(label, { color: '#ffffff', duration: config.duration.fast, ease: config.ease });
        if (arrow) gsap.to(arrow, { x: 10, color: '#ffffff', duration: config.duration.fast, ease: config.ease });
      });
      btn.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.fast, ease: config.ease });
        if (label) gsap.to(label, { color: baseColor, duration: config.duration.fast, ease: config.ease });
        if (arrow) gsap.to(arrow, { x: 0, color: baseColor, duration: config.duration.fast, ease: config.ease });
      });
    } else {
      // corporate: 背景スローフェード、矢印 x +4、色はラベルと同タイミング
      btn.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.slow, ease: config.ease });
        if (label) gsap.to(label, { color: '#ffffff', duration: config.duration.slow, ease: config.ease });
        if (arrow) gsap.to(arrow, { x: 4, color: '#ffffff', duration: config.duration.slow, ease: config.ease });
      });
      btn.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.slow, ease: config.ease });
        if (label) gsap.to(label, { color: baseColor, duration: config.duration.slow, ease: config.ease });
        if (arrow) gsap.to(arrow, { x: 0, color: baseColor, duration: config.duration.slow, ease: config.ease });
      });
    }

    // 押下フィードバック: 背景を一瞬深く
    btn.addEventListener('mousedown', () => {
      if (bg) gsap.to(bg, { opacity: 1, duration: 0.05 });
    });
    btn.addEventListener('mouseup', () => {
      if (bg) gsap.to(bg, { opacity: 1, duration: 0.05 });
    });
  }
}

export function bindCardInteraction(gsap: GSAPInstance, config: MotionConfig): void {
  const cards = document.querySelectorAll<HTMLElement>('.feature-card');

  for (const card of cards) {
    const bg = card.querySelector<HTMLElement>('.card-bg');
    const icon = card.querySelector<HTMLElement>('.card-icon');
    const line = card.querySelector<HTMLElement>('.card-line');
    const title = card.querySelector<HTMLElement>('.card-title');

    if (config.personality === 'premium') {
      // 背景スローフェード + ライン横展開 + アイコン x +4
      card.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.slow, ease: 'power2.inOut' });
        if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: 'power2.inOut' });
        if (icon) gsap.to(icon, { x: 4, duration: config.duration.slow, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.slow, ease: 'power2.inOut' });
        if (line) gsap.to(line, { width: '0%', duration: config.duration.slow * 0.7, ease: 'power2.inOut' });
        if (icon) gsap.to(icon, { x: 0, duration: config.duration.slow, ease: 'power2.inOut' });
      });
    } else if (config.personality === 'energetic') {
      // 背景瞬間フラッシュ + ライン高速展開 + アイコンスケールパルス
      card.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: 0.1, ease: 'expo.out' });
        if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: 'expo.out' });
        if (icon) gsap.timeline()
          .to(icon, { scale: 1.35, duration: 0.1, ease: 'expo.out' })
          .to(icon, { scale: 1, duration: 0.2, ease: 'expo.out' });
      });
      card.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: 0.12, ease: 'expo.out' });
        if (line) gsap.to(line, { width: '0%', duration: 0.15, ease: 'expo.out' });
        if (icon) gsap.to(icon, { scale: 1, duration: 0.1, ease: 'expo.out' });
      });
    } else if (config.personality === 'playful') {
      // 背景フェード + アイコン back.out バウンス + タイトル y -3
      card.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.fast, ease: config.ease });
        if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: config.ease });
        if (icon) gsap.to(icon, { scale: 1.4, rotation: 15, duration: config.duration.slow, ease: 'back.out(2.2)' });
        if (title) gsap.to(title, { y: -3, duration: config.duration.slow, ease: 'back.out(2.0)' });
      });
      card.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.fast, ease: config.ease });
        if (line) gsap.to(line, { width: '0%', duration: config.duration.fast, ease: config.ease });
        if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: config.duration.slow, ease: 'back.out(1.8)' });
        if (title) gsap.to(title, { y: 0, duration: config.duration.slow, ease: 'back.out(1.5)' });
      });
    } else {
      // corporate: 背景スローフェード + ライン展開のみ
      card.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.slow, ease: config.ease });
        if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: config.ease });
      });
      card.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.slow, ease: config.ease });
        if (line) gsap.to(line, { width: '0%', duration: config.duration.slow * 0.6, ease: config.ease });
      });
    }
  }
}

export function initAmbient(gsap: GSAPInstance, config: MotionConfig): void {
  const el = document.querySelector<HTMLElement>('.ambient-layer');
  if (!el) return;

  const duration =
    config.personality === 'premium'
      ? 7
      : config.personality === 'energetic'
        ? 1.8
        : config.personality === 'playful'
          ? 2.5
          : 6;

  gsap.to(el, {
    opacity: config.personality === 'energetic' ? 0.5 : 0.9,
    duration,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

// ─────────────────────────────────────────────
// Slider
// ─────────────────────────────────────────────

export function initSlider(gsap: GSAPInstance, config: MotionConfig): void {
  const track = document.querySelector<HTMLElement>('.slider-track');
  if (!track) return;

  const slides = track.querySelectorAll('.slider-slide');
  const total = slides.length;
  if (total === 0) return;

  let current = 0;
  const dots = document.querySelectorAll<HTMLElement>('.slider-dot');
  const currentEl = document.querySelector<HTMLElement>('.slider-current');

  // スライダーセクション入場アニメーション（スクロールトリガー）
  const root = document.querySelector<HTMLElement>('.slider-root');
  if (root) {
    gsap.set(root, { opacity: 0 });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (config.personality === 'energetic') {
              gsap.fromTo(root, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease });
            } else if (config.personality === 'playful') {
              gsap.fromTo(root, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: config.duration.slow, ease: config.ease });
            } else if (config.personality === 'corporate') {
              gsap.fromTo(root, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease });
            } else {
              gsap.fromTo(root, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: config.duration.slow * 1.2, ease: config.ease });
            }
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(root);
  }

  function goTo(index: number): void {
    // track は width:（total×100%）なので xPercent -(100/total) で 1スライド分移動
    const xPercent = -(100 / total) * index;

    if (config.personality === 'energetic') {
      gsap.to(track, { xPercent, duration: config.duration.fast * 2.5, ease: 'expo.out' });
    } else if (config.personality === 'playful') {
      gsap.to(track, { xPercent, duration: config.duration.slow, ease: 'power2.out' });
    } else {
      gsap.to(track, { xPercent, duration: config.duration.slow, ease: config.ease });
    }

    dots.forEach((dot, i) => {
      gsap.to(dot, { opacity: i === index ? 1 : 0.25, duration: config.duration.fast, ease: config.ease });
    });

    if (currentEl) currentEl.textContent = String(index + 1).padStart(2, '0');
    current = index;
  }

  document.querySelector('.slider-prev')?.addEventListener('click', () => {
    goTo((current - 1 + total) % total);
  });
  document.querySelector('.slider-next')?.addEventListener('click', () => {
    goTo((current + 1) % total);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });
}

// ─────────────────────────────────────────────
// Card List — 入場
// ─────────────────────────────────────────────

function cardListEntrance(gsap: GSAPInstance, config: MotionConfig): void {
  const items = document.querySelectorAll('.card-list-item');
  if (config.personality === 'energetic') {
    gsap.fromTo(
      items,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease, stagger: config.stagger }
    );
  } else if (config.personality === 'playful') {
    gsap.fromTo(
      items,
      { opacity: 0, x: 20, rotation: 1 },
      { opacity: 1, x: 0, rotation: 0, duration: config.duration.slow, ease: config.ease, stagger: config.stagger }
    );
  } else if (config.personality === 'corporate') {
    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease, stagger: config.stagger }
    );
  } else {
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: config.duration.slow, ease: config.ease, stagger: config.stagger }
    );
  }
}

// ─────────────────────────────────────────────
// Card List — ホバー
// ─────────────────────────────────────────────

export function bindCardListInteraction(gsap: GSAPInstance, config: MotionConfig): void {
  const items = document.querySelectorAll<HTMLElement>('.card-list-item');

  for (const item of items) {
    const bg = item.querySelector<HTMLElement>('.card-list-bg');
    const accent = item.querySelector<HTMLElement>('.card-list-accent');
    const title = item.querySelector<HTMLElement>('.card-list-title');

    if (config.personality === 'premium') {
      item.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.slow, ease: 'power2.inOut' });
        if (accent) gsap.to(accent, { height: '100%', duration: config.duration.slow, ease: 'power2.inOut' });
      });
      item.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.slow, ease: 'power2.inOut' });
        if (accent) gsap.to(accent, { height: '0%', duration: config.duration.slow * 0.7, ease: 'power2.inOut' });
      });
    } else if (config.personality === 'energetic') {
      item.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: 0.1, ease: 'expo.out' });
        if (accent) gsap.to(accent, { height: '100%', duration: config.duration.slow, ease: 'expo.out' });
        if (title) gsap.to(title, { x: 10, duration: config.duration.fast, ease: 'expo.out' });
      });
      item.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: 0.12, ease: 'expo.out' });
        if (accent) gsap.to(accent, { height: '0%', duration: 0.15, ease: 'expo.out' });
        if (title) gsap.to(title, { x: 0, duration: config.duration.fast, ease: 'expo.out' });
      });
    } else if (config.personality === 'playful') {
      item.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.fast, ease: config.ease });
        if (accent) gsap.to(accent, { height: '100%', duration: config.duration.slow, ease: config.ease });
        if (title) gsap.to(title, { x: 8, duration: config.duration.slow, ease: 'back.out(2.0)' });
      });
      item.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.fast, ease: config.ease });
        if (accent) gsap.to(accent, { height: '0%', duration: config.duration.fast, ease: config.ease });
        if (title) gsap.to(title, { x: 0, duration: config.duration.slow, ease: 'back.out(1.5)' });
      });
    } else {
      item.addEventListener('mouseenter', () => {
        if (bg) gsap.to(bg, { opacity: 1, duration: config.duration.slow, ease: config.ease });
        if (accent) gsap.to(accent, { height: '100%', duration: config.duration.slow, ease: config.ease });
      });
      item.addEventListener('mouseleave', () => {
        if (bg) gsap.to(bg, { opacity: 0, duration: config.duration.slow, ease: config.ease });
        if (accent) gsap.to(accent, { height: '0%', duration: config.duration.slow * 0.6, ease: config.ease });
      });
    }
  }
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────

export function initModal(gsap: GSAPInstance, config: MotionConfig): void {
  const overlay = document.querySelector<HTMLElement>('.modal-overlay');
  const content = document.querySelector<HTMLElement>('.modal-content');
  const closeBtn = document.querySelector<HTMLElement>('.modal-close');
  const line = document.querySelector<HTMLElement>('.modal-line');

  if (!overlay || !content) return;

  gsap.set(overlay, { opacity: 0, pointerEvents: 'none' });
  gsap.set(content, { opacity: 0 });

  function openModal(title: string, tag: string, body: string): void {
    const tagEl = overlay!.querySelector<HTMLElement>('.modal-tag');
    const titleEl = overlay!.querySelector<HTMLElement>('.modal-title');
    const textEl = overlay!.querySelector<HTMLElement>('.modal-text');
    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = body;

    overlay!.setAttribute('aria-hidden', 'false');
    gsap.set(overlay, { pointerEvents: 'auto' });
    if (line) gsap.set(line, { width: '0%' });

    if (config.personality === 'premium') {
      gsap.to(overlay, { opacity: 1, duration: config.duration.slow, ease: 'power2.inOut' });
      gsap.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: config.duration.slow, ease: config.ease });
      if (line) gsap.to(line, { width: '100%', duration: config.duration.slow * 1.2, ease: 'power2.inOut', delay: 0.2 });
    } else if (config.personality === 'energetic') {
      gsap.to(overlay, { opacity: 1, duration: 0.15, ease: 'expo.out' });
      gsap.fromTo(content, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: config.duration.slow, ease: 'expo.out' });
      if (line) gsap.to(line, { width: '100%', duration: 0.25, ease: 'expo.out', delay: 0.05 });
    } else if (config.personality === 'playful') {
      gsap.to(overlay, { opacity: 1, duration: config.duration.fast, ease: config.ease });
      gsap.fromTo(
        content,
        { opacity: 0, scale: 0.78, rotation: -4 },
        { opacity: 1, scale: 1, rotation: 0, duration: config.duration.slow, ease: 'back.out(2.0)' }
      );
      if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: config.ease, delay: 0.1 });
    } else {
      gsap.to(overlay, { opacity: 1, duration: config.duration.slow, ease: config.ease });
      gsap.fromTo(content, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: config.duration.slow, ease: config.ease });
      if (line) gsap.to(line, { width: '100%', duration: config.duration.slow, ease: config.ease, delay: 0.15 });
    }
  }

  function closeModal(): void {
    overlay!.setAttribute('aria-hidden', 'true');

    if (config.personality === 'premium') {
      gsap.to(content, { opacity: 0, y: 20, duration: config.duration.fast, ease: 'power2.in' });
      gsap.to(overlay, { opacity: 0, duration: config.duration.fast, ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) });
    } else if (config.personality === 'energetic') {
      gsap.to(content, { opacity: 0, scale: 0.94, duration: 0.12, ease: 'expo.in' });
      gsap.to(overlay, { opacity: 0, duration: 0.15, ease: 'expo.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) });
    } else if (config.personality === 'playful') {
      gsap.to(content, { opacity: 0, scale: 0.85, rotation: 3, duration: config.duration.fast, ease: 'power2.in' });
      gsap.to(overlay, { opacity: 0, duration: config.duration.fast, ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) });
    } else {
      gsap.to(content, { opacity: 0, x: -30, duration: config.duration.fast, ease: 'power3.in' });
      gsap.to(overlay, { opacity: 0, duration: config.duration.fast, ease: 'power3.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }) });
    }
  }

  document.querySelectorAll<HTMLElement>('.modal-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(
        btn.dataset.modalTitle ?? '',
        btn.dataset.modalTag ?? '',
        btn.dataset.modalBody ?? ''
      );
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

export function initPage(
  gsap: GSAPInstance,
  config: MotionConfig,
  options: { squash?: boolean; rotate?: boolean } = {}
): void {
  // 初期状態を非表示にセット（ちらつき防止）
  gsap.set('.hero-content', { opacity: 0 });
  gsap.set('.hero-shadow', { opacity: 0 });
  gsap.set('.feature-card', { opacity: 0 });
  gsap.set('.cta-banner', { opacity: 0 });
  gsap.set('.card-list-item', { opacity: 0 });

  // Hero: 0.3s 遅延後に起動
  heroTimeline(gsap, config);

  // Cards: スクロールで表示
  observe('.feature-card', () => cardStagger(gsap, config, options));

  // CTA: スクロールで表示
  observe('.cta-banner', () => ctaTimeline(gsap, config), { threshold: 0.1 });

  // Card list: スクロールで表示
  observe('.card-list-item', () => cardListEntrance(gsap, config));

  bindCardInteraction(gsap, config);
  bindButtonInteraction(gsap, config, '.cta-btn');
  bindCardListInteraction(gsap, config);
  initSlider(gsap, config);
  initModal(gsap, config);
  initAmbient(gsap, config);
}
