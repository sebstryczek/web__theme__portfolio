import { copyToClipboard } from '../UtilsClipboard';
import { screenToWorldPoint } from '../UtilsRaycast';
import { createButton, createSprite, createTextSprite } from '../UtilsUI';

export default async (camera) => {
  const scene = new THREE.Scene();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  
  const headerSprite = createTextSprite("SEBASTIAN STRYCZEK");
  const height = 2.0 * 4 * Math.tan(camera.fov * 0.5 * (Math.PI / 180) );
  headerSprite.scale.y = height;
  headerSprite.scale.x = height;
  if (window.appGlobals.ratio > 0) {
    headerSprite.scale.y = height + 2;
    headerSprite.scale.x = height + 2;
  }
  scene.add(headerSprite);

  const buttonGitHub = createButton({
    camera: camera,
    sprite: createSprite('./assets/img/icon-github-b.png'),
    position: { x: -0.05, y: -0.8},
    colliderSize: { x: 1, y: 1 },
    colliderPosition: { x: -0.25, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.6 },
    onClick: () => {
      console.log('??')
      document.querySelector('#buttonGitHub').click()
    }
  })
  buttonGitHub.scale.x = 0.3;
  buttonGitHub.scale.y = 0.3;
  scene.add(buttonGitHub);

  const buttonLinkedIn = createButton({
    camera: camera,
    sprite: createSprite('./assets/img/icon-linkedin-b.png'),
    position: { x: 0.05, y: -0.8},
    colliderSize: { x: 1, y: 1 },
    colliderPosition: { x: -0.25, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => document.querySelector('#buttonLinkedIn').click()
  })
  buttonLinkedIn.scale.x = 0.3;
  buttonLinkedIn.scale.y = 0.3;
  scene.add(buttonLinkedIn);
  
  const buttonCopyEmail = createButton({
    camera: camera,
    sprite: createTextSprite('sebastian@stryczek.pl'),
    position: { x: 0, y: -0.93},
    colliderSize: { x: 1, y: 0.2 },
    colliderPosition: { x: -0.075, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => {
      buttonCopyEmail.visible = false;
      buttonCopyEmailDone.visible = true;
      copyToClipboard('sebastian@stryczek.pl');
    }
  })
  buttonCopyEmail.scale.x = 1;
  buttonCopyEmail.scale.y = 1;
  scene.add(buttonCopyEmail);
  
  
  const buttonCopyEmailDone = createButton({
    camera: camera,
    sprite: createTextSprite('e-mail address copied'),
    position: { x: 0, y: -0.93},
    colliderSize: { x: 1, y: 0.2 },
    colliderPosition: { x: -0.075, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => {
      buttonCopyEmail.visible = true;
      buttonCopyEmailDone.visible = false;
    }
  })
  buttonCopyEmailDone.visible = false;
  buttonCopyEmailDone.scale.x = 1;
  buttonCopyEmailDone.scale.y = 1;
  scene.add(buttonCopyEmailDone);
  
  return scene;
}
