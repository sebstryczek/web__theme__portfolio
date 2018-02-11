import { getStyle } from './UtilsCss';
import { addLoop, clearLoops } from './UtilsLoop';
import { addStats } from './UtilsStats';
import { onResize } from './UtilsWindow';

const setGlobals = args => {
  window.appGlobals = Object.assign({}, window.appGlobals, args);
}

const setSize = (container, renderer) => {
  const style = getStyle(container);
  const height = parseInt( style.height, 10 );
  const width = parseInt( style.width, 10 );
  const ratio = width / height;
  renderer.setSize( width, height );
  setGlobals({height, width, ratio});
}

const init = ( container, clearColor ) => {
  //addStats(container);

  const renderer = new THREE.WebGLRenderer({ /*antialias: true,*/ alpha: true });
  setSize(container, renderer);
  onResize( async e => setSize(container, renderer));
  renderer.setClearColor(clearColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.autoClear = false;
  container.appendChild( renderer.domElement );

  const initSceneLoop = async sceneCreator => {
    clearLoops();
    const sceneWrapper =  await sceneCreator(renderer);
    const { camera, animLoop, animEffectsLoop, render} = sceneWrapper;
    setGlobals({ camera });
    addLoop( delta => {
      animLoop( delta );
      animEffectsLoop( delta );
      render( delta );
    });
  }

  const openScene = async (sceneCreator) => {
    await initSceneLoop(sceneCreator);
    onResize( async e => await initSceneLoop(sceneCreator) );
  }

  return { openScene };

}

export default init;