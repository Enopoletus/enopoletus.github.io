// ==UserScript==
// @name         Recursive Twitter Block
// @namespace    https://enopoletus.github.io
// @version      0.15
// @description  Blocks everyone who liked a certain tweet
// @author       E. Harding
// @include      https://twitter.com/*
// @updateURL    https://enopoletus.github.io/recursiveblock.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

const timeso=[];
timeso.push(0);
const timeso2=[];
timeso2.push(0);
const truefals=[];
window.addEventListener("load", buttoncreate);
window.addEventListener("load", buttonsactivate);
setInterval(buttoncreate, 1200);
setInterval(buttonsactivate, 1201);
function buttoncreate(){
  const blockbuttons=document.getElementsByClassName("block-link js-actionBlock");
  for (let i=0; i<blockbuttons.length; i++){
    if (blockbuttons[i].parentElement.getElementsByClassName("blockAllLikers").length == 0){
      const blockbutton=blockbuttons[i];
      const newnode=document.createElement("li");
      newnode.setAttribute("class", "blockAllLikers");
      newnode.setAttribute("role", "presentation");
      const newblockb=document.createElement("button");
      newblockb.setAttribute("type", "button");
      newblockb.setAttribute("class", "dropdown-link");
      const nbbtxt=document.createTextNode("Block all liking Tweet");
      newblockb.appendChild(nbbtxt);
      newnode.append(newblockb);
      blockbutton.after(newnode);
    };
  };
};
function buttonsactivate(){
  const buttons=document.getElementsByClassName("blockAllLikers")
  for (let i=0; i<buttons.length; i++){
    const tweetidproto=buttons[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    const tweetid=tweetidproto.getAttribute("data-tweet-id");
    buttons[i].addEventListener("click", function(){dowork(tweetid)})
  };
};
function dowork(tweetid){
  const ourtime = new Date().getTime();
  if (ourtime>(timeso2.slice(-1)[0])+700 || truefals.slice(-1)[0] == "t"){
    const thetext=[];
    const currentuser=document.getElementById("current-user-id").value;
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        const usernums=xmlhttp.responseText.match(/data-item-id=\\.*?\\/g).map(el => el.replace(/\D/g,"")).slice(1).filter(function(e) {return e !== currentuser});
        thetext.push(usernums);
        processing(thetext[0], tweetid);
      }
      else if (xmlhttp.status == 400) {console.log('There was an error 400');}
      else {console.log('something else other than 200 was returned');};
      };
    };
  xmlhttp.open("GET", "https://twitter.com/i/activity/favorited_popup?id=".concat(tweetid), true);
  xmlhttp.send();
  timeso2.push(ourtime);
  }
}
function processing(thetext0, tweetid){
  const autok= document.getElementsByName("authenticity_token")[0].value;
  for (let i=0; i<thetext0.length; i++){
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "https://twitter.com/i/user/block", true);
    xmlhttp.setRequestHeader("accept", "application/json, text/javascript, */*; q=0.01");
    xmlhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
    xmlhttp.setRequestHeader("x-twitter-active-user", "yes");
    xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    const formdat= "authenticity_token="+autok+"&challenges_passed=false&handles_challenges=1&user_id="+thetext0[i];
    xmlhttp.send(formdat);
  }
  const ourtime = new Date().getTime();
  if(thetext0.length==0){truefals.push("f")}else{truefals.push("t")};
  if(thetext0.length>0 && ourtime>(timeso.slice(-1)[0])+200){dowork(tweetid); timeso.push(ourtime);};
  console.log(truefals);
  console.log(thetext0.length);
};