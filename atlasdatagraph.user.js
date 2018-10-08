// ==UserScript==
// @name         Atlas Data Download
// @namespace    https://enopoletus.github.io
// @version      0.78
// @description  Downloads data from U.S. Election Atlas DataGraphs, datatables, and image maps
// @author       E. Harding
// @include      https://uselectionatlas.org/*
// @updateURL    https://enopoletus.github.io/atlasdatagraph.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

//below script is to redirect away from framed version
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
    };
    if (/&f=1/.test(iref) == true && /uselectionatlas/.test(location.href) == true){
      i.setAttribute("href", iref.replace(/&f=1/g,"&f=0"));
    };
    if (/uselectionatlas/.test(location.href) == true && /&f=1/g.test(location.href) == true){
      window.location=location.href.replace(/&f=1/g,"&f=0");
    };
  };
});
//now the data download script begins
window.addEventListener("load",
function createHTML() {
    document.getElementById("google").style.display = "none";
    const x = document.getElementsByClassName("content");
    const h = document.createElement("BUTTON");
    const node = document.createTextNode("Press this button to download CSV");
    h.appendChild(node);
    h.setAttribute("id", "silver");
    h.style.maxWidth="120px";
    for(let i=0; i<4; i++){
    x[0].insertBefore(h, x[0].childNodes[0]);}
})
function download_csv(csv, filename) {
    const csvFile = new Blob([csv], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
function export_graph_to_csv(html, filename) {
  const csv = [];
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
  csv.push(row1.join(",")); //push row one into CSV; join with commas
  //***push vote totals into CSV***
  for (let i = 0; i < rows.length; i++){ //for the number of all rows
    const row = [], cols = rows[i].querySelectorAll("b, .dat"); //separate columns (numbers) within rows
    for (let j = 0; j < cols.length; j++){
      row.push(cols[j].innerText.replace(/,/g,''));}; //push columns into every row
      csv.push(row.join(",")); //join every row with comma and push every row into CSV
  }
  download_csv(csv.join("\n"), filename);
}
function export_map_to_csv(html, filename) {
  const csv = [];
  const themaps = document.querySelectorAll("map");
  const themap = themaps[themaps.length-1];
  const rows = themap.querySelectorAll("area");
  const rowz = rows[0];
  const cndnames=[];
  const row1=[];
  const fipz = rowz.getAttribute("data-fips");
  const col2z = rowz.getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/.+?(?=hr)/)[0].replace(/\D+/g, '');
  if (fipz != null){row1.push("FIPS code")};
  row1.push("Location");
  if (col2z != ""){row1.push("Total Vote")};
//***find out what are the names of the candidates before anything else***
  for (let i=0; i<rows.length; i++){
    const col3_1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").replace(/.+?(?=hr)/, "").replace(/hr \/>/g, '').replace(/%/g, "%,");
    const col3 = col3_1.substr(0, col3_1.lastIndexOf(",")).replace(/<br \/>/g, "").replace(/.+?(?=<\/b>)/, "").replace(/<\/b>/g, '');
    const col3names=col3.replace(/\d+/g, '').replace(/ /g, '').replace(/\./g, '').replace(/,/g, '').split('%');
      for(let i=0; i<col3names.length; i++){
          if(cndnames.indexOf(col3names[i]) < 0 && col3names[i] != ""){ //no duplicates; indexOf should be -1
          cndnames.push(col3names[i]);
          row1.push(col3names[i].replace(/:/g, ''))
          }
      };
  };
  csv.push(row1.join(",")); //push row one into CSV; join with commas
  //***push rows into CSV***
  for (let i=0; i<rows.length; i++){
    const row=[];
    const fips = rows[i].getAttribute("data-fips");
    const col1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/<b>(.*?)<\/b>/)[1].replace(/\\/g, '');
    const col2 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/.+?(?=hr)/)[0].replace(/\D+/g, '');
    const col3_1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").replace(/.+?(?=hr)/, "").replace(/hr \/>/g, '').replace(/%/g, "%,");
    const col3 = col3_1.substr(0, col3_1.lastIndexOf(",")).replace(/<br \/>/g, "").replace(/.+?(?=<\/b>)/, "").replace(/<\/b>/g, '');
    //push first two columns into row
    if (fips != null){row.push(fips)};
    row.push(col1);
    if (col2 != ""){row.push(col2)};
    //check if the candidate name is in the row. if not, then make empty space, if yes, then with number next to candidate name
    for (let j=0; j<cndnames.length; j++){
        const res = new RegExp(cndnames[j],"g")
        if (res.test(col3)==true){
          row.push(col3.split(cndnames[j])[1].split(",")[0].replace(/ /g,""))
        } else {row.push("")
          };
    }
    csv.push(row.join(","));
  };
    const newcsv = [];
    //***below is for removing duplicates***
    for (let i = 0; i < csv.length; i++) {
      if (newcsv.indexOf(csv[i]) < 0) { //i.e., make sure indexof returns -1 because no other instances of the string exist
        newcsv.push(csv[i]);
      }
    }
    download_csv(newcsv.join("\n"), filename);
}
function export_table_to_csv(html, filename){
  const csv=[];
  const datatable=document.getElementById("datatable");
  const thead=datatable.querySelectorAll("thead")[0].querySelectorAll('[role="row"]')[0].querySelectorAll("td");
  const tbody=datatable.querySelectorAll("tbody")[0].querySelectorAll('[role="row"]');
  const tfoot=datatable.querySelectorAll("tfoot")[0].querySelectorAll('[role="row"]')[0].querySelectorAll("td")
  const row1=[];
  const row2=[];
  for (let i=0; i<thead.length; i++){
    const columns= thead[i].getElementsByClassName("tablesorter-header-inner")[0].innerText;
    row1.push(columns.replace(/,/g,'').replace(/\r?\n|\r/g,'').replace(/\u00A0/g, ' '));
  }
  csv.push(row1.join(","));
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
   csv.push(row.join(","))
  }
  for (let i=0; i<tfoot.length; i++){
    const columns= tfoot[i].innerText.replace(/,/g,'').replace(/\r?\n|\r/g,'');
    row2.push(columns.replace(/\u00A0/g, ''))
  }
  csv.push(row2.join(","));
  download_csv(csv.join("\n"), filename);
}
window.addEventListener("load", function button(){
document.querySelector("button").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
    if (document.querySelectorAll("map")[0] != undefined && document.getElementById("datatable") == undefined){export_map_to_csv(html, `${name}.csv`)};
	if (document.querySelectorAll("map")[0]== undefined && document.getElementById("datatable") == undefined) {export_graph_to_csv(html, `${name}.csv`)};
    if (document.getElementById("datatable") != undefined) {export_table_to_csv(html, `${name}.csv`)};
})});
