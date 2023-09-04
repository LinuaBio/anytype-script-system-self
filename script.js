//
// define variable
//
const componentPath = 'D:/Project/Anytype/vue-component/src/components'
const Vue = require('vue')

//
// On Load
//
function onLoad() {
    const vuejs = document.createElement('script');
    vuejs.src = 'https://cdn.jsdelivr.net/npm/vue';
    vuejs.type = 'text/javascript';
    document.body.appendChild(vuejs);
}

onLoad()

// About reload funtion to Console
//
//Add reload 'script.js' function
window.reloadScript = function () {
    const scriptUrl = 'D:/Project/Anytype/antype-script-self/script.js';

    const originalScript = document.querySelector('script[src="' + scriptUrl + '"]');

    if (originalScript) {
        const newScript = document.createElement('script');
        newScript.src = scriptUrl;

        if (originalScript.async) {
            newScript.async = true;
        }
        if (originalScript.defer) {
            newScript.defer = true;
        }
        if (originalScript.type) {
            newScript.type = originalScript.type;
        }

        originalScript.parentNode.replaceChild(newScript, originalScript);
        console.log('reload script');
    }
};

//
// Observe wether element was created
// target: which element should be observe
// parentNode: In which place observe Dom, default in root Dom
//
function observeElementCreation(target, parentNode = document, callback) {
    const observer = new IntersectionObserver(entries => {
        entries.some(entry => {
            if (entry.target.querySelector(target)) {
                window.requestAnimationFrame(() => {
                    callback();
                    observer.disconnect();
                });
                return true;
            }
        });
    });

    observer.observe(parentNode, { childList: true });
}

//
// About mouse click event
//
var idHash = {};

// 哈希表中存储每个ID对应的函数
idHash["button-icon"] = function () {
    console.log("Function for ID 'button-icon'");
    var btn = document.createElement('div');
    btn.className = 'btn';
    btn.textContent = '生成 ico';

    btn.addEventListener('click', function () {
        const id = 'vue-component-button-icon'
        // console.log('按钮被点击了');
        var component = document.createElement('div')
        component.id = id
        

        const app = Vue.createApp({});
        app.component('my-component', {
            template: '<div>This is my component.</div>'
        });
        app.mount('#'+id);
    });
    const parentNode = document.getElementById('menu-polygon').parentNode
    observeElementCreation('#menuSmile', parentNode, function () {
        parentNode.getElementsByClassName('head')[0].appendChild(btn);
    })
};

function handleClick(event) {
    const parentWithId = event.target.closest('[id]');

    if (parentWithId && idHash.hasOwnProperty(parentWithId.id)) {
        // 执行对应 ID 的函数
        idHash[parentWithId.id]();
    }
}

// 通过事件监听器绑定点击事件处理函数
document.addEventListener('click', handleClick);