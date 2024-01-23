<!-- https://playground.babylonjs.com/#KBS9I5#88 -->
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
  camera.upperBetaLimit = Math.PI / 2.2; //设置相机的最大beta角度为Math.PI / 2.2
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  //Skybox
  // 使用BABYLON.MeshBuilder.CreateBox方法创建一个新的立方体网格，命名为'skyBox'
  // 立方体的大小为150，将被添加到scene中
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);

  // 创建一个新的标准材质，命名为'skyBox'，将被添加到scene中
  const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);

  // 设置材质的背面剔除为false，表示材质的背面也会被渲染
  skyboxMaterial.backFaceCulling = false;

  // 设置材质的反射纹理为一个新的立方体纹理，纹理的URL为'https://assets.babylonjs.com/skyboxes/skybox/skybox'
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    'https://assets.babylonjs.com/skyboxes/skybox/skybox',
    scene
  );

  // 设置纹理的坐标模式为SKYBOX_MODE，表示纹理将被用作天空盒
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;

  // 设置材质的漫反射颜色为黑色，RGB值都为0
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

  // 设置材质的镜面反射颜色为黑色，RGB值都为0
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

  // 设置skybox的材质为skyboxMaterial
  skybox.material = skyboxMaterial;

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'valleyvillage.glb'
  );
  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'car.glb'
  ).then(() => {
    const car = scene.getMeshByName('car') as BABYLON.Mesh;
    car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    const animCar = new BABYLON.Animation(
      'carAnimation',
      'position.z',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const carKeys = [];

    carKeys.push({
      frame: 0,
      value: 10,
    });

    carKeys.push({
      frame: 200,
      value: -15,
    });

    animCar.setKeys(carKeys);

    car.animations = [];
    car.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);

    //wheel animation
    const wheelRB = scene.getMeshByName('wheelRB');
    const wheelRF = scene.getMeshByName('wheelRF');
    const wheelLB = scene.getMeshByName('wheelLB');
    const wheelLF = scene.getMeshByName('wheelLF');

    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
  });

  return scene;
}

useRender(renderCanvas, createScene);
</script>
