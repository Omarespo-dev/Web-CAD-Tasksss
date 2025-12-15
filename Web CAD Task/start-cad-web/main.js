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


// Qui gestisco i pulsanti della toolbar per cambiare le varie forme di disegno
// e per gestire l esportazione del JSON
document.getElementById("rectBtn").addEventListener("click", () => currentTool = "rectangle");
document.getElementById("lineBtn").addEventListener("click", () => currentTool = "line");
document.getElementById("exportJSONBtn").addEventListener("click", () => {
  document.getElementById("output").textContent = JSON.stringify(shapes, null, 2);
});



//Iniziamo ad implementare le Funzioni di Disegno

//Funzione per Disegnare il rettangolo dato in input un oggetto rettangolo e dare in output il disegno effettivo in pixel sulla canvas
function drawRect(ctx, rect) {
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
}

//Funzione per Disegnare la linea 
function drawLine(ctx, line) {

  // inizia un nuovo percorso
  ctx.beginPath()

  //indica il punto di partenza della linea
  ctx.moveTo(line.x1, line.y1)
  //disegna la linea fino al punto finale
  ctx.lineTo(line.x2, line.y2)

  // disegna la linea sul canvas
  ctx.stroke()
}


//Funzione per gestire quale funzione di disegno chiamare in base all oggetto(Forma) che riceviamo in input 
function drawShape(ctx, shape) {

  //Gestiamo la forma che riceviamo in input se e rettangolo la passiamo alla funzione specifica e stessa cosa vale se e una linea
  if (shape.type === "rectangle") {
    drawRect(ctx, shape)
  }else if(shape.type === "line"){
    drawLine(ctx, shape)
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



//Iniziamo a gestire gli eventi del mouse catturati dall utente
//1 Evento al primo click del mouse sulla canvas
canvas.addEventListener("pointerdown", (e) => {

  //verifico se non e selezionato nessun strumento
  if (!currentTool) return

  // prendo la posizione del mouse nella canvas come oggetto
  const cord = getMousePosition(e)

  //aggiorna variabile di stato(sto disegnando)
  isDrawing = true

  // imposto i valori di x e y di partenza della forma
  startX = cord.x
  startY = cord.y

})

//2 Evento movimento mouse dopo aver Cliccato per mostrare la preview
canvas.addEventListener("pointermove", (e) => {

  //se non sta disegnando esci
  if (!isDrawing) return

  //prendo la posizione del mouse nella canvas come oggetto
  const cord = getMousePosition(e)

  //verifico se currentTooll e un rettangolo
  if (currentTool === "rectangle") {
    //prendo l'angolo in alto a sinistra del rettangolo, indipendentemente dalla direzione del drag
    const x = Math.min(startX, cord.x)
    const y = Math.min(startY, cord.y)

    //calcolo larghezza e altezza come distanza dal punto iniziale
    const width = Math.abs(cord.x - startX)
    const height = Math.abs(cord.y - startY)

    //Salviamo la forma temporanea della preview
    tempShape = { type: "rectangle", x, y, width, height }
  }

  //verifico se currentTool e una linea
  if (currentTool === "line") {

    //salviamo la forma temporanea nella preview
    tempShape = { type: "line", x1: startX, y1: startY, x2: cord.x, y2: cord.y }
  }


  //ridisegno tutta la canvas per mostrare la preview aggiornata
  render()

  //Debug per vedere l oggetto preview in tempo reale
  console.log(tempShape);
})



//3 Evento per catturare il momento in cui stacchiamo il mouse
canvas.addEventListener("pointerup", () => {

  //verifico se non si sta disegnado
  if (!isDrawing) return

  //Impostiamo la variabile isDrawing a false perche in questo caso stiamo rilasciando il mouse per salavare quella forma
  isDrawing = false

  //Verifico se esiste una preview la pusho nell arr shapes
  if (tempShape) {
    shapes.push(tempShape)
  }

  //svuotiamo la preview
  tempShape = null

  //Ridisegnamo la canvas per per mostrare lo stato finale senza preview 
  render()

  //Debug per vedere oggetto pushano
  console.log(shapes);

})





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
