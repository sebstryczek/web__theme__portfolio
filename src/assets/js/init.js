import { getStyle } from './helpers';

const init = ( container ) => {
  // Stats
  var stats = new Stats();
  stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild( stats.dom );
  
  // Get height and width
  const style = getStyle(container);
  const height = parseInt( style.height, 10 );
  const width = parseInt( style.width, 10 );

  // Create an empty scene
  const scene = new THREE.Scene();

  // Create a basic perspective camera
  /*
     new THREE.PerspectiveCamera( fov, aspect, near, far )
     fov - Camera frustum vertical field of view.
     aspect - Camera frustum aspect ratio.
     near - Camera frustum near plane.
     far - Camera frustum far plane.
     *frustum - ostrosłup ścięty
     *https://bittermanandy.files.wordpress.com/2009/04/image006.jpg
  */
  const camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
  camera.position.z = 4;

  // Create a renderer with Antialiasing 
  //const renderer = new THREE.CanvasRenderer({
  //  antialias:true
  //});
  const renderer = new THREE.WebGLRenderer({
    antialias:true
  });

  // Configure renderer clear color
  renderer.setClearColor("#000000");

  // Configure renderer size
  renderer.setSize( width, height );

  const loops = [];
  const addLoop = loop => loops.push(loop);
  
  const render = () => {
    stats.begin();
    loops.forEach( f => f() );
    stats.end();
    requestAnimationFrame(render);
  };
  render();

  // Append Renderer to DOM
  container.appendChild( renderer.domElement );

  return { scene, renderer, camera, addLoop };
}

export default init;