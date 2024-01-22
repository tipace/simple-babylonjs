<!-- GitHub\BabylonJS\Babylon.js\packages\tools\babylonServer\scripts\generateScripts.js -->

<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';
import * as GUI from '@babylonjs/gui/Legacy/legacy';

const can = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  // Model by Mixamo

  engine.enableOfflineSupport = false;

  // This is really important to tell Babylon.js to use decomposeLerp and matrix interpolation
  BABYLON.Animation.AllowMatricesInterpolation = true;

  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.ArcRotateCamera(
    'camera1',
    Math.PI / 2,
    Math.PI / 4,
    3,
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  camera.attachControl(canvas, true);

  // 设置相机的最小半径限制为2，这将限制用户可以缩小到的最小距离
  camera.lowerRadiusLimit = 2;

  // 设置相机的最大半径限制为10，这将限制用户可以放大到的最大距离
  camera.upperRadiusLimit = 10;

  // 设置滚轮变化百分比为0.01，这将影响用户滚动鼠标滚轮时相机的缩放速度
  camera.wheelDeltaPercentage = 0.01;

  const light = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.6;
  // 设置光源的镜面反射颜色为黑色。这意味着光源不会在物体表面产生高光效果。
  light.specular = BABYLON.Color3.Black();

  const light2 = new BABYLON.DirectionalLight(
    'dir01',
    new BABYLON.Vector3(0, -0.5, -1.0),
    scene
  );
  light2.position = new BABYLON.Vector3(0, 5, 5);

  // Shadows
  // 创建一个新的阴影生成器，参数1024定义了阴影贴图的大小，light2是产生阴影的光源
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);

  // 启用模糊指数阴影图，这将使阴影边缘更加柔和
  shadowGenerator.useBlurExponentialShadowMap = true;

  // 设置模糊核大小为32，这将影响阴影的模糊程度
  shadowGenerator.blurKernel = 32;

  engine.displayLoadingUI();

  BABYLON.SceneLoader.ImportMesh(
    '',
    'https://playground.babylonjs.com/scenes/',
    'dummy3.babylon',
    scene,
    function (newMeshes, particleSystems, skeletons) {
      const skeleton = skeletons[0];

      shadowGenerator.addShadowCaster(scene.meshes[0], true);
      for (let index = 0; index < newMeshes.length; index++) {
        newMeshes[index].receiveShadows = false;
      }

      const helper = scene.createDefaultEnvironment({
        enableGroundShadow: true,
      }) as BABYLON.EnvironmentHelper;
      helper.setMainColor(BABYLON.Color3.Gray());
      if (helper.ground) {
        helper.ground.position.y += 0.01;
      }

      // ROBOT
      // 创建一个新的AnimationPropertiesOverride对象，并将其赋值给骨架的animationPropertiesOverride属性
      // AnimationPropertiesOverride对象用于覆盖骨架的动画属性
      skeleton.animationPropertiesOverride =
        new BABYLON.AnimationPropertiesOverride();

      // 启用动画混合。当启用时，可以在不同的动画之间平滑过渡
      skeleton.animationPropertiesOverride.enableBlending = true;

      // 设置动画混合的速度为0.05。这将影响从一种动画过渡到另一种动画的速度
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;

      // 设置动画的循环模式为1。这意味着动画将在结束时从头开始
      skeleton.animationPropertiesOverride.loopMode = 1;

      // 获取骨架的各种动画范围
      const idleRange = skeleton.getAnimationRange('YBot_Idle'); // 获取Idle动画范围
      const walkRange = skeleton.getAnimationRange('YBot_Walk'); // 获取Walk动画范围
      const runRange = skeleton.getAnimationRange('YBot_Run'); // 获取Run动画范围
      const leftRange = skeleton.getAnimationRange('YBot_LeftStrafeWalk'); // 获取LeftStrafeWalk动画范围
      const rightRange = skeleton.getAnimationRange('YBot_RightStrafeWalk'); // 获取RightStrafeWalk动画范围
      // IDLE
      if (idleRange)
        scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);

      // UI
      // 创建一个全屏的UI纹理
      const advancedTexture =
        GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

      // 创建一个新的堆栈面板
      const uiPanel = new GUI.StackPanel();

      // 设置面板的宽度为220px
      uiPanel.width = '220px';

      // 设置面板的字体大小为14px
      uiPanel.fontSize = '14px';

      // 设置面板的水平对齐方式为右对齐
      uiPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;

      // 设置面板的垂直对齐方式为居中对齐
      uiPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

      // 将面板添加到全屏UI纹理中
      advancedTexture.addControl(uiPanel);

      // 创建一个新的按钮，按钮的标签为"Play Idle"
      const button = GUI.Button.CreateSimpleButton('but1', 'Play Idle');

      // 设置按钮的顶部内边距为10px
      button.paddingTop = '10px';

      // 设置按钮的宽度为100px，高度为50px
      button.width = '100px';
      button.height = '50px';

      // 设置按钮的文字颜色为白色
      button.color = 'white';

      // 设置按钮的背景颜色为绿色
      button.background = 'green';

      // 当按钮被按下时，如果存在Idle动画范围，则开始播放Idle动画
      button.onPointerDownObservable.add(() => {
        if (idleRange)
          scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
      });

      // 将按钮添加到面板中
      uiPanel.addControl(button);
      // ..
      let button1 = GUI.Button.CreateSimpleButton('but2', 'Play Walk');
      button1.paddingTop = '10px';
      button1.width = '100px';
      button1.height = '50px';
      button1.color = 'white';
      button1.background = 'green';
      button1.onPointerDownObservable.add(() => {
        if (walkRange)
          scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
      });
      uiPanel.addControl(button1);
      // ..
      button1 = GUI.Button.CreateSimpleButton('but3', 'Play Run');
      button1.paddingTop = '10px';
      button1.width = '100px';
      button1.height = '50px';
      button1.color = 'white';
      button1.background = 'green';
      button1.onPointerDownObservable.add(() => {
        if (runRange)
          scene.beginAnimation(skeleton, runRange.from, runRange.to, true);
      });
      uiPanel.addControl(button1);
      // ..
      button1 = GUI.Button.CreateSimpleButton('but4', 'Play Left');
      button1.paddingTop = '10px';
      button1.width = '100px';
      button1.height = '50px';
      button1.color = 'white';
      button1.background = 'green';
      button1.onPointerDownObservable.add(() => {
        if (leftRange)
          scene.beginAnimation(skeleton, leftRange.from, leftRange.to, true);
      });
      uiPanel.addControl(button1);
      // ..
      button1 = GUI.Button.CreateSimpleButton('but5', 'Play Right');
      button1.paddingTop = '10px';
      button1.width = '100px';
      button1.height = '50px';
      button1.color = 'white';
      button1.background = 'green';
      button1.onPointerDownObservable.add(() => {
        if (rightRange)
          scene.beginAnimation(skeleton, rightRange.from, rightRange.to, true);
      });
      uiPanel.addControl(button1);
      // ..
      // 创建一个新的按钮，按钮的标签为"Play Blend"
      button1 = GUI.Button.CreateSimpleButton('but6', 'Play Blend');

      // 设置按钮的顶部内边距为10px
      button1.paddingTop = '10px';

      // 设置按钮的宽度为100px，高度为50px
      button1.width = '100px';
      button1.height = '50px';

      // 设置按钮的文字颜色为白色
      button1.color = 'white';

      // 设置按钮的背景颜色为绿色
      button1.background = 'green';

      // 当按钮被按下时，如果存在walkRange和leftRange动画范围，则开始播放混合动画
      button1.onPointerDownObservable.add(() => {
        if (walkRange && leftRange) {
          // 停止当前的动画
          scene.stopAnimation(skeleton);

          // 开始播放walk动画，权重为0.5
          const walkAnim = scene.beginWeightedAnimation(
            skeleton,
            walkRange.from,
            walkRange.to,
            0.5,
            true
          );

          // 开始播放left动画，权重为0.5
          const leftAnim = scene.beginWeightedAnimation(
            skeleton,
            leftRange.from,
            leftRange.to,
            0.5,
            true
          );

          // 将walk动画设置为主动画，其他动画将与其同步
          walkAnim.syncWith(null);
          leftAnim.syncWith(walkAnim);
        }
      });
      uiPanel.addControl(button1);

      engine.hideLoadingUI();
    }
  );

  return scene;
}

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
