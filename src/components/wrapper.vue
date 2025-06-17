<template>
  <container v-if='entityReady'>
    <layout />
    <scroll />
  </container>
</template>

<script setup lang="ts">
import Container from './container.vue';
import { useStore } from './store';
import Layout from './layout/index.vue';
import Scroll from './scroll/index.vue';

const { entityReady, container } = useStore()!;

</script>

<style scoped>

</style>