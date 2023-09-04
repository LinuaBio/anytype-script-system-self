<template>
  <div class="draw-board">
    <svg id="-1" style="background-color: white;" ref="svgRef" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
      @mouseup="handleMouseUp" :width="svgWidth" :height="svgHeight">
      <!-- 添加元素 -->
      <rect
        :transform="'rotate(' + rect.rotateAngle + ' ' + (rect.x + rect.width / 2) + ' ' + (rect.y + rect.height / 2) + ')'"
        v-for="(rect, index) in rects" :id="String(index)" :key="index" :x="rect.x" :y="rect.y" :width="rect.width"
        :height="rect.height" :fill="rect.color" />

      <!-- 添加选框 -->
      <g :transform="'rotate(' + RotateAngle + ' ' + getNowCentor.x + ' ' + getNowCentor.y + ')'">
        <!-- <line-chart mask="url(#mask)" :width="svgWidth" :height="svgHeight" /> -->
        <!-- 添加选框边框 -->
        <rect v-if="selectedRectIndex == -1" :x="selectedRectX" :y="selectedRectY" :width="selectedRectWidth"
          :height="selectedRectHeight" fill="none" stroke="black" />

        <!-- 添加选框的外边框 -->
        <rect :x="selectedRectX" :y="selectedRectY" :width="selectedRectWidth" :height="selectedRectHeight" fill="none"
          stroke="blue" />
        <!-- 添加缩放手柄 -->
        <rect name="tl" v-if="selectedRectIndex !== -1" :x="selectedRectX - handleSize / 2"
          :y="selectedRectY - handleSize / 2" :width="handleSize" :height="handleSize" fill="white" stroke="black" />
        <rect name="tr" v-if="selectedRectIndex !== -1" :x="selectedRectX + selectedRectWidth - handleSize / 2"
          :y="selectedRectY - handleSize / 2" :width="handleSize" :height="handleSize" fill="white" stroke="black" />
        <rect name="bl" v-if="selectedRectIndex !== -1" :x="selectedRectX - handleSize / 2"
          :y="selectedRectY + selectedRectHeight - handleSize / 2" :width="handleSize" :height="handleSize" fill="white"
          stroke="black" />
        <rect name="br" v-if="selectedRectIndex !== -1" :x="selectedRectX + selectedRectWidth - handleSize / 2"
          :y="selectedRectY + selectedRectHeight - handleSize / 2" :width="handleSize" :height="handleSize" fill="white"
          stroke="black" />

        <!-- 旋转手柄 -->
        <line v-if="selectedRectIndex !== -1" class="handle-rotate-line" :x1="selectedRectX + selectedRectWidth / 2"
          :y1="selectedRectY - rotateHandleLength" :x2="selectedRectX + selectedRectWidth / 2" :y2="selectedRectY"
          stroke="black" />
        <circle name="rotate" v-if="selectedRectIndex !== -1" class="handle-rotate-circle"
          :cx="selectedRectX + selectedRectWidth / 2" :cy="selectedRectY - rotateHandleLength" :r="rotateHandleRadius"
          fill="white" stroke="black" />
      </g>

      <!-- 添加预测缩放和旋转的箭头 -->
      <line v-if="selectedRectIndex !== -1 && showPrediction" class="prediction-line" :x1="predictionX" :y1="predictionY"
        :x2="mouseX" :y2="mouseY" stroke="black" />
      <path v-if="selectedRectIndex !== -1 && showPrediction" class="prediction-arrow" :d="predictionArrowPath"
        fill="black" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import LineChart from './LineChart.vue';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotateAngle: number;
  color: string;
}

type SelectedRectFunction = 'tl' | 'tr' | 'bl' | 'br' | 'rotate' | null

