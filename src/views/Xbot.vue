<template>
  <!-- <div class="button-wrap">
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
  </div> -->
  <canvas id="renderCanvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const actionList = ref<string[]>([]);

interface AnimGroupMap {
  [key: string]: BABYLON.AnimationGroup;
}

const baseActions = ['none', 'idle', 'run', 'walk'];
const additiveActions = ['sad_pose', 'sneak_pose', 'headShake', 'agree'];
let agMap: AnimGroupMap = {};
/**
 * 加载函数
 */
function load() {
  // 获取canvas元素并进行类型转换
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  // 设置canvas的宽度和高度为窗口的宽度和高度
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 创建BABYLON引擎
  const engine = new BABYLON.Engine(canvas, true);
  // 创建BABYLON场景
  const scene = new BABYLON.Scene(engine);
  // 设置场景的背景颜色
  scene.clearColor = new BABYLON.Color4(1, 1, 1, 0);

  // 创建地面
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 50, height: 50 },
    scene
  );
  // 创建地面材质
  const material = new BABYLON.StandardMaterial('groundMaterial', scene);
  // 设置地面颜色
  material.diffuseColor = new BABYLON.Color3(255, 255, 255);
  // 将地面材质应用到地面
  ground.material = material;

  // 创建摄像机
  const camera: any = new BABYLON.ArcRotateCamera(
    'camera',
    Math.PI / 2,
    Math.PI / 2.5,
    6,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // 将摄像机与canvas进行控制绑定
  camera.attachControl(canvas, true);

  // 创建定向光源
  const light = new BABYLON.DirectionalLight(
    'dir01',
    new BABYLON.Vector3(1, -3, -1),
    scene
  );
  // light.diffuse = new BABYLON.Color3(1, 0, 0);
  // light.specular = new BABYLON.Color3(0, 1, 0);

  // 导入模型
  BABYLON.SceneLoader.ImportMesh(
    '',
    '/models/Xbot.glb',
    '',
    scene,
    (newMeshes) => {
      const mesh = newMeshes[0];

      // 创建阴影生成器
      const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      // 将阴影投射到网格
      shadowGenerator.addShadowCaster(mesh);
      // 设置地面接收阴影
      ground.receiveShadows = true;

      // 设置摄像机的焦点为网格
      camera.target = mesh;

      // 获取所有动画组
      const allAGs: BABYLON.AnimationGroup[] = scene.animationGroups;
      // 创建动画对象映射
      const agObjMap: AnimGroupMap = {};
      for (let i = 0; i < allAGs.length; i++) {
        allAGs[i].stop();
        console.log(allAGs[i].name + ',', allAGs[i]);
        // 将动画组名添加到动作列表中
        actionList.value.push(allAGs[i].name);
        // 将动画组对象添加到映射中
        agObjMap[allAGs[i].name] = allAGs[i];
      }
      agMap = agObjMap;
    }
  );

  // Show inspector.
  Inspector.Show(scene, {
    embedMode: true,
  });

  // 开始渲染循环
  engine.runRenderLoop(() => {
    scene.render();
  });

  // 处理浏览器窗口大小改变
  window.addEventListener('resize', function () {
    engine.resize();
  });
}
function changeBaseAction(act: string, loop = false) {
  Object.keys(agMap).forEach((key) => {
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
  top: 60px;
  left: 20px;

  .title {
    color: #333;
  }

  button {
    margin-right: 8px;
    cursor: pointer;
  }
}
</style>
