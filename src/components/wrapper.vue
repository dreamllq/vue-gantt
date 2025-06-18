<template>
  <container v-if='entityReady'>
    <layout v-if='scrollReady'>
      <template #aside-header>
        111
      </template>
      <template #aside-main>
        <div>1111111111111333333333334444444444444555555555555111111111111133333333333444444444444455555555555511111111111113333333333344444444444445555555555551111111111111333333333334444444444444555555555555</div>
      </template>
      <template #main-header>
        <time-line />
      </template>
      <template #main-main>
        <div>1111111111111333333333334444444444444555555555555111111111111133333333333444444444444455555555555511111111111113333333333344444444444445555555555551111111111111333333333334444444444444555555555555</div>
      </template>
    </layout>
    <scroll />
  </container>
</template>

<script setup lang="ts">
import Container from './container.vue';
import { useStore } from './store';
import Layout from './layout/index.vue';
import Scroll from './scroll/index.vue';
import TimeLine from './time-line/index.vue';

const { entityReady, container, scroll } = useStore()!;
const { scrollReady } = scroll;
</script>

<style scoped>

</style>