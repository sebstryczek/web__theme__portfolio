import createAnimLoop from './scene1_animLoop';
import createCamera from './scene1_camera';
import createSceneBackground from './scene1_layer1_Background';
import createSceneMirrorMask from './scene1_layer2_MirrorMask';
import createSceneText from './scene1_layer3_Text';
import createPostProcessingRenderer from './scene1_postProcessing';

export default async (renderer) => {
  const camera = createCamera();
  const sceneBackground = createSceneBackground();
  const sceneMirror = createSceneMirrorMask();
  const sceneText = await createSceneText(camera);
  const { render, animEffectsLoop } = createPostProcessingRenderer(
    renderer,
    camera,
    sceneBackground,
    sceneMirror,
    sceneText
  );
  
  const animLoop = createAnimLoop(camera, sceneBackground, sceneText);
  
  return {
    render, animLoop, animEffectsLoop
  }
}