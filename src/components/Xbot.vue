<template>
  <div class="button-wrap">
    <div class="title">Base Action</div>
    <button
      v-for="act in baseActions"
      :key="act"
      @click="changeBaseAction(act, true)"
    >
      {{ act }}
    </button>
    <br /><br />
    <div class="title">Additive Actions</div>
    <button
      v-for="act in additiveActions"
      :key="act"
      @click="changeBaseAction(act)"
    >
      {{ act }}
    </button>
  </div>
  <canvas id="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';

const actionList = ref<string[]>([]);

const baseActions = ['none', 'idle', 'run', 'walk'];
const additiveActions = ['sad_pose', 'sneak_pose', 'headShake', 'agree'];
let agMap = {};

function load() {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(1, 1, 1, 0);

  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 50, height: 50 },
    scene
  );
  const material = new BABYLON.StandardMaterial('groundMaterial', scene);
  material.diffuseColor = new BABYLON.Color3(255, 255, 255); // 设置地面的颜色
  ground.material = material;

  const camera: any = new BABYLON.ArcRotateCamera(
    'camera',
    Math.PI / 2,
    Math.PI / 2.5,
    6,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  camera.attachControl(canvas, true);

  const light = new BABYLON.DirectionalLight(
    'dir01',
    new BABYLON.Vector3(1, -3, -1),
    scene
  );
  // light.diffuse = new BABYLON.Color3(1, 0, 0);
  // light.specular = new BABYLON.Color3(0, 1, 0);

  BABYLON.SceneLoader.ImportMesh(
    '',
    '/models/Xbot.glb',
    '',
    scene,
    (newMeshes) => {
      const mesh = newMeshes[0];

      // 创建阴影生成器
      const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      shadowGenerator.addShadowCaster(mesh); // 添加能投射阴影的网格

      // 设置接收阴影的网格
      ground.receiveShadows = true;

      // console.log('mesh', mesh);
      camera.target = mesh;

      const allAGs: BABYLON.AnimationGroup[] = scene.animationGroups;
      // console.log('allAGs', allAGs);
      const agObjMap = {};
      for (let i = 0; i < allAGs.length; i++) {
        allAGs[i].stop();
        console.log(allAGs[i].name + ',', allAGs[i]);
        actionList.value.push(allAGs[i].name);
        agObjMap[allAGs[i].name] = allAGs[i];
      }
      agMap = agObjMap;
    }
  );

  // 渲染循环
  engine.runRenderLoop(() => {
    scene.render();
  });

  // 处理浏览器窗口大小改变
  window.addEventListener('resize', function () {
    engine.resize();
  });
}

function changeBaseAction(act, loop = false) {
  Reflect.ownKeys(agMap).forEach((key) => {
    if (key !== act) {
      agMap[key].stop();
    } else {
      agMap[act]?.start(loop);
    }
  });
}

onMounted(() => {
  load();
});
</script>

<style scoped>
.button-wrap {
  position: fixed;
  top: 50px;
  right: 50px;

  .title {
    color: #333;
  }

  button {
    margin-right: 8px;
    cursor: pointer;
  }
}
</style>
