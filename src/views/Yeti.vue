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
// 创建一个函数createScene，接收两个参数：一个BABYLON引擎实例和一个HTMLCanvasElement元素
function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  // 创建一个基本的Babylon场景对象（非网格）
  var scene = new BABYLON.Scene(engine);

  // 创建一个ArcRotateCamera（弧形旋转相机），设置其位置和目标
  var camera = new BABYLON.ArcRotateCamera(
    'camera',
    BABYLON.Tools.ToRadians(90),
    BABYLON.Tools.ToRadians(65),
    10,
    BABYLON.Vector3.Zero(),
    scene
  );

  // 将相机附加到canvas上
  camera.attachControl(canvas, true);

  // 创建一个光源，方向向上（非网格）
  var light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // 设置光源的强度
  light.intensity = 0.7;

  // 创建一个内置的'ground'形状
  var ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 6, height: 6 },
    scene
  );

  // 创建一个标准材质并应用到地面上
  let groundMaterial = new BABYLON.StandardMaterial('Ground Material', scene);
  ground.material = groundMaterial;

  // 创建一个纹理并应用到地面材质上
  let groundTexture = new BABYLON.Texture(
    Assets.textures.checkerboard_basecolor_png.rootUrl
  );
  ground.material = groundMaterial;
  groundMaterial.diffuseTexture = groundTexture;

  // 从指定的URL导入一个网格（Yeti）
  BABYLON.SceneLoader.ImportMesh(
    '',
    Assets.meshes.Yeti.rootUrl,
    Assets.meshes.Yeti.filename,
    scene,
    function (newMeshes) {
      // 设置新导入的网格的缩放
      newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
    }
  );

  // 返回创建的场景
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
