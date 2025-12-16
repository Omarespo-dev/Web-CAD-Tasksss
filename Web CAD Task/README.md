# Task – Start CAD Web

## Descrizione
Questo esercizio serve a valutare le tue competenze con **JavaScript** e la gestione grafica tramite **HTML5 Canvas**.

Ti forniamo un canvas già impostato.  
Il tuo compito è aggiungere la logica per disegnare e manipolare oggetti geometrici e permettere l’esportazione in **JSON** e **DXF**.
Per l'esportazione in DXF, deve essere utilizzata la libreria "@tarikjabiri/dxf" (alias "js-dxf"). E' necessario pertanto aggiungerla al progetto ed utilizzarla per l'esportazione. 

---

## Requisiti

1. Creare una semplice interfaccia con un canvas centrale e una barra di strumenti.✅
2. Implementare almeno **due tipi di oggetti** (es. rettangolo e linea).✅
3. L’utente deve poter:
   - Disegnare nuove entità sul canvas (click + drag).✅
   - **Selezionare** un oggetto già disegnato.✅
   - **Spostare** un oggetto selezionato con il mouse.✅
4. Alla pressione del pulsante **Esporta JSON**, deve essere generato un array con la lista delle forme e le loro proprietà, es:✅
   json
   [
     { "type": "rectangle", "x": 10, "y": 20, "width": 100, "height": 50 },
     { "type": "line", "x1": 30, "y1": 40, "x2": 120, "y2": 60 }
   ]
5. Alla pressione del pulsante **Esporta DXF** deve essere generato un file DXF scaricabile compatibile con AutoCAD.✅


---

## Come lavorare
1. Apri `index.html` in un browser. ✅ 
2. Implementa la logica dentro `main.js`.  ✅
3. Verifica che sia possibile disegnare, selezionare e spostare le forme.  ✅
4. Premi **Esporta JSON** per ottenere la lista delle forme.  ✅
5. Premi **Esporta DXF** per scaricare un file DXF compatibile con AutoCAD.✅


## Materiale fornito
- `index.html` → con base minima di codice HTML 
- `main.js` → vuoto dove scrivere la logica

---

## Consegna
Inviaci il progetto compresso in formato .zip OPPURE caricalo su un repository GitHub/GitLab e mandaci il link. 


---

## Tempo stimato
3-4 ore