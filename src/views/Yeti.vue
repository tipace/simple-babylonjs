<!-- Yeti https://playground.babylonjs.com/#2KRNG9#4 -->

<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/core/Materials/standardMaterial';

import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';
import Assets from '../assets/babylonAssets';

const can = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(65),
    10,
    BABYLON.Vector3.Zero(),
    scene
  );

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 6, height: 6 },
    scene
  );
  let groundMaterial = new BABYLON.StandardMaterial('Ground Material', scene);
  ground.material = groundMaterial;
  let groundTexture = new BABYLON.Texture(
    Assets.textures.checkerboard_basecolor_png.rootUrl
  );

  ground.material = groundMaterial;
  groundMaterial.diffuseTexture = groundTexture;

  BABYLON.SceneLoader.ImportMesh(
    '',
    Assets.meshes.Yeti.rootUrl,
    Assets.meshes.Yeti.filename,
    scene,
    function (newMeshes) {
      newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    }
  );

  return scene;
}

function render() {
  const canvas = can.value;
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
</script>
