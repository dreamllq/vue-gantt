<template>
  <div
    :class='["path-arrow", link.arrow!.direction]'
    :style='{
      transform: `translateX(${link.arrow!.point.x}px) translateY(${props.link.arrow!.point.y}px)`,
      "--task-color": mergeColor,
      zIndex: zIndex
    }' />
  <svg
    :id='svgId' 
    :style='{
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      "pointer-events": "none",
      zIndex:zIndex
    }'>
    <path />
  </svg>
</template>

<script setup lang="ts">
import { GanttLinkView } from '@/models/gantt-link-view';
import { onMounted, onUnmounted, PropType, ref, watch } from 'vue';
import { path as d3Path } from 'd3-path';
import { select as d3Select } from 'd3-selection';
import { line as d3Line, curveBasis, curveLinear } from 'd3-shape';
import { useStore } from '../store';

const props = defineProps({
  link: {
    type: Object as PropType<ReturnType<typeof GanttLinkView.prototype.toJSON>>,
    required: true
  },
  zIndex: {
    type: Number,
    default: 1
  },
  selected: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: undefined
  }
});

const { ganttId } = useStore()!;
const svgId = `path-svg-${ganttId}-${props.link.id}`;
const mergeColor = ref(props.selected ? 'var(--link-selected-color)' : (props.color ? props.color : 'var(--link-color)'));

let cp: {remove:()=>void} | null = null;

watch(() => props.link, () => {
  renderLink();
}, { deep: true });

const renderLink = () => {
  
  if (cp !== null) {
    cp.remove();
    cp = null;
  }

  
  // if (props.lineType === 'curveLinear') {
  const p = d3Path();
  p.moveTo(props.link.path[0].x, props.link.path[0].y);

  for (let i = 1; i < props.link.path.length - 1; i++) {
    const px = props.link.path[i - 1].x;
    const py = props.link.path[i - 1].y;
    const sx = props.link.path[i].x;
    const sy = props.link.path[i].y;
    const ex = props.link.path[i + 1].x;
    const ey = props.link.path[i + 1].y;

    const x1 = sx - (10 * Math.sign(sx - px));
    const y1 = sy - (10 * Math.sign(sy - py));

    const x2 = sx + (10 * Math.sign(ex - sx));
    const y2 = sy + (10 * Math.sign(ey - sy));

    const x = (sx + ex) / 2;
    const y = (sy + ey) / 2;

    if ((x1 - px) * Math.sign(px - sx) <= 0) {
      p.lineTo(x1, y1);
    }
    if ((x2 - x) * Math.sign(sx - ex) >= 0) {
      p.bezierCurveTo(sx, sy, sx, sy, x2, y2);
      p.lineTo(x, y);
    } else {
      p.bezierCurveTo(sx, sy, sx, sy, x, y);
    }
  }
  const endIndex = props.link.path.length - 1;
  const endPoint = props.link.path[endIndex];
  p.lineTo(endPoint.x, endPoint.y);
  const _svg = d3Select(`#${svgId}`);
  if (_svg === null) return;
  cp = _svg.append('path');
  // @ts-ignore
  cp.attr('d', p.toString())
    .style('fill', 'none')
    .style('stroke', mergeColor.value)
    .style('stroke-width', '2')
    .style('z-index', props.zIndex);
  // } else {
  //   const l = props.link.path.map(p => [p.x, p.y]);
  //   const line = d3Line().curve(lineTypeMap[props.lineType]).context(null);
  //   const _svg = d3Select(svgId);
  //   if (_svg === null) return;
  //   cp = _svg.append('path');
  //   cp.attr('d', line(l))
  //     .style('fill', 'none')
  //     .style('stroke', props.taskColor || 'var(--task-color)')
  //     .style('stroke-width', '2');
  // }
};

onMounted(() => {
  renderLink();
});

onUnmounted(() => {
  if (cp !== null) {
    cp.remove();
    cp = null;
  }
});
</script>

<style scoped lang="scss">
.path-arrow {
  position: absolute;
  user-select: none;
  background-color: transparent;
  border-style: solid;
  border-top-color: transparent;
  border-bottom-color: transparent;
  width: 0;
  height: 0;
  border-width: 5px 10px;
  top: 0;
  left: 0;

  &.right {
    border-right-color: transparent;
    border-left-color: var(--task-color);
    margin-top: -5px;
    margin-left: -8px;
  }

  &.left {
    margin-left: -11px;
    margin-top: -5px;
    border-right-color: var(--task-color);
    border-left-color: transparent;
  }
}
</style>