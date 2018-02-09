import { addLoop } from './UtilsLoop';
import { getMousePosNorm, getMousePosNormDelta, onMouseDown, onMouseUp, onMouseClick } from './UtilsMouse';
import { getObjectFaceOnPoint, isScreenPointOverObject, screenToWorldPoint } from './UtilsRaycast';
import { doOnceAfterRender } from './UtilsRender';

const canvas = document.createElement('canvas');
canvas.width = 2048;
canvas.height = 2048;
canvas.style.display = "none";
const ctx = canvas.getContext("2d");


onMouseDown( e => {
})

onMouseUp( e => {
})
import { copyToClipboard } from './UtilsClipboard';

let isHoverInitialized = false;
let hoverButtonOnClick = null;
window.appGlobals = Object.assign({}, window.appGlobals, {isHoverUI: () => hoverButtonOnClick != null});
onMouseClick( e => {
  hoverButtonOnClick ? hoverButtonOnClick() : null});



export const createButton = (args) => {
  const {
    camera,
    sprite, position,
    colliderSize, colliderPosition,
    stateNormal, stateHover,
    onClick
  } = args;
  if (!isHoverInitialized) {
    addLoop(delta => hoverButtonOnClick = null);
    isHoverInitialized = true;
  }
  const button = new THREE.Object3D();

  button.add(sprite);

  const collider = new THREE.Mesh(
    new THREE.PlaneGeometry(colliderSize.x, colliderSize.y, 0),
    new THREE.MeshBasicMaterial({ color: "#ff0000", visible: false })
  );
  collider.position.x = colliderPosition.x;
  collider.position.y = colliderPosition.y;
  button.add(collider);

  let targetOpacity = stateNormal.opacity;
  addLoop( delta => {
    
    const isHover = button.visible && isScreenPointOverObject(camera, getMousePosNorm(), collider);
    if (isHover) {
      hoverButtonOnClick = onClick;
      targetOpacity = stateHover.opacity;
    } else {
      targetOpacity = stateNormal.opacity;
    }
    sprite.material.opacity = THREE.Math.lerp(sprite.material.opacity, targetOpacity, delta * 10);
  });
  
  doOnceAfterRender(() => {
    const buttonPos = screenToWorldPoint(camera, new THREE.Vector2(position.x, position.y), button);
    if (buttonPos) {
      button.position.x = buttonPos.x;
      button.position.y = buttonPos.y;
    }
  });
  return button;
}

export const createSprite = url => {
  const texture = new THREE.TextureLoader().load(url);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color: "#ffffff",
      fog: false
    })
  );
  return sprite;
}

export const createTextSprite = text => {
  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillStyle="#000000";
  ctx.font = "200px Segoe UI Semibold";
  ctx.textAlign = "center";
  ctx.textBaseline = "baseline"; 

  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillText(text, 1024, 1024);
  const headerPng = canvas.toDataURL("image/png");
  const headerTexture = new THREE.TextureLoader().load(headerPng);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial( { map: headerTexture, color: 0xffffff, fog: false } )
  );
  return sprite;
}