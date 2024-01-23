<!-- https://playground.babylonjs.com/#GMEI6U#1715 -->
<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/core/Meshes';
import { Inspector } from '@babylonjs/inspector';

const can = ref();

const createScene = (engine: BABYLON.Engine, canvas: HTMLCanvasElement) => {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2.2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0)
  );

  const faceColors: any = [];
  faceColors[0] = BABYLON.Color3.Blue();
  faceColors[1] = BABYLON.Color3.Teal();
  faceColors[2] = BABYLON.Color3.Red();
  faceColors[3] = BABYLON.Color3.Purple();
  faceColors[4] = BABYLON.Color3.Green();
  faceColors[5] = BABYLON.Color3.Yellow();

  const boxParent = BABYLON.MeshBuilder.CreateBox('Box', {
    faceColors: faceColors,
  });
  const boxChild = BABYLON.MeshBuilder.CreateBox('Box', {
    size: 0.5,
    faceColors: faceColors,
  });
  boxChild.setParent(boxParent);

  boxChild.position.x = 0;
  boxChild.position.y = 2;
  boxChild.position.z = 0;

  boxChild.rotation.x = Math.PI / 4;
  boxChild.rotation.y = Math.PI / 4;
  boxChild.rotation.z = Math.PI / 4;

  boxParent.position.x = 2;
  boxParent.position.y = 0;
  boxParent.position.z = 0;

  boxParent.rotation.x = 0;
  boxParent.rotation.y = 0;
  boxParent.rotation.z = -Math.PI / 4;

  const boxChildAxes = localAxes(1, scene);
  boxChildAxes.parent = boxChild;
  showAxis(6, scene);
  return scene;
};

/***********Create and Draw Axes**************************************/
const showAxis = (size: number, scene: BABYLON.Scene) => {
  const makeTextPlane = (text: string, color: string, size: number) => {
    const dynamicTexture = new BABYLON.DynamicTexture(
      'DynamicTexture',
      50,
      scene,
      true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
      text,
      5,
      40,
      'bold 36px Arial',
      color,
      'transparent',
      true
    );
    const plane: any = BABYLON.MeshBuilder.CreatePlane(
      'TextPlane',
      { size, updatable: true },
      scene
    );
    plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
  };

  const axisX = BABYLON.MeshBuilder.CreateLines('axisX', {
    points: [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0),
      new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
    ],
  });
  axisX.color = new BABYLON.Color3(1, 0, 0);
  const xChar = makeTextPlane('X', 'red', size / 10);
  xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

  const axisY = BABYLON.MeshBuilder.CreateLines('axisY', {
    points: [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0),
      new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
    ],
  });
  axisY.color = new BABYLON.Color3(0, 1, 0);
  const yChar = makeTextPlane('Y', 'green', size / 10);
  yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

  const axisZ = BABYLON.MeshBuilder.CreateLines('axisZ', {
    points: [
      BABYLON.Vector3.Zero(),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size),
      new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
    ],
  });
  axisZ.color = new BABYLON.Color3(0, 0, 1);
  const zChar = makeTextPlane('Z', 'blue', size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

/*********************************************************************/

/*******************************Local Axes****************************/
const localAxes = (size: number, scene: BABYLON.Nullable<BABYLON.Scene>) => {
  const local_axisX = BABYLON.MeshBuilder.CreateLines(
    'local_axisX',
    {
      points: [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
      ],
    },
    scene
  );
  local_axisX.color = new BABYLON.Color3(1, 0, 0);

  const local_axisY = BABYLON.MeshBuilder.CreateLines(
    'local_axisY',
    {
      points: [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
      ],
    },
    scene
  );
  local_axisY.color = new BABYLON.Color3(0, 1, 0);

  const local_axisZ = BABYLON.MeshBuilder.CreateLines(
    'local_axisZ',
    {
      points: [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
      ],
    },
    scene
  );
  local_axisZ.color = new BABYLON.Color3(0, 0, 1);

  // 创建一个新的变换节点，命名为'local_origin'
  const local_origin = new BABYLON.TransformNode('local_origin');

  // 将local_axisX的父节点设置为local_origin，这意味着local_axisX的位置、旋转和缩放将相对于local_origin
  local_axisX.parent = local_origin;

  // 将local_axisY的父节点设置为local_origin，这意味着local_axisY的位置、旋转和缩放将相对于local_origin
  local_axisY.parent = local_origin;

  // 将local_axisZ的父节点设置为local_origin，这意味着local_axisZ的位置、旋转和缩放将相对于local_origin
  local_axisZ.parent = local_origin;
  return local_origin;
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
