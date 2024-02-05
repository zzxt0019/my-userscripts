// ==UserScript==
// @name         zzxt0019-知乎首页关闭盐选
// @version      0.3
// @description  知乎首页关闭盐选 点开如果有盐选标识就不显示
// @author       zzxt0019
// @match        https://www.zhihu.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    const UserscriptId = 'zzxt0019-zhihu-yanxuan';
    const DisplayKey = UserscriptId + '-display';
    let style = document.createElement('style');
    style.innerHTML = `
    .${DisplayKey} {
      display: none !important;
    }`;
    document.body.append(style);

    let click = new Event('click', {bubbles: true, cancelable: false});

    let observer = new MutationObserver(() => {
        init();
    });
    observer.observe(document, {childList: true, subtree: true, attributes: true});

    function init() {
        let articles = document.querySelectorAll([
            `div.Card.TopstoryItem:not([${UserscriptId}])`,  // 首页
            `div.Card.SearchResult-Card:not([${UserscriptId}])`,  // 搜索页
        ].join(','));
        for (let i = 0; i < articles.length; i++) {
            let article = articles[i];
            article.setAttribute(UserscriptId, '');
            article.classList.add(DisplayKey);
            let buttonMore = article.querySelector('button.ContentItem-more');
            buttonMore.dispatchEvent(click);
            let interval = setTimeout(() => {
                let buttonBack = article.querySelector('button .RichContent-collapsedText');
                if (buttonBack != null) {
                    clearInterval(interval);
                    if (article.querySelector('.KfeCollection-AnswerTopCard-Container') == null) {  // 不是盐选
                        article.classList.remove(DisplayKey);
                    }
                    buttonBack.dispatchEvent(click);
                }
            }, 100);
        }
    }
})();