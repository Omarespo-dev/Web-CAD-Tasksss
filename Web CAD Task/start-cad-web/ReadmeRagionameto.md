
# TASK - RAGIONAMENTO STEP BY STEP

## Obiettivo

L'obiettivo di questa task e quello di disegnare forme geometriche su una **canvas HTML** e salvarle come **oggetti JavaScript** dentro un array (`shapes`). Inoltre bisogna implementare anche vari requisiti come: 
    1) Implementare almeno **due tipi di oggetti** (es. rettangolo e linea)
    2) Disegnare nuove entità sul canvas (click + drag + preview)
    3) **Selezionare** un oggetto già disegnato
    4) **Spostare** un oggetto selezionato con il mouse
    5) Poi gestire l'esportazione (JSON / DXF)

---

## Cosa ho implementato io 

### 1) Stato dell’utente e gestione del disegno

Per gestire il disegno sul canvas ho aggiunto alcune variabili di stato che permettono di capire cosa sta facendo l’utente in ogni momento.

* `currentTool` indica quale strumento è selezionato (rettangolo, linea, ecc.).
* `isDrawing` serve a capire se l’utente ha iniziato a disegnare e sta trascinando il mouse.
* `startX` e `startY` salvano il punto iniziale del disegno, cioè dove avviene il primo click.
* `tempShape` rappresenta la forma temporanea usata come preview durante il drag.

La forma viene aggiunta all’array `shapes` solo quando l’utente termina il disegno.

---

### 2) Funzioni di disegno e gestione delle forme

Per il disegno ho iniziato a implementare due funzioni principali.
La prima `drawRect` serve per il disegno effettivo del rettangolo e riceve in input un oggetto rettangolo con le sue proprietà.

La seconda funzione è `drawShape` e viene usata per gestire in modo più ordinato la logica del disegno. Questa funzione riceve un oggetto generico e controlla se il tipo è un rettangolo oppure no, cosi da decidere quale disegno eseguire.

L’uso di `drawShape` non era obbligatorio ma ho deciso di inserirla per centralizzare la logica e renderla più chiara. In questo modo evito di gestire i controlli direttamente nella funzione di render che si occupa di mostrare il disegno sulla canvas.

---


