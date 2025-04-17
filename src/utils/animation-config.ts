export const animationTimings = {
  splash: {
    load01: 100, // 最初のスプラッシュアニメーション
    load02: 4500, // 2番目のスプラッシュアニメーション
    load03: 6400, // 3番目のスプラッシュアニメーション
  },
  threeScene: {
    canvasFadeIn: 6500, // キャンバスのフェードイン開始
    initialAnimation: {
      startDelay: 8000, // 初期アニメーション開始
      duration: 2000, // アニメーション継続時間
      autoScrollDelay: 0, // 自動スクロール開始までの遅延
      autoScrollDuration: 2000, // 自動スクロールの継続時間
    },
  },
  settings: {
    autoScrollSpeed: 0.002,
    userInteractionTimeout: 1200,
    liquidEffect: {
      speed: 0.8,
    },
  },
} as const;

// アニメーションの依存関係を考慮した計算用のヘルパー関数
export const getTimings = () => {
  const t = animationTimings;
  return {
    ...t,
    // 合計時間を計算（必要に応じて）
    totalDuration: Math.max(
      t.splash.load03,
      t.threeScene.canvasFadeIn,
      t.threeScene.initialAnimation.startDelay + t.threeScene.initialAnimation.duration
    ),
  };
};
