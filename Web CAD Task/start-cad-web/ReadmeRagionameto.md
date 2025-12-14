
# TASK - RAGIONAMENTO STEP BY STEP

## Obiettivo

L'obiettivo di questa task e quello di disegnare forme geometriche su una **canvas HTML** e salvarle come **oggetti JavaScript** dentro un array (`shapes`). Inoltre bisogna implementare anche vari requisiti come: 
    1) Implementare almeno **due tipi di oggetti** (es. rettangolo e linea)
    2) Disegnare nuove entità sul canvas (click + drag + preview)
    3) **Selezionare** un oggetto già disegnato
    4) **Spostare** un oggetto selezionato con il mouse
    5) Poi gestire l'esportazione (JSON / DXF)

---

### Che struttura sto seguendo?
Sto separando il lavoro in due parti:

* **Render-side (disegno)**: funzioni che trasformano lo stato in pixel sulla canvas
  (`drawRect`, `drawShape`, `drawPreview`, `render`)✅

* **Controller-side (logica)**: gestione degli eventi mouse e aggiornamento dello stato
  (creazione forme con click+drag, selezione, spostamento, ecc.)

In questa fase sto implementando solo una forma, il rettangolo, per costruire la logica di base del disegno e della preview. Una volta completato questo flusso, la stessa struttura verra estesa anche alla linea.

---


## Cosa ho implementato io 

### 1) Stato dell’utente e gestione del disegno

Per gestire il disegno sul canvas ho aggiunto alcune variabili di stato che permettono di capire cosa sta facendo l’utente in ogni momento.

* `currentTool` indica quale strumento è selezionato (rettangolo, linea, ecc.).
* `isDrawing` serve a capire se l’utente ha iniziato a disegnare e sta trascinando il mouse.
* `startX` e `startY` salvano il punto iniziale del disegno, cioè dove avviene il primo click.
* `tempShape` è l’oggetto “in costruzione” durante il drag, serve solo per la preview finché non rilasci il mouse, poi diventa una forma definitiva dentro shapes.

La forma viene aggiunta all’array `shapes` solo quando l’utente termina il disegno.

---

### 2) Funzioni di disegno e gestione delle forme

Per il disegno ho iniziato a implementare due funzioni principali.
La prima `drawRect` serve per il disegno effettivo del rettangolo e riceve in input un oggetto rettangolo con le sue proprietà.

La seconda funzione è `drawShape` e viene usata per gestire in modo più ordinato la logica del disegno. Questa funzione riceve un oggetto generico e controlla se il tipo è un rettangolo oppure no, cosi da decidere quale disegno eseguire.

La terza funzione e `drawPreview` e viene usato per disegnare la preview della forma durante il drag (trascinamento del mouse), applicando uno stile grafico diverso.

L’uso di `drawShape` e `drawPreview` non erano obbligatorie, ma le ho introdotte per organizzare meglio il codice e non appesantire la funzione di render che deve solo mostrare il risultato finale.

## 3) Funzione di Render

Ho implementato una funzione `render` perche la canvas non ha memoria delle forme disegnate. Ogni volta che aggiungo una nuova figura o modifico lo stato devo ridisegnare tutto leggendo l’array `shapes`. In questo modo posso visualizzare tutte le forme gia create insieme a quella nuova o alla preview, mantenendo il disegno sempre aggiornato.

---



