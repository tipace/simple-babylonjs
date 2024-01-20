<template>
  <div class="menus">
    <select :value="name" @change="changeMenu">
      <option value="" disabled selected hidden>choose</option>
      <option v-for="n in routeList" :value="n">{{ n }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { routeList } from '../router';

const name = ref(window.location.pathname.split('/')[1]);

function changeMenu(e) {
  name.value = e.target.value;
  // @babylonjs/inspector 会破坏dom结构，使用vue-router跳转时可能出现vue内部的错误
  // todo 临时方案改为重新加载页面
  window.location.href = `/${name.value}`;
}
</script>

<style scoped>
.menus {
  position: fixed;
  left: 20px;
  top: 20px;

  display: flex;
  flex-direction: column;

  button {
    margin-bottom: 10px;
  }
}
</style>
