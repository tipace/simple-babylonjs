<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';
/**
The extrudePolygon and PolygonMeshBuilder both use a earcut slicing algorithm.
The playground has earcut defined but if you are following this tutorial on your own file system that you will need to download the earcut algorithm via CDN or NPM.
If you are using TypeScript then you can inject the earcut algorithm as the earcutInjection parameter on the extudePolygon function.
 */
// @ts-ignore
import earcut from 'earcut';

const can = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0)
  );

  const car = buildCar(scene);

  return scene;
}

const buildCar = (scene: BABYLON.Scene) => {
  //base
  const outline = [
    new BABYLON.Vector3(-0.3, 0, -0.1),
    new BABYLON.Vector3(0.2, 0, -0.1),
  ];

  //curved front
  for (let i = 0; i < 20; i++) {
    outline.push(
      new BABYLON.Vector3(
        0.2 * Math.cos((i * Math.PI) / 40),
        0,
        0.2 * Math.sin((i * Math.PI) / 40) - 0.1
      )
    );
  }

  //top
  outline.push(new BABYLON.Vector3(0, 0, 0.1));
  outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

  //back formed automatically

  //face UVs
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
  faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
  faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);

  //material
  const carMat = new BABYLON.StandardMaterial('carMat');
  carMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/car.png'
  );

  // 使用BABYLON.MeshBuilder.ExtrudePolygon方法创建一个新的多边形挤出网格，命名为'car'
  // shape参数为outline，表示多边形的轮廓
  // depth参数为0.2，表示挤出的深度
  // faceUV参数为faceUV，表示每个面的UV坐标
  // wrap参数为true，表示是否将最后一个顶点和第一个顶点连接起来，形成一个封闭的多边形
  // 最后两个参数分别为scene和earcut，表示要添加到的场景和用于三角剖分的算法
  const car = BABYLON.MeshBuilder.ExtrudePolygon(
    'car',
    {
      shape: outline,
      depth: 0.2,
      faceUV,
      wrap: true,
    },
    scene,
    earcut
  );
  car.material = carMat;

  //wheel face UVs
  const wheelUV = [];
  wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
  wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
  wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

  //car material
  const wheelMat = new BABYLON.StandardMaterial('wheelMat');
  wheelMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/wheel.png'
  );

  const wheelRB = BABYLON.MeshBuilder.CreateCylinder('wheelRB', {
    diameter: 0.125,
    height: 0.05,
    faceUV: wheelUV,
  });
  wheelRB.material = wheelMat;
  wheelRB.parent = car;
  wheelRB.position.z = -0.1;
  wheelRB.position.x = -0.2;
  wheelRB.position.y = 0.035;

  const wheelRF = wheelRB.clone('wheelRF');
  wheelRF.position.x = 0.1;

  const wheelLB = wheelRB.clone('wheelLB');
  wheelLB.position.y = -0.2 - 0.035;

  const wheelLF = wheelRF.clone('wheelLF');
  wheelLF.position.y = -0.2 - 0.035;
  return car;
};

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
