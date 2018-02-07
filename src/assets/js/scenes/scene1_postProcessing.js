import { createReusableEffects, createAnimEffectsLoop } from './scene1_postProcessingEffects';


export default (renderer, camera, sceneBackground, sceneMirror, sceneHeader) => {
  const renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth, window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false
    }
  );

  const {
    badTVPass, blurHorizontalPass, blurVerticalPass,
    clearPass, clearMaskPass, copyPass, copyAndRenderPass,
    distortionPass, filmPass, flipPass, glitchPass,
    rgbPass, staticPass
  } = createReusableEffects();

  /* Background scene composer */
  const composerBackground = new THREE.EffectComposer(renderer, renderTarget);
  composerBackground.renderTarget1.stencilBuffer = true; // ??
  composerBackground.renderTarget2.stencilBuffer = true; //??
  /* *** */
  /* Clear */
  composerBackground.addPass(clearPass);
  /* *** */
  /* Render background scene with SSAA */
  const sceneBackgroundSsaaRenderPass = new THREE.SSAARenderPass(sceneBackground, camera);
  sceneBackgroundSsaaRenderPass.unbiased = false;
  composerBackground.addPass(sceneBackgroundSsaaRenderPass);
  /* *** */
  /* Background effects */
  const sceneBackgroundVignettePass = new THREE.ShaderPass( THREE.VignetteShader );
  sceneBackgroundVignettePass.uniforms[ "offset" ].value = 1;
  sceneBackgroundVignettePass.uniforms[ "darkness" ].value = 1;
  composerBackground.addPass(sceneBackgroundVignettePass);
  //composerBackground.addPass(rgbPass);
  composerBackground.addPass(staticPass);
  composerBackground.addPass(filmPass);
  composerBackground.addPass(badTVPass);
  /* *** */
  /* Triangle "flip mirror" */
  const sceneMirrorMaskPass = new THREE.MaskPass(sceneMirror, camera);
  composerBackground.addPass(sceneMirrorMaskPass);
  composerBackground.addPass(flipPass);
  composerBackground.addPass(blurHorizontalPass);
  composerBackground.addPass(blurVerticalPass);
  const sceneMirrorVignettePass = new THREE.ShaderPass( THREE.VignetteShader );
  sceneMirrorVignettePass.uniforms[ "offset" ].value = 1;
  sceneMirrorVignettePass.uniforms[ "darkness" ].value = 3;
  composerBackground.addPass(sceneMirrorVignettePass);
  composerBackground.addPass(badTVPass);
  composerBackground.addPass(clearMaskPass);
  /* *** */
  /* Final pass */
  composerBackground.addPass(copyPass);
  /* *** */
  
  const finalComposer = new THREE.EffectComposer(renderer);

  sceneHeader.background = renderTarget.texture;
  const headerSsaaRenderPass = new THREE.SSAARenderPass(sceneHeader, camera, 0x000000, 0);
  
  finalComposer.addPass(headerSsaaRenderPass);
  finalComposer.addPass(rgbPass);
  finalComposer.addPass(distortionPass);
  finalComposer.addPass(glitchPass);
  finalComposer.addPass(copyPass);
  //finalComposerTexturePass.renderToScreen = true;
  //finalComposer.addPass(finalComposerTexturePass);

  
  //renderer.render( sceneHeader, camera, rtTexture, true );



  


  //const renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: true };
  //const renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );

  
  const effects = [ badTVPass, distortionPass, filmPass, staticPass ];
  const effectGlitch = glitchPass;
  const animEffectsLoop = createAnimEffectsLoop(effects, effectGlitch);
  const render = () => {
    composerBackground.render();
    finalComposer.render();
  }

  return { render, animEffectsLoop }
}
