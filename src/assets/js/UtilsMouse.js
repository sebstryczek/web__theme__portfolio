let pos = { x: -1, y: -1 };
let prevPos = { x: -1, y: -1 };
let posNorm = { x: -1, y: -1 };
let prevPosNorm = { x: -1, y: -1 };
const onMouseDownCallbacks = [];
const onMouseUpCallbacks = [];
const onMouseClickCallbacks = [];

document.addEventListener('mousemove', event => {
  event.preventDefault();
  const posX = event.clientX;
  const posY = event.clientY;
  pos = { x: posX, y: posY };
  const posNormX = (event.clientX / window.innerWidth) * 2 - 1;
  const posNormY = - (event.clientY / window.innerHeight) * 2 + 1;
  posNorm = { x: posNormX, y: posNormY };
});

document.addEventListener('mousedown', event => {
  //event.preventDefault();
  onMouseDownCallbacks.forEach( f => f(event) );
}, true);

document.addEventListener('mouseup', event => {
  event.preventDefault();
  onMouseUpCallbacks.forEach( f => f(event) );
}, true);

document.addEventListener('click', event => {
  //event.preventDefault();
  onMouseClickCallbacks.forEach( f => f(event) );
}, true);

export const getMousePos = () => pos;

export const getMousePosDelta = () => {
  const x = prevPos.x - pos.x;
  const y = prevPos.y - pos.y;
  prevPos = Object.assign({}, pos);
  return { x, y }
}

export const getMousePosNorm = () => posNorm;

export const getMousePosNormDelta = () => {
  const x = posNorm.x - prevPosNorm.x;
  const y = prevPosNorm.y - posNorm.y;
  prevPosNorm = Object.assign({}, posNorm);
  return { x, y }
}

export const onMouseDown = f => onMouseDownCallbacks.push(f);
export const onMouseUp = f => onMouseUpCallbacks.push(f);
export const onMouseClick = f => onMouseClickCallbacks.push(f);
