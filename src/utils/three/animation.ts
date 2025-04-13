import * as THREE from 'three';
import type { SlideInterface } from './types';
import { settings } from './config';

let lastFrameTime = 0;
let animationFrameId: number | null = null;
let isAnimating = false;
let activeSlides: SlideInterface[] = [];

// アニメーションのスロットリング
const FRAME_RATE = 60;
const FRAME_INTERVAL = 1000 / FRAME_RATE;

export const updateSlidePosition = (
  slide: SlideInterface,
  targetPosition: number,
  currentPosition: number
) => {
  if (!slide.visible) return; // 非表示の要素はスキップ

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

export const initializeAnimation = (slides: SlideInterface[]) => {
  activeSlides = slides;
  setupIntersectionObserver(slides);
};

export const startAnimation = () => {
  isAnimating = true;
  lastFrameTime = performance.now();
  if (!animationFrameId) {
    animateLoop();
  }
};

export const stopAnimation = () => {
  isAnimating = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

const animateLoop = (currentTime = performance.now()) => {
  if (!isAnimating) return;

  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime >= FRAME_INTERVAL) {
    lastFrameTime = currentTime - (deltaTime % FRAME_INTERVAL);

    // アニメーションロジックをここに移動
    activeSlides.forEach(slide => {
      if (slide.visible) {
        const positionDiff = slide.userData.targetPosition - slide.userData.currentPosition;
        slide.userData.currentPosition += positionDiff * settings.slideLerp * deltaTime;
        updateSlidePosition(slide, slide.userData.targetPosition, slide.userData.currentPosition);
      }
    });
  }

  animationFrameId = requestAnimationFrame(animateLoop);
};

// Intersection Observer の設定
const setupIntersectionObserver = (slides: SlideInterface[]) => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const slide = slides.find(s => s.uuid === entry.target.id);
        if (slide) {
          slide.visible = entry.isIntersecting;
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
    }
  );

  slides.forEach(slide => {
    const element = document.getElementById(slide.uuid);
    if (element) {
      observer.observe(element);
    }
  });
};
