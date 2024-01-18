<template>
  <canvas id="xinyan" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

onMounted(() => {
  render();
});

function render() {
  const canvas = document.getElementById('xinyan') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const engine = new BABYLON.Engine(canvas, true);

  const scene = createScene(engine, canvas);

  engine.runRenderLoop(() => {
    scene.render();
  });

  // Resize
  window.addEventListener('resize', function () {
    engine.resize();
  });
}

const createScene = (engine, canvas) => {
  const scene = new BABYLON.Scene(engine);

  var Camera = new BABYLON.ArcRotateCamera(
    'Camera',
    -10,
    5,
    10,
    new BABYLON.Vector3(-1.5, 8, -2),
    scene
  );

  Camera.setPosition(new BABYLON.Vector3(0, 15, 20));
  Camera.fov = 1;
  Camera.attachControl(canvas, true);
  Camera.wheelPrecision = 20;
  Camera.minZ = 0.1;
  // scene.debugLayer.show({ showExplorer: true });//????inspector????

  var light = new BABYLON.PointLight(
    'light',
    new BABYLON.Vector3(3, 20, 10),
    scene
  );
  var light2 = new BABYLON.PointLight(
    'light2',
    new BABYLON.Vector3(3, 20, -10),
    scene
  );
  BABYLON.SceneLoader.Append(
    'https://smashelbow.github.io/xinyan/',
    'xinyanBabylon.gltf',
    scene,
    function (scene) {
      light.intensity = 1; //????
      light2.intensity = 1;
      light.shadowMinZ = 0.1;
      light.shadowMaxZ = 1200;
      light2.shadowMinZ = 0.1;
      light2.shadowMaxZ = 1200;

      var xinyan = scene.getMeshByName('xinyan');
      var xinyanLine: any = scene.getMeshByName('xinyanLine');
      xinyanLine.material.indexOfRefraction = 0;
      xinyanLine.material.metallicF0Factor = 0;

      BABYLON.NodeMaterial.ParseFromSnippetAsync('#4AWEWY#63', scene).then(
        (mat) => {
          xinyan.material = mat;
        }
      );

      var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
      shadowGenerator.getShadowMap().renderList.push(xinyan);
      shadowGenerator.setDarkness(0);
      shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_PCSS; //?????????,????
      shadowGenerator.usePoissonSampling = true;
      shadowGenerator.useContactHardeningShadow = true;
      shadowGenerator.usePercentageCloserFiltering = true; //?????????,????
      shadowGenerator.bias = 0.0001;

      shadowGenerator.blurBoxOffset = 0.01;

      var shadowGenerator2 = new BABYLON.ShadowGenerator(2048, light2);
      shadowGenerator2.getShadowMap().renderList.push(xinyan);
      shadowGenerator2.setDarkness(0);
      shadowGenerator2.filter = BABYLON.ShadowGenerator.FILTER_PCSS; //?????????,????
      shadowGenerator2.usePoissonSampling = true;
      shadowGenerator2.useContactHardeningShadow = true;
      shadowGenerator2.usePercentageCloserFiltering = true; //?????????,????
      shadowGenerator2.bias = 0.0001;

      shadowGenerator2.blurBoxOffset = 0.01;

      xinyan.receiveShadows = true;
    }
  );

  return scene;
};
</script>
