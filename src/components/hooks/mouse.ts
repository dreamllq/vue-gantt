import { useMouseInElement } from '@vueuse/core';

export const useMouse = () => {
  const { x, y, isOutside } = useMouseInElement();
};