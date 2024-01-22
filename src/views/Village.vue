<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const can = ref();

const createScene = (engine: BABYLON.Engine, canvas: HTMLCanvasElement) => {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
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

  buildDwellings();

  return scene;
};

/******Build Functions***********/
const buildDwellings = () => {
  const ground = buildGround();

  const detached_house = buildHouse(1) as BABYLON.Mesh;
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = buildHouse(2) as BABYLON.Mesh;
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -6.8, 2.5]);
  places.push([2, -Math.PI / 16, -4.5, 3]);
  places.push([2, -Math.PI / 16, -1.5, 4]);
  places.push([2, -Math.PI / 3, 1.5, 6]);
  places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, 0, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
  places.push([2, Math.PI / 1.9, 4.75, -1]);
  places.push([1, Math.PI / 1.95, 4.5, -3]);
  places.push([2, Math.PI / 1.9, 4.75, -5]);
  places.push([1, Math.PI / 1.9, 4.75, -7]);
  places.push([2, -Math.PI / 3, 5.25, 2]);
  places.push([1, -Math.PI / 3, 6, 4]);

  //Create instances from the first two that were built
  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance('house' + i);
    } else {
      houses[i] = semi_house.createInstance('house' + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
};

const buildGround = () => {
  //color
  const groundMat = new BABYLON.StandardMaterial('groundMat');
  groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const ground = BABYLON.MeshBuilder.CreateGround('ground', {
    width: 15,
    height: 16,
  });
  ground.material = groundMat;
};
// 定义一个函数，用于构建房子
const buildHouse = (width: number) => {
  // 调用buildBox函数，创建一个盒子，盒子的宽度为传入的width参数
  const box = buildBox(width);

  // 调用buildRoof函数，创建一个屋顶，屋顶的宽度为传入的width参数
  const roof = buildRoof(width);

  // 使用BABYLON.Mesh.MergeMeshes函数，将盒子和屋顶合并为一个网格
  // 第二个参数true表示删除源网格
  // 第三个参数false表示不合并材质
  // 第四个参数undefined表示不需要转换矩阵
  // 第五个参数false表示不需要子网格
  // 第六个参数true表示需要修复平面
  return BABYLON.Mesh.MergeMeshes(
    [box, roof],
    true,
    false,
    undefined,
    false,
    true
  );
};
const buildBox = (width: number) => {
  //texture
  const boxMat = new BABYLON.StandardMaterial('boxMat');
  if (width == 2) {
    boxMat.diffuseTexture = new BABYLON.Texture(
      'https://assets.babylonjs.com/environments/semihouse.png'
    );
  } else {
    boxMat.diffuseTexture = new BABYLON.Texture(
      'https://assets.babylonjs.com/environments/cubehouse.png'
    );
  }

  //options parameter to set different images on each side
  const faceUV = [];
  if (width == 2) {
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
  } else {
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
  }
  // top 4 and bottom 5 not seen so not set

  /**** World Objects *****/
  const box = BABYLON.MeshBuilder.CreateBox('box', {
    width: width,
    faceUV: faceUV,
    wrap: true,
  });
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
};
// 定义一个函数，用于构建屋顶
const buildRoof = (width: number) => {
  // 创建一个新的标准材质，命名为'roofMat'
  const roofMat = new BABYLON.StandardMaterial('roofMat');

  // 设置材质的漫反射纹理，纹理的URL为'https://assets.babylonjs.com/environments/roof.jpg'
  roofMat.diffuseTexture = new BABYLON.Texture(
    'https://assets.babylonjs.com/environments/roof.jpg'
  );

  // 使用MeshBuilder创建一个新的圆柱体，作为屋顶
  // 圆柱体的直径为1.3，高度为1.2，细分数为3
  const roof = BABYLON.MeshBuilder.CreateCylinder('roof', {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });

  // 设置屋顶的材质为之前创建的roofMat
  roof.material = roofMat;

  // 设置屋顶的缩放，x方向缩放0.75，y方向缩放为传入的width参数
  roof.scaling.x = 0.75;
  roof.scaling.y = width;

  // 设置屋顶的旋转，z方向旋转π/2
  roof.rotation.z = Math.PI / 2;

  // 设置屋顶的位置，y坐标为1.22
  roof.position.y = 1.22;

  // 返回创建的屋顶
  return roof;
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
