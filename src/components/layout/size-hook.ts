import { onMounted, ref } from 'vue';
import { useStore } from '../store';
import { useResizeObserver } from '@vueuse/core';

export const useSizeHook = ({ mainContainerRef }) => {
  const { layout } = useStore()!;

  useResizeObserver(mainContainerRef, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    console.log(`main-container ## width: ${width}, height: ${height}`);
    layout.setSize({
      width,
      height 
    });
  });
};