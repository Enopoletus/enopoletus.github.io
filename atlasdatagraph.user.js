// ==UserScript==
// @name         Atlas Data download
// @namespace    https://enopoletus.github.io
// @version      3.85
// @description  downloads data from U.S. Election Atlas DataGraphs, datatables, and image maps
// @author       E. Harding
// @include      https://uselectionatlas.org/*
// @include      https://web.archive.org/*
// @updateURL    https://enopoletus.github.io/atlasdatagraph.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

//document.write out malicious scripts on page (for the next 30 lines)
document.write('<style type="text/undefined">');
document.getElementsByTagName("html")[0].remove();
document.close();
const thetext = [];
const xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == XMLHttpRequest.DONE) {
  if (xmlhttp.status == 200) {thetext.push(xmlhttp.responseText); postload()}
    else if (xmlhttp.status == 400) {console.log('There was an error 400');}
    else {console.log('something else other than 200 was returned');};
  };
};
xmlhttp.open("GET", location.href, true);
xmlhttp.send();
function postload(){
  thetext[0]=thetext[0].replace(/eval\(/g,"//eval(");
  document.write(thetext[0]);
  document.close();
  if (/uselectionatlas/.test(location.href) == true && /&f=1/g.test(location.href) == true){
    window.location=location.href.replace(/&f=1/g,"&f=0");
  };
  if (location.href == "https://uselectionatlas.org/RESULTS/"){
    window.location="https://uselectionatlas.org/RESULTS/national.php?year=2016&f=0&off=0&elect=0";
  };
  setTimeout(createHTML3,348);
  setTimeout(createHTML2,349);
  setTimeout(createHTML,350);
  setTimeout(overwrites,370);
  setTimeout(buttons,400);
};
//below script is to redirect links away from framed version (for next 20 lines). probably unnecessary, but whatevs
function overwrites(){
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
    };
    if (/&f=1/.test(iref) == true && /uselectionatlas/.test(location.href) == true){
      i.setAttribute("href", iref.replace(/&f=1/g,"&f=0"));
    };
  };
};
//now the data download script begins
function createHTML(){
  if(document.querySelectorAll('[id^=datatable]')[0] != undefined ||
     document.querySelectorAll("map")[0] != undefined ||
     document.getElementsByClassName("info")[0].querySelectorAll("tbody") !=undefined
  ){
    document.getElementById("google").style.display = "none";
    const x = document.getElementsByClassName("content");
    const h = document.createElement("BUTTON");
    const node = document.createTextNode("Get data from this page only (no Internet required)");
    h.appendChild(node);
    h.setAttribute("id", "silver");
    h.style.maxWidth="120px";
    for(let i=0; i<4; i++){x[0].insertBefore(h, x[0].childNodes[0]);}
  };
};
function createHTML2(){
  if(document.querySelectorAll('[id^=datatable]')[0] != undefined ||
     document.querySelectorAll("map")[0] != undefined ||
     document.getElementsByClassName("info")[0].querySelectorAll("tbody") != undefined
  ){
    document.getElementById("google").style.display = "none";
    const x = document.getElementsByClassName("content");
    const h = document.createElement("BUTTON");
    const node = document.createTextNode("Get data recursively from image maps (Internet required)");
    h.appendChild(node);
    h.setAttribute("id", "gold");
    h.style.maxWidth="120px";
    for(let i=0; i<4; i++){x[0].insertBefore(h, x[0].childNodes[0]);}
  };
};
function createHTML3(){
  if(document.querySelectorAll("map")[0] != undefined ||
     document.getElementsByClassName("info")[0].querySelectorAll("tbody") != undefined
  ){
    document.getElementById("google").style.display = "none";
    const x = document.getElementsByClassName("content");
    const h = document.createElement("BUTTON");
    const node = document.createTextNode("Get data from county/state pages via image map links (Internet required)");
    h.appendChild(node);
    h.setAttribute("id", "platinum");
    h.style.maxWidth="120px";
    for(let i=0; i<4; i++){x[0].insertBefore(h, x[0].childNodes[0]);}
  };
};
function download_csv66(csv66, filename) {
  const csv66File = new Blob([csv66], {type: "text/csv"});
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csv66File);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
function export_graph_to_csv66(html, filename) {
  const csv66 = [];
  const rows = document.getElementsByClassName("info")[0].querySelectorAll("tbody"); //get all rows
  const rowz=rows[0];
  const row1 = [];
  //***create first row***
  row1.push("County");
  const col1 = rowz.querySelectorAll("tr .cnd")[0]; //get first candidate name
  row1.push(col1.innerText); //push first candidate name into first row
  const colz = rowz.querySelectorAll("tr"); //other candidates' names
  for (let j = 1; j < colz.length; j++){ //for all other candidate names
    row1.push(colz[j].firstChild.innerText.replace(/,/g,'')); //push them into first row.
  }
  csv66.push(row1.join(",")); //push row one into csv66; join with commas
  //***push vote totals into csv66***
  if (rowz.querySelectorAll(".dat").length > 1){
    for (let i = 0; i < rows.length; i++){ //for the number of all rows
      const row = [], cols = rows[i].querySelectorAll("b, .dat"); //separate columns (numbers) within rows
      for (let j = 0; j < cols.length; j++){row.push(cols[j].innerText.replace(/,/g,''));}; //push cols into every row
        csv66.push(row.join(",")); //join every row with comma and push every row into csv66
    };
  };
  if (rowz.querySelectorAll(".dat").length < 1){
    for (let i = 0; i < rows.length; i++){ //for the number of all rows
      const row = [], cols = rows[i].querySelectorAll("b, .per"); //separate columns (numbers) within rows
      for (let j = 0; j < cols.length; j++){
        row.push(cols[j].innerText.replace(/,/g,''));}; //push columns into every row
        csv66.push(row.join(",")); //join every row with comma and push every row into csv66
    };
  };
  download_csv66(csv66.join("\n"), filename);
}
function export_map_to_csv66(html, filename) {
  const csv66 = [];
  const themaps = document.querySelectorAll("map");
  const themap = themaps[themaps.length-1];
  const rows = themap.querySelectorAll("area");
  const rowz = rows[0];
  const cndnames=[];
  const row1=[];
  const fipz = rowz.getAttribute("href").split("fips=")[1].split("&")[0];
  const townfipz = rowz.getAttribute("href").split("townfips=")[1].split("&")[0];
  const col2z = rowz.getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/.+?(?=<hr \/>)/)[0].replace(/\D+/g, '');
  row1.push("FIPS");
  if (townfipz != undefined){row1.push("TownFIPS")};
  row1.push("Location");
  if (col2z != ""){row1.push("Total Vote")};
