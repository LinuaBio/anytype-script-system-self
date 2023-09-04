//
// Observe wether element was created
// target: which element should be observe
// parentNode: In which place observe Dom, default in root Dom
//
function observeElementCreation(target: string, parentNode: null|Element, callback: () => any) {
    parentNode = parentNode?parentNode:document.documentElement
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

    observer.observe(parentNode);
}

export { observeElementCreation }