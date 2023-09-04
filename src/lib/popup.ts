import { createApp, Component } from 'vue'
import { generateIDFromHash } from './method';
import PopUp from '../components/basis-component/PopUp.vue';

/**
 * 
 * @param targetNode vue组件添加位置
 * @param component 要添加的vue组件
 */
function createVueComponent(targetNode: Element, component: Component) {
    const componentNode = document.createElement('div');
    const id = generateIDFromHash();
    componentNode.id = id;
    targetNode.appendChild(componentNode);
    const app = createApp(component);
    app.mount(`#${id}`);
}

function createPopup(component: Component) {
    const componentNode = document.createElement('div');
    const id = generateIDFromHash();
    componentNode.id = id;
    document.getElementById("dragProvider")!.appendChild(componentNode);
    const app = createApp(PopUp, { component: component, parentID: id});
    app.mount(`#${id}`);
}

export { createPopup, createVueComponent }