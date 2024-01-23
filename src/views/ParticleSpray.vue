<!-- https://playground.babylonjs.com/#TC31NV#4 -->
<!-- https://playground.babylonjs.com/#TC31NV#5 -->
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
    'Camera',
    (3 * Math.PI) / 2,
    Math.PI / 2,
    70,
    BABYLON.Vector3.Zero()
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'hemi',
    new BABYLON.Vector3(0, 1, 0)
  );

  //Switch fountain on and off
  // 定义一个布尔变量switched，初始值为false
  let switched = false;

  // 定义一个函数pointerDown，参数为mesh
  // 当mesh等于fountain时，切换switched的值
  // 如果switched为true，则启动粒子系统
  // 如果switched为false，则停止粒子系统
  const pointerDown = (mesh: BABYLON.Nullable<BABYLON.AbstractMesh>) => {
    if (mesh === fountain) {
      switched = !switched;
      if (switched) {
        // Start the particle system
        particleSystem.start();
      } else {
        // Stop the particle system
        particleSystem.stop();
      }
    }
  };

  // 添加一个指针观察者到scene
  // 当触发POINTERDOWN事件时，如果pickInfo存在并且hit为true，则调用pointerDown函数
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERDOWN:
        if (pointerInfo.pickInfo?.hit) {
          pointerDown(pointerInfo.pickInfo?.pickedMesh);
        }
        break;
    }
  });

  const fountainProfile = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(10, 0, 0),
    new BABYLON.Vector3(10, 4, 0),
    new BABYLON.Vector3(8, 4, 0),
    new BABYLON.Vector3(8, 1, 0),
    new BABYLON.Vector3(1, 2, 0),
    new BABYLON.Vector3(1, 15, 0),
    new BABYLON.Vector3(3, 17, 0),
  ];

  // 使用BABYLON.MeshBuilder.CreateLathe方法创建一个新的旋转体网格，命名为'fountain'
  // 旋转体的轮廓为fountainProfile
  // 旋转体的侧面方向为双面，表示旋转体的两面都会被渲染
  // 旋转体将被添加到scene中
  const fountain = BABYLON.MeshBuilder.CreateLathe(
    'fountain',
    { shape: fountainProfile, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );

  // 设置fountain的y坐标为-5
  fountain.position.y = -5;

  // 创建一个新的粒子系统，命名为'particles'
  // 粒子系统可以管理的最大粒子数量为5000
  // 粒子系统将被添加到scene中
  var particleSystem = new BABYLON.ParticleSystem('particles', 5000, scene);

  // 设置粒子系统的粒子纹理为'https://assets.babylonjs.com/textures/flare.png'
  particleSystem.particleTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/textures/flare.png',
    scene
  );

  // 设置粒子系统的发射器为一个新的向量(0, 10, 0)
  // 发射器是粒子系统的起始对象
  particleSystem.emitter = new BABYLON.Vector3(0, 10, 0);

  // 设置粒子系统的最小发射盒为一个新的向量(-1, 0, 0)
  // 最小发射盒表示粒子的起始位置
  particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);

  // 设置粒子系统的最大发射盒为一个新的向量(1, 0, 0)
  // 最大发射盒表示粒子的结束位置
  particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);

  // 设置粒子系统的颜色1为一个新的颜色(0.7, 0.8, 1.0, 1.0)
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);

  // 设置粒子系统的颜色2为一个新的颜色(0.2, 0.5, 1.0, 1.0)
  particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);

  // 设置粒子系统的死亡颜色为一个新的颜色(0, 0, 0.2, 0.0)
  particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

  // 设置粒子系统的最小粒子大小为0.1
  particleSystem.minSize = 0.1;

  // 设置粒子系统的最大粒子大小为0.5
  particleSystem.maxSize = 0.5;

  // 设置粒子系统的最小生命周期为2
  particleSystem.minLifeTime = 2;

  // 设置粒子系统的最大生命周期为3.5
  particleSystem.maxLifeTime = 3.5;

  // 设置粒子系统的发射率为1500
  particleSystem.emitRate = 1500;

  // 设置粒子系统的混合模式为BLENDMODE_ONEONE
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

  // 设置粒子系统的所有粒子的重力为一个新的向量(0, -9.81, 0)
  particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // 设置粒子系统的方向1为一个新的向量(-2, 8, 2)
  particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);

  // 设置粒子系统的方向2为一个新的向量(2, 8, -2)
  particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);

  // 设置粒子系统的最小角速度为0
  particleSystem.minAngularSpeed = 0;

  // 设置粒子系统的最大角速度为π
  particleSystem.maxAngularSpeed = Math.PI;

  // 设置粒子系统的最小发射力为1
  particleSystem.minEmitPower = 1;

  // 设置粒子系统的最大发射力为3
  particleSystem.maxEmitPower = 3;

  // 设置粒子系统的更新速度为0.025
  particleSystem.updateSpeed = 0.025;

  // 启动粒子系统
  particleSystem.start();

  return scene;
}

useRender(renderCanvas, createScene);
</script>
