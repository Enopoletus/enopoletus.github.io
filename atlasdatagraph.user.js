// ==UserScript==
// @name         Atlas Data Download
// @namespace    https://enopoletus.github.io
// @version      0.56
// @description  Downloads data from U.S. Election Atlas DataGraphs
// @author       E. Harding
// @include      https://uselectionatlas.org/*
// @updateURL    https://enopoletus.github.io/atlasdatagraph.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

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
function export_table_to_csv(html, filename) {
	const csv = [];
    const rows = document.getElementsByClassName("info")[0].querySelectorAll("tbody"); //get all rows
    const rowz=rows[0];
    const row1 = [];
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
    //***push vote totals into CSV***
    for (let i=0; i<rows.length; i++){
    const row=[]
    const col1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/<b>(.*?)<\/b>/)[1];
    const col2 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").match(/.+?(?=hr)/)[0].replace(/\D+/g, '');
    const col3_1 = rows[i].getAttribute("onmouseover").match(/\((.*)\)/)[0].replace(/[{()}]/g, "").replace(/.+?(?=hr)/, "").replace(/hr \/>/g, '').replace(/%/g, "%,");
    const col3 = col3_1.substr(0, col3_1.lastIndexOf(",")).replace(/<br \/>/g, "").replace(/.+?(?=<\/b>)/, "").replace(/<\/b>/g, '');
    row.push(col1);
    row.push(col2);
    row.push(col3);
      for (let i=0; i<(row.length/3); i++){ //divided by three because there are three columns.
    csv.push(row.join(","))};
      }
    const newcsv = [];
    //***below is for removing duplicates***
    for (let i = 0; i < csv.length; i++) {
      if (newcsv.indexOf(csv[i]) < 0) { //i.e., make sure indexof returns -1 because no other instances of the string exist
        newcsv.push(csv[i]);
      }
    }
    download_csv(newcsv.join("\n"), filename);
}
window.addEventListener("load", function button(){
document.querySelector("button").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
    if (document.querySelectorAll("map")[0] != undefined){export_map_to_csv(html, `${name}.csv`)};
	if (document.querySelectorAll("map")[0]== undefined) {export_table_to_csv(html, `${name}.csv`)};
})});
