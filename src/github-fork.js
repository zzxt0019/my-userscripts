// ==UserScript==
// @name         github-fork页面查看二开项目
// @version      0.1
// @description  github-fork页面查看二开项目
// @author       zzxt0019
// @match        https://github.com/**/network/members
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        let list = document.querySelectorAll('#network .repo a:not([data-hovercard-type="user"]):not([zzxt0019-github-fork])');
        for (let i = 0; i < list.length; i++) {
            let a = list[i];
            a.setAttribute('zzxt0019-github-fork', '');
            fetch(a.href).then(res => {
                res.text().then(text => {
                    let div = document.createElement('div');
                    div.innerHTML = text;
                    let span = document.createElement('span');
                    let positions = div.querySelectorAll('.Box.Box-body a[data-analytics-event]');
                    for (let j = 0; j < positions.length; j++) {
                        let position = positions[j];
                        if (position.innerHTML.includes('ahead')) {
                            let ahead = document.createElement('span');
                            ahead.innerText = position.innerHTML;
                            ahead.style.color = 'green';
                            span.append(ahead);
                        }
                    }
                    a.parentElement.append(span);
                })
            })
        }
    }, 1000);
})();