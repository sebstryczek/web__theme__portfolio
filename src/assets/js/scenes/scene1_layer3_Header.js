import { screenToWorldPoint } from '../UtilsRaycast';
import { doOnceAfterRender } from '../UtilsRender';

export default async (camera) => {
  const scene = new THREE.Scene();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");
  canvas.width = 2048;
  canvas.height = 2048;
  canvas.style.display = "none";
  ctx.fillStyle="#000000";
  ctx.font = "200px Segoe UI Semibold";
  ctx.textAlign = "center";
  ctx.textBaseline = "baseline"; 
  const height = 2.0 * 4 * Math.tan(camera.fov * 0.5 * (Math.PI / 180) );
  
  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillText("SEBASTIAN STRYCZEK", 1024, 1024);
  const headerPng = canvas.toDataURL("image/png");
  const headerTexture = new THREE.TextureLoader().load(headerPng);
  const headerSprite = new THREE.Sprite(
    new THREE.SpriteMaterial( { map: headerTexture, color: 0xffffff, fog: false } )
  );
  headerSprite.scale.y = height;
  headerSprite.scale.x = height;
  if (window.appGlobals.ratio > 0) {
    headerSprite.scale.y = height + 2;
    headerSprite.scale.x = height + 2;
  }
  scene.add(headerSprite);

  ctx.clearRect(0, 0, 2048, 2048);
  ctx.fillText("sebastian@stryczek.pl", 1024, 1024);
  const emailPng = canvas.toDataURL("image/png");
  const emailTexture = new THREE.TextureLoader().load(emailPng);
  const emailSprite = new THREE.Sprite(
    new THREE.SpriteMaterial( { map: emailTexture, opacity: 0.7, color: 0xffffff, fog: false } )
  );
  emailSprite.name = "buttonEmail";
  emailSprite.position.y = -2.85;
  emailSprite.scale.y = 1;
  emailSprite.scale.x = 1;
  scene.add(emailSprite);
  const emailSpriteCollider = new THREE.Mesh( new THREE.PlaneGeometry(1.2, 0.2, 0), new THREE.MeshBasicMaterial({ visible: false }) );
  emailSpriteCollider.name = "buttonEmailCollider";
  emailSprite.add(emailSpriteCollider);

  const textureGitHub = new THREE.TextureLoader().load('./assets/img/icon-github-b.png');
  const spriteGitHub = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: textureGitHub,
      color: 0xffffff,
      opacity: 0.4,
      fog: false
    })
  );
  spriteGitHub.name = "buttonGitHub";
  spriteGitHub.scale.x = 0.3;
  spriteGitHub.scale.y = 0.3;
  scene.add(spriteGitHub);
  const spriteGitHubCollider = new THREE.Mesh( new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({visible: false}) );
  spriteGitHubCollider.position.x = -0.5;
  spriteGitHub.add(spriteGitHubCollider);


  const textureLinkedIn = new THREE.TextureLoader().load('./assets/img/icon-linkedin-b.png');
  const spriteLinkedIn = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: textureLinkedIn,
      color: 0xffffff,
      opacity: 0.4,
      fog: false
    })
  );
  spriteLinkedIn.name = "buttonLinkedIn";
  spriteLinkedIn.scale.x = 0.3;
  spriteLinkedIn.scale.y = 0.3;
  scene.add(spriteLinkedIn);
  const spriteLinkedInCollider = new THREE.Mesh( new THREE.PlaneGeometry(2, 2, 0), new THREE.MeshBasicMaterial({visible: false}) );
  spriteLinkedInCollider.position.x = -0.5;
  spriteLinkedIn.add(spriteLinkedInCollider);

  doOnceAfterRender(() => {
    const spriteGitHubPos = screenToWorldPoint(camera, new THREE.Vector2(-0.05, -0.8), spriteGitHub);
    if (spriteGitHubPos) {
      spriteGitHub.position.x = spriteGitHubPos.x;
      spriteGitHub.position.y = spriteGitHubPos.y;
    }

    const spriteLinkedInPos = screenToWorldPoint(camera, new THREE.Vector2(0.05, -0.8), spriteLinkedIn);
    if (spriteLinkedInPos) {
      spriteLinkedIn.position.x = spriteLinkedInPos.x;
      spriteLinkedIn.position.y = spriteLinkedInPos.y;
    }
  });
  return scene;
}
