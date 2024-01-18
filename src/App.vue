<script setup>
import { ref } from 'vue';

import Xbot from './components/Xbot.vue';
import Xinyan from './components/Xinyan.vue';

const compMap = {
  Xbot,
  Xinyan,
};

const nameList = Reflect.ownKeys(compMap);

const name = ref('Xinyan');
</script>

<template>
  <div class="types">
    <select @change="name = $event.target.value">
      <option v-for="n in nameList" :value="n">{{ n }}</option>
    </select>
  </div>
  <component :is="compMap[name]" />
</template>

<style scoped>
.types {
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
