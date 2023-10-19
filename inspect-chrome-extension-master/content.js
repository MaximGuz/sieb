//ibasov 01062022 внедряем css и js в страничку siebel
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.runtime.getURL("injected.js");
document.body.appendChild(script);
var style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.runtime.getURL("mts_inspect.css");
document.head.appendChild(style);