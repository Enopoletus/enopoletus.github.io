// ==UserScript==
// @name         Results replacement
// @namespace    https://enopoletus.github.io
// @version      0.31
// @description  Replaces link to framed version with no-frame version of page on uselectionatlas.org
// @author       E. Harding
// @include      *
// @updateURL    https://enopoletus.github.io/atlasnoframes.user.js
// @grant        none
// @run-at document-start
// ==/UserScript==

window.addEventListener("load", function overwrites(){
const x = document.getElementsByTagName("a");
for (let i of x) {
  const iref=i.getAttribute("href");
  if (iref == "RESULTS/") {
  i.setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");
  };
  if (iref == "https://uselectionatlas.org/RESULTS/") {
  i.setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");
  };
  if (iref == "http://uselectionatlas.org/RESULTS/") {
  i.setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");
  };
  if (/uselectionatlas/.test(iref) == true){
     i.setAttribute("href", iref.replace(/&f=1/g,"&f=0"));
     }
  if (/&f=1/.test(iref) == true && /uselectionatlas/.test(location.href) == true){
     i.setAttribute("href", iref.replace(/&f=1/g,"&f=0"));
     }
  if (/uselectionatlas/.test(location.href) == true && /&f=1/g.test(location.href) == true){
     window.location=location.href.replace(/&f=1/g,"&f=0");
     }
  };
 });
