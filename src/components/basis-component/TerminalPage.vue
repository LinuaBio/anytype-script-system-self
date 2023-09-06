<template>
    <Terminal name="my-terminal" @exec-cmd="onExecCmd"></Terminal>
</template>
<script lang="ts">
import Terminal from 'vue-web-terminal'
import { defineComponent } from 'vue';
export default defineComponent({
    components: {
        Terminal
    },
    methods: {
        onExecCmd(key: any, command: any, success: any, failed: any) {
            if (key === 'fail') {
                failed('Something wrong!!!')
            } else {
                let allClass = ['success', 'error', 'system', 'info', 'warning'];

                let clazz = allClass[Math.floor(Math.random() * allClass.length)];
                success({
                    type: 'normal',
                    class: clazz,
                    tag: '成功',
                    content: command
                })
            }
        }
    }
})
</script>

<style scoped>
body, html, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>