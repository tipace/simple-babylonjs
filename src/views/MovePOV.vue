<!-- https://playground.babylonjs.com/#N9IZ8M#1 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Inspector } from '@babylonjs/inspector';

type Slide = {
  turn: number;
  dist: number;
};

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 1.5,
    Math.PI / 5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  //create a sphere
  // 使用BABYLON.MeshBuilder.CreateSphere方法创建一个新的球体网格，命名为'sphere'
  // 球体的直径为0.25
  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 0.25 });

  // 设置球体的位置，x坐标为2，y坐标为0，z坐标为2
  sphere.position = new BABYLON.Vector3(2, 0, 2);

  //draw lines to form a triangle
  const points = [];
  points.push(new BABYLON.Vector3(2, 0, 2));
  points.push(new BABYLON.Vector3(2, 0, -2));
  points.push(new BABYLON.Vector3(-2, 0, -2));
  points.push(points[0]); //close the triangle;

  BABYLON.MeshBuilder.CreateLines('triangle', { points: points });

  function slide(turn: number, dist: number): Slide {
    //after covering dist apply turn
    return {
      turn,
      dist,
    };
    // this.turn = turn;
    // this.dist = dist;
  }

  const track: Slide[] = [];
  track.push(slide(Math.PI / 2, 4));
  track.push(slide((3 * Math.PI) / 4, 8));
  track.push(slide((3 * Math.PI) / 4, 8 + 4 * Math.sqrt(2)));

  let distance = 0;
  let step = 0.05;
  let p = 0;

  // 在每次渲染之前，添加一个观察者函数
  scene.onBeforeRenderObservable.add(() => {
    // 移动球体，但不改变其朝向
    sphere.movePOV(0, 0, step);
    // 累加移动的距离
    distance += step;

    // 如果移动的距离超过了当前路径点的距离
    if (distance > track[p].dist) {
      // 旋转球体，使其朝向下一个路径点
      sphere.rotate(BABYLON.Axis.Y, track[p].turn, BABYLON.Space.LOCAL);
      // 移动到下一个路径点
      p += 1;
      // 如果超过了路径点的数量，回到第一个路径点
      p %= track.length;
      // 如果回到了第一个路径点
      if (p === 0) {
        // 重置移动的距离
        distance = 0;
        // 重置球体的位置为初始位置
        sphere.position = new BABYLON.Vector3(2, 0, 2); //reset to initial conditions
        // 重置球体的旋转为初始旋转，防止误差累积
        sphere.rotation = BABYLON.Vector3.Zero(); //prevents error accumulation
      }
    }
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
