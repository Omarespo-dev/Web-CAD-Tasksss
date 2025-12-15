
// ===============================
// SETUP CANVAS
// ===============================

//Ricaviamoci il tag canvas dall Html e prendiamo il context per avere gli strumenti per gestire la canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");



// ===============================
// STATO APPLICAZIONE
// ===============================

//Stato principale dove contengono tutte le forme come oggetti
let shapes = [];


//Queste variabili di stato invece gestiscono cosa sta facendo L'utente
let currentTool = null;
let isDrawing = false;
let startX = 0;
let startY = 0;
let tempShape = null;


//Aggiunta delle variabili di stato per gestire selezione e spostamento delle forme
let selectedShape = null
let isDragging = false
let lastX = 0
let lastY = 0



// ===============================
// TOOLBAR / UI
// ===============================

// Qui gestisco i pulsanti della toolbar per cambiare le varie forme di disegno
// e per gestire l esportazione del JSON
document.getElementById("rectBtn").addEventListener("click", () => currentTool = "rectangle");
document.getElementById("lineBtn").addEventListener("click", () => currentTool = "line");
document.getElementById("exportJSONBtn").addEventListener("click", () => {
  document.getElementById("output").textContent = JSON.stringify(shapes, null, 2);
});



// ===============================
// FUNZIONI DI DISEGNO
// ===============================

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

  //salva lo stato grafico attuale della canvas
  ctx.save()

  // evidenzio la forma selezionata
  //verifica se questa shape è quella selezionata
  if (shape === selectedShape) {
    ctx.strokeStyle = "dodgerblue";
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
  }


  //Gestiamo la forma che riceviamo in input se e rettangolo la passiamo alla funzione specifica e stessa cosa vale se e una linea
  if (shape.type === "rectangle") {
    drawRect(ctx, shape)
  } else if (shape.type === "line") {
    drawLine(ctx, shape)
  }

  //ripristina lo stile precedente
  ctx.restore()

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

// ===============================
// HIT TEST E SELEZIONE
// ===============================


//Funzione per capire se un punto(mouse) e dentro un rettangolo
function hitRect(rect, px, py) {

  //ritorna true se tutte le condizioni sono vere
  return (
    //il mouse è tra il lato sinistro e destro
    px >= rect.x &&
    px <= rect.x + rect.width &&

    //il mouse è tra il lato alto e basso
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}

//Funzione per calcolare la distanza minima tra il punto del mouse e il segmento della linea , serve per essere precisi nel selezionare la linea
function distancePointToSegment(px, py, x1, y1, x2, y2) {

  //differenza tra inizio e fine linea
  const dx = x2 - x1;
  const dy = y2 - y1;

  //lunghezza della linea (al quadrato)
  const len2 = dx * dx + dy * dy;

  //se la linea è solo un punto
  if (len2 === 0) return Math.hypot(px - x1, py - y1);

  //calcola il punto della linea più vicino al mouse
  let t = ((px - x1) * dx + (py - y1) * dy) / len2;

  //limita il punto dentro la linea
  t = Math.max(0, Math.min(1, t));

  //coordinate del punto più vicino
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  //distanza finale mouse - linea
  return Math.hypot(px - projX, py - projY);
}


//Funzione per capire se un punto e dentro la linea 
function hitLine(line, px, py, tolerance = 6) {

  //Calcolo la distanza minima tra il punto del mouse e il segmento della linea
  const d = distancePointToSegment(px, py, line.x1, line.y1, line.x2, line.y2);

  //se la distanza è piccola abbastanza, la linea è selezionata
  return d <= tolerance;
}



//Funzione che scorre shapes per trovare la forma cliccata dal mouse
function getShapeAt(px, py) {

  //controlla le forme partendo dall'ultima disegnata
  for (let i = shapes.length - 1; i >= 0; i--) {
    const s = shapes[i];

    //se è un rettangolo e il mouse è dentro ritorna rettangolo
    if (s.type === "rectangle" && hitRect(s, px, py)) return s;

    // se è una linea e il mouse è vicino ritorna linea
    if (s.type === "line" && hitLine(s, px, py)) return s;
  }

  //nessuna forma trovata
  return null;
}


// ===============================
// SPOSTAMENTO DELLE FORME
// ===============================

//Questa funzione serve a spostare una forma sullo schermo => shape = la forma da spostare (rettangolo o linea)
// dx = quanto il mouse si è spostato in orizzontale
// dy = quanto il mouse si è spostato in verticale
function moveShape(shape, dx, dy) {

  //se la forma è un rettangolo
  if (shape.type === "rectangle") {

    //sposto il rettangolo a destra/sinistra
    shape.x = shape.x + dx;

    //sposto il rettangolo in alto/basso
    shape.y = shape.y + dy;
  }

  // ALTRIMENTI se la forma è una linea
  else if (shape.type === "line") {

    //sposto il punto di inizio della linea
    shape.x1 = shape.x1 + dx;
    shape.y1 = shape.y1 + dy;

    //sposto il punto di fine della linea
    shape.x2 = shape.x2 + dx;
    shape.y2 = shape.y2 + dy;
  }
}

// ===============================
// EVENTI CANVAS
// ==============================

//Iniziamo a gestire gli eventi del mouse catturati dall utente
//1 Evento al primo click del mouse sulla canvas
canvas.addEventListener("pointerdown", (e) => {

  // prendo la posizione del mouse nella canvas come oggetto
  const cord = getMousePosition(e)

  // 1) prima provo a selezionare una shape già disegnata
  const hit = getShapeAt(cord.x, cord.y);

  //Se il click colpisce una forma
  if (hit) {
    // imposto la forma come selezionata
    selectedShape = hit;

    //attivo la modalità trascinamento (drag)
    isDragging = true;

    //salvo la posizione iniziale del mouse: mi serve per calcolare dx e dy
    lastX = cord.x;
    lastY = cord.y;

    // aggiorno la canvas per mostrare l’evidenziazione
    render();

    //esco non devo iniziare il disegno
    return;
  }

  //Se il click è su una zona vuota rimuovo la selezione
  selectedShape = null;

  // 2) Se non è attivo nessun tool di disegno,
  //non posso iniziare a disegnare
  if (!currentTool) {

    // aggiorno la canvas per rimuovere l’evidenziazione
    render();

    return;
  }

  //3) se ho un tool attivo e ho cliccato sul vuoto, inizio il disegno

  //aggiorna variabile di stato(sto disegnando)
  isDrawing = true

  // imposto i valori di x e y di partenza della forma
  startX = cord.x
  startY = cord.y

})

//2 Evento movimento mouse dopo aver Cliccato per mostrare la preview
canvas.addEventListener("pointermove", (e) => {
  
  // Se sto trascinando una forma selezionata, la sposto
  if (isDragging && selectedShape) {
    const cord = getMousePosition(e);

    //calcolo di quanto il mouse si è mosso rispetto all'ultima posizione
    const dx = cord.x - lastX;
    const dy = cord.y - lastY;

    //applico lo spostamento alla forma selezionata
    moveShape(selectedShape, dx, dy);

    //aggiorno la posizione del mouse per il prossimo movimento
    lastX = cord.x;
    lastY = cord.y;

    render();
    return; // importantissimo: non faccio preview disegno
  }

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

  // Se stavo trascinando una forma, termino lo spostamento
  if (isDragging) {
    isDragging = false;
    return;
  }
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


