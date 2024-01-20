<!-- https://playground.babylonjs.com/#P1RZV0 -->
<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
// @ts-nocheck

import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import '@babylonjs/loaders/glTF';
import { Inspector } from '@babylonjs/inspector';

const can = ref();

async function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);
  engine.displayLoadingUI();

  // create camera and lights for scene
  const lights = {};
  const env = {};
  async function initScene() {
    // 创建一个弧旋转相机
    const camera = new BABYLON.ArcRotateCamera(
      'camera', // 相机的名称
      BABYLON.Tools.ToRadians(0), // 初始位置
      BABYLON.Tools.ToRadians(70), // 初始方向
      0.5, // 远剪裁平面距离
      new BABYLON.Vector3(0.0, 0.1, 0.0), // 初始旋转
      scene // 场景
    );
    camera.minZ = 0.01; // 最小近剪裁平面距离
    camera.wheelDeltaPercentage = 0.01; // 鼠标滚轮百分比
    camera.upperRadiusLimit = 0.5; // 最大半径限制
    camera.lowerRadiusLimit = 0.25; // 最小半径限制
    camera.upperBetaLimit = 1.575; // 最大beta限制
    camera.lowerBetaLimit = 0; // 最小beta限制
    camera.panningAxis = new BABYLON.Vector3(0, 0, 0); // 旋转轴
    camera.attachControl(canvas, true); // 将相机与画布控件绑定

    // 创建一个环境光照纹理
    env.lighting = BABYLON.CubeTexture.CreateFromPrefilteredData(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/env/hamburg_hbf.env',
      scene // 场景
    );
    env.lighting.name = 'hamburg_hbf'; // 环境纹理名称
    env.lighting.gammaSpace = false; // 环境纹理的伽马空间
    env.lighting.rotationY = BABYLON.Tools.ToRadians(0); // 环境纹理的Y轴旋转
    scene.environmentTexture = env.lighting; // 设置场景的环境纹理

    // 创建一个天空盒
    env.skybox = BABYLON.MeshBuilder.CreateBox(
      'skyBox', // 天空盒的名称
      { size: 1000.0 }, // 天空盒的尺寸
      scene // 场景
    );
    env.skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene); // 创建天空盒的材质
    env.skyboxMaterial.backFaceCulling = false; // 不剔除背面三角面片
    env.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/skybox/hamburg', // 环境纹理的URL
      scene // 场景
    );
    env.skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE; // 环境纹理的坐标模式
    env.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // 漫反射颜色
    env.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // 镜面反射颜色
    env.skybox.material = env.skyboxMaterial; // 设置天空盒的材质

    // 创建一个定向光源
    lights.dirLight = new BABYLON.DirectionalLight(
      'dirLight', // 光源的名称
      new BABYLON.Vector3(0.6, -0.7, 0.63), // 光向量
      scene // 场景
    );
    lights.dirLight.position = new BABYLON.Vector3(-0.05, 0.35, -0.05); // 光源位置
    lights.dirLight.shadowMaxZ = 0.45; // 最大阴影深度
    lights.dirLight.intensity = 10; // 光源强度
  }

  const bottle = {};
  const table = {};
  async function loadMeshes() {
    // 将瓶子模型文件追加到场景中
    bottle.file = await BABYLON.SceneLoader.AppendAsync(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/sodaBottle.gltf'
    );

    // 获取瓶子主体网格
    bottle.glass = scene.getMeshByName('sodaBottle_low');

    // 获取瓶子内部液体网格
    bottle.liquid = scene.getMeshByName('soda_low');

    // 设置瓶子的根节点为瓶子主体网格的父节点
    bottle.root = bottle.glass.parent;

    // 设置瓶子主体网格的alphaIndex为2
    bottle.glass.alphaIndex = 2;

    // 设置瓶子内部液体网格的alphaIndex为1
    bottle.liquid.alphaIndex = 1;

    // 克隆瓶子主体网格并将其赋值给瓶子主体网格标签
    bottle.glassLabels = bottle.glass.clone('glassLabels');

    // 设置瓶子主体网格标签的alphaIndex为0
    bottle.glassLabels.alphaIndex = 0;

    // 将桌子模型文件追加到场景中
    table.file = await BABYLON.SceneLoader.AppendAsync(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/table.gltf'
    );

    // 获取桌子网格
    table.mesh = scene.getMeshByName('table_low');

    // 将瓶子根节点移动到指定位置
    bottle.root.position = new BABYLON.Vector3(-0.09, 0.0, -0.09);

    // 将瓶子根节点绕Y轴旋转指定角度
    bottle.root.rotation = new BABYLON.Vector3(0.0, 4.0, 0.0);

    // 将方向光源只照在桌子网格上
    lights.dirLight.includedOnlyMeshes.push(table.mesh);
  }

  let loadTexturesAsync = async function () {
    let textures = []; // 定义一个空数组用于存储纹理
    return new Promise((resolve, reject) => {
      // 返回一个Promise对象
      let textureUrls = [
        // 定义一个纹理URL数组
        'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/sodaBottleMat_thickness.png',
        'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/sodaMat_thickness.png',
        'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/gltf/sodaBottleMat_translucency.png',
      ];

      for (let url of textureUrls) {
        // 遍历纹理URL数组
        textures.push(new BABYLON.Texture(url, scene, false, false)); // 创建纹理对象并将其添加到textures数组中
      }

      whenAllReady(textures, () => resolve(textures)); // 调用whenAllReady函数，当所有纹理都加载完毕后，调用resolve函数并传入textures数组
    }).then(() => {
      // 成功加载纹理后执行的回调函数
      assignTextures(textures); // 调用assignTextures函数，传入textures数组
    });
  };

  // test if a texture is loaded
  let whenAllReady = function (textures, resolve) {
    let numRemaining = textures.length;
    if (numRemaining == 0) {
      resolve();
      return;
    }

    for (let i = 0; i < textures.length; i++) {
      let texture = textures[i];
      if (texture.isReady()) {
        if (--numRemaining === 0) {
          resolve();
          return;
        }
      } else {
        let onLoadObservable = texture.onLoadObservable;
        if (onLoadObservable) {
          onLoadObservable.addOnce(() => {
            if (--numRemaining === 0) {
              resolve();
            }
          });
        }
      }
    }
  };

  // 为给定的网格材质、通道和纹理列表检索纹理
  let retrieveTexture = function (meshMat, channel, textures) {
    let texture; // 初始化纹理变量
    for (let file of textures) {
      let segment = file.name.split('/'); // 将文件名按 '/' 分割成数组
      if (segment[segment.length - 1].split('_')[0] === meshMat) {
        // 如果文件名的第一个单词与网格材质名称相同
        if (segment[segment.length - 1].split('_')[1] === channel + '.png') {
          // 如果文件名的第二个单词与给定的通道和'.png'拼接后的字符串相同
          texture = file; // 将当前文件赋值给纹理变量
          return texture; // 返回纹理变量
        }
      }
    }
  };

  const sodaMats = {};
  const bottleTex = {};
  const liquidTex = {};
  // 根据提供的纹理对象分配纹理
  function assignTextures(textures) {
    // 将瓶子的底色纹理赋值给瓶子纹理对象的baseColor属性
    bottleTex.baseColor = bottle.glass.material.albedoTexture;
    // 将瓶子的金属度纹理赋值给瓶子纹理对象的orm属性
    bottleTex.orm = bottle.glass.material.metallicTexture;
    // 将瓶子的法线纹理赋值给瓶子纹理对象的normal属性
    bottleTex.normal = bottle.glass.material.bumpTexture;
    // 将指定纹理从纹理对象中取出并赋值给瓶子纹理对象的thickness属性
    bottleTex.thickness = retrieveTexture(
      'sodaBottleMat',
      'thickness',
      textures
    );
    // 将指定纹理从纹理对象中取出并赋值给瓶子纹理对象的translucency属性
    bottleTex.translucency = retrieveTexture(
      'sodaBottleMat',
      'translucency',
      textures
    );
    // 将瓶子中液体的底色纹理赋值给液体纹理对象的baseColor属性
    liquidTex.baseColor = bottle.liquid.material.albedoTexture;
    // 将瓶子中液体的金属度纹理赋值给液体纹理对象的orm属性
    liquidTex.orm = bottle.liquid.material.metallicTexture;
    // 将瓶子中液体的法线纹理赋值给液体纹理对象的normal属性
    liquidTex.normal = bottle.liquid.material.bumpTexture;
    // 将指定纹理从纹理对象中取出并赋值给液体纹理对象的thickness属性
    liquidTex.thickness = retrieveTexture('sodaMat', 'thickness', textures);

    // 释放瓶子的底色纹理和金属度纹理
    bottle.glass.material.dispose();
    // 释放瓶子中液体的底色纹理和金属度纹理
    bottle.liquid.material.dispose();
  }
  BABYLON.NodeMaterial.IgnoreTexturesAtLoadTime = true;
  const bottleParameters = {};
  const liquidParameters = {};
  // 创建sodaMats.bottle材质
  async function createMaterials() {
    // 创建sodaMats.bottle节点材质，不输出注释
    sodaMats.bottle = new BABYLON.NodeMaterial('sodaBottleMat', scene, {
      emitComments: false,
    });
    // 异步加载sodaBottleMat的json文件
    await sodaMats.bottle.loadAsync(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/shaders/glassShader.json'
    );
    // 构建sodaMats.bottle材质

    // 创建sodaMats.liquid材质
    sodaMats.liquid = new BABYLON.NodeMaterial('sodaMat', scene, {
      emitComments: false,
    });
    // 异步加载sodaMat的json文件
    await sodaMats.liquid.loadAsync(
      'https://patrickryanms.github.io/BabylonJStextures/Demos/sodaBottle/assets/shaders/sodaShader.json'
    );
    // 构建sodaMats.liquid材质

    // 创建sodaMats.glassLabels材质，是sodaMats.bottle的克隆
    sodaMats.glassLabels = sodaMats.bottle.clone('glassLabelsMat');

    // 获取sodaMats.bottle中的着色器参数
    bottleParameters.baseColor = sodaMats.bottle.getBlockByName('baseColorTex');
    bottleParameters.orm = sodaMats.bottle.getBlockByName('orm');
    bottleParameters.normal = sodaMats.bottle.getBlockByName('normalTex');
    bottleParameters.thickness = sodaMats.bottle.getBlockByName('thicknessTex');
    bottleParameters.maxThickness =
      sodaMats.bottle.getBlockByName('maxThickness');
    bottleParameters.glassTint = sodaMats.bottle.getBlockByName('glassTint');
    bottleParameters.fresnelColor =
      sodaMats.bottle.getBlockByName('fresnelColor');
    bottleParameters.translucency =
      sodaMats.bottle.getBlockByName('refractionInt');
    bottleParameters.glassAlphaSwitch =
      sodaMats.bottle.getBlockByName('alphaSwitch');
    bottleParameters.pbr = sodaMats.bottle.getBlockByName(
      'PBRMetallicRoughness'
    );

    // 获取sodaMats.glassLabels中的着色器参数
    bottleParameters.labelBaseColor =
      sodaMats.glassLabels.getBlockByName('baseColorTex');
    bottleParameters.labelOrm = sodaMats.glassLabels.getBlockByName('orm');
    bottleParameters.labelNormal =
      sodaMats.glassLabels.getBlockByName('normalTex');
    bottleParameters.labelThickness =
      sodaMats.glassLabels.getBlockByName('thicknessTex');
    bottleParameters.labelMaxThickness =
      sodaMats.glassLabels.getBlockByName('maxThickness');
    bottleParameters.labelGlassTint =
      sodaMats.glassLabels.getBlockByName('glassTint');
    bottleParameters.labelFresnelColor =
      sodaMats.glassLabels.getBlockByName('fresnelColor');
    bottleParameters.labelTranslucency =
      sodaMats.glassLabels.getBlockByName('refractionInt');
    bottleParameters.labelGlassAlphaSwitch =
      sodaMats.glassLabels.getBlockByName('alphaSwitch');
    bottleParameters.labelPbr = sodaMats.glassLabels.getBlockByName(
      'PBRMetallicRoughness'
    );

    // 获取sodaMats.liquid中的着色器参数
    liquidParameters.maxThickness =
      sodaMats.liquid.getBlockByName('maxThickness');

    // 设置玻璃渲染参数
    sodaMats.bottle.getAlphaTestTexture = () => bottleTex.baseColor;
    sodaMats.liquid.getAlphaTestTexture = () => liquidTex.baseColor;
    sodaMats.bottle.needDepthPrePass = true;
    sodaMats.bottle.backFaceCulling = false;
    sodaMats.glassLabels.forceDepthWrite = true;

    // 分配纹理和基准着色器参数
    bottle.glass.material = sodaMats.bottle;
    bottle.glassLabels.material = sodaMats.glassLabels;
    bottleParameters.baseColor.texture =
      bottleParameters.labelBaseColor.texture = bottleTex.baseColor;
    bottleParameters.orm.texture = bottleParameters.labelOrm.texture =
      bottleTex.orm;
    bottleParameters.normal.texture = bottleParameters.labelNormal.texture =
      bottleTex.normal;
    bottleParameters.thickness.texture =
      bottleParameters.labelThickness.texture = bottleTex.thickness;
    bottleParameters.translucency.texture =
      bottleParameters.labelTranslucency.texture = bottleTex.translucency;
    bottleParameters.pbr.alphaTestCutoff = 0.0;
    bottleParameters.labelPbr.alphaTestCutoff = 0.999;
    bottleParameters.glassAlphaSwitch.value = 0.0;
    bottleParameters.labelGlassAlphaSwitch.value = 1.0;
    bottleParameters.maxThickness.value =
      bottleParameters.labelMaxThickness.value = 5.0;
    bottleParameters.glassTint.value = bottleParameters.labelGlassTint.value =
      BABYLON.Color3.FromHexString('#aaaaaa');

    // 设置基准着色器参数为液体材质
    bottle.liquid.material = sodaMats.liquid;
    liquidParameters.maxThickness.value = 1.5;
  }

  const shadows = {};
  function generateShadows() {
    // 创建阴影生成器对象
    shadows.shadowGenerator = new BABYLON.ShadowGenerator(
      1024,
      lights.dirLight
    );

    // 设置阴影生成器使用模糊指数性阴影映射
    shadows.shadowGenerator.useBlurExponentialShadowMap = true;

    // 设置阴影生成器模糊框偏移量
    shadows.shadowGenerator.blurBoxOffset = 2;

    // 设置阴影生成器深度缩放因子为0
    shadows.shadowGenerator.depthScale = 0;

    // 将玻璃材质对象添加为产生阴影的对象
    shadows.shadowGenerator.addShadowCaster(bottle.glass);

    // 将液体材质对象添加为产生阴影的对象
    shadows.shadowGenerator.addShadowCaster(bottle.liquid);

    // 启用软透明阴影
    shadows.shadowGenerator.enableSoftTransparentShadow = true;

    // 启用透明阴影
    shadows.shadowGenerator.transparencyShadow = true;

    // 将桌子的网格材质对象接收阴影设为true
    table.mesh.receiveShadows = true;

    // 将桌子的网格材质对象的环境强度设为0.2
    table.mesh.material.environmentIntensity = 0.2;
  }

  initScene();
  await loadMeshes();
  await loadTexturesAsync();
  await createMaterials();
  generateShadows();

  return scene;
}

async function render() {
  const canvas = can.value;
  const engine = new BABYLON.Engine(canvas, true);
  const scene = await createScene(engine, canvas);

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
