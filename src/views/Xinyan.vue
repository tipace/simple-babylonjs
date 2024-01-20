<!-- https://playground.babylonjs.com/#SH5DVI#1 -->
<template>
  <canvas id="xinyan" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

onMounted(() => {
  render();
});

function render() {
  const canvas = document.getElementById('xinyan') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const engine = new BABYLON.Engine(canvas, true);

  const scene = createScene(engine, canvas);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });
}
/**
 * 创建场景
 * @param {BABYLON.Engine} engine - 渲染引擎
 * @param {HTMLElement} canvas - 渲染画布
 * @returns {BABYLON.Scene} - 创建的场景对象
 */
const createScene = (engine: BABYLON.Engine, canvas: HTMLCanvasElement) => {
  const scene = new BABYLON.Scene(engine);

  // 创建相机
  const Camera = new BABYLON.ArcRotateCamera(
    'Camera',
    -10,
    5,
    10,
    new BABYLON.Vector3(-1.5, 8, -2),
    scene
  );

  Camera.setPosition(new BABYLON.Vector3(0, 15, 20));
  Camera.fov = 1;
  Camera.attachControl(canvas, true);
  Camera.wheelPrecision = 20;
  Camera.minZ = 0.1;

  // 创建灯光
  const light = new BABYLON.PointLight(
    'light',
    new BABYLON.Vector3(3, 20, 10),
    scene
  );
  const light2 = new BABYLON.PointLight(
    'light2',
    new BABYLON.Vector3(3, 20, -10),
    scene
  );

  // 从指定路径加载glb模型文件
  BABYLON.SceneLoader.Append(
    'https://smashelbow.github.io/xinyan/',
    'xinyanBabylon.gltf',
    scene,
    function (scene) {
      light.intensity = 1; // 设置灯光强度
      light2.intensity = 1;
      light.shadowMinZ = 0.1; // 设置light的最小阴影深度为0.1
      light.shadowMaxZ = 1200; // 设置light的最大阴影深度为1200
      light2.shadowMinZ = 0.1; // 设置light2的最小阴影深度为0.1
      light2.shadowMaxZ = 1200; // 设置light2的最大阴影深度为1200

      // 获取模型和模型的线
      const xinyan = scene.getMeshByName('xinyan') as BABYLON.AbstractMesh;
      const xinyanLine: any = scene.getMeshByName('xinyanLine');

      // 设置模型线的折射率和金属度
      xinyanLine.material.indexOfRefraction = 0;
      xinyanLine.material.metallicF0Factor = 0;

      // 从snippet异步解析NodeMaterial
      BABYLON.NodeMaterial.ParseFromSnippetAsync('#4AWEWY#63', scene).then(
        (mat) => {
          xinyan.material = mat; // 将解析得到的材质赋值给xinyan.material
        }
      );

      // 创建阴影生成器
      const shadowGenerator: any = new BABYLON.ShadowGenerator(2048, light);
      shadowGenerator.getShadowMap().renderList.push(xinyan); // 将xinyan添加到阴影渲染列表中
      shadowGenerator.setDarkness(0); // 设置阴影昏暗度为0
      shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_PCSS; // 使用PCSS阴影过滤器
      shadowGenerator.usePoissonSampling = true; // 使用Poisson采样
      shadowGenerator.useContactHardeningShadow = true; // 使用接触硬化阴影
      shadowGenerator.usePercentageCloserFiltering = true; // 使用百分比更近过滤
      shadowGenerator.bias = 0.0001; // 设置偏置
      shadowGenerator.blurBoxOffset = 0.01; // 设置模糊框偏移

      const shadowGenerator2: any = new BABYLON.ShadowGenerator(2048, light2);
      shadowGenerator2.getShadowMap().renderList.push(xinyan); // 将xinyan添加到阴影渲染列表中
      shadowGenerator2.setDarkness(0); // 设置阴影昏暗度为0
      shadowGenerator2.filter = BABYLON.ShadowGenerator.FILTER_PCSS; // 使用PCSS阴影过滤器
      shadowGenerator2.usePoissonSampling = true; // 使用Poisson采样
      shadowGenerator2.useContactHardeningShadow = true; // 使用接触硬化阴影
      shadowGenerator2.usePercentageCloserFiltering = true; // 使用百分比更近过滤
      shadowGenerator2.bias = 0.0001; // 设置偏置
      shadowGenerator2.blurBoxOffset = 0.01; // 设置模糊框偏移

      xinyan.receiveShadows = true; // 接收阴影
    }
  );

  // Show inspector.
  Inspector.Show(scene, {
    embedMode: true,
  });

  return scene;
};
</script>
