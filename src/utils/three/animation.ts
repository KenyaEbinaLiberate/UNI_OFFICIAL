import * as THREE from 'three';
import type { SlideInterface } from './types';
import { settings } from './config';

export const updateSlidePosition = (
  slide: SlideInterface,
  targetPosition: number,
  currentPosition: number
) => {
  const geometry = slide.geometry;
  const vertices = geometry.attributes.position.array as Float32Array;
  const originalVertices = slide.userData.originalVertices;

  for (let i = 0; i < vertices.length; i += 3) {
    const distanceFromCenter = Math.abs(vertices[i] - currentPosition);
    const distortionFactor = Math.min(
      distanceFromCenter * settings.distortionSensitivity,
      settings.maxDistortion
    );

    vertices[i] = originalVertices[i] + (targetPosition - currentPosition) * distortionFactor;
  }

  geometry.attributes.position.needsUpdate = true;
};

export const animateSlides = (
  slides: SlideInterface[],
  targetPosition: number,
  currentPosition: number,
  deltaTime: number
) => {
  const positionDiff = targetPosition - currentPosition;
  currentPosition += positionDiff * settings.slideLerp * deltaTime;

  slides.forEach(slide => {
    updateSlidePosition(slide, targetPosition, currentPosition);
  });

  return currentPosition;
};
