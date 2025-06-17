<template>
  <slot />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useProvideStore } from './store';
import { GanttJsonData } from '@/types/gantt';

const props = defineProps({
  data: {
    type: Object as PropType<GanttJsonData>,
    required: true
  }
});

useProvideStore(props.data);

</script>

<style scoped>

</style>