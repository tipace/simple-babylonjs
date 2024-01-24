<!-- https://playground.babylonjs.com/#4G38H4#6 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
// @ts-nocheck

import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import useRender from '../hooks/useRender';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'Camera',
    (3 * Math.PI) / 2,
    Math.PI / 2.2,
    50,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'hemi',
    new BABYLON.Vector3(0, 50, 0)
  );
  light.intensity = 0.5;

  //add a spotlight and later after a mesh lamp post and a bulb have been created
  //then will make the post a parent to the bulb and
  //the bulb to the parent
  // 使用BABYLON.SpotLight方法创建一个新的聚光灯，命名为'lampLight'
  // 聚光灯的位置为(0, 0, 0)
  // 聚光灯的方向为(0, -1, 0)，表示聚光灯向下照射
  // 聚光灯的角度为π，表示聚光灯的光束角度为180度
  // 聚光灯的指数衰减为1，表示聚光灯的光线随着距离的增加而衰减
  // 聚光灯将被添加到scene中
  const lampLight = new BABYLON.SpotLight(
    'lampLight',
    BABYLON.Vector3.Zero(),
    new BABYLON.Vector3(0, -1, 0),
    Math.PI,
    1,
    scene
  );

  // 设置lampLight的漫反射颜色为黄色
  lampLight.diffuse = BABYLON.Color3.Yellow();

  //shape to extrude
  const lampShape = [];
  for (let i = 0; i < 20; i++) {
    lampShape.push(
      new BABYLON.Vector3(
        Math.cos((i * Math.PI) / 10),
        Math.sin((i * Math.PI) / 10),
        0
      )
    );
  }
  lampShape.push(lampShape[0]); //close shape

  //extrusion path
  const lampPath = [];
  lampPath.push(new BABYLON.Vector3(0, 0, 0));
  lampPath.push(new BABYLON.Vector3(0, 10, 0));
  for (let i = 0; i < 20; i++) {
    lampPath.push(
      new BABYLON.Vector3(
        1 + Math.cos(Math.PI - (i * Math.PI) / 40),
        10 + Math.sin(Math.PI - (i * Math.PI) / 40),
        0
      )
    );
  }
  lampPath.push(new BABYLON.Vector3(3, 11, 0));

  const yellowMat = new BABYLON.StandardMaterial('yellowMat');
  yellowMat.emissiveColor = BABYLON.Color3.Yellow();

  //extrude lamp
  // 使用BABYLON.MeshBuilder.ExtrudeShape方法创建一个新的挤压形状，命名为'lamp'
  // 挤压形状的顶部为封闭的
  // 挤压形状的轮廓为lampShape
  // 挤压形状的路径为lampPath
  // 挤压形状的缩放比例为0.5
  const lamp = BABYLON.MeshBuilder.ExtrudeShape('lamp', {
    cap: BABYLON.Mesh.CAP_END,
    shape: lampShape,
    path: lampPath,
    scale: 0.5,
  });
  //add bulb
  const bulb = BABYLON.MeshBuilder.CreateSphere('bulb', {
    diameterX: 1.5,
    diameterZ: 0.8,
  });

  bulb.material = yellowMat;
  bulb.parent = lamp;
  bulb.position.x = 2;
  bulb.position.y = 10.5;

  // 将lampLight的父对象设置为bulb
  // 这意味着lampLight的位置和旋转将相对于bulb
  lampLight.parent = bulb;

  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 50,
    height: 50,
  });

  return scene;
}

useRender(renderCanvas, createScene);
</script>
