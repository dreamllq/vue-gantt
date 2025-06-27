<template>
  <root :data='data'>
    <wrapper ref='wrapperRef'>
      <template #aside-header>
        <slot name='aside-header' />
      </template>
      <template #group='slotProps'>
        <slot name='group' v-bind='slotProps' />
      </template>
      <template #bar='slotProps'>
        <slot name='bar' v-bind='slotProps' />
      </template>
    </wrapper>
  </root>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import Root from './root.vue';
import Wrapper from './wrapper.vue';
import { GanttJsonData } from '@/types/gantt';

const props = defineProps({
  data: {
    type: Object as PropType<GanttJsonData>,
    required: true
  }
});

const wrapperRef = ref<InstanceType<typeof Wrapper>>();

defineExpose({ api: () => wrapperRef.value!.api() });
</script>

<style scoped lang="scss">

</style>