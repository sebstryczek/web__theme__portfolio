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

export default (camera, polygon1, polygon2) => {
  const obj = polygon2.children.find( x => x.name == "Mesh");
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
  
  onMouseUp( e => isDragging = false );
  
  return () => {
    const mousePosNorm = getMousePosNorm();
    const mousePosNormDelta = getMousePosNormDelta();
    const selectedFace = getFaceOnMouse();
    
    obj.geometry.faces.forEach( x => {
      if (x.color.r !== 0 || x.color.g !== 1 || x.color.b !== 1) {
        x.color.r = 0;
        x.color.g = 1;
        x.color.b = 1;
        obj.geometry.colorsNeedUpdate = true;
      }
    });

    if (selectedFace) {
      selectedFace.color.r = 0;
      selectedFace.color.g = 0;
      selectedFace.color.b = 0;
      obj.geometry.colorsNeedUpdate = true;
    }

    if (isMouseOverObjectMesh()) {
      document.body.classList.add("cursor-pointer");
    } else {
      document.body.classList.remove("cursor-pointer");
    }

    if (isDragging) {
      document.body.classList.add("cursor-grab");
      rotation.x += mousePosNormDelta.x;
      rotation.y += mousePosNormDelta.y;
    } else {
      document.body.classList.remove("cursor-grab");
      if (isRotationComplete(rotation)) {
        isAutoSpin = true;
      }
    }
    
    if (isAutoSpin) {
      rotation.x = THREE.Math.clamp( rotation.x + autoSpinAcc, minAutoSpin, maxAutoSpin);
      rotation.y = THREE.Math.clamp( rotation.y + autoSpinAcc, minAutoSpin, maxAutoSpin);
    } else {
      rotation.x *= rotationSlowingFactor;
      rotation.y *= rotationSlowingFactor;
    }

    rotateObject(rotation.x, rotation.y);
  }
}