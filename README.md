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

La grafica segue le 22 schermate disegnate dal team (in `docs/design-reference/`). Logo e icona sono in `assets/brand/`.

1. **Avvio:** schermata di benvenuto, poi accesso o registrazione con verifica dell'email (i dati sono già compilati: basta premere i pulsanti).
2. **Configurazione con il terapeuta** (“Insieme, con calma”):
   - associazione dell'oggetto: si tiene premuto per 3 s il pulsante o l'oggetto a lato;
   - “Eccoci, è connesso!”, con la scelta del colore;
   - come vuoi essere guidato/a (voce, vibrazioni, ore silenziose);
   - cosa condividere con il terapeuta;
   - rete di supporto (codice di invito);
   - programma “Onde serali”;
   - le tre fasi (ascolto, apprendimento, guida concordata).
3. **Oggi:** il gesto del giorno, “Per esercitarti”, “Quando ne senti il bisogno”, “Come ti senti?” e i messaggi (campanella in alto). Dai comandi demo si può scollegare SOMA per mostrare la versione offline.
4. **Pratica:** i 10 gesti e le 6 pratiche. Ogni pratica ha una scheda “Come funziona” prima di iniziare.
5. **Simula un'onda** (console IA a destra): alla settimana 9 SOMA parte da solo con la sequenza Respira → Radicati (5-4-3-2-1) → Osserva l'onda → Muoviti → Riposa. Il pulsante di aiuto è sempre visibile in alto.
6. **Il mattino dopo**, **Onde** (grafici), **Report per il terapeuta**, **Io** (team di cura, messaggi, consensi, lingua).

I **comandi per la presentazione** sono fuori dal telefono, nel pannello “Comandi demo” sotto la console IA (su telefono: pulsante rotondo → *IA e demo*). Da lì si salta alla settimana 2, 5 o 9, si apre il mattino dopo, si scollega o ricollega SOMA, si rivede l'onboarding o si azzera la demo.

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
