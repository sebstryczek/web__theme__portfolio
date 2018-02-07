import { loadFont } from '../UtilsLoaders';

const createHeader = font => {
  const text = "Sebastian Stryczek".toUpperCase();

  const geometry = new THREE.TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0,
  });
  geometry.computeBoundingBox();

  const material = new THREE.MeshBasicMaterial({
    color: "#333333",
    depthTest: false,
    fog: false,
    transparent: true
  });
  
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.x = -geometry.boundingBox.max.x / 2;
  mesh.position.y = geometry.boundingBox.max.y / 2;
  mesh.position.y -= 0.3;
  const group = new THREE.Object3D();
  group.add(mesh);
  return group;
}

export default async () => {
  const scene = new THREE.Scene();
  const font = await loadFont('vendor/fonts/helvetiker_bold.typeface.json');
  const header = createHeader(font);
  scene.add(header);
  return scene;
}