//***find out what are the names of the candidates before anything else***
  for (let i=0; i<rows.length; i++){
    const col3_1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").replace(/.+?(?=<hr \/>)/, "").replace(/hr \/>/g, '').replace(/%/g, "%,");
    const col3 = col3_1.substr(0, col3_1.lastIndexOf(",")).replace(/<br \/>/g, "").replace(/.+?(?=<\/b>)/, "").replace(/<\/b>/g, '');
    const col3names=col3.replace(/\d+/g, '').replace(/ /g, '').replace(/\./g, '').replace(/,/g, '').replace(/</g,'').split('%');
      for(let i=0; i<col3names.length; i++){
          if(cndnames.indexOf(col3names[i]) < 0 && col3names[i] != ""){ //no duplicates; indexOf should be -1
            cndnames.push(col3names[i]);
            row1.push(col3names[i].replace(/:/g, ''))
          }
      };
  };
  csv66.push(row1.join(",")); //push row one into csv66; join with commas
  //***push rows into csv66***
  for (let i=0; i<rows.length; i++){
    const row=[];
    const fips = rows[i].getAttribute("href").split("fips=")[1].split("&")[0];
    const townfips = rows[i].getAttribute("href").split("townfips=")[1].split("&")[0];
    const col1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/<b>(.*?)<\/b>/)[1].replace(/\\/g, '');
    const col2 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/.+?(?=<hr \/>)/)[0].replace(/\D+/g, '');
    const col3_1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").replace(/.+?(?=<hr \/>)/, "").replace(/hr \/>/g, '').replace(/%/g, "%,");
    const col3 = col3_1.substr(0, col3_1.lastIndexOf(",")).replace(/<br \/>/g, "").replace(/.+?(?=<\/b>)/, "").replace(/<\/b>/g, '');
    //push first two columns into row
    row.push(fips);
    if (townfips != null){row.push(townfips)};
    row.push(col1);
    if (col2 != ""){row.push(col2)};
    //check if the candidate name is in the row. if not, then make empty space, if yes, then with number next to candidate name
    for (let j=0; j<cndnames.length; j++){
      const res = new RegExp(cndnames[j],"g")
      if (res.test(col3)==true){
        row.push(col3.split(cndnames[j])[1].split(",")[0].replace(/ /g,""))
      } else {row.push("")
        };
    };
    csv66.push(row.join(","));
  };
  const newcsv66 = [];
  //***below is for removing duplicates***
  for (let i = 0; i < csv66.length; i++) {
    if (newcsv66.indexOf(csv66[i]) < 0) { //i.e., make sure indexof returns -1 because no other instances of the string exist
      newcsv66.push(csv66[i]);
    };
  };
  download_csv66(newcsv66.join("\n"), filename);
}
function export_maps_to_csv66(html, filename){
}
function export_ctpages_to_csv66(html, filename) {
  const ctpages = [];
  const themaps = document.querySelectorAll("map");
  const themap = themaps[themaps.length-1];
  const rows = themap.querySelectorAll("area");
  const ctnames=[];
  //this part gets the county pages and pushes them into the ctpages array
  for (let i=0; i<rows.length; i++){
   const linksvar=rows[i].getAttribute("href");
   const xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
     if (xmlhttp.readyState == XMLHttpRequest.DONE) {
       if (xmlhttp.status == 200) {ctpages.push(xmlhttp.responseText); if (ctpages.length==rows.length){postweb()};}
         else if (xmlhttp.status == 400) {console.log('There was an error 400');}
         else {console.log('something else other than 200 was returned');};
      };
    };
     xmlhttp.open("GET", linksvar, true);
     xmlhttp.send();
  };
  function postweb(){
    const csv66=[];
    const cndnames=[];
    const row1=[];
    const cupages=[];
    const locnames=[];
    const fipss=[];
    row1.push("FIPS");
    row1.push("Location");
    //***find out what are the names of the candidates before anything else***
    for (let i=0; i<ctpages.length; i++){
      const parser=new DOMParser();
      const htmlDoc=parser.parseFromString(ctpages[i], "text/html");
      const statetitle=htmlDoc.getElementsByTagName("head")[0].getElementsByTagName("title")[0].innerText.split("- ")[1];
      const countytitle=htmlDoc.getElementsByClassName("header")[0].innerText.split("- ")[1];
      if (countytitle != undefined){locnames.push(countytitle.replace(/,/g,':'))}else{locnames.push(statetitle)};
      const rowsl=htmlDoc.querySelectorAll("#goods")[0].querySelectorAll(".result")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
      cupages.push(rowsl);
      const rowslf=htmlDoc.querySelectorAll("#goods")[0].getElementsByTagName("a")[htmlDoc.querySelectorAll("#goods")[0].getElementsByTagName("a").length-1].href.split("fips=")[1].split("&")[0];
      fipss.push(rowslf);
      for (let i=0; i<rowsl.length; i++){
        const votenames=rowsl[i].getElementsByTagName("td")[1].innerText.replace(/[(+)]/g, '');;
        if(cndnames.indexOf(votenames) < 0){ //remove duplicates
          cndnames.push(votenames);
          row1.push(votenames);
        };
      };
    };
    csv66.push(row1);
    //***push rows into csv66***
    for (let i=0; i<cupages.length; i++){
      const row=[];
      row.push(fipss[i]);
      row.push(locnames[i]);
      const cands=cupages[i];
      for (let i=0; i<cndnames.length; i++){
        const match=[];
        const cndnamez=cndnames[i]
        for (let i=0; i<cands.length; i++){
          const cand=cands[i];
          if (cand.getElementsByTagName("td")[1].innerText.replace(/[(+)]/g, '')==cndnamez)
          {row.push(cand.getElementsByTagName("td")[4].innerText.replace(/,/g, '')); match.push('t');};
        };
        if (match.length==0){row.push('')}
      };
    csv66.push(row.join(","));
    };
    const newcsv66 = [];
    //***below is for removing duplicates***
    for (let i = 0; i < csv66.length; i++) {
      if (newcsv66.indexOf(csv66[i]) < 0) { //i.e., make sure indexof returns -1 because no other instances of the string exist
        newcsv66.push(csv66[i]);
      };
    };
  download_csv66(newcsv66.join("\n"), filename);
  };
};
function export_table_to_csv66(html, filename){
  const csv66=[];
  const datatable=document.querySelectorAll('[id^=datatable]')[0];
  const thead=datatable.querySelectorAll("thead")[0].querySelectorAll('[role="row"]')[0].querySelectorAll("td");
  const tbody=datatable.querySelectorAll("tbody")[0].querySelectorAll('[role="row"]');
  const row1=[];
  const row2=[];
  for (let i=0; i<thead.length; i++){
    const columns= thead[i].getElementsByClassName("tablesorter-header-inner")[0].innerText;
    row1.push(columns.replace(/,/g,'').replace(/\r?\n|\r/g,'').replace(/\u00A0/g, ' '));
  }
  csv66.push(row1.join(","));
  for (let i=0; i<tbody.length; i++){
    const row=[];
    const columns= tbody[i].querySelectorAll("td")
    for (let i=0; i<columns.length; i++){
      if (columns[i].innerText == null){
        row.push(columns[i].replace(/,/g,'').replace(/\r?\n|\r/g,'').replace(/\u00A0/g, ''));
      }
      if (columns[i].innerText != null){
        row.push(columns[i].innerText.replace(/,/g,'').replace(/\r?\n|\r/g,'').replace(/\u00A0/g, ''));
      }
    }
   csv66.push(row.join(","))
  }
  if (document.querySelectorAll("tfoot")[0] != undefined){
    const tfoot=datatable.querySelectorAll("tfoot")[0].querySelectorAll('[role="row"]')[0].querySelectorAll("td");
    for (let i=0; i<tfoot.length; i++){
      const columns= tfoot[i].innerText.replace(/,/g,'').replace(/\r?\n|\r/g,'');
      row2.push(columns.replace(/\u00A0/g, ''))
    }
  };
  csv66.push(row2.join(","));
  download_csv66(csv66.join("\n"), filename);
}
function buttons(){
  document.getElementById("silver").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
    if (document.querySelectorAll("map")[0] != undefined && document.querySelectorAll('[id^=datatable]')[0] == undefined){export_map_to_csv66(html, `${name}.csv`)};
    if (document.querySelectorAll("map")[0]== undefined && document.querySelectorAll('[id^=datatable]')[0] == undefined) {export_graph_to_csv66(html, `${name}.csv`)};
    if (document.querySelectorAll('[id^=datatable]')[0] != undefined) {export_table_to_csv66(html, `${name}.csv`)};
  })
  document.getElementById("gold").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
  })
  document.getElementById("platinum").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
    export_ctpages_to_csv66(html, `${name}.csv`);
  })
};
