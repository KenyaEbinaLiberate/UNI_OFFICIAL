import * as THREE from 'three';

export interface SlideInterface extends THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  userData: {
    originalVertices: number[];
    targetX: number;
    currentX: number;
    index: number;
  };
}

export interface ExtendedWindow extends Window {
  scrollTimeout?: ReturnType<typeof setTimeout>;
}
