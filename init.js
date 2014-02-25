// 在当前页面注入脚本
injectJs(chrome.extension.getURL('angular.min.js'));
injectJs(chrome.extension.getURL('app.js'));

/**
 * 将chrome环境的js插入到dom
 * @param srcFile chrome.extension.getURL('jquery.min.js');
 */
function injectJs(srcFile) {
    var scr = document.createElement('script');
    scr.src = srcFile;
    document.getElementsByTagName('head')[0].appendChild(scr);
}