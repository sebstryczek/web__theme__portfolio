import createAnimLoop from './scene1_animLoop';
import createCamera from './scene1_camera';
import createSceneBackground from './scene1_layer1_Background';
import createSceneMirrorMask from './scene1_layer2_MirrorMask';
import createSceneHeader from './scene1_layer3_Header';
import createPostProcessingRenderer from './scene1_postProcessing';

export default async (renderer) => {
  const camera = createCamera();
  const sceneBackground = createSceneBackground();
  const sceneMirror = createSceneMirrorMask();
  const sceneHeader = await createSceneHeader(camera);
  const { render, animEffectsLoop } = createPostProcessingRenderer(
    renderer,
    camera,
    sceneBackground,
    sceneMirror,
    sceneHeader
  );
  
  const animLoop = createAnimLoop(camera, sceneBackground, sceneHeader);
  
  return {
    render, animLoop, animEffectsLoop
  }
}