export default defineComponent({
  props: {
    svgWidth: {
      type: Number,
      required: true
    },
    svgHeight: {
      type: Number,
      required: true
    },
  },
  components: {
    LineChart,
  },
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      rects: reactive<Rect[]>([]),
      handleSize: 12, // 手柄大小
      rotateHandleLength: 20, // 旋转线的长度
      rotateHandleRadius: 8, // 旋转圆的半径
      selectedRectIndex: -1,
      selectedRectStart: { x: 0, y: 0, width: 0, height: 0 },
      selectedRectCenter: { x_old: 0, y_old: 0 },
      isDragging: false,
      isSelectedRect: false,
      SelectedRectFunction: null as SelectedRectFunction,
    }
  },
  mounted() {
    this.createRect(100, 100);
    this.createRect(150, 200);
  },
  methods: {
    handleMouseDown(event: MouseEvent) {
      const target = (event.target as HTMLElement)
      const RectFunction = target.getAttribute('name') as SelectedRectFunction

      if (target.id != '') {
        this.selectedRectIndex = Number(target.id);
      }

      if (this.selectedRectIndex == -1) {
        return
      }

      //后面计算要用
      const { clientX, clientY } = event;
      const svg = this.$refs.svgRef as SVGSVGElement;
      const svgRect = svg.getBoundingClientRect();
      this.mouseX = clientX - svgRect.left;
      this.mouseY = clientY - svgRect.top;

      this.selectedRectStart.y = this.selectedRectY;
      this.selectedRectStart.x = this.selectedRectX;
      this.selectedRectStart.width = this.selectedRectWidth;
      this.selectedRectStart.height = this.selectedRectHeight;

      if (RectFunction == null) {
        this.isDragging = true;
      } else {
        this.selectedRectCenter = { x_old: this.getNowCentor.x, y_old: this.getNowCentor.y };
        this.isSelectedRect = true;
        this.isDragging = false;
        this.SelectedRectFunction = RectFunction;
      }
    },
    handleMouseMove(event: MouseEvent) {
      const svg = this.$refs.svgRef as SVGSVGElement;
      //处理拖拽移动
      if (this.isDragging && svg) {
        const { clientX, clientY } = event;
        const svgRect = svg.getBoundingClientRect();
        const dragDeltaX = clientX - svgRect.left - this.mouseX;
        const dragDeltaY = clientY - svgRect.top - this.mouseY;

        if (this.selectedRectIndex !== -1) {
          this.rects[this.selectedRectIndex].x = this.selectedRectStart.x + dragDeltaX;
          this.rects[this.selectedRectIndex].y = this.selectedRectStart.y + dragDeltaY;
        }
      } else if (this.isSelectedRect && svg) {
        //处理旋转
        if (this.SelectedRectFunction == 'rotate') {
          const rectCenterX = this.getNowCentor.x;
          const rectCenterY = this.getNowCentor.y;
          const { clientX, clientY } = event;
          const svgRect = svg.getBoundingClientRect();
          const deltaX = clientX - svgRect.left - rectCenterX;
          const deltaY = clientY - svgRect.top - rectCenterY;
          this.RotateAngle = (Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90) % 360;
          return;
        }
        //处理缩放
        const { clientX, clientY } = event;
        const svgRect = svg.getBoundingClientRect();
        const dragDeltaXTemp = clientX - svgRect.left - this.mouseX;
        const dragDeltaYTemp = clientY - svgRect.top - this.mouseY;

        const angle = this.RotateAngle * (Math.PI / 180);
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        let dragDeltaX = cosAngle * dragDeltaXTemp + sinAngle * dragDeltaYTemp
        let dragDeltaY

        // 根据旋转角度调整鼠标坐标方向
        if (Math.abs(this.RotateAngle / 90) % 2 != 0) {
          dragDeltaY = - sinAngle * dragDeltaXTemp + cosAngle * dragDeltaYTemp
        } else {
          dragDeltaY = sinAngle * dragDeltaXTemp + cosAngle * dragDeltaYTemp
        }

        let tempSelectedRectStart = { x: this.selectedRectStart.x, y: this.selectedRectStart.y };
        let newWidth = 0;
        let newHeight = 0;
        switch (this.SelectedRectFunction) {
          case 'tl':
            newWidth = this.selectedRectStart.width - dragDeltaX;
            newHeight = this.selectedRectStart.height - dragDeltaY;
            // 根据左上角位置调整左上角坐标
            tempSelectedRectStart.x += dragDeltaX;
            tempSelectedRectStart.y += dragDeltaY;
            break;
          case 'tr':
            newWidth = this.selectedRectStart.width + dragDeltaX;
            newHeight = this.selectedRectStart.height - dragDeltaY;
            // 根据右上角位置调整左上角坐标
            tempSelectedRectStart.y += dragDeltaY;
            break;
          case 'bl':
            newWidth = this.selectedRectStart.width - dragDeltaX;
            newHeight = this.selectedRectStart.height + dragDeltaY;
            // 根据左下角位置调整左上角坐标
            tempSelectedRectStart.x += dragDeltaX;
            break;
          case 'br':
            newWidth = this.selectedRectStart.width + dragDeltaX;
            newHeight = this.selectedRectStart.height + dragDeltaY;
            break;
          default:
            break;
        }

        if (newWidth > 0 && newHeight > 0) {
          const centerX = tempSelectedRectStart.x + newWidth / 2;
          const centerY = tempSelectedRectStart.y + newHeight / 2;

          const dx = centerX - this.selectedRectCenter.x_old;
          const dy = centerY - this.selectedRectCenter.y_old;

          const rotatedDX = dx * cosAngle - dy * sinAngle;
          const rotatedDY = dx * sinAngle + dy * cosAngle;

          const newX = this.selectedRectCenter.x_old + rotatedDX;
          const newY = this.selectedRectCenter.y_old + rotatedDY;

          this.rects[this.selectedRectIndex].x = newX - newWidth / 2;
          this.rects[this.selectedRectIndex].y = newY - newHeight / 2;
          this.rects[this.selectedRectIndex].width = newWidth;
          this.rects[this.selectedRectIndex].height = newHeight;
        }
      }
    },
    handleMouseUp() {
      this.isDragging = false;
      this.isSelectedRect = false;
      this.SelectedRectFunction = null
      if (this.selectedRectIndex !== -1) {
        this.selectedRectStart.x = this.rects[this.selectedRectIndex].x;
        this.selectedRectStart.y = this.rects[this.selectedRectIndex].y;
      }
    },
    isSelected(index: number) {
      return index === this.selectedRectIndex;
    },
    createRect(x: number, y: number) {
      const rects = {
        x: x,
        y: y,
        width: Math.random() * 50 + 50,
        height: Math.random() * 50 + 50,
        color: '#' + Math.random().toString(16).substr(-6),
        rotateAngle: 0
      } as Rect;
      // this.selectedRectIndex = 0
      this.rects.push(rects);
    },
    setRotateAngle(angle: number) {
      console.log(angle)
    },
  },
  computed: {
    getNowCentor(): { x: number, y: number } {
      return {
        x: this.selectedRectX + this.selectedRectWidth / 2,
        y: this.selectedRectY + this.selectedRectHeight / 2
      }
    },
    RotateAngle: {
      get(): number {
        if (this.selectedRectIndex !== -1) {
          return this.rects[this.selectedRectIndex].rotateAngle;
        }
        return 0;
      },
      set(v: number) {
        if (this.selectedRectIndex !== -1) {
          this.rects[this.selectedRectIndex].rotateAngle = v;
        }
      }
    },
    selectedRectX(): number {
      if (this.selectedRectIndex !== -1) {
        return this.rects[this.selectedRectIndex].x;
      }
      return 0;
    },
    selectedRectY(): number {
      if (this.selectedRectIndex !== -1) {
        return this.rects[this.selectedRectIndex].y;
      }
      return 0;
    },
    selectedRectWidth(): number {
      if (this.selectedRectIndex !== -1) {
        return this.rects[this.selectedRectIndex].width;
      }
      return 0;
    },
    selectedRectHeight(): number {
      if (this.selectedRectIndex !== -1) {
        return this.rects[this.selectedRectIndex].height;
      }
      return 0;
    },
    showPrediction(): boolean {
      return this.isDragging && this.selectedRectIndex !== -1;
    },
    predictionX(): number {
      if (this.showPrediction) {
        return this.selectedRectX + this.selectedRectWidth / 2;
      }
      return 0;
    },
    predictionY(): number {
      if (this.showPrediction) {
        return this.selectedRectY + this.selectedRectHeight / 2;
      }
      return 0;
    },
    predictionArrowPath(): string {
      if (this.showPrediction) {
        const dx = this.mouseX - this.predictionX;
        const dy = this.mouseY - this.predictionY;
        const angle = Math.atan2(dy, dx);
        const arrowSize = this.handleSize * 2;
        const arrowHalfSize = arrowSize / 2;
        const headAngle = Math.PI / 6;

        const arrowX = this.predictionX + Math.cos(angle) * arrowHalfSize;
        const arrowY = this.predictionY + Math.sin(angle) * arrowHalfSize;

        const arrowLeftX = arrowX + Math.cos(angle - headAngle) * arrowHalfSize;
        const arrowLeftY = arrowY + Math.sin(angle - headAngle) * arrowHalfSize;

        const arrowRightX = arrowX + Math.cos(angle + headAngle) * arrowHalfSize;
        const arrowRightY = arrowY + Math.sin(angle + headAngle) * arrowHalfSize;

        return `M${arrowX},${arrowY}L${arrowLeftX},${arrowLeftY}L${arrowRightX},${arrowRightY}Z`;
      }
      return '';
    },
  },
});
</script>

<style scoped>
.draw-board {
  position: relative;
}

.handle-top-left,
.handle-top-right,
.handle-bottom-left,
.handle-bottom-right {
  cursor: pointer;
}

.prediction-line {
  stroke-dasharray: 5;
  pointer-events: none;
}

.prediction-arrow {
  transform-origin: center;
}
</style>
