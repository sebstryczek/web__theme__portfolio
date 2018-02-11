import { copyToClipboard } from '../UtilsClipboard';
import { screenToWorldPoint } from '../UtilsRaycast';
import { createButton, createSprite, createTextSprite, setFixedPosition, setFixedSize } from '../UtilsUI';

export default async () => {
  const scene = new THREE.Scene();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");

  const headerSprite = createTextSprite("SEBASTIAN STRYCZEK");
  scene.add(headerSprite);
  const { ratio, width, height } = window.appGlobals;
  let size = width * 0.75;
  if (window.appGlobals.width > 980) size = width * 0.6;
  setFixedSize(headerSprite, { x: size, y: size });

  const buttonGitHub = createButton({
    sprite: createSprite('./assets/img/icon-github-b.png'),
    colliderSize: { x: 1, y: 1 },
    colliderPosition: { x: -0.25, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.6 },
    onClick: () => {
      document.querySelector('#buttonGitHub').click()
    }
  });
  scene.add(buttonGitHub);
  setFixedSize(buttonGitHub, { x: 48, y: 48 });
  setFixedPosition(buttonGitHub, { x: window.appGlobals.width / 2 - 48, y: 64 });

  const buttonLinkedIn = createButton({
    sprite: createSprite('./assets/img/icon-linkedin-b.png'),
    colliderSize: { x: 1, y: 1 },
    colliderPosition: { x: -0.25, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => document.querySelector('#buttonLinkedIn').click()
  });
  scene.add(buttonLinkedIn);
  setFixedSize(buttonLinkedIn, { x: 48, y: 48 });
  setFixedPosition(buttonLinkedIn, { x: window.appGlobals.width / 2 + 48, y: 64 });
  
  const buttonCopyEmail = createButton({
    sprite: createTextSprite('sebastian@stryczek.pl'),
    colliderSize: { x: 1, y: 0.2 },
    colliderPosition: { x: -0.075, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => {
      buttonCopyEmail.visible = false;
      buttonCopyEmailDone.visible = true;
      copyToClipboard('sebastian@stryczek.pl');
    }
  });
  scene.add(buttonCopyEmail);
  setFixedSize(buttonCopyEmail, { x: 160, y: 160 });
  setFixedPosition(buttonCopyEmail, { x: window.appGlobals.width / 2, y: 12 });
  
  const buttonCopyEmailDone = createButton({
    sprite: createTextSprite('e-mail address copied'),
    colliderSize: { x: 1, y: 0.2 },
    colliderPosition: { x: -0.075, y: 0 },//TODO: Check if this is because of postprocessign rgb
    stateNormal: { opacity: 0.3 },
    stateHover: { opacity: 0.8 },
    onClick: () => {
      buttonCopyEmail.visible = true;
      buttonCopyEmailDone.visible = false;
    }
  });
  buttonCopyEmailDone.visible = false;
  scene.add(buttonCopyEmailDone);
  setFixedSize(buttonCopyEmailDone, { x: 160, y: 160 });
  setFixedPosition(buttonCopyEmailDone, { x: window.appGlobals.width / 2, y: 12 });
  
  return scene;
}
