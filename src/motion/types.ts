export type MotionPersonality = 'premium' | 'energetic' | 'playful' | 'corporate';

export interface MotionConfig {
  personality: MotionPersonality;
  duration: {
    fast: number;
    slow: number;
  };
  ease: string;
  overshoot: number;
  stagger: number;
  yFrom: number;
  xFrom: number;
  label: string;
  accentColor: string;
  /** アクセントカラー背景上に置くテキストの色（コントラスト確保用） */
  textOnAccent: string;
  tagline: string;
  heroTitle: string;
}
