<!-- https://playground.babylonjs.com/#KBS9I5#96 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

type Walk = {
  turn: number;
  dist: number;
};

import useRender from '../hooks/useRender';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    0,
    Math.PI / 4,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);

  const light = new BABYLON.DirectionalLight(
    'dir01',
    new BABYLON.Vector3(0, -1, 1),
    scene
  );
  light.position = new BABYLON.Vector3(0, 50, -100);

  // Shadow generator
  // 使用BABYLON.ShadowGenerator方法创建一个新的阴影生成器
  // 阴影生成器的贴图大小为1024，表示生成的阴影贴图的分辨率为1024x1024
  // 阴影生成器的光源为light，表示light的阴影将被阴影生成器捕捉
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

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
  BABYLON.SceneLoader.ImportMeshAsync(
    'him',
    'https://assets.babylonjs.com/meshes/Dude/',
    'dude.babylon',
    scene
  ).then((result) => {
    const dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    // 使用addShadowCaster方法将dude添加为阴影生成器的阴影投射者
    // 第二个参数为true，表示dude的所有子网格都将投射阴影
    shadowGenerator.addShadowCaster(dude, true);
    dude.position = new BABYLON.Vector3(-6, 0, 0);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-95),
      BABYLON.Space.LOCAL
    );
    const startRotation =
      dude.rotationQuaternion?.clone() as BABYLON.Quaternion;

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.01;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
      distance += step;

      if (distance > track[p].dist) {
        dude.rotate(
          BABYLON.Axis.Y,
          BABYLON.Tools.ToRadians(track[p].turn),
          BABYLON.Space.LOCAL
        );
        p += 1;
        p %= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new BABYLON.Vector3(-6, 0, 0);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });
  });

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
  ).then(() => {
    const meshGround = scene.getMeshByName('ground') as BABYLON.Mesh;
    // 设置meshGround接收阴影
    // 这意味着其他物体的阴影可以投射到meshGround上
    meshGround.receiveShadows = true;
  });

  return scene;
}

useRender(renderCanvas, createScene);
</script>
