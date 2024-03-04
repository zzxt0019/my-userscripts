// ==UserScript==
// @name         zzxt0019-爱恋动漫记录追番按钮
// @version      0.2
// @description  新番页面番剧后添加选项框, 记录自己追的番
// @author       zzxt0019
// @match        https://www.kisssub.org
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    // a[data-balloon-pos="up"] 查询含有番剧名字的标签
    document.querySelectorAll('a[data-balloon-pos="up"]').forEach(element => {
        let checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        // 获取番剧名
        let key = element.innerHTML.trim();
        // checkbox,改变值时存储setValue
        checkbox.checked = GM_getValue(key, false);
        checkbox.onchange = () => {
            GM_setValue(key, !GM_getValue(key, false));
            checkbox.checked = GM_getValue(key);
        }
        // 将checkbox添加到番剧后面
        if (element.nextSibling) {
            element.parentElement.insertBefore(checkbox, element.nextSibling);
        } else {
            element.parentElement.appendChild(checkbox);
        }
    })
})();
