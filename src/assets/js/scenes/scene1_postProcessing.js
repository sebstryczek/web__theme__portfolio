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
  //const sceneBackgroundSsaaRenderPass = new THREE.SSAARenderPass(sceneBackground, camera);
  //composerBackground.addPass(sceneBackgroundSsaaRenderPass);
  //sceneBackgroundSsaaRenderPass.unbiased = false;
  /* *** */
  const sceneBackgroundRenderPass = new THREE.RenderPass(sceneBackground, camera);
  composerBackground.addPass(sceneBackgroundRenderPass);
  /* *** */
  /* Background effects */
  const sceneBackgroundVignettePass = new THREE.ShaderPass( THREE.VignetteShader );
  sceneBackgroundVignettePass.uniforms[ "offset" ].value = 1;
  sceneBackgroundVignettePass.uniforms[ "darkness" ].value = 1;
  composerBackground.addPass(sceneBackgroundVignettePass);
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
  composerBackground.addPass(clearMaskPass);
  /* *** */
  /* Final pass */
  composerBackground.addPass(copyPass);
  /* *** */
  
  sceneHeader.background = renderTarget.texture;
  const finalComposer = new THREE.EffectComposer(renderer);
  //const headerSsaaRenderPass = new THREE.SSAARenderPass(sceneHeader, camera);
  //finalComposer.addPass(headerSsaaRenderPass);
  const headerRenderPass = new THREE.RenderPass( sceneHeader, camera);
  finalComposer.addPass(headerRenderPass);
  const fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
  finalComposer.addPass(fxaaPass);

  finalComposer.addPass(rgbPass);
  finalComposer.addPass(distortionPass);
  finalComposer.addPass(glitchPass);
  finalComposer.addPass(copyAndRenderPass);

  const effects = [ badTVPass, distortionPass, filmPass, staticPass ];
  const effectGlitch = glitchPass;
  const animEffectsLoop = createAnimEffectsLoop(effects, effectGlitch);
  const render = () => {
    composerBackground.render();
    finalComposer.render();
  }

  return { render, animEffectsLoop }
}
