import { getPointOnCircle, deg2rad } from '../UtilsMathExt';

export default () => {
  const scene = new THREE.Scene();

  const shape = new THREE.Shape();
  const shapeP1 = getPointOnCircle(0, 0, 1.9, 0);
  const shapeP2 = getPointOnCircle(0, 0, 1.9, 120);
  const shapeP3 = getPointOnCircle(0, 0, 1.9, 240);
  shape.moveTo(shapeP1.x, shapeP1.y);
  shape.lineTo(shapeP2.x, shapeP2.y);
  shape.lineTo(shapeP3.x, shapeP3.y);

  const hole = new THREE.Path();
  const holeP1 = getPointOnCircle(0, 0, 1.2, 0);
  const holeP2 = getPointOnCircle(0, 0, 1.2, 120);
  const holeP3 = getPointOnCircle(0, 0, 1.2, 240);
  hole.moveTo(holeP1.x, holeP1.y);
  hole.lineTo(holeP2.x, holeP2.y);
  hole.lineTo(holeP3.x, holeP3.y);
  
  //const shape = new THREE.Shape();
  //shape.moveTo(-2, 2);
  //shape.lineTo(-5, 2);
  //shape.lineTo(-5, -1);
  //shape.lineTo(-2, -1);
  //const hole = new THREE.Path();
  //hole.moveTo(-2.25, 1.75);
  //hole.lineTo(-4.75, 1.75);
  //hole.lineTo(-4.75, -0.75);
  //hole.lineTo(-2.25, -0.75);
  

  shape.holes.push(hole);


  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.z = 90 * deg2rad;
  scene.add( mesh );

  return scene;
}
