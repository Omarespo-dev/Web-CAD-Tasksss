
# TASK - RAGIONAMENTO STEP BY STEP

## Obiettivo

L'obiettivo di questa task e quello di disegnare forme geometriche su una **canvas HTML** e salvarle come **oggetti JavaScript** dentro un array (`shapes`). Inoltre bisogna implementare anche vari requisiti come: 
    1) Implementare almeno **due tipi di oggetti** (es. rettangolo e linea)✅
    2) Disegnare nuove entità sul canvas (click + drag + preview)✅
    3) **Selezionare** un oggetto già disegnato
    4) **Spostare** un oggetto selezionato con il mouse
    5) Poi gestire l'esportazione (JSON / DXF)

---

### Che struttura sto seguendo?
Sto separando il lavoro in due parti:

* **Render-side (disegno)**: funzioni che trasformano lo stato in pixel sulla canvas
  (`drawRect`, `drawShape`, `drawPreview`, `render`)✅

* **Controller-side (logica)**: gestione degli eventi mouse e aggiornamento dello stato
  (creazione forme con click+drag✅, selezione, spostamento, ecc.)

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

---

## 3) Funzione di Render

Ho implementato una funzione `render` perche la canvas non ha memoria delle forme disegnate. Ogni volta che aggiungo una nuova figura o modifico lo stato devo ridisegnare tutto leggendo l’array `shapes`. In questo modo posso visualizzare tutte le forme gia create insieme a quella nuova o alla preview, mantenendo il disegno sempre aggiornato.

---

## 4) Funzione per traddure le coordinate del mouse della finestra Browser in canvas

Ho implementato una funzione getMousePosition per gestire le coordinate del mouse sulla canvas.
Il motivo per cui l ho fatta e perche gli eventi del mouse restituiscono le coordinate rispetto alla finestra del browser, mentre il canvas e solo una porzione della pagina.

Questa funzione prende l evento del mouse e restituisce le coordinate x e y relative alla canvas.
In questo modo posso ottenere le coordinate corrette da usare nei controller del mouse, cioe negli eventi di click, movimento e rilascio.

---


## 5) Controllers del Mouse

Per gestire il disegno sulla canvas utilizzo tre eventi del mouse: `pointerdown`, `pointermove` e `pointerup`.
In questo modo separo l inizio del disegno, l aggiornamento in tempo reale con la preview e la fine dell operazione.

In `pointerdown` inizializzo lo stato salvando il punto di partenza e attivando isDrawing cosi i movimenti successivi vengono interpretati come se stessi disegnando.

In `pointermove` aggiorno una variabile temporanea `tempShape` perche in questa fase non devo salvare la forma definitiva dentro shapes ma semplicemente gestire la preview.
Dopo ogni aggiornamento richiamo la funzione render perche la canvas non mantiene stato e deve essere ridisegnata per mostrare i cambiamenti altrimenti la preview non verrebbe visualizzata.

In `pointerup` gestisco la conferma del disegno salvando la preview nell arr shapes e richiamo nuovamente render per aggiornare la canvas con lo stato finale.

---

## 6) Aggiunta Forma linea

Ho aggiunto una seconda forma (linea) mantenendo la stessa struttura usata per il rettangolo.

-L evento `pointerdown` non cambia, perche mi serve solo a salvare il punto iniziale (startX/startY) e ad attivare `isDrawing`, quindi funziona per qualsiasi forma.

- In `pointermove` ho aggiunto un controllo su `currentTool === "line"` e creo una `tempShape` di tipo line con `x1,y1` come punto di partenza e `x2,y2` come posizione corrente del mouse, cosi posso avere la preview durante il drag.

- In `pointerup` non cambia nulla: la preview viene salvata in `shapes` come forma definitiva e viene fatto render finale.


Per disegnare la linea ho aggiunto `drawLine` e ho esteso `drawShape` per gestire anche `type: "line"`.

---

## 7) Aggiunte Funzioni per capire se clicco dentro una forma (Hit-test)

Quando l utente clicca sulla canvas, il browser mi da solo un punto(px,py) cioe le coordinate del mouse. Per poter selezionare  per poi spostare una forma gia disegnata devo capire: se quel punto sta dentr un rettangolo e se quel punto e quasi vicino alla linea disegnata.

Per questo Ho implementato diverse funzioni 

La funzione `hitRect` ci serve per capire se il punto del mouse e dentro al rettangolo,quindi dobbiamo fare un controlle su px e py e ritorna o `true` o `false`

La funzione `distancePointToSegment` ci serve per calcolare la distanza minima tra il mouse e un segmento di linea, questo lo facciamo perche la linea non ha area e quindi non posso verificare se effetivamente sto cliccando quella linea oppure no. Infine la funzione ritorna un numero che sarebbe la distanza in pixel

La funzione `hitLine` ci serve per capire se il mouse e vicino alla linea,avendo una tolleranza e usando anche la funzione `distancePointToSegment`. Se la distanza e <= tolleranza, la linea e cliccata e la funzione ritorna o `true` o `false`

Una volta definite le funzioni chiamate (hit-test) devo capire quale forma e stata cliccata e per farlo mi serve una funzione `getShapeAt` che socrre l arr `shapes` e controlla ogni forma usando `hitRect` o `hitLine` in base al tipo di forma.

Il controllo viene fatto dall ultima forma disegnata quindi nel for viene (i--), perche e la forma che si trova sopra alle altre, quindi dobbiamo ciclare al contrario, inoltre se trova la forma cliccata la ritorna altrimenti ritorna `null`

