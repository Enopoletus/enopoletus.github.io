// ==UserScript==
// @name         Atlas Data Download
// @namespace    https://enopoletus.github.io
// @version      0.25
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
	const rowz = document.getElementsByClassName("info")[0].querySelectorAll("tbody")[0];
    const rows = document.getElementsByClassName("info")[0].querySelectorAll("tbody");
    const row1 = []
    row1.push("County");
	//push candidate names into CSV
    const col1 = rowz.querySelectorAll("tr .cnd")[0];
    const colz = rowz.querySelectorAll("tr");
    row1.push(col1.innerText);
    for (let j = 1; j < colz.length; j++){
        row1.push(colz[j].firstChild.innerText.replace(/,/g,''));
    }
		csv.push(row1.join(","));
	//push vote totals into CSV
    for (let i = 0; i < rows.length; i++) {
		const row = [], cols = rows[i].querySelectorAll("b, .dat");
        for (let j = 0; j < cols.length; j++){
        row.push(cols[j].innerText.replace(/,/g,''));}
		csv.push(row.join(","));
	}
    download_csv(csv.join("\n"), filename);
}
window.addEventListener("load", function button(){
document.querySelector("button").addEventListener("click", function () {
    const html=document.querySelector("table").outerHTML;
    const name=document.querySelectorAll(".header")[0].innerText.replace(/\s/g,'');
	export_table_to_csv(html, `${name}.csv`);
})});
