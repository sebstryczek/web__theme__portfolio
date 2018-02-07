import 'babel-polyfill';
import './ThreeShaders/DistortionShader';
import './ThreeShaders/FlipShader';

import init from './init';
import createScene1 from './scenes/scene1';

(async () => {
  const container = document.querySelector('.js--app');
  const app = init(container, "#f7f7f7");
  window.app = app;
  app.openScene( createScene1 );
})();
