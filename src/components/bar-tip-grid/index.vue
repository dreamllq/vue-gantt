<template>
  <div class='bar-tip-grid'>
    <template v-for='item in tipBars' :key='item.id'>
      <div
        v-if='item.sy - scrollTop > 0 && !item.dragging'
        class='dragging-tip' 
        :style='{
          width: `${width}px`,
          transform: `translate(${item.sx}px, ${item.sy + wrapperHeight}px)`,
          zIndex:`${Number.MAX_SAFE_INTEGER}`
        }'>
        {{ item.start }}~{{ item.end }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBarTipGridHook } from './hook';
import { useStore } from '../store';

const { ganttEntity, scroll } = useStore()!;
const { scrollTop } = scroll;
const { tipBars } = useBarTipGridHook();
const width = ref(280);
const wrapperHeight = ref(ganttEntity.layoutConfig.HEADER_HEIGHT - 20);

</script>

<style scoped lang="scss">
.bar-tip-grid {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;

  .dragging-tip{
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-fill-color-blank);
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 12px;
    height: 16px;
    padding: 2px;
    box-sizing: border-box;
    transition: transform 0.2s ease-in-out;
  }
}
</style>