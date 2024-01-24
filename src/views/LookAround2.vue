<!-- https://playground.babylonjs.com/#KBS9I5#98 -->
<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
type Walk = {
  turn: number;
  dist: number;
};

import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import useRender from '../hooks/useRender';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  const scene = new BABYLON.Scene(engine);

  // This creates and initially positions a follow camera
  // 使用BABYLON.FollowCamera方法创建一个新的跟随相机，命名为'FollowCam'
  // 相机的初始位置为(-6, 0, 0)
  // 相机将被添加到scene中
  const camera = new BABYLON.FollowCamera(
    'FollowCam',
    new BABYLON.Vector3(-6, 0, 0),
    scene
  );

  // 设置相机距离目标的目标距离为1
  camera.radius = 1;

  // 设置相机在目标的局部原点（中心）上方的目标高度为8
  camera.heightOffset = 8;

  // 设置相机围绕目标的局部原点（中心）在xy平面内的目标旋转角度为0
  camera.rotationOffset = 0;

  // 设置相机从当前位置移动到目标位置的加速度为0.005
  camera.cameraAcceleration = 0.005;

  // 设置加速度停止的速度为10
  camera.maxCameraSpeed = 10;

  // camera.target在目标创建后设置

  // 这将相机附加到画布
  camera.attachControl(true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(1, 1, 0)
  );

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
    var dude = result.meshes[0];
    dude.scaling = new BABYLON.Vector3(0.008, 0.008, 0.008);

    dude.position = new BABYLON.Vector3(-6, 0, 0);
    dude.rotate(
      BABYLON.Axis.Y,
      BABYLON.Tools.ToRadians(-95),
      BABYLON.Space.LOCAL
    );
    const startRotation = dude.rotationQuaternion?.clone();

    // 将camera的锁定目标设置为dude
    // 这意味着camera将始终对准dude
    camera.lockedTarget = dude;

    scene.beginAnimation(result.skeletons[0], 0, 100, true, 1.0);

    let distance = 0;
    let step = 0.015;
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
          dude.rotationQuaternion =
            startRotation?.clone() as BABYLON.Quaternion;
        }
      }
    });
  });

  const spriteManagerTrees = new BABYLON.SpriteManager(
    'treesManager',
    'textures/palm.png',
    2000,
    { width: 512, height: 1024 },
    scene
  );

  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }

  for (let i = 0; i < 500; i++) {
    const tree = new BABYLON.Sprite('tree', spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }

  //Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox('skyBox', { size: 100 }, scene);
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
  );

  return scene;
}

useRender(renderCanvas, createScene);
</script>
