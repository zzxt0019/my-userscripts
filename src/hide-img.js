// ==UserScript==
// @name         隐藏图片
// @version      0.5
// @description  隐藏图片, 旁边添加按钮可展示/隐藏
// @author       zzxt0019
// @match        https://nga.178.com/*
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const baseId = 'zzxt0019-hide';
    // 需要被隐藏操作的图片的AttributeKey
    const ImgId = baseId + '-img-id';
    // 对应隐藏按钮的AttributeKey
    const ButtonId = baseId + '-button-id';
    // 隐藏时 图片的class
    const ImgHideClass = baseId + '-img-class';
    // button的AttributeKey 表示img的状态
    const ButtonImgStatus = baseId + '-button-img-status';

    const styles = {
        // 点击从隐藏变为可视的图标(眼睛)
        buttonSvgToSee: '<svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M81.8 537.8a60.3 60.3 0 010-51.5C176.6 286.5 319.8 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c-192.1 0-335.4-100.5-430.2-300.2z" fill="#e6f7ff"></path><path d="M512 258c-161.3 0-279.4 81.8-362.7 254C232.6 684.2 350.7 766 512 766c161.4 0 279.5-81.8 362.7-254C791.4 339.8 673.3 258 512 258zm-4 430c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z" fill="#e6f7ff"></path><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258s279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766z" fill="#1890ff"></path><path d="M508 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" fill="#1890ff"></path></svg>',
        // 点击从可视变为隐藏的图标(眼睛斜线)
        buttonSvgToHide: '<svg viewBox="64 64 896 896" focusable="false" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M254.89 758.85l125.57-125.57a176 176 0 01248.82-248.82L757 256.72Q651.69 186.07 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q69.27 145.91 173.09 221.05zM942.2 486.2Q889.46 375.11 816.7 305L672.48 449.27a176.09 176.09 0 01-227.22 227.21L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5z" fill="#e6f7ff"></path><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zM878.63 165.56L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z" fill="#1890ff"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z" fill="#1890ff"></path></svg>',
        // 按钮样式
        buttonStyle: {
            'vertical-align': 'top', 'width': '20px', 'height': '20px', 'border-radius': '20px', 'background': 'pink',
        }
    }
    let count = 0;
    const dataOriginal = new Set();
    // 开始
    createStyle();
    hide();
    let observer = new MutationObserver(() => {
        hide();
        check();
    });
    observer.observe(document, {childList: true, subtree: true, attributes: true});

    // 结束

    /**
     * 创建style
     */
    function createStyle() {
        let style = document.createElement('style');
        style.innerHTML = `
          [${ImgId}].${ImgHideClass} {
            display: none !important;
          }
          [${ImgId}]:not(.${ImgHideClass}) {
            opacity: 0.3 !important;
          }
          html {
            opacity: 0.8;
          }
          `;
        document.body.append(style);
    }


    /**
     * 初始化img前的button以及匹配的zzxt
     */
    function hide(list) {
        if (!list) {
            list = [];
            // <img src=""> 但src不为[about:blank]
            list.push(...document.querySelectorAll(`img[src]:not([src="about:blank"]):not([${ImgId}])`));
            // style里有[: url("]
            list.push(...document.querySelectorAll(`[style*=': url(\"']:not([${ImgId}])`));
        }
        for (let i = 0; i < list.length; i++) {
            // 当前的计数
            let count0 = count++;
            let img = list[i];
            if (ZhiHu(img)) {
                img.setAttribute(ImgId, String(count0));
                // 创建button
                let button = document.createElement('button');
                button.setAttribute(ButtonId , String(count0));
                button.setAttribute(ButtonImgStatus, 'none');
                // button样式
                Object.keys(styles.buttonStyle).forEach(key => button.style[key] = styles.buttonStyle[key]);
                button.innerHTML = styles.buttonSvgToSee;
                button.onclick = () => {
                    // 点击button时 修改img的隐藏状态和button的ImgStatus
                    if (button.getAttribute(ButtonImgStatus) === 'none') {
                        button.setAttribute(ButtonImgStatus, '');
                        button.innerHTML = styles.buttonSvgToHide;
                        document.querySelector(`[${ImgId}="${count0}"]`).classList.remove(ImgHideClass);
                    } else {
                        button.setAttribute(ButtonImgStatus, 'none');
                        button.innerHTML = styles.buttonSvgToSee;
                        document.querySelector(`[${ImgId}="${count0}"]`).classList.add(ImgHideClass);
                    }
                };
                img.parentElement.insertBefore(button, img);
            }
        }
    }

    /**
     * 检查 隐藏应该隐藏但没有隐藏的img
     */
    function check() {
        let list = document.querySelectorAll(`button[${ButtonId }][${ButtonImgStatus}=none]`);
        for (let i = 0; i < list.length; i++) {
            let button = list[i];
            let img = document.querySelector(`[${ImgId}="${button.getAttribute(ButtonId)}"]`);
            if (img) {
                // img没有隐藏class并且button的ImgStatus为隐藏 或者 img有隐藏class并且button的ImgStatus为不隐藏
                //   => img的隐藏状态和button的ImgStatus不同时
                // 改为button的状态
                if ((!img.classList.contains(ImgHideClass) && button.getAttribute(ButtonImgStatus) === 'none')
                    || (img.classList.contains(ImgHideClass) && button.getAttribute(ButtonImgStatus) !== 'none')) {
                    if (button.getAttribute(ButtonImgStatus) === 'none') {
                        img.classList.add(ImgHideClass);
                    } else {
                        img.classList.remove(ImgHideClass);
                    }
                }
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