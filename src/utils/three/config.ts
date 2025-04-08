import * as THREE from 'three';

export const settings = {
  wheelSensitivity: 0.01,
  touchSensitivity: 0.015,
  momentumMultiplier: 2.5,
  smoothing: 0.25,
  slideLerp: 0.045,
  distortionDecay: 0.985,
  maxDistortion: 64.0,
  distortionSensitivity: 2.6,
  distortionSmoothing: 0.5,
  autoScrollSpeed: 0.001,
  userInteractionTimeout: 1200,
  liquidEffect: {
    speed: 0.35,
    strength: 99.0,
    frequency: 256.8,
    amplitude: 800
  }
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
