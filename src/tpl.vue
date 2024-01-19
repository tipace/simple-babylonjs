<template>
  <canvas ref="can" />
</template>

<script setup lang="ts">
// @ts-nocheck

import { onMounted, ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Inspector } from '@babylonjs/inspector';

const can = ref();

function createScene(engine, canvas) {}

function render() {
  const canvas = can.value;
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;

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
