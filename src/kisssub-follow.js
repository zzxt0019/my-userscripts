// ==UserScript==
// @name         zzxt0019-爱恋动漫记录追番记录按钮
// @version      0.4
// @description  新番页面番剧后添加选项框, 记录自己追的番
// @author       zzxt0019
// @match        https://www.kisssub.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    const id = 'zzxt0019-kisssub-follow';
    const styleId = id + '-style';

    GM_registerMenuCommand('设置宽度', () => {
        let width = prompt("设置宽度(px)", GM_getValue('style.width', 30));
        if (width) {
            GM_setValue('style.width', width);
        }
        updateStyle();
    })
    GM_registerMenuCommand('设置高度', () => {
        let height = prompt("设置高度(px)", GM_getValue('style.height', 15));
        if (height) {
            GM_setValue('style.height', height);
        }
        updateStyle();
    })
    // 样式
    let style = document.createElement('style');
    style.id = styleId;
    document.body.append(style);
    updateStyle();

    function updateStyle() {
        document.getElementById(styleId).innerHTML = `
          input.${id} {
              height: ${GM_getValue('style.height', 15)}px;
              width: ${GM_getValue('style.width', 30)}px;
          }
          `;
    }

    // a[data-balloon-pos="up"] 查询含有番剧名字的标签
    document.querySelectorAll('a[data-balloon-pos="up"]').forEach(element => {
        let input = document.createElement("input");

        input.type = 'number';
        // 获取番剧名
        let key = 'anime.' + element.innerHTML.trim();
        input.classList.add(id);
        // input, 改变值时存储setValue
        input.value = GM_getValue(key, null);
        input.onchange = () => {
            GM_setValue(key, input.value);
        }
        // 将input添加到番剧后面
        if (element.nextSibling) {
            element.parentElement.insertBefore(input, element.nextSibling);
        } else {
            element.parentElement.appendChild(input);
        }
    })
})();
