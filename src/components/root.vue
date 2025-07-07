<template>
  <slot />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useProvideStore } from './store';
import { GanttHook, GanttJsonData } from '@/types/gantt';

const props = defineProps({
  data: {
    type: Object as PropType<GanttJsonData>,
    required: true
  },
  hook: {
    type: Object as PropType<GanttHook>,
    default: undefined
  }
});


useProvideStore(props.data, { hook: props.hook });

</script>

<style scoped>

</style>