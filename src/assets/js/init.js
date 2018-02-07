import { getStyle } from './UtilsCss';

const init = ( container, clearColor ) => {
  
  const style = getStyle(container);
  const height = parseInt( style.height, 10 );
  const width = parseInt( style.width, 10 );
  
  const renderer = new THREE.WebGLRenderer({ /*antialias: true,*/ alpha: true });
  renderer.setClearColor(clearColor);
  renderer.setSize( width, height );
  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  let currentSceneWrapper = null;
  
  const loops = [];
  const addLoop = loop => loops.push(loop);
  const clock = new THREE.Clock();

  /* Stats */
  //const stats = new Stats();
  //stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  //container.appendChild( stats.dom );
  /* *** */
  const render = () => {
    //stats.begin();
    loops.forEach( f => f() );
    if (currentSceneWrapper) {
      const delta = clock.getDelta();
      currentSceneWrapper.animLoop( delta );
      currentSceneWrapper.animEffectsLoop( delta );
      currentSceneWrapper.render( delta );
    }
    //stats.end();
    requestAnimationFrame(render);
  };
  render();

  container.appendChild( renderer.domElement );

  const openScene = async (sceneCreator) => currentSceneWrapper = await sceneCreator(renderer);

  return { addLoop, width, height, openScene };

}

export default init;