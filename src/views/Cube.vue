<!-- https://playground.babylonjs.com/#LQF5QR#2 -->
<template>
  <canvas ref="cube" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Inspector } from '@babylonjs/inspector';

const cube = ref();
onMounted(() => {
  render();
});

function render() {
  const canvas = cube.value;
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

  const engine = new BABYLON.Engine(canvas, true);

  const scene = createScene(engine, canvas);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', function () {
    engine.resize();
  });
}

class CustomNode extends BABYLON.TransformNode {
  _mesh: BABYLON.Mesh;
  _color!: BABYLON.Color3;

  constructor(name: string, scene: BABYLON.Scene, color: BABYLON.Color3) {
    super(name, scene);

    this._mesh = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene);
    this._mesh.parent = this;
    this._mesh.material = new BABYLON.StandardMaterial('material', scene);

    // Set initial color.
    this.color = color;

    // Custom inspector properties.
    this.inspectableCustomProperties = [
      {
        label: 'My color field',
        propertyName: 'color',
        type: BABYLON.InspectableType.Color3,
      },
    ];
  }

  set color(value) {
    this._color = value;
    // @ts-ignore
    this._mesh.material.diffuseColor = value;
  }

  get color() {
    return this._color;
  }
}

var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera(
    'camera1',
    new BABYLON.Vector3(0, 5, -7),
    scene
  );

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Instantiate custom nodes.
  const myCustomNode1 = new CustomNode(
    'myCustomNode1',
    scene,
    BABYLON.Color3.Green()
  );
  myCustomNode1.position.x = -1.5;
  const myCustomNode2 = new CustomNode(
    'myCustomNode2',
    scene,
    BABYLON.Color3.Red()
  );
  myCustomNode2.position.x = 1.5;

  // Show inspector.
  Inspector.Show(scene, {
    embedMode: true,
  });

  return scene;
};
</script>
