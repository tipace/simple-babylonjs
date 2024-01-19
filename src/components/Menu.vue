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
import { useRouter, useRoute } from 'vue-router';
import { routeList } from '../router';

const router = useRouter();

const name = ref();

function changeMenu(e) {
  name.value = e.target.value;
  router.push('/' + name.value);
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
