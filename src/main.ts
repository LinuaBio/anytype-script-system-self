import { generateIDFromHash } from "./lib/method";
import { handleClick } from "./lib/mouse-event";

console.log("Script System Started")

// 鼠标事件
document.addEventListener('click', handleClick);


(function (generateIDFromHash) {
    // 在这里可以调用 generateIDFromHash 函数
    console.log("generateIDFromHash: ",generateIDFromHash(10));
})(generateIDFromHash);
// 假设有一个名为 element 的元素

// 保存原始的点击事件监听器
// const originalClickListeners = element.onclick;

// // 清除元素上的点击事件监听器
// element.onclick = null;

// // 执行其他操作，此时点击 element 不会触发任何监听器

// // 恢复之前的点击事件监听器
// element.onclick = originalClickListeners;