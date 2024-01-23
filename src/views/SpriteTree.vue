<!-- https://playground.babylonjs.com/#KBS9I5#89 -->
<!-- https://playground.babylonjs.com/#KBS9I5#90 -->
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
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  // 创建一个新的精灵管理器，命名为'treesManager'
  // 精灵的纹理URL为'https://assets.babylonjs.com/sprites/palm.png'
  // 精灵管理器可以管理的最大精灵数量为2000
  // 纹理的宽度为512px，高度为1024px
  // 精灵管理器将被添加到scene中
  const spriteManagerTrees = new BABYLON.SpriteManager(
    'treesManager',
    'https://assets.babylonjs.com/sprites/palm.png',
    2000,
    { width: 512, height: 1024 },
    scene
  );

  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }

  const spriteManagerUFO = new BABYLON.SpriteManager(
    'UFOManager',
    'https://assets.babylonjs.com/environments/ufo.png',
    1,
    { width: 128, height: 76 },
    scene
  );
  const ufo = new BABYLON.Sprite('ufo', spriteManagerUFO);
  // 使用playAnimation方法播放ufo的动画
  // 动画的开始帧为0，结束帧为16
  // 动画将循环播放
  // 每帧的播放时间为125毫秒
  ufo.playAnimation(0, 16, true, 125);
  ufo.position.y = 5;
  ufo.position.z = 0;
  ufo.width = 2;
  ufo.height = 1;

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

useRender(renderCanvas, createScene);
</script>
