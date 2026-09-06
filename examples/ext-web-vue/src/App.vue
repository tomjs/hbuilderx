<script setup lang="ts">
import { Modal } from 'antdv-next';
import { onMounted } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';

onMounted(() => {
  hbuilderx.onDidReceiveMessage((msg) => {
    if (msg.command === 'ping-back') {
      Modal.info({
        title: '后端消息',
        content: msg.text,
      });
    }
  });
});
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="@/assets/vite.svg" class="logo" alt="Vite logo">
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo">
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
