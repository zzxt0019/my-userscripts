// ==UserScript==
// @name         zzxt0019-爱恋动漫记录追番记录按钮
// @version      0.5
// @description  新番页面番剧后添加选项框, 记录自己追的番
// @author       zzxt0019
// @match        https://www.kisssub.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...

    // 计数框的id
    const id = 'zzxt0019-kisssub-follow';
    // 样式标签的id
    const styleId = id + '-style';
    // 油猴菜单id
    let menuId;
    // 显示样式的css
    const showCss = `
          input.${id} {
              height: ${GM_getValue('style.height', 15)}px;
              width: ${GM_getValue('style.width', 30)}px;
          }
    `
    // 隐藏样式的css
    const hideCss = `
          input.${id} {
              height: ${GM_getValue('style.height', 15)}px;
              width: ${GM_getValue('style.width', 30)}px;
              display: none;
          }
    `

    createUpdateSizeMenu();  // 设置计数框的宽度和高度
    createHideMenu();  // 创建隐藏/显示菜单
    createStyle();  // 创建初始的样式标签
    createElement();  // 创建计数框

    /**
     * 创建更改尺寸的菜单
     */
    function createUpdateSizeMenu() {
        GM_registerMenuCommand('设置宽度', () => {
            let width = prompt("设置宽度(px)", GM_getValue('style.width', 30));
            if (width) {
                GM_setValue('style.width', width);
            }
            updateSize();
        })
        GM_registerMenuCommand('设置高度', () => {
            let height = prompt("设置高度(px)", GM_getValue('style.height', 15));
            if (height) {
                GM_setValue('style.height', height);
            }
            updateSize();
        })
    }

    /**
     * 创建隐藏菜单(隐藏计数的input输入框)
     */
    function createHideMenu() {
        menuId = GM_registerMenuCommand('隐藏', () => {
            updateSize(false);
        });
    }

    /**
     * 创建显示菜单(显示计数的input输入框)
     */
    function createShowMenu() {
        menuId = GM_registerMenuCommand('显示', () => {
            updateSize();
        })
    }

    /**
     * 创建样式标签
     */
    function createStyle() {
        let style = document.createElement('style');
        style.id = styleId;
        document.body.append(style);
        updateSize();
    }

    /**
     * 更新样式内容(尺寸和显示状态)
     */
    function updateSize(show = true) {
        // 样式改为显示/隐藏
        document.getElementById(styleId).innerHTML = show ? showCss : hideCss;
        // 取消显示/隐藏菜单
        GM_unregisterMenuCommand(menuId);
        // 创建隐藏/显示菜单
        show ? createHideMenu() : createShowMenu();
    }

    /**
     * 创建计数标签
     */
    function createElement() {
        // a[data-balloon-pos="up"] 查询含有番剧名字的标签
        document.querySelectorAll('a[data-balloon-pos="up"]').forEach(element => {
            let input = document.createElement("input");
            input.type = 'number';
            input.classList.add(id);

            // 获取番剧名, key = anime.番名
            let key = 'anime.' + element.innerHTML.trim();
            // input, 改变值时存储setValue
            input.value = GM_getValue(key, null);
            // 没有标记的变透明
            input.style.opacity = input.value ? 1 : 0.3;
            input.onchange = () => {
                GM_setValue(key, input.value);
                // 没有标记的变透明
                input.style.opacity = input.value ? 1 : 0.3;
            }
            // 将input添加到番剧后面
            if (element.nextSibling) {
                element.parentElement.insertBefore(input, element.nextSibling);
            } else {
                element.parentElement.appendChild(input);
            }
        })
    }
})();
