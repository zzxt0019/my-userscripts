// ==UserScript==
// @name         zzxt0019-知乎自动关闭首页框
// @version      0.2
// @description  自动关闭知乎首页的"自动前往活动"的框
// @author       zzxt0019
// @match        https://www.zhihu.com/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    let svgs = document.querySelectorAll('.Topstory > :not(.Topstory-container) svg');
    let event = new Event('click', {bubbles: true, cancelable: false})
    for (let i = 0; i < svgs.length; i++) {
        svgs[i].dispatchEvent(event);
    }
})();