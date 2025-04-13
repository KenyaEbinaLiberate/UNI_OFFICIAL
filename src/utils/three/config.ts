import * as THREE from 'three';

export const settings = {
  wheelSensitivity: 0.02,
  touchSensitivity: 0.05,
  momentumMultiplier: 7.0,
  smoothing: 0.3,
  slideLerp: 0.12,
  distortionDecay: 0.96,
  maxDistortion: 150.0,
  distortionSensitivity: 6.4,
  distortionSmoothing: 0.4,
  autoScrollSpeed: 0.002,
  userInteractionTimeout: 1200,
  liquidEffect: {
    speed: 0.8,
    strength: 240.0,
    frequency: 256.8,
    amplitude: 1800,
  },
};

export const calculateSlideSize = (camera: THREE.PerspectiveCamera) => {
  const isPc = window.innerWidth >= 768;
  const viewportHeight = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
  let viewportWidth;
  const gap = isPc ? 0 : 0;

  if (isPc) {
    viewportWidth = (viewportHeight * 9) / 16;
  } else {
    viewportWidth = viewportHeight * (window.innerWidth / window.innerHeight);
  }

  return {
    width: viewportWidth,
    height: viewportHeight,
    gap: gap,
  };
};
