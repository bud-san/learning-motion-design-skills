import type { MotionConfig, MotionPersonality } from './types';

export const motionConfigs: Record<MotionPersonality, MotionConfig> = {
  premium: {
    personality: 'premium',
    label: 'Premium',
    tagline: 'エレガント・リッチ',
    heroTitle: '動きで、品格を語る。',
    accentColor: 'var(--color-accent-premium)',
    textOnAccent: 'var(--color-ink)',   // ゴールド背景 → 濃色テキスト
    duration: { fast: 0.35, slow: 0.75 },
    ease: 'power2.inOut',
    overshoot: 0,
    stagger: 0.12,
    yFrom: 60,
    xFrom: 0,
  },
  energetic: {
    personality: 'energetic',
    label: 'Energetic',
    tagline: 'スポーティ・ダイナミック',
    heroTitle: '動きで、熱量を伝える。',
    accentColor: 'var(--color-accent-energetic)',
    textOnAccent: '#ffffff',            // 赤背景 → 白テキスト
    duration: { fast: 0.1, slow: 0.3 },
    ease: 'expo.out',
    overshoot: 1.5,
    stagger: 0.04,
    yFrom: -80,
    xFrom: 0,
  },
  playful: {
    personality: 'playful',
    label: 'Playful',
    tagline: 'ポップ・キュート',
    heroTitle: '動きで、笑顔をつくる。',
    accentColor: 'var(--color-accent-playful)',
    textOnAccent: '#ffffff',            // 濃紫背景 → 白テキスト
    duration: { fast: 0.18, slow: 0.45 },
    ease: 'back.out(2.2)',
    overshoot: 2.2,
    stagger: 0.06,
    yFrom: 40,
    xFrom: 0,
  },
  corporate: {
    personality: 'corporate',
    label: 'Corporate',
    tagline: 'ビジネス・クリーン',
    heroTitle: '動きで、信頼を積む。',
    accentColor: 'var(--color-accent-corporate)',
    textOnAccent: '#ffffff',            // 濃紺背景 → 白テキスト
    duration: { fast: 0.25, slow: 0.5 },
    ease: 'power3.out',
    overshoot: 0,
    stagger: 0.08,
    yFrom: 0,
    xFrom: -50,
  },
};
