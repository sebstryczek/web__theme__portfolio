import { copyToClipboard } from '../UtilsClipboard';
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

export default (camera, sceneBackground, sceneText) => {
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
  
  const buttonGitHub = sceneText.children.find( x => x.name == "buttonGitHub");
  const buttonLinkedIn = sceneText.children.find( x => x.name == "buttonLinkedIn");
  const buttonEmail = sceneText.children.find( x => x.name == "buttonEmail");
  const buttonEmailCollider = buttonEmail.children.find( x => x.name == "buttonEmailCollider");

  onMouseDown( e => {
    if (isMouseOverObjectMesh()) {
      isDragging = true;
      isAutoSpin = false;
    }
  });
  
  let triggerMouseUp = false;
  let selectedEmail = false;
  onMouseUp( e => {
    if (selectedEmail) {
      //Can't copy from render function
      //Even trigger "click" on button with copy function, not working
      copyToClipboard('sebastian@stryczek.pl');
      selectedEmail = false;
    }
    triggerMouseUp = true;
    isDragging = false;
  });
  
  let targetEdgesOpacity = 0.3;
  let targetButtonGitHubOpacity = 0.4;
  let targetButtonLinkedInOpacity = 0.4;
  let targetButtonEmailOpacity = 0.4;

  return delta => {
    const mousePosNorm = getMousePosNorm();
    const mousePosNormDelta = getMousePosNormDelta();
    const selectedFace = getFaceOnMouse();

    const selectedGitHub = isScreenPointOverObject(camera, getMousePosNorm(), buttonGitHub);
    if (selectedGitHub) {
      if (triggerMouseUp) document.querySelector('#buttonGitHub').click();
      targetButtonGitHubOpacity = 0.7;
    } else {
      targetButtonGitHubOpacity = 0.4;
    }
    buttonGitHub.material.opacity = THREE.Math.lerp(
      buttonGitHub.material.opacity, targetButtonGitHubOpacity, delta * 10
    );
    
    const selectedLinkedIn = isScreenPointOverObject(camera, getMousePosNorm(), buttonLinkedIn);
    if (selectedLinkedIn) {
      if (triggerMouseUp) document.querySelector('#buttonLinkedIn').click();
      targetButtonLinkedInOpacity = 0.7;
    } else {
      targetButtonLinkedInOpacity = 0.4;
    }
    buttonLinkedIn.material.opacity = THREE.Math.lerp(
      buttonLinkedIn.material.opacity, targetButtonLinkedInOpacity, delta * 10
    );

    selectedEmail = isScreenPointOverObject(camera, getMousePosNorm(), buttonEmailCollider);
    if (selectedEmail) {
      if (triggerMouseUp) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");
        canvas.width = 2048;
        canvas.height = 2048;
        canvas.style.display = "none";
        ctx.fillStyle="#000000";
        ctx.font = "170px Segoe UI Semibold";
        ctx.textAlign = "center";
        ctx.textBaseline = "baseline"; 
        const height = 2.0 * 4 * Math.tan(camera.fov * 0.5 * (Math.PI / 180) );
        
        ctx.clearRect(0, 0, 2048, 2048);
        ctx.fillText("E-MAIL ADDRESS COPIED", 1024, 1024);
        const emailPng = canvas.toDataURL("image/png");
        const emailTexture = new THREE.TextureLoader().load(emailPng);
        buttonEmail.material.map = emailTexture;
        buttonEmail.material.needsUpdate = true;
      }
      targetButtonEmailOpacity = 0.7;
    } else {
      targetButtonEmailOpacity = 0.4;
    }
    buttonEmail.material.opacity = THREE.Math.lerp(
      buttonEmail.material.opacity, targetButtonEmailOpacity, delta * 10
    );
    
    obj.geometry.faces.forEach( x => {
      if (x.color.r !== 0 || x.color.g !== 1 || x.color.b !== 1) {
        x.color.setRGB(0, 1, 1);
        obj.geometry.colorsNeedUpdate = true;
      }
    });

    if (selectedGitHub || selectedLinkedIn || selectedEmail) {
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
