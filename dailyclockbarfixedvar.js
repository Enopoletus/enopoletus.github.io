// ==UserScript==
// @name         Daily Progress Bar (fixed position)
// @namespace    https://enopoletus.github.io
// @version      0.5
// @description  Puts a progress bar of the day (between 7 AM and 7 PM) at the bottom of each page you visit
// @author       E. Harding
// @include      *
// @grant        none
// @run-at document-start
// ==/UserScript==
window.addEventListener("load",
function createHTML(){
    var h = document.createElement("DIV");
    h.setAttribute("id", "myProgress");
    h.style.width="100%";
    h.style.height="30px";
    h.style.position="fixed";
    h.style.bottom="0px";
    h.style.backgroundColor="#ddd";
    document.body.appendChild(h);
    var g = document.createElement("DIV");
    g.setAttribute("id", "myBar");
    g.style.width="0%";
    g.style.position="fixed";
    g.style.bottom="0px";
    g.style.height="30px";
    g.style.backgroundColor="#4CAF50";
    h.appendChild(g);
    var id = setInterval(frame, 100);
    function frame() {
    var secondsInADay = 12 * 60 * 60;
    var now = new Date();
    var hours = (now.getHours()-7) * 60 * 60;
    var minutes = now.getMinutes() * 60;
    var seconds = now.getSeconds();
    var totalSeconds = hours + minutes + seconds;
    var percentSeconds = 100 * totalSeconds/secondsInADay;
    if (0>=percentSeconds||99.99<=percentSeconds){h.style.height="0px";}
    else {seconds++;
    g.style.width = percentSeconds +'%';}}});
