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
          <div class='main-tip-block' :style='mainContainerStyle'>
            <slot v-if='layoutReady' name='main-tip' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch, watchPostEffect } from 'vue';
import { useStore } from '../store';
import { max } from 'lodash';
import { useSizeHook } from './size-hook';
import { Events } from '@/types/events';
import { useMouseInElement } from '@vueuse/core';

const { ganttEntity, scroll, layout, bus } = useStore()!;
const { layoutReady } = layout;

const { scrollLeft, scrollTop } = scroll;

const mainContainerRef = ref();
const mainHeaderRef = ref();
const asideMainRef = ref();
useSizeHook({ mainContainerRef });

const { isOutside } = useMouseInElement(mainContainerRef);

watch(isOutside, () => {
  if (isOutside.value === true) {
    bus.emit(Events.MOUSE_MAIN_OUTSIDE);
  }
}, { immediate: true });

watchPostEffect(() => {
  asideMainRef.value.scrollTop = scrollTop.value;

  mainHeaderRef.value.scrollLeft = scrollLeft.value;

  mainContainerRef.value.scrollLeft = scrollLeft.value;
  mainContainerRef.value.scrollTop = scrollTop.value;
});

const asideStyle = ref({ width: `${ganttEntity.layoutConfig.GRID_CELL_WIDTH}px` });
const headerStyle = ref({ height: `${ganttEntity.layoutConfig.HEADER_HEIGHT}px` });

const asideMainStyle = ref({ paddingBottom: `${ganttEntity.scroll.hasX ? ganttEntity.layoutConfig.SCROLL_HEIGHT : 0}px` });
const asideMainInnerStyle = ref({ height: `${ganttEntity.groups.getGroupHeight()}px` });

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
  height: `${ganttEntity.groups.getGroupHeight()}px` 
});

const onLayoutChange = () => {
  asideMainInnerStyle.value.height = `${ganttEntity.groups.getGroupHeight()}px`;

  mainHeaderInnerStyle.value.width = `${max([ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth, ganttEntity.container.width])}px`;

  mainContainerInnerStyle.value.width = `${max([ganttEntity.config.totalSeconds * ganttEntity.config.secondWidth, ganttEntity.container.width])}px`;
  mainContainerInnerStyle.value.height = `${ganttEntity.groups.getGroupHeight()}px`;
};

onMounted(() => {
  bus.on(Events.LAYOUT_CHANGE, onLayoutChange);
});

onBeforeMount(() => {
  bus.off(Events.LAYOUT_CHANGE, onLayoutChange);
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
    position: relative;
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

  .main-tip-block{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
    overflow: hidden;
  }
}
</style>