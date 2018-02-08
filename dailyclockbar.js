// ==UserScript==
// @name         Daily Progress Bar
// @namespace    https://enopoletus.github.io
// @version      0.1
// @description  Puts a progress bar of the day at the bottom of each page you visit
// @author       E. Harding
// @match        https://github.com/enopoletus
// @grant        none
// @run-at document-start
// ==/UserScript==
window.addEventListener("load",
function createHTML() {
    var h = document.createElement("DIV");
    h.setAttribute("id", "myProgress");
    h.style.width="100%";
    h.style.backgroundColor="#ddd";
    document.body.appendChild(h);
    var g = document.createElement("DIV");
    g.setAttribute("id", "myBar");
    g.style.width="0%";
    g.style.height="30px";
    g.style.backgroundColor="#4CAF50";
    h.appendChild(g);
    var secondsInADay = 24 * 60 * 60;
    var now = new Date();
    var hours = now.getHours() * 60 * 60;
    var minutes = now.getMinutes() * 60;
    var seconds = now.getSeconds();
    var totalSeconds = hours + minutes + seconds;
    var percentSeconds = 100 * totalSeconds/secondsInADay;
    var id = setInterval(frame, 1000);
    function frame() {
      seconds++;
      g.style.width = percentSeconds +'%'; }
    });
