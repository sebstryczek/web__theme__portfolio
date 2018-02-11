import createAnimLoop from './scene1_animLoop';
import createCamera from './scene1_camera';
import createSceneBackground from './scene1_layer1_Background';
import createSceneMirrorMask from './scene1_layer2_MirrorMask';
import createSceneUI from './scene1_layer3_UI';
import createPostProcessingRenderer from './scene1_postProcessing';

export default async (renderer) => {
  const camera = createCamera();
  const sceneBackground = createSceneBackground();
  const sceneMirror = createSceneMirrorMask();
  const sceneUI = await createSceneUI();
  const { render, animEffectsLoop } = createPostProcessingRenderer(
    renderer,
    camera,
    sceneBackground,
    sceneMirror,
    sceneUI
  );
  
  const animLoop = createAnimLoop(camera, sceneBackground, sceneUI);
  
  return {
    camera, render, animLoop, animEffectsLoop
  }
}