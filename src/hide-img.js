// ==UserScript==
// @name         隐藏图片
// @version      0.3
// @description  隐藏图片, 旁边添加按钮可展示/隐藏
// @author       zzxt0019
// @match        https://nga.178.com/*
// @match        https://www.zhihu.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const UserscriptId = 'zzxt0019-hide-img';
    const DisplayAttribute = UserscriptId + '-display';

    let styles = {
        buttonSvgToSee: '<svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M81.8 537.8a60.3 60.3 0 010-51.5C176.6 286.5 319.8 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c-192.1 0-335.4-100.5-430.2-300.2z" fill="#e6f7ff"></path><path d="M512 258c-161.3 0-279.4 81.8-362.7 254C232.6 684.2 350.7 766 512 766c161.4 0 279.5-81.8 362.7-254C791.4 339.8 673.3 258 512 258zm-4 430c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" fill="#e6f7ff"></path><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258s279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z" fill="#1890ff"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" fill="#1890ff"></path></svg>',
        buttonSvgToHide: '<svg viewBox="64 64 896 896" focusable="false" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M254.89 758.85l125.57-125.57a176 176 0 01248.82-248.82L757 256.72Q651.69 186.07 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q69.27 145.91 173.09 221.05zM942.2 486.2Q889.46 375.11 816.7 305L672.48 449.27a176.09 176.09 0 01-227.22 227.21L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5z" fill="#e6f7ff"></path><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zM878.63 165.56L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z" fill="#1890ff"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z" fill="#1890ff"></path></svg>',
        buttonStyle: {
            'vertical-align': 'top', 'width': '20px', 'height': '20px', 'border-radius': '20px', 'background': 'pink',
        }
    }
    let dataOriginal = new Set();
    let count = 0;
    hide();
    let observer = new MutationObserver(() => {
        hide();
        check();
    });
    observer.observe(document, {childList: true, subtree: true, attributes: true});

    /**
     * 初始化img前的button以及匹配的zzxt
     */
    function hide(list) {
        console.log('list', list);
        if (!list) {
            list = document.querySelectorAll(`img[src]:not([${UserscriptId}]):not([src="about:blank"])`);
        }
        for (let i = 0; i < list.length; i++) {
            let count0 = count++;
            let img = list[i];
            if (ZhiHu(img)) {
                img.setAttribute(UserscriptId, String(count0));
                let button = document.createElement('button');
                button.setAttribute(UserscriptId, String(count0));
                button.setAttribute(DisplayAttribute, 'none');
                Object.keys(styles.buttonStyle).forEach(key => button.style[key] = styles.buttonStyle[key]);
                button.innerHTML = styles.buttonSvgToSee;
                button.onclick = () => {
                    button.setAttribute(DisplayAttribute, button.getAttribute(DisplayAttribute) === 'none' ? '' : 'none');
                    button.innerHTML = button.getAttribute(DisplayAttribute) === 'none' ? styles.buttonSvgToSee : styles.buttonSvgToHide;
                    document.querySelector(`img[${UserscriptId}="${count0}"]`).style.display = button.getAttribute(DisplayAttribute);
                };
                img.parentElement.insertBefore(button, img);
            }
        }
    }

    /**
     * 检查 隐藏应该隐藏但没有隐藏的img
     */
    function check() {
        let list = document.querySelectorAll(`button[${UserscriptId}][${DisplayAttribute}=none]`);
        for (let i = 0; i < list.length; i++) {
            let button = list[i];
            let img = document.querySelector(`img[${UserscriptId}="${button.getAttribute(UserscriptId)}"]`);
            if (img && img.style.display !== button.getAttribute(DisplayAttribute)) {
                img.style.display = button.getAttribute(DisplayAttribute);
            }
        }
    }

    /**
     * 知乎大图判断, 不隐藏大图
     */
    function ZhiHu(img) {
        if (dataOriginal.has(img.src) && !img.hasAttribute('data-original')) {
            return false;
        }
        if (img.hasAttribute('data-original')) {
            dataOriginal.add(img.getAttribute('data-original'));
        }
        return true;
    }
})();