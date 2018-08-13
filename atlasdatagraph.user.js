// ==UserScript==
// @name         Atlas Data Download
// @namespace    https://enopoletus.github.io
// @version      0.1
// @description  Downloads data from U.S. Election Atlas DataGraphs
// @author       E. Harding
// @include      https://uselectionatlas.org/*
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
	const rows = document.getElementsByClassName("info")[0].querySelectorAll("tbody");
    for (let i = 0; i < rows.length; i++) {
		const row = [], cols = rows[i].querySelectorAll("td");
        for (let j = 0; j < cols.length; j++)
        row.push(cols[j].innerText);
		csv.push(row.join(","));
	}
    download_csv(csv.join("\n"), filename);
}
window.addEventListener("load", function button(){
document.querySelector("button").addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
	export_table_to_csv(html, "table.csv");
})});
