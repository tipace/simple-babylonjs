<!-- https://playground.babylonjs.com/#KBS9I5#95 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import * as GUI from '@babylonjs/gui/Legacy/legacy';

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
  light.intensity = 1;

  // GUI
  // 使用GUI.AdvancedDynamicTexture.CreateFullscreenUI方法创建一个全屏的UI，命名为'UI'
  const adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  // 创建一个新的堆栈面板
  const panel = new GUI.StackPanel();

  // 设置面板的宽度为220px
  panel.width = '220px';

  // 设置面板的顶部位置为-25px
  panel.top = '-25px';

  // 设置面板的水平对齐方式为右对齐
  panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

  // 设置面板的垂直对齐方式为底部对齐
  panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

  // 将面板添加到adt中
  adt.addControl(panel);

  // 创建一个新的文本块
  const header = new GUI.TextBlock();

  // 设置文本块的文本为'Night to Day'
  header.text = 'Night to Day';

  // 设置文本块的高度为30px
  header.height = '30px';

  // 设置文本块的颜色为白色
  header.color = 'white';

  // 将文本块添加到面板中
  panel.addControl(header);

  // 创建一个新的滑块
  const slider = new GUI.Slider();

  // 设置滑块的最小值为0
  slider.minimum = 0;

  // 设置滑块的最大值为1
  slider.maximum = 1;

  // 设置滑块的边框颜色为黑色
  slider.borderColor = 'black';

  // 设置滑块的颜色为灰色
  slider.color = 'gray';

  // 设置滑块的背景颜色为白色
  slider.background = 'white';

  // 设置滑块的初始值为1
  slider.value = 1;

  // 设置滑块的高度为20px
  slider.height = '20px';

  // 设置滑块的宽度为200px
  slider.width = '200px';

  // 当滑块的值改变时，更新light的强度为滑块的值
  slider.onValueChangedObservable.add((value) => {
    if (light) {
      light.intensity = value;
    }
  });

  // 将滑块添加到面板中
  panel.addControl(slider);
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
