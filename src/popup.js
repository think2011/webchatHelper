// 在当前页面注入脚本

injectJs(chrome.extension.getURL('app.js'));

/**
 * 将chrome环境的js插入到dom
 * @param src
 */
function injectJs(src) {
    var script = document.createElement('script');
    script.src = src;

    document.head.appendChild(script);
}