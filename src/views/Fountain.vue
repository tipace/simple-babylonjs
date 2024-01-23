<!-- https://playground.babylonjs.com/#KBS9I5#91 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import useRender from '../hooks/useRender';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 1.5,
    Math.PI / 2.2,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  createFoundation();

  //Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    'https://assets.babylonjs.com/skyboxes/skybox/skybox',
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'valleyvillage.glb'
  );

  return scene;
}

function createFoundation() {
  const fountainOutline = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(0.5, 0.2, 0),
    new BABYLON.Vector3(0.4, 0.2, 0),
    new BABYLON.Vector3(0.4, 0.05, 0),
    new BABYLON.Vector3(0.05, 0.1, 0),
    new BABYLON.Vector3(0.05, 0.8, 0),
    new BABYLON.Vector3(0.15, 0.9, 0),
  ];

  //Create lathed fountain
  // 使用BABYLON.MeshBuilder.CreateLathe方法创建一个新的旋转体网格，命名为'fountain'
  // 旋转体的轮廓为fountainOutline
  // 旋转体的侧面方向为双面，表示旋转体的两面都会被渲染
  const fountain = BABYLON.MeshBuilder.CreateLathe('fountain', {
    shape: fountainOutline,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  });

  // 设置fountain的x坐标为-4
  fountain.position.x = -4;

  // 设置fountain的z坐标为-6
  fountain.position.z = -6;
}
useRender(renderCanvas, createScene);
</script>
