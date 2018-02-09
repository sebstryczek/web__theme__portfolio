const createBackgrondPlane = () => {
  const geometry = new THREE.PlaneGeometry( 100, 100 );
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    depthTest: false,
    fog: false
  });
  const plane = new THREE.Mesh( geometry, material );
  return plane;
}

const generateParticleTexture = () => {
  const size = 256;
  const radius = size / 2;
  const center = size / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(center, center, radius, 0, 2 * Math.PI, false);
  context.closePath();
  context.fillStyle = "#000000";
  context.fill();
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const createPolygon = (size, position) => {
  const shapeGeometry = new THREE.IcosahedronGeometry(size, 1);
  const edgesGeometry = new THREE.EdgesGeometry(shapeGeometry);
  //geo.dynamic = true;
  //const lineMaterial = new THREE.LineBasicMaterial({
  //  color: new THREE.Color('rgba(0, 0, 0)'),
  //  linewidth: 1,
  //  transparent: true,
  //  opacity: 0.4,
  //  fog: true,
  //});
  const shapeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.05,
    fog: true,
    depthTest: false,
    vertexColors: THREE.FaceColors
  });
  const edgesMaterial = new THREE.MeshBasicMaterial({
    color: "#000000",
    transparent: true,
    opacity: 0.2,
    fog: true,
    depthTest: false
  });
  const meshShape = new THREE.Mesh(shapeGeometry, shapeMaterial);
  meshShape.name = "Mesh";

  const meshEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  meshEdges.name = "Edges";

  const particleGeometry = new THREE.Geometry();
  particleGeometry.vertices = shapeGeometry.vertices.map(v => {
    v.x = v.x * 1.0001;
    v.y = v.y * 1.0001;
    v.z = v.z * 1.0001;
    return v;
  });
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 4,
    sizeAttenuation: false,
    map: generateParticleTexture(),
    transparent: true,
    alphaTest: 0.1,
    depthTest: false
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.name = "Particles";
  particles.sortParticles = true;

  const group = new THREE.Object3D();
  group.add(meshShape);
  group.add(meshEdges);
  group.add(particles);
  group.position.x = position.x;
  group.position.y = position.y;
  group.position.z = position.z;

  return group;
}

export default () => {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#f7f7f7", 4, 8);

  const backgrondPlane = createBackgrondPlane();
  scene.add(backgrondPlane);

  const polygon1 = createPolygon(4.5, new THREE.Vector3(1.5, -1, 0));
  polygon1.name = "polygon1";
  const polygon2 = createPolygon(3, new THREE.Vector3(1.5, -1, 0));
  polygon2.name = "polygon2";
  scene.add(polygon1);
  scene.add(polygon2);

  return scene;
}