<template>
  <div class='gantt-layout'>
    <div class='gantt-aside vertical left-aside' :style='asideStyle'>
      <div class='gantt-header aside-header' :style='headerStyle'>
        <div class='main-container'>
          <slot v-if='layoutReady' name='aside-header' />
        </div>
      </div>
      <div class='gantt-main aside-main'>
        <div class='main-container' :style='asideMainStyle'>
          <div ref='asideMainRef' class='aside-main-inner main-container'>
            <div :style='asideMainInnerStyle' class='hidden-container'>
              <slot v-if='layoutReady' name='aside-main' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='gantt-main vertical'>
      <div class='gantt-header main-header' :style='mainHeaderStyle'>
        <div ref='mainHeaderRef' class='main-container gantt-header-wrapper'>
          <div :style='mainHeaderInnerStyle' class='hidden-container mainHeaderInner'>
            <slot v-if='layoutReady' name='main-header' />
          </div>
        </div>
      </div>
      <div class='gantt-main'>
        <div :style='mainContainerStyle' class='main-container'>
          <div ref='mainContainerRef' class='main-main-inner main-container'>
            <div :style='mainContainerInnerStyle' class='hidden-container'>
              <slot v-if='layoutReady' name='main-main' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchPostEffect } from 'vue';
import { useStore } from '../store';
import { max } from 'lodash';
import { useSizeHook } from './size-hook';

const { ganttEntity, scroll, layout } = useStore()!;
const { layoutReady } = layout;



const { scrollLeft, scrollTop } = scroll;

const mainContainerRef = ref();
const mainHeaderRef = ref();
const asideMainRef = ref();
useSizeHook({ mainContainerRef });

watchPostEffect(() => {
  asideMainRef.value.scrollTop = scrollTop.value;

  mainHeaderRef.value.scrollLeft = scrollLeft.value;

  mainContainerRef.value.scrollLeft = scrollLeft.value;
  mainContainerRef.value.scrollTop = scrollTop.value;
});

const asideStyle = ref({ width: `${ganttEntity.layoutConfig.GRID_CELL_WIDTH}px` });
const headerStyle = ref({ height: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px` });

const asideMainStyle = ref({ paddingBottom: `${ganttEntity.scroll.hasX ? ganttEntity.layoutConfig.SCROLL_HEIGHT : 0}px` });
const asideMainInnerStyle = ref({ height: `${ganttEntity.groups.expandedGroups.length * ganttEntity.layoutConfig.ROW_HEIGHT}px` });

const mainHeaderStyle = ref({
  height: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px`,
  paddingRight: `${ganttEntity.scroll.hasY ? ganttEntity.layoutConfig.SCROLL_WIDTH : 0}px` 
});
const mainHeaderInnerStyle = ref({ width: `${max([ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth, ganttEntity.container.width])}px` });

const mainContainerStyle = ref({
  paddingRight: `${ganttEntity.scroll.hasY ? ganttEntity.layoutConfig.SCROLL_WIDTH : 0}px`,
  paddingBottom: `${ganttEntity.scroll.hasX ? ganttEntity.layoutConfig.SCROLL_HEIGHT : 0}px` 
});
const mainContainerInnerStyle = ref({
  width: `${max([ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth, ganttEntity.container.width])}px`,
  height: `${ganttEntity.groups.expandedGroups.length * ganttEntity.layoutConfig.ROW_HEIGHT}px` 
});
</script>

<style scoped lang="scss">
.gantt-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--el-fill-color-blank);
  display: flex;


    .vertical{
      flex-direction: column;
    }

  .gantt-aside {
    flex: none;
    overflow: hidden;
    display: flex;
    height: 100%;

    .vertical{
      .gantt-main{
        height: auto;
        width: 100%;
      }
    }
  }

  .gantt-main{
    flex: 1;
    overflow: hidden;
    display: flex;
    height: 100%;

    .vertical{
      .gantt-main{
        height: auto;
        width: 100%;
      }
    }
  }

  .gantt-header{
    flex: none;
    overflow: hidden;
    width: 100%;
  }

  .main-container{
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .hidden-container{
    overflow: hidden;
    position: relative;
  }

  .mainHeaderInner{
    height: 100%;
  }

  .aside-header{
    border-bottom: 1px solid var(--border-color);
  }

  .aside-main-inner{
    border-bottom: 1px solid var(--border-color);
  }

  .left-aside{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      height: 100%;
      border-right: 1px solid var(--border-color);
      right: 0;
      top: 0;
    }
  }

  .main-header{
    border-bottom: 1px solid var(--border-color);
  }

  .gantt-header-wrapper{
    border-right: 1px solid var(--border-color);
  }

  .main-main-inner{
    border-bottom: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
}
</style>