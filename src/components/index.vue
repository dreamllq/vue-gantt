<template>
  <root :data='data'>
    <wrapper 
      ref='wrapperRef' 
      :hook='hook'
      @bar-drag-change='(...args)=>emits("bar-drag-change",...args)'
    >
      <template #aside-header>
        <slot name='aside-header' />
      </template>
      <template #group='slotProps'>
        <slot name='group' v-bind='slotProps' />
      </template>
      <template #bar='slotProps'>
        <slot name='bar' v-bind='slotProps' />
      </template>
      <template #attachedBar='slotProps'>
        <slot name='attachedBar' v-bind='slotProps' />
      </template>
    </wrapper>
  </root>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import Root from './root.vue';
import Wrapper from './wrapper.vue';
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

const wrapperRef = ref<InstanceType<typeof Wrapper>>();

const emits = defineEmits(['bar-drag-change']);

defineExpose({ api: () => wrapperRef.value!.api() });
</script>

<style scoped lang="scss">

</style>