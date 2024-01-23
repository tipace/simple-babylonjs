<!-- https://playground.babylonjs.com/#KDPAQ9#17 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

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
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'village.glb'
  );
  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'car.glb'
  ).then(() => {
    // 从场景中获取名为'car'的网格，并将其类型断言为BABYLON.Mesh
    const car = scene.getMeshByName('car') as BABYLON.Mesh;

    // 设置car的旋转，x方向旋转π/2，z方向旋转-π/2
    car.rotation = new BABYLON.Vector3(Math.PI / 2, 0, -Math.PI / 2);

    // 设置car的位置，y坐标为0.16，x坐标为-3，z坐标为8
    car.position.y = 0.16;
    car.position.x = -3;
    car.position.z = 8;

    // 创建一个新的BABYLON.Animation实例，命名为'carAnimation'
    // 动画的目标属性为'position.z'
    // 动画的帧率为30
    // 动画的类型为ANIMATIONTYPE_FLOAT
    // 动画的循环模式为ANIMATIONLOOPMODE_CYCLE
    const animCar = new BABYLON.Animation(
      'carAnimation',
      'position.z',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // 创建一个空数组，用于存储动画关键帧
    const carKeys = [];

    // 将第一个关键帧添加到数组中，帧数为0，值为8
    carKeys.push({
      frame: 0,
      value: 8,
    });

    // 将第二个关键帧添加到数组中，帧数为150，值为-7
    carKeys.push({
      frame: 150,
      value: -7,
    });

    // 将第三个关键帧添加到数组中，帧数为200，值为-7
    carKeys.push({
      frame: 200,
      value: -7,
    });

    // 将关键帧数组设置到动画中
    animCar.setKeys(carKeys);

    // 清空car的动画数组
    car.animations = [];

    // 将新创建的动画添加到car的动画数组中
    car.animations.push(animCar);

    // 开始播放动画，从第0帧到第200帧，循环播放
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
</script>
