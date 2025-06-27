<template>
  <div class='gantt-group-layout'>
    <template v-for='item in lazyGroup' :key='item.index'>
      <div
        class='group-item'
        :style='{
          height: `${item.group.height}px`,
          top: `${ganttEntity.groups.getGroupTopByIndex(item.index)}px`,
          paddingLeft: `${16*item.group.deep}px`
        }'
      >
        <div class='group-inner'>
          <div
            v-if='item.group.children.length>0'
            class='operator' 
            @click='onExpand(item.group)'>
            <el-icon
              size='12'
              class='icon'
              :style='{
                transform: `rotate(${item.group.isExpand?90: 0}deg)`
              }'>
              <caret-right />
            </el-icon>
          </div>
          <div v-else class='operator' />
          <div class='content'>
            <slot :group='item.group'>
              {{ item.group.id }}
            </slot>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useGroupHook } from './group-hook';

const { ganttEntity } = useStore()!;
const { lazyGroup, onExpand } = useGroupHook();
</script>

<style scoped lang="scss">
.gantt-group-layout{
  position: relative;
  width: 100%;
  height: 100%;

  .group-item{
    position: absolute;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
    left: 0;
    box-sizing: border-box;
  }

  .group-inner {
    display: flex;
    width: 100%; 
    height: 100%; 
    align-items: center;

    .operator{
      flex: none; 
      padding: 0 2px; 
      display: flex;
      align-items: center;
      cursor: pointer;
      overflow: hidden;
      width: 16px;
      
      .icon {
        animation: transform 0.1s ease-in-out;
      }
    }

    .content{
      flex: 1; 
      overflow: hidden;
    }
  }
}
</style>