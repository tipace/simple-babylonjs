<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

  //Create Village ground
  // 创建一个新的标准材质，命名为'groundMat'
  const groundMat = new BABYLON.StandardMaterial('groundMat');
  // 设置材质的漫反射纹理为一个新的纹理，纹理的URL为'https://assets.babylonjs.com/environments/villagegreen.png'
  groundMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/villagegreen.png'
  );
  // 设置纹理的alpha通道为true，表示纹理支持透明度
  groundMat.diffuseTexture.hasAlpha = true;

  // 使用BABYLON.MeshBuilder.CreateGround方法创建一个新的地面网格，命名为'ground'
  // 地面的宽度和高度都为24
  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 24,
    height: 24,
  });
  // 设置地面的材质为groundMat
  ground.material = groundMat;

  // 创建一个新的标准材质，命名为'largeGroundMat'
  const largeGroundMat = new BABYLON.StandardMaterial('largeGroundMat');
  // 设置材质的漫反射纹理为一个新的纹理，纹理的URL为'https://assets.babylonjs.com/environments/valleygrass.png'
  largeGroundMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/valleygrass.png'
  );

  // 使用BABYLON.MeshBuilder.CreateGroundFromHeightMap方法从高度图创建一个新的地面网格，命名为'largeGround'
  // 高度图的URL为'https://assets.babylonjs.com/environments/villageheightmap.png'
  // 地面的宽度和高度都为150，细分数为20，最小高度为0，最大高度为10
  const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    'largeGround',
    'https://assets.babylonjs.com/environments/villageheightmap.png',
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  // 设置地面的材质为largeGroundMat
  largeGround.material = largeGroundMat;
  // 设置地面的y坐标为-0.01，将地面稍微降低一点
  largeGround.position.y = -0.01;
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
