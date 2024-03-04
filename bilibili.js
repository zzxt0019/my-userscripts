// ==UserScript==
// @name         zzxt0019-bilibili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili脚本
// @author       You
// @match        http*://*bilibili*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        dataUrl();  // a标签右键补充href(可以右键打开新页面)
        dataUserId();  // a标签右键补充href(可以右键打开新页面)
        liveNoLeave();  // 直播页长时间未操作提示(自动点击提示)
    }, 1000)

    function dataUrl() {
        let list = document.querySelectorAll('[data-url]:not([href])');
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            element.setAttribute('href', element.getAttribute('data-url'));
        }
    }

    function dataUserId() {
        let list = document.querySelectorAll('[data-user-id]:not([href])');
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            element.setAttribute('href', 'https://space.bilibili.com/' + element.getAttribute('data-user-id'));
        }
    }

    function liveNoLeave() {
        if (document.querySelector('div.prompt button')) {
            let event = new Event('click', {bubbles: true, cancelable: false});
            document.querySelector('div.prompt button').dispatchEvent(event);
        }
    }
})();
