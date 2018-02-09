import { deg2rad, rotateAroundWorldAxis } from '../UtilsMathExt';
import { getMousePosNorm, getMousePosNormDelta, onMouseDown, onMouseUp } from '../UtilsMouse';
import { getObjectFaceOnPoint, isScreenPointOverObject, screenToWorldPoint } from '../UtilsRaycast';

let firstLoop = true;
let isDragging = false;
let isAutoSpin = true;
const autoSpinAcc = 0.0001;
const minAutoSpin = 0;
const maxAutoSpin = 0.1;
const rotation = { x: maxAutoSpin, y: maxAutoSpin };
const rotationSlowingFactor = 0.99;
const isRotationComplete = ({x, y}) => Math.abs(x.toFixed(2)) < 0.01 & Math.abs(y.toFixed(2)) < 0.01

export default (camera, sceneBackground, sceneUI) => {
  const polygon1 = sceneBackground.children.find( x => x.name == "polygon1");
  const polygon2 = sceneBackground.children.find( x => x.name == "polygon2");
  const obj = polygon2.children.find( x => x.name == "Mesh");
  const edges = polygon2.children.find( x => x.name == "Edges");
  const isMouseOverObjectMesh = () => isScreenPointOverObject(camera, getMousePosNorm(), obj);
  const getFaceOnMouse = () => getObjectFaceOnPoint(camera, getMousePosNorm(), obj);
  const rotateObject = (angleX, angleY) => {
    rotateAroundWorldAxis(polygon1, new THREE.Vector3(0, 1, 0), angleX * deg2rad);
    rotateAroundWorldAxis(polygon1, new THREE.Vector3(1, 0, 0), angleY * deg2rad);
    rotateAroundWorldAxis(polygon2, new THREE.Vector3(0, 1, 0), angleX * deg2rad);
    rotateAroundWorldAxis(polygon2, new THREE.Vector3(1, 0, 0), angleY * deg2rad);
  }
  
  onMouseDown( e => {
    if (isMouseOverObjectMesh()) {
      isDragging = true;
      isAutoSpin = false;
    }
  });
  
  let triggerMouseUp = false;
  onMouseUp( e => {
    triggerMouseUp = true;
    isDragging = false;
  });
  
  let targetEdgesOpacity = 0.3;

  return delta => {
    const mousePosNorm = getMousePosNorm();
    const mousePosNormDelta = getMousePosNormDelta();
    const selectedFace = getFaceOnMouse();

    obj.geometry.faces.forEach( x => {
      if (x.color.r !== 0 || x.color.g !== 1 || x.color.b !== 1) {
        x.color.setRGB(0, 1, 1);
        obj.geometry.colorsNeedUpdate = true;
      }
    });
    
    if (window.appGlobals.isHoverUI()) {
      isDragging = false;
    } else {
      if (selectedFace) {
        selectedFace.color.setRGB(0, 0, 0);
        obj.geometry.colorsNeedUpdate = true;
      }
    }

    if (isMouseOverObjectMesh()) {
      targetEdgesOpacity = 0.4;
      document.body.classList.add("cursor-pointer");
    } else {
      targetEdgesOpacity = 0.3;
      document.body.classList.remove("cursor-pointer");
    }

    if (isDragging) {
      targetEdgesOpacity = 0.7;
      document.body.classList.add("cursor-grab");
      rotation.x += mousePosNormDelta.x;
      rotation.y += mousePosNormDelta.y;
    } else {
      document.body.classList.remove("cursor-grab");
      if (isRotationComplete(rotation)) {
        isAutoSpin = true;
      }
    }

    
    edges.material.opacity = THREE.Math.lerp(
      edges.material.opacity, targetEdgesOpacity, delta * 10
    );
    
    if (isAutoSpin) {
      rotation.x = THREE.Math.clamp( rotation.x + autoSpinAcc, minAutoSpin, maxAutoSpin);
      rotation.y = THREE.Math.clamp( rotation.y + autoSpinAcc, minAutoSpin, maxAutoSpin);
    } else {
      rotation.x *= rotationSlowingFactor;
      rotation.y *= rotationSlowingFactor;
    }


    rotateObject(rotation.x, rotation.y);

    if (triggerMouseUp) triggerMouseUp = false;
  }
}
