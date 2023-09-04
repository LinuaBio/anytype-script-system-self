<template>
    <g :transform="'translate('+x+',' +y +')'" class="lines-container" :width="width" :height="height">
        <line v-for="line in lines" :key="line.id" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
            :stroke="line.stroke" :stroke-width="line.strokeWidth">
        </line>
    </g>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'LineChart',
    props: {
        x:{
            type: Number,
            default: 0,
        },
        y: {
            type: Number,
            default: 0,
        },
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 100,
        },
        padding: {
            type: Number,
            default: 20,
        },
        strokeProp: {
            default: {
                color: 'red',
            },
        }
    },
    computed: {
        lines() {
            const lines = [];
            const maxLine = Math.max(this.width, this.height)
            const minLine = Math.min(this.width, this.height)
            //circumscribed square
            const CSquareDiagonal = maxLine * Math.SQRT2
            const CSquareLineCount = Math.ceil(CSquareDiagonal / this.padding);
            //extra square
            const extraDiagonal = (maxLine - minLine) * Math.SQRT2
            const extraLineCount = Math.ceil(extraDiagonal / this.padding / 2)

            const lineCount = CSquareLineCount - extraLineCount;
            const step = this.padding * Math.SQRT2

            let y, x, maxY, maxX

            if (this.width < this.height) {
                for (let i = 1; i < lineCount; i++) {
                    x = i * step;
                    if (x < this.width) {
                        lines.push({ id: i, x1: x, y1: 0, x2: 0, y2: x });
                    } else {
                        y = x - this.width;
                        maxY = Math.min(x, this.height);
                        lines.push({ id: i, x1: this.width, y1: y, x2: x - maxY, y2: maxY });
                    }
                }
            } else {
                for (let i = 1; i < lineCount; i++) {
                    y = i * step;
                    if (y < this.height) {
                        lines.push({ id: i, x1: 0, y1: y, x2: y, y2: 0 });
                    } else {
                        x = y - this.height;
                        maxX = Math.min(y, this.width);
                        lines.push({ id: i, x1: x, y1: this.height, x2: maxX, y2: y - maxX });
                    }
                }
            }
            return lines.map(line => ({
                ...line,
                stroke: this.strokeProp.color,
                strokeWidth: 1
            }));
        }
    },
});
</script>