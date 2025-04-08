import * as THREE from 'three';

export interface SlideInterface extends THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> {
  userData: {
    originalVertices: number[];
    targetX: number;
    currentX: number;
    index: number;
    currentImageIndex: number;
    nextTexture: THREE.Texture | null;
    isTransitioning: boolean;
    transitionProgress: number;
  };
}

export interface ExtendedWindow extends Window {
  scrollTimeout?: ReturnType<typeof setTimeout>;
}
