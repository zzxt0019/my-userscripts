// ==UserScript==
// @name         zzxt0019-爱恋动漫记录追番按钮
// @version      0.3
// @description  新番页面番剧后添加选项框, 记录自己追的番
// @author       zzxt0019
// @match        https://www.kisssub.org
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    const id = 'zzxt0019-kisssub-follow';
    // 样式
    let style = document.createElement('style');
    style.innerHTML = `
          input.${id} {
              height: 15px;
              width: 30px;
          }
          `;
    document.body.append(style);

    // a[data-balloon-pos="up"] 查询含有番剧名字的标签
    document.querySelectorAll('a[data-balloon-pos="up"]').forEach(element => {
        let input = document.createElement("input");

        input.type = 'number';
        // 获取番剧名
        let key = element.innerHTML.trim();
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
