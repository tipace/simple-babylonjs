<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

type Walk = {
  turn: number;
  dist: number;
};

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

  const walk = function (turn: number, dist: number): Walk {
    return {
      turn,
      dist,
    };
  };

  const track: Walk[] = [];
  track.push(walk(86, 7));
  track.push(walk(-85, 14.8));
  track.push(walk(-93, 16.5));
  track.push(walk(48, 25.5));
  track.push(walk(-112, 30.5));
  track.push(walk(-72, 33.2));
  track.push(walk(42, 37.5));
  track.push(walk(-98, 45.2));
  track.push(walk(0, 47));

  // Dude
  // 使用BABYLON.SceneLoader.ImportMeshAsync方法异步导入一个网格
  // 网格的名字为'him'
  // 网格的URL为'https://assets.babylonjs.com/meshes/Dude/'
  // 网格的文件名为'dude.babylon'
  // 网格将被导入到scene中
  BABYLON.SceneLoader.ImportMeshAsync(
    'him',
    'https://assets.babylonjs.com/meshes/Dude/',
    'dude.babylon',
    scene
  ).then((result) => {
    // 从导入结果中获取第一个网格，并将其命名为dude
    var dude = result.meshes[0];

    // 设置dude的缩放，x、y、z方向都缩放0.008
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    // 设置dude的位置，x坐标为-6，y、z坐标为0
    dude.position = new BABYLON.Vector3(-6, 0, 0);

    // 旋转dude，使其沿y轴旋转-95度
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-95),
      BABYLON.Space.LOCAL
    );

    // 获取dude的初始旋转，并将其存储为startRotation
    const startRotation =
      dude.rotationQuaternion?.clone() as BABYLON.Quaternion;

    // 开始播放dude的动画，从第0帧到第100帧，循环播放，播放速度为1.0
    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    // 初始化移动的距离为0
    let distance = 0;

    // 设置每次移动的步长为0.015
    let step = 0.015;

    // 初始化路径点的索引为0
    let p = 0;

    // 在每次渲染之前，添加一个观察者函数
    scene.onBeforeRenderObservable.add(() => {
      // 移动dude，但不改变其朝向
      dude.movePOV(0, 0, step);

      // 累加移动的距离
      distance += step;

      // 如果移动的距离超过了当前路径点的距离
      if (distance > track[p].dist) {
        // 旋转dude，使其朝向下一个路径点
        dude.rotate(
          BABYLON.Axis.Y,
          BABYLON.Tools.ToRadians(track[p].turn),
          BABYLON.Space.LOCAL
        );

        // 移动到下一个路径点
        p += 1;

        // 如果超过了路径点的数量，回到第一个路径点
        p %= track.length;

        // 如果回到了第一个路径点
        if (p === 0) {
          // 重置移动的距离
          distance = 0;

          // 重置dude的位置为初始位置
          dude.position = new BABYLON.Vector3(-6, 0, 0);

          // 重置dude的旋转为初始旋转，防止误差累积
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
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
