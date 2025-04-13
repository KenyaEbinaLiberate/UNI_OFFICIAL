import * as THREE from 'three';

export const settings = {
  wheelSensitivity: 0.02,
  touchSensitivity: 0.05,
  momentumMultiplier: 7.0,
  smoothing: 0.3,
  slideLerp: 0.1,
  distortionDecay: 0.95,
  maxDistortion: 2.0,
  distortionSensitivity: 0.08,
  distortionSmoothing: 0.15,
  autoScrollSpeed: 0.002,
  userInteractionTimeout: 1200,
  liquidEffect: {
    speed: 0.5,
    intensity: 1.2,
    frequency: 0.8,
  },
} as const;

export const calculateSlideSize = (camera: THREE.PerspectiveCamera) => {
  const viewportHeight = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
  // 常に9:16のアスペクト比を維持
  const viewportWidth = (viewportHeight * 9) / 16;

  return {
    width: viewportWidth,
    height: viewportHeight,
    gap: 0,
  };
};
