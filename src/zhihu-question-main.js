// ==UserScript==
// @name         zzxt0019-知乎问题页隐藏标题
// @version      0.2
// @description  知乎问题页隐藏标题
// @author       zzxt0019
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    const UserscriptId = 'zzxt0019-zhihu-question-main';
    const DisplayKey = UserscriptId + '-display';
    let style = document.createElement('style');
    style.innerHTML = `
    .${DisplayKey} {
      display: none !important;
    }`;
    document.body.append(style);

    let observer = new MutationObserver(() => {
        init();
    });
    observer.observe(document, {childList: true, subtree: true, attributes: true});

    function init() {
        let list = document.querySelectorAll(`.QuestionHeader-main:not([${UserscriptId}])`);
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            item.setAttribute(UserscriptId, '');
            item.classList.add(DisplayKey);
        }
    }

})();
