export const createReusableEffects = () => {
  const badTVPass = new THREE.ShaderPass( THREE.BadTVShader );
  badTVPass.uniforms['distortion'].value = 0; //0-20
  badTVPass.uniforms['distortion2'].value = 1; //0-20
  badTVPass.uniforms['speed'].value = 0.3; //0-1
  badTVPass.uniforms['rollSpeed'].value = 0; //0-1

  const blurHorizontalPass = new THREE.ShaderPass(THREE.HorizontalBlurShader);
  blurHorizontalPass.uniforms.h.value = 0.0005;

  const blurVerticalPass = new THREE.ShaderPass(THREE.VerticalBlurShader);
  blurVerticalPass.uniforms.v.value = 0.0005;

  const clearPass = new THREE.ClearPass();

  const clearMaskPass = new THREE.ClearMaskPass();

  const copyPass = new THREE.ShaderPass( THREE.CopyShader );
  
  const copyAndRenderPass = new THREE.ShaderPass( THREE.CopyShader );
  copyAndRenderPass.renderToScreen = true;

  const distortionPass = new THREE.ShaderPass( THREE.DistortionShader );
  
  const filmPass = new THREE.FilmPass(0.1, 0.25, 256, false);
  filmPass.uniforms['sCount'].value = 500;
  filmPass.uniforms['sIntensity'].value = 0.2;
  filmPass.uniforms['nIntensity'].value = 0.2;

  const flipPass = new THREE.ShaderPass(THREE.FlipShader);

  const glitchPass = new THREE.ShaderPass( THREE.DigitalGlitch );
  glitchPass.uniforms['byp'].value = 1; // 0 - enable | 1 - disable
  glitchPass.uniforms['col_s'].value = 0.05; // default 0.05

  const rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  rgbPass.uniforms['angle'].value = 0.2 * Math.PI;
  rgbPass.uniforms['amount'].value = 0.002;
  
  const staticPass = new THREE.ShaderPass( THREE.StaticShader );
  staticPass.uniforms[ 'amount' ].value = 0.1;
  staticPass.uniforms[ 'size' ].value = 1;
  
  return {
    badTVPass, blurHorizontalPass, blurVerticalPass,
    clearPass, clearMaskPass, copyPass, copyAndRenderPass,
    distortionPass, filmPass, flipPass, glitchPass,
    rgbPass, staticPass
  }
}

export const createAnimEffectsLoop = (effects, effectGlitch) => {
  let effectsTimer = 0;
  let effectGlitchStartTime = 0;
  let effectGlitchStartTimer = 0;
  let effectGlitchLengthTime = 0;
  let effectGlitchLengthTimer = 0;
  
  const configEffectGlitch = (force) => {
    if (force == 0) {
      effectGlitch.uniforms['byp'].value = 1;
    } else if (force == 1) {
      effectGlitch.uniforms['byp'].value = 0;
      effectGlitch.uniforms['amount'].value = Math.random() / 90;
      effectGlitch.uniforms['angle'].value = THREE.Math.randFloat(- Math.PI, Math.PI);
      effectGlitch.uniforms['distortion_x'].value = THREE.Math.randFloat(0, 1);
      effectGlitch.uniforms['distortion_y'].value = THREE.Math.randFloat(0, 1);
      effectGlitch.uniforms['seed_x'].value = THREE.Math.randFloat(- 0.3, 0.3);
      effectGlitch.uniforms['seed_y'].value = THREE.Math.randFloat(- 0.3, 0.3);
    } else {
      effectGlitch.uniforms['byp'].value = 0;
      effectGlitch.uniforms['amount'].value = Math.random() / 30;
      effectGlitch.uniforms['angle'].value = THREE.Math.randFloat(- Math.PI, Math.PI);
      effectGlitch.uniforms['seed'].value = Math.random();
      effectGlitch.uniforms['seed_x'].value = THREE.Math.randFloat(- 1, 1);
      effectGlitch.uniforms['seed_y'].value = THREE.Math.randFloat(- 1, 1);
      effectGlitch.uniforms['distortion_x'].value = THREE.Math.randFloat(0, 1);
      effectGlitch.uniforms['distortion_y'].value = THREE.Math.randFloat(0, 1);
    }
  }
  
  return delta => {
    effectsTimer += delta;
    effects.forEach( x => x.uniforms['time'].value = effectsTimer );
    
    if (effectGlitchStartTimer >= effectGlitchStartTime) {
      if (effectGlitchLengthTimer >= effectGlitchLengthTime) {
        configEffectGlitch(0);
        effectGlitchStartTime = THREE.Math.randInt( 10, 20 );
        effectGlitchStartTimer = 0;
        effectGlitchLengthTime = THREE.Math.randFloat(0.1, 0.75);
        effectGlitchLengthTimer = 0;
      } else {
        configEffectGlitch(THREE.Math.randInt(1, 2));
        effectGlitchLengthTimer += delta;
      }
    } else {
      effectGlitchStartTimer += delta;
    }
  }
}
