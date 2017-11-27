// ==UserScript==
// @name         Results replacement
// @namespace    https://enopoletus.github.io
// @version      0.1
// @description  Replaces link to framed version with no-frame version of page on uselectionatlas.org
// @author       You
// @include      *
// @grant        none
// @run-at document-start
// ==/UserScript==

window.addEventListener("load", function overwrites(){var x = document.getElementsByTagName("a");
for (i=0;i<x.length;++i) {
  if (x[i].getAttribute("href") == "RESULTS/") {
x[i].setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");}}
var q = document.getElementsByTagName("a");
for (i=0;i<q.length;++i) {
  if (q[i].getAttribute("href") == "https://uselectionatlas.org/RESULTS/") {
q[i].setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");}}
var u = document.getElementsByTagName("a");
for (i=0;i<u.length;++i) {
  if (u[i].getAttribute("href") == "http://uselectionatlas.org/RESULTS/") {
u[i].setAttribute("href", "https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0");}}
                                   };)
