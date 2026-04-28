# Motion Personality Lab

「同一コンテンツ × 同一デザイン × 異なるモーション」で、動きの違いだけが体験を変えることを体感できる実験サイトです。

4つのモーションパーソナリティ（Premium / Energetic / Playful / Corporate）を切り替えながら比較することで、モーションデザインの効果を具体的に確認できます。

## 確認方法

```sh
bun install
bun dev
```

開発サーバー起動後、`http://localhost:4321` にアクセスしてください。トップページから各パーソナリティのページに移動できます。

## このサイトについて

LottieFiles が提供するエージェントスキル **[motion-design-skill](https://github.com/LottieFiles/motion-design-skill)** の実験的な活用を目的として作成しました。

同スキルが体系化している「感情的意図 / 視覚的ナラティブ / モーションクラフト」の3本柱と、4つのパーソナリティ定数（タイミング・イージング・オーバーシュートなど）をAstro + GSAP の実装に落とし込み、スキルが実案件でどのように機能するかを検証しています。

モーションの設計思想や各パーソナリティの詳細については [`motion-guide.md`](./motion-guide.md) を参照してください。

## 技術スタック

Astro / React / TypeScript / Tailwind CSS v4 / GSAP / Bun / Biome
