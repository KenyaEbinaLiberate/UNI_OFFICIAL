import * as THREE from 'three';

export const settings = {
  wheelSensitivity: 0.01,
  touchSensitivity: 0.015,
  momentumMultiplier: 1.5,
  smoothing: 0.15,
  slideLerp: 0.075,
  distortionDecay: 0.98,
  maxDistortion: 4.0,
  distortionSensitivity: 0.2,
  distortionSmoothing: 0.05,
  autoScrollSpeed: 0.001,
  userInteractionTimeout: 500,
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
