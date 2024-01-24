<!-- http://localhost:5173/StreetLight2 -->
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
    -Math.PI / 2.2,
    Math.PI / 2.2,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  light.intensity = 0.1;

  BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'https://assets.babylonjs.com/meshes/',
    'lamp.babylon'
  ).then(() => {
    const lampLight = new BABYLON.SpotLight(
      'lampLight',
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, -1, 0),
      0.8 * Math.PI,
      0.01,
      scene
    );
    lampLight.diffuse = BABYLON.Color3.Yellow();
    lampLight.parent = scene.getMeshByName('bulb');

    const lamp = scene.getMeshByName('lamp') as BABYLON.Mesh;
    lamp.position = new BABYLON.Vector3(2, 0, 2);
    lamp.rotation = BABYLON.Vector3.Zero();
    lamp.rotation.y = -Math.PI / 4;

    const lamp3 = lamp.clone('lamp3');
    lamp3.position.z = -8;

    const lamp1 = lamp.clone('lamp1');
    lamp1.position.x = -8;
    lamp1.position.z = 1.2;
    lamp1.rotation.y = Math.PI / 2;

    const lamp2 = lamp1.clone('lamp2');
    lamp2.position.x = -2.7;
    lamp2.position.z = 0.8;
    lamp2.rotation.y = -Math.PI / 2;
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
    const groundMesh = scene.getMeshByName('ground');
    if (groundMesh && groundMesh.material instanceof BABYLON.PBRMaterial) {
      // 设置groundMesh的材质的最大同时光源数量为5
      // 这意味着groundMesh的材质最多可以同时接收5个光源的影响
      groundMesh.material.maxSimultaneousLights = 5;
    }
  });

  return scene;
}

useRender(renderCanvas, createScene);
</script>
