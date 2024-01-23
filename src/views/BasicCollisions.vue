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
    -Math.PI / 2.2,
    Math.PI / 2.2,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  const wireMat = new BABYLON.StandardMaterial('wireMat');
  // wireMat.wireframe = true; //设置材质为线框模式
  wireMat.alpha = 0; //设置材质的透明度为0

  const hitBox = BABYLON.MeshBuilder.CreateBox('carbox', {
    width: 0.5,
    height: 0.6,
    depth: 4.5,
  });
  hitBox.material = wireMat;
  hitBox.position.x = 3.1;
  hitBox.position.y = 0.3;
  hitBox.position.z = -5;

  let carReady = false;

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'car.glb'
  ).then(() => {
    const car = scene.getMeshByName('car') as BABYLON.Mesh;
    carReady = true;
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
      value: 8,
    });

    carKeys.push({
      frame: 150,
      value: -7,
    });

    carKeys.push({
      frame: 200,
      value: -7,
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
  track.push(walk(180, 2.5));
  track.push(walk(0, 5));

  // Dude
  BABYLON.SceneLoader.ImportMeshAsync(
    'him',
    'https://assets.babylonjs.com/meshes/Dude/',
    'dude.babylon',
    scene
  ).then((result) => {
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-90),
      BABYLON.Space.LOCAL
    );
    const startRotation =
      dude.rotationQuaternion?.clone() as BABYLON.Quaternion;

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
    let p = 0;

    // 在每次渲染之前，添加一个观察者函数
    scene.onBeforeRenderObservable.add(() => {
      // 如果汽车已经准备好
      if (carReady) {
        // 如果dude的子对象[1]没有与hitBox相交，且名为'car'的网格与hitBox相交
        if (
          !(
            (
              dude as BABYLON.AbstractMesh
            ).getChildren()[1] as BABYLON.AbstractMesh
          ).intersectsMesh(hitBox) &&
          scene.getMeshByName('car')?.intersectsMesh(hitBox)
        ) {
          // 则返回，不执行后面的代码
          return;
        }
      }
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
          dude.position = new BABYLON.Vector3(1.5, 0, -6.9);
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
