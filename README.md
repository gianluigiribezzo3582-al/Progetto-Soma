# SOMA — Holding the Wave · App prototype

> **Per presentare la demo senza conoscenze tecniche, leggi [GUIDA.md](GUIDA.md).**

Companion app for **SOMA**, a product-service system for people living with Binge Eating Disorder (BED).
Master's thesis in Industrial Design, *Care Ability – Sense Making Future*, Politecnico di Bari (dArCoD), A.Y. 2025–2026.
Students: Francesca Cognetti, Azzurra Francesca Doronzo, Alessandro Perna.

> Presentation prototype: data and AI are **simulated**. This is not a medical device.

## Come si apre

Non serve installare niente: è una webapp statica in HTML, CSS e JavaScript, senza dipendenze.

- **Da computer:** apri `index.html` con un doppio clic. Per una presentazione dà il meglio a schermo intero, da 1280 px in su.
- **Da telefono:** pubblica la cartella con GitHub Pages (Settings → Pages → branch) oppure con qualsiasi hosting statico, poi apri il link. Da Safari o Chrome puoi usare "Aggiungi a Home": l'app si apre a tutto schermo, come un'app installata.

## Com'è fatta la schermata

| Desktop / proiettore | Telefono |
|---|---|
| A sinistra **l'oggetto SOMA virtuale**, al centro **il telefono**, a destra la **console dell'IA** | L'app occupa tutto lo schermo; il pulsante rotondo in basso a destra apre l'oggetto e la console IA |

## Il percorso da mostrare

La grafica segue le schermate disegnate dal team: 42 per l'app e 10 per l'area terapista, salvate in `docs/design-reference/`. Logo e icona sono in `assets/brand/`.

1. **Avvio e configurazione con la terapista:** benvenuto, accesso o registrazione, associazione di SOMA, preferenze, accordi su cosa condividere, codice di invito, programma, fasi.
2. **Oggi:** il gesto del giorno, le pratiche, "Come ti senti?" e i messaggi (la campanella). Dai comandi demo si può scollegare SOMA per mostrare la versione offline.
3. **Pratica:** sei pratiche, ognuna con la scheda "Come funziona". Grounding 5-4-3-2-1 fino a "Grounding completato", Osserva l'onda, Autocompassione, Pasto consapevole.
4. **Sequenza guidata** ("Simula un impulso che sale", alla settimana 9): Respira → Grounding → Osserva l'onda → Cammina con calma → Resta con te.
5. **Il giorno dopo** (dai comandi demo): una risposta facoltativa, poi **Onde · Le tue esperienze** con le riflessioni, private o "da portare in seduta".
6. **Il tuo spazio:** programma, voce e tranquillità, accordi e dati, il tuo SOMA, ritmo quotidiano, team di cura, aiuto, lingua.
7. **Pausa del telefono:** gesto "Avvicina il telefono" sull'oggetto, oppure dai comandi demo.
8. **Area terapista** (comandi demo → "Apri l'area terapista"):
   - le persone seguite e il percorso di Laura;
   - le sessioni e le note condivise (si vede la riflessione che Laura ha scelto di condividere);
   - l'andamento delle onde;
   - la modifica del programma in 4 passi. Dopo "Condividi con Laura", tornando all'app paziente il programma e la notifica risultano aggiornati.

I **comandi per la presentazione** sono fuori dal telefono, nel pannello "Comandi demo" sotto la console IA (su telefono: pulsante rotondo → *IA e demo*). Da lì si passa tra app paziente e area terapista, si salta alla settimana 2, 5 o 9, si apre il giorno dopo, si attiva la pausa del telefono, si scollega SOMA, si rivede la configurazione o si azzera la demo.

## Gesti dell'oggetto (dal capitolo "Movements of the hand")

Hold · Squeeze & release · Rotate · Trace the dots · Rub side A/B · Press & hold 2 s (avvia la guida) · Rock · Double tap (voce on/off) · Tap phone on SOMA (pausa app) · Turn face down (interrompe).
Si possono attivare con i pulsanti oppure direttamente sull'oggetto: premendo il corpo lo si "tiene", tenendo premuto il dial per 2 s parte la guida, con un doppio clic sul dial si accende o spegne la voce.

## Struttura

```
index.html            shell: oggetto · telefono · console IA
css/styles.css        stile (palette ripresa dai mockup della tesi)
js/i18n.js            testi bilingui inline: L('English', 'Italiano')
js/store.js           stato, persistenza (localStorage), storico simulato di 9 settimane
js/engine.js          IA simulata: segnali → feature → baseline → firma → indice → avvio
js/device.js          oggetto SOMA virtuale (SVG) e gesti
js/charts.js          grafici SVG
js/screens.js         schermate: onboarding, Oggi, Pratica, Onde, Io, Mattino, Report
js/session.js         sequenza guidata
js/app.js             navigazione, eventi, console IA, notifiche
assets/               logo e icona
```

Per modificare un testo, cercalo in `js/` e cambia la versione inglese e/o quella italiana nella stessa chiamata `L(...)`.

## Immagini (segnaposto)

Le foto in `assets/img/` sono **estratte dal PDF della tesi** e sono a bassa risoluzione (240–600 px). Per sostituirle basta salvare gli originali con **lo stesso nome file**:

| File | Contenuto | Dove compare |
|---|---|---|
| `hand-hold.jpg` | mano che tiene SOMA nel palmo | associazione, gesto *Hold* |
| `hands-float.jpg` | SOMA tra due mani | guida *How to use SOMA* |
| `g-squeeze.jpg`, `g-press.jpg`, `g-double.jpg`, `g-trace.jpg`, `g-rubB.jpg`, `g-rotate.jpg`, `g-rock.jpg`, `g-phone.jpg` | le foto dei gesti (pag. 38) | guida ai gesti |
| `everyday-1/2/3.jpg` | SOMA appeso alla borsa | guida, "Among the things you carry" |
| `colours.jpg` | i sei colori | (di riserva) |

L'oggetto interattivo resta disegnato in vettoriale (`js/device.js`), perché deve cambiare colore, lato e luce.

> Nota: `docs/ui-spec/` contiene le misure della grafica precedente, preparate per i designer prima del loro ridisegno; i riferimenti attuali sono in `docs/design-reference/`.
