// ==UserScript==
// @name         bilibili a标签没有href了?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不能右键+T在新标签页打开链接?
// @author       You
// @match        https://www.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        dataUrl();
        dataUserId();
    },1000)
    function dataUrl(){
        let list = document.querySelectorAll('[data-url]:not([href])');
        for(let i = 0;i<list.length;i++){
            let element = list[i];
            element.setAttribute('href',element.getAttribute('data-url'));
        }
    }
    function dataUserId(){
        let list = document.querySelectorAll('[data-user-id]:not([href])');
        for(let i=0;i<list.length;i++){
            let element = list[i];
            element.setAttribute('href','https://space.bilibili.com/'+element.getAttribute('data-user-id'));
        }
    }
})();
