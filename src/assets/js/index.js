import init from './init';
console.log('111')
const app = document.querySelector('.js--app');
const { scene, renderer, camera, addLoop } = init( app );

// Add light to Scene
scene.add( new THREE.AmbientLight( 0x333333 ) );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.x = 0;
directionalLight.position.y = 1;
directionalLight.position.z = 0;
directionalLight.position.normalize();
scene.add( directionalLight );

renderer.setClearColor(0xf7f7f7);
//scene.background = new THREE.Color( 0xf7f7f7 );
//scene.fog = new THREE.FogExp2( 0xf7f7f7, 0.1 );
scene.fog = new THREE.Fog( 0xf7f7f7, 3, 7 );

const shapeGeometry = new THREE.IcosahedronGeometry( 2, 1 );
const edgesGeometry = new THREE.EdgesGeometry( shapeGeometry )
const lineMaterial = new THREE.LineBasicMaterial( {
	color: new THREE.Color('rgba(0, 0, 0)'),
  linewidth: 1,
  transparent: true,
  opacity: 0.3,
  fog: true
 } );
const mesh = new THREE.LineSegments( edgesGeometry, lineMaterial );
scene.add( mesh );

//const mesh2 = new THREE.LineSegments( edgesGeometry, lineMaterial );
//mesh2.scale.x = 0.8;
//mesh2.scale.y = 0.8;
//mesh2.scale.z = 0.8;
//scene.add( mesh2 );

/*
const geometry = new THREE.Geometry();
for (var i = 0; i < shapeGeometry.vertices.length; i ++ ) {
  geometry.vertices.push(shapeGeometry.vertices[i]);
}
const material = new THREE.PointCloudMaterial( { size: 35, sizeAttenuation: false, transparent: true } );
material.color.setHSL( 1.0, 0.3, 0.7 );

const particles = new THREE.PointCloud( geometry, material );
particles.sortParticles = true;
scene.add( particles );
*/




var vertices = shapeGeometry.vertices;
var positions = new Float32Array(vertices.length * 3);
for (var i = 0, l = vertices.length; i < l; i++) {
  vertices[i].toArray(positions, i * 3);
}

var geometry = new THREE.BufferGeometry();
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
//const geometry = new THREE.Geometry();
//for (var i = 0; i < shapeGeometry.vertices.length; i ++ ) {
//  geometry.vertices.push(shapeGeometry.vertices[i]);
//}
var material = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: THREE.VertexColors,
  map: sprite,
  color: 0x252525
});
var points = new THREE.Points(geometry, material);
var object = new THREE.Object3D();
object.add(points);

/*
object.add(new THREE.Mesh(
  mesh,
  new THREE.MeshPhongMaterial({
    color: 0x616161,
    emissive: 0xa1a1a1,
    wireframe: true,
    fog: 1
  })

));
*/

scene.add(points);






addLoop( () => {
  
  object.rotation.x += 0.0025;
  object.rotation.y += 0.0025;

  mesh.rotation.x += 0.0025;
  mesh.rotation.y += 0.0025;

  // Render the scene
  renderer.render(scene, camera);
});
