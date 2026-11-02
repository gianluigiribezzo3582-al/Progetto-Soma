# SOMA — Holding the Wave · App prototype

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

1. **Onboarding in seduta:** benvenuto, poi il **codice di attivazione** della clinica (già compilato: basta premere *Continue*) e la conferma del team di cura, poi l'associazione (si tiene premuto per 3 s il pulsante o l'oggetto e l'anello si accende), la scelta del colore tra i sei toni, *What we agree on* (consensi), il programma "Evening waves" e *Listening first*.
2. **Oggi:** la fase del modello personale (ascolto, apprendimento, guida), la pratica quotidiana, *Soma noticed* con gli insight dell'IA e il pulsante *I need a moment*.
   **Io:** il team di cura (messaggi con il terapeuta, chiamata alla clinica), il dispositivo, i promemoria, i consensi e *Get help now*.
3. **Simula un'onda** (dalla console IA): la console mostra i segnali che salgono (FC, HRV, EDA, temperatura). L'indice supera la soglia concordata con il terapeuta e, alla settimana 9, Soma **parte da solo**: due impulsi, anello ambra, nessuna domanda.
   - Il pulsante *Ordinary stress* mostra che il modello distingue un normale stress dalla "firma" di un'onda.
   - Alle settimane 2 e 5 Soma annota il momento ma non parte, perché sta ancora imparando.
4. **Sequenza guidata (schermate scure)**, con il pulsante di aiuto sempre visibile in alto: Breathe (si stringe SOMA mentre il cerchio si gonfia), Ground (5-4-3-2-1), Surf (urge surfing; ruotando l'oggetto la curva avanza), Phone pause, Move, Rest: *"You stayed with yourself."*
5. **Il mattino dopo:** parole semplici e un tocco facoltativo, non giudicante. Le risposte servono a far imparare il modello.
6. **Onde:** grafici dell'andamento (onde guidate per settimana, tempo per calmarsi, orari, firma dell'onda, apprendimento del modello).
7. **Report per il terapeuta:** si sceglie il periodo; l'IA "analizza" e scrive una sintesi in parole semplici con i punti da discutere in seduta. Include **solo i dati concordati**. Si può inviare (simulato) o salvare in PDF.

I **comandi per la presentazione** sono fuori dal telefono, così l'app sembra quella reale: si trovano nel pannello "Demo controls" sotto la console IA (su telefono, nel pulsante rotondo → *AI & demo*). Da lì si salta alla settimana 2, 5 o 9, si apre il "mattino dopo", si rivede l'onboarding o si azzera la demo.

Per ora l'app è **solo in inglese**. Le traduzioni italiane delle prime schermate sono rimaste nel codice, dentro `L('English', 'Italiano')`, ma non sono attive.

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
