import { getStyle } from './UtilsCss';
import { addStats, statsBegin, statsEnd } from './UtilsStats';
import { onResize } from './UtilsWindow';

const setSize = (container, renderer) => {
  const style = getStyle(container);
  const height = parseInt( style.height, 10 );
  const width = parseInt( style.width, 10 );
  window.appGlobals = Object.assign({}, window.appGlobals, { height, width });
  renderer.setSize( width, height );
}

let currentSceneWrapper = null;

const clock = new THREE.Clock();
const loops = [];
const addLoop = loop => loops.push(loop);
const render = () => {
  statsBegin();
  loops.forEach( f => f() );
  if (currentSceneWrapper) {
    const delta = clock.getDelta();
    currentSceneWrapper.animLoop( delta );
    currentSceneWrapper.animEffectsLoop( delta );
    currentSceneWrapper.render( delta );
  }
  statsEnd();
  requestAnimationFrame(render);
};


const init = ( container, clearColor ) => {
  addStats(container);

  const renderer = new THREE.WebGLRenderer({ /*antialias: true,*/ alpha: true });
  setSize(container, renderer);
  onResize( async e => setSize(container, renderer));
  renderer.setClearColor(clearColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.autoClear = false;
  container.appendChild( renderer.domElement );

  render();
  
  const openScene = async (sceneCreator) => {
    currentSceneWrapper =  await sceneCreator(renderer);
    onResize( async e => currentSceneWrapper = await sceneCreator(renderer) );
  }

  return { addLoop, openScene };

}

export default init;