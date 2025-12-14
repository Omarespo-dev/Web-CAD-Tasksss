//Ricaviamoci il tag canvas dall Html e prendiamo il context per avere gli strumenti per gestire la canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Stato principale dove contengono tutte le forme come oggetti
let shapes = [];



document.getElementById("rectBtn").addEventListener("click", () => currentTool = "rectangle");
document.getElementById("lineBtn").addEventListener("click", () => currentTool = "line");
document.getElementById("exportJSONBtn").addEventListener("click", () => {
  document.getElementById("output").textContent = JSON.stringify(shapes, null, 2);
});





// Esportazione DXF
document.getElementById("exportDXFBtn").addEventListener("click", () => {

  /** genera file DXF */


  /** scarica file DXF*/

});







// Scrivere la logica per:
// 1. Disegnare forme sul canvas
// 2. Selezionare e spostare forme già disegnate
// 3. Aggiornare il canvas in modo dinamico
// 4. Salvare le forme in `shapes` con le proprietà necessarie
// 4. Generare ed esportare il file del disegno in formato DXF
