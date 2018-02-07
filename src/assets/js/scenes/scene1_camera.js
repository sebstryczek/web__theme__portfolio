/*
   new THREE.PerspectiveCamera( fov, aspect, near, far )
   fov - Camera frustum vertical field of view.
   aspect - Camera frustum aspect ratio.
   near - Camera frustum near plane.
   far - Camera frustum far plane.
   *frustum - ostrosłup ścięty
   *https://bittermanandy.files.wordpress.com/2009/04/image006.jpg
*/

export default () => {
  const camera = new THREE.PerspectiveCamera( 75, window.app.width / window.app.height, 0.1, 1000 );
  camera.position.z = 4;
  return camera;
}
