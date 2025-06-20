<template>
  <root :data='data'>
    <wrapper>
      <template #aside-header>
        <slot name='aside-header' />
      </template>
      <template #bar='slotProps'>
        <slot name='bar' v-bind='slotProps' />
      </template>
    </wrapper>
  </root>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import Root from './root.vue';
import Wrapper from './wrapper.vue';
import { GanttJsonData } from '@/types/gantt';

const props = defineProps({
  data: {
    type: Object as PropType<GanttJsonData>,
    required: true
  }
});
</script>

<style scoped lang="scss">

</style>