import { Ref, onMounted } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

export default function useRender(
  renderCanvas: Ref<HTMLCanvasElement>,
  createScene: {
    (engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene;
    (arg0: BABYLON.Engine, arg1: any): any;
  }
) {
  function render() {
    const canvas = renderCanvas.value;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = createScene(engine, canvas);

    // Show inspector.
    Inspector.Show(scene, {
      embedMode: true,
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener('resize', function () {
      engine.resize();
    });
  }
  onMounted(() => {
    render();
  });
}
