import { addLoop } from './UtilsLoop';
import { getMousePosNorm, onMouseClick } from './UtilsMouse';
import { isScreenPointOverObject, screenToWorldPoint } from './UtilsRaycast';
import { doOnceAfterRender } from './UtilsRender';

const canvas = document.createElement('canvas');
canvas.width = 2048;
canvas.height = 2048;
canvas.style.display = "none";
const ctx = canvas.getContext("2d");

let isHoverInitialized = false;
let hoverButtonOnClick = null;
window.appGlobals = Object.assign({}, window.appGlobals, {isHoverUI: () => hoverButtonOnClick != null});
onMouseClick( e => hoverButtonOnClick ? hoverButtonOnClick() : null );

export const createButton = (args) => {
  const {
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
    const camera = window.appGlobals.camera;
    const isHover = button.visible && isScreenPointOverObject(camera, getMousePosNorm(), collider);
    if (isHover) {
      hoverButtonOnClick = onClick;
      targetOpacity = stateHover.opacity;
    } else {
      targetOpacity = stateNormal.opacity;
    }
    sprite.material.opacity = THREE.Math.lerp(sprite.material.opacity, targetOpacity, delta * 10);
  });
  return button;
}

export const setFixedSize = (obj, fixedSize) => {
  doOnceAfterRender(() => {
    const camera = window.appGlobals.camera;
    const fixedWidthNormalized = (fixedSize.x / window.appGlobals.width) * 2;
    const fixedHeightNormalized = (fixedSize.y / window.appGlobals.height) * 2;
    const min = screenToWorldPoint(camera, new THREE.Vector2(0), obj);
    const max = screenToWorldPoint(camera, new THREE.Vector2(fixedWidthNormalized, fixedHeightNormalized), obj);
    const scaleX = Math.abs(min.x) + Math.abs(max.x);
    const scaleY = Math.abs(min.y) + Math.abs(max.y);
    obj.scale.x = scaleX;
    obj.scale.y = scaleY;
  });
}

export const setFixedPosition = (obj, fixedPosition) => {
  doOnceAfterRender(() => {
    const camera = window.appGlobals.camera;
    const fixedPositionXNormalized = (fixedPosition.x / window.appGlobals.width) * 2 - 1;
    const fixedPositionYNormalized = (fixedPosition.y / window.appGlobals.height) * 2 - 1;
    const position = screenToWorldPoint(camera, new THREE.Vector2(fixedPositionXNormalized, fixedPositionYNormalized), obj);
    obj.position.x = position.x;
    obj.position.y = position.y;
  });
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
  const png = canvas.toDataURL("image/png");
  const texture = new THREE.TextureLoader().load(png);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: false } )
  );
  return sprite;
}