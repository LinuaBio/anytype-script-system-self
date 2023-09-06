import { observeElementCreation } from "./observe";
import { createPopup } from "./popup";
import SelectedRect from "../components/icon-design-tool/SelectedRect.vue";

var idHash: { [key: string]: any } = {};

// 哈希表中存储每个ID对应的函数
idHash["button-icon"] = function () {
    console.log("Function for ID 'button-icon'");
    var btn = document.createElement('div');
    btn.className = 'btn';
    btn.textContent = '生成 ico';

    btn.addEventListener('click', function () {
        // console.log('111')
        // createVueComponent(document.getElementById('dragProvider')!, SelectedRect)
        createPopup(SelectedRect)
    });

    const parentNode = document.getElementById('menu-polygon')!.parentNode as Element
    observeElementCreation('#menuSmile', parentNode, function () {
        parentNode.getElementsByClassName('head')[0].appendChild(btn);
    })
};

function handleClick(event: MouseEvent) {
    const parentWithId = (event.target! as Element).closest('[id]');

    if (parentWithId && idHash.hasOwnProperty(parentWithId.id)) {
        // 执行对应 ID 的函数
        idHash[parentWithId.id]();
    }
}

export { handleClick }