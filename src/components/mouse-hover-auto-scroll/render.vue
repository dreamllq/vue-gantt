<template>
  <div ref='target' class='mouse-hover-scroll' :style='style'>
    <div 
      v-if='isShowTop'
      ref='topRef'
      class='scroll-top scroll-item'>
      <el-icon class='icon'>
        <d-arrow-left />
      </el-icon>
    </div>

    <div 
      v-if='isShowBottom'
      ref='bottomRef'
      class='scroll-bottom scroll-item'>
      <el-icon class='icon'>
        <d-arrow-left />
      </el-icon>
    </div>

    <div
      v-if='isShowLeft'
      ref='leftRef'
      class='scroll-left scroll-item'>
      <el-icon class='icon'>
        <d-arrow-left />
      </el-icon>
    </div>

    <div 
      v-if='isShowRight'
      ref='rightRef'
      class='scroll-right scroll-item'>
      <el-icon class='icon'>
        <d-arrow-left />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '../store';
import { useMouseInElement } from '@vueuse/core';
import { ref } from 'vue';
import { useTopHook } from './top-hook';
import { useBottomHook } from './bottom-hook';
import { useLeftHook } from './left-hook';
import { useRightHook } from './right-hook';

const target = ref<HTMLDivElement>();

const { isOutside, elementX, elementY } = useMouseInElement(target);
const { scroll, ganttEntity } = useStore()!;
const { scrollLeft, scrollTop } = scroll;

const topRef = ref<HTMLElement>();
const bottomRef = ref<HTMLElement>();
const leftRef = ref<HTMLElement>();
const rightRef = ref<HTMLElement>();

const style = ref({ '--size': `${ganttEntity.layoutConfig.AUTO_SCROLL_AREA_SIZE}px` });

const { isShow: isShowTop } = useTopHook(topRef);
const { isShow: isShowBottom } = useBottomHook(bottomRef);
const { isShow: isShowLeft } = useLeftHook(leftRef);
const { isShow: isShowRight } = useRightHook(rightRef);
</script>

<style scoped lang="scss">
.mouse-hover-scroll{
  width: 100%;
  height: 100%;
  position: relative;
}

.scroll-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-top{
  height: var(--size);
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0));
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  @keyframes slideOutTop {
    from {
     opacity: 1;
     transform: rotate(90deg) translateX(0);
    }
    to {
      opacity: 0;
      transform: rotate(90deg) translateX(-20px);
    }
  }

  .icon{
    transform: rotate(90deg);
    animation: slideOutTop 1s ease-out infinite;
  }
}

.scroll-bottom{
  height: var(--size);
  background: linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0));
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  @keyframes slideOutBottom {
    from {
     opacity: 1;
     transform: rotate(-90deg) translateX(0);
    }
    to {
      opacity: 0;
      transform: rotate(-90deg) translateX(-20px);
    }
  }

  .icon{
    transform: rotate(-90deg);
    animation: slideOutBottom 1s ease-out infinite;
  }
}

.scroll-left{
  width: var(--size);
  background: linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0));
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;

  @keyframes slideOutLeft {
    from {
     opacity: 1;
     transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-20px);
    }
  }

  .icon{
    animation: slideOutLeft 1s ease-out infinite;
  }
}

.scroll-right{
  width: var(--size);
  background: linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0));
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;

  @keyframes slideOutRight {
    from {
     opacity: 1;
     transform: rotate(180deg) translateX(0);
    }
    to {
      opacity: 0;
      transform: rotate(180deg) translateX(-20px);
    }
  }

  .icon{
    transform: rotate(180deg) translateX(0);
    animation: slideOutRight 1s ease-out infinite;
  }
}

</style>