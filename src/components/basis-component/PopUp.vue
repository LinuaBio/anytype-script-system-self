<template>
    <div class="background">
        <div id="draggable-window" class="draggable-window"
            :style="{ width: windowWidth + 'px', height: windowHeight + 'px', top: top + 'px', left: left + 'px' }">
            <div class="title-bar" @mousedown="startDrag">
                <span class="title">{{ title }}</span>
                <div class="close-button" @click="closeWindow">X</div>
            </div>

            <div class="content">
                <!-- 窗口内容 -->
                <component :is="component" :svgWidth="windowWidth" :svgHeight="windowHeight - titlebarHeight" />
            </div>

            <div class="resize-handle" @mousedown="startResize"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';
export default defineComponent({
    name: 'DraggableWindow',
    props: {
        title: String,
        component: {
            type: Object as () => Component,
            required: true
        },
        parentID: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            windowWidth: 400,
            windowHeight: 300,
            top: 0,
            left: 0,
            isDragging: false,
            isResizing: false,
            resizeStartX: 0,
            resizeStartY: 0,
            titlebarHeight: 34,
        }
    },
    mounted() {
        this.top = (document.documentElement.clientHeight - this.windowHeight) / 2;
        this.left = (document.documentElement.clientWidth - this.windowWidth) / 2;
    },
    methods: {
        startDrag(event: MouseEvent) {
            event.preventDefault();
            this.isDragging = true;
            const startX = event.clientX - this.left;
            const startY = event.clientY - this.top;

            const handleMouseMove = (event: MouseEvent) => {
                if (this.isDragging) {
                    this.left = event.clientX - startX;
                    this.top = event.clientY - startY;
                }
            };

            const handleMouseUp = () => {
                this.isDragging = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            this.titlebarHeight = document.getElementsByClassName('title-bar')[0].clientHeight
        },
        startResize(event: MouseEvent) {
            event.preventDefault();
            this.isResizing = true;
            this.resizeStartX = event.clientX;
            this.resizeStartY = event.clientY;

            const handleMouseMove = (event: MouseEvent) => {
                if (this.isResizing) {
                    const dx = event.clientX - this.resizeStartX;
                    const dy = event.clientY - this.resizeStartY;
                    this.windowWidth += dx;
                    this.windowHeight += dy;
                    this.resizeStartX = event.clientX;
                    this.resizeStartY = event.clientY;
                }
            };

            const handleMouseUp = () => {
                this.isResizing = false;
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        closeWindow() {
            document.getElementById(this.parentID)!.remove();
        }
    }
})
</script>
  
<style lang="scss" scoped>
$radius: 12px;
.background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 998;
}
.draggable-window {
    position: absolute;
    // border: 1px solid #ccc;
    background-color: #fff;
    border-radius: $radius;
    overflow: hidden;
    z-index: 999;
}

.title-bar {
    border-radius: $radius $radius 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    background-color: #f2f2f2;
    cursor: move;
}

.close-button {
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.2em 0.8em;
    font-size: 0.8em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
}

// .content {
//     // padding: 8px;
// }

.resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 6px;
    height: 6px;
    background-color: inherit;
    cursor: se-resize;
    opacity: 0;
}
</style>