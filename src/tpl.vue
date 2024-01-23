<template>
  <canvas ref="renderCanvas" />
</template>

<script setup lang="ts">
// @ts-nocheck

import { ref } from 'vue';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';

import useRender from '../hooks/useRender';

const renderCanvas = ref();

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {}

useRender(renderCanvas, createScene);
</script>
