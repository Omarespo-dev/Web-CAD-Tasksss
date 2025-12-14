//Ricaviamoci il tag canvas dall Html e prendiamo il context per avere gli strumenti per gestire la canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Stato principale dove contengono tutte le forme come oggetti
let shapes = [];


//Queste variabili di stato invece gestiscono cosa sta facendo L'utente
let currentTool = null;
let isDrawing = false;
let startX = 0;
let startY = 0;
let tempShape = null;


//Iniziamo ad implementare le Funzioni di Disegno

//Funzione per Disegnare il rettangolo dato in input un oggetto rettangolo e dare in output il disegno effettivo in pixel sulla canvas
function drawRect(ctx, rect) {
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
}


//Funzione per gestire quale funzione di disegno chiamare in base all oggetto(Forma) che riceviamo in input 
function drawShape(ctx, shape) {

  //Gestiamo la forma che riceviamo in input se e rettangolo la passiamo alla funzione specifica
  if (shape.type === "rectangle") {
    drawRect(ctx, shape)
  }

}


//Funzione per Disegnare la preview mentre stiamo trascinando col mouse
function drawPreview(ctx, shape) {

  // Impostiamo lo stile grafico per la preview
  ctx.save()
  ctx.setLineDash([6, 4])
  ctx.strokeStyle = "gray"

  //Invochiamo la funzione drawShape che sa gia quale forma disegnare
  drawShape(ctx, shape)

  //ripristino lo stato grafico 
  ctx.restore()

}

//Funzione Render per mostrare i Disegni sulla canvas
function render() {

  // Puliamo la canvas perché ogni aggiornamento richiede di ridisegnare tutto da zero
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  //Disegnamo tutte le forme che stanno nello stato shapes ciclando
  //e passando ogni singolo oggetto alla funzione drawShape
  for (let i = 0; i < shapes.length; i++) {
    drawShape(ctx, shapes[i])
  }


  //Condizione per gestire la forma temporanea(preview)
  if (tempShape) {
    drawPreview(ctx, tempShape)
  }
  
}


//Funzione per gestire le coordinate del mouse sulla canvas attraverso l evento del mouse
function getMousePosition(e) {

  //Questo metodo mi dice dove sta la canvas
  const rect = canvas.getBoundingClientRect()

  //ritorna un oggetto con le coordinate del mouse relative alla canvas
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

}






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
