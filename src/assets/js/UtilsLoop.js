import { statsBegin, statsEnd } from './UtilsStats';
import { doOnceAfterRenderInvoke } from './UtilsRender';

const clock = new THREE.Clock();
let loops = [];
const mainLoop = () => {
  statsBegin();
  const delta = clock.getDelta();
  loops.forEach( f => f(delta) );
  doOnceAfterRenderInvoke();
  statsEnd();
  requestAnimationFrame(mainLoop);
};

mainLoop();

export const addLoop = f => loops.push(f);
export const clearLoops = () => loops = [];
