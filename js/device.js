/* SOMA — the virtual object.
 * Stands in for the physical pebble during the presentation: every gesture
 * in "Movements of the hand" can be performed here and reaches the app.
 */
(function () {
  const D = {
    side: 'A',
    light: 'off',      // off | on | pulse | breathe | pair
    pairProgress: 0,
    listeners: [],
    battery: 82
  };

  D.GESTURES = [
    { id: 'hold',     en: 'Hold',            it: 'Tieni in mano',            fbEn: 'Soft silicone, comforting contact.',      fbIt: 'Silicone morbido, contatto rassicurante.' , forEn: 'Feel held. A calm anchor in your palm.', forIt: 'Avere un punto fermo, nel palmo della mano.', img: 'hand-hold' },
    { id: 'squeeze',  en: 'Squeeze & release', it: 'Stringi e rilascia', fbEn: 'Elastic silicone, gentle resistance.', fbIt: 'Silicone elastico, resistenza delicata.' , forEn: 'Release tension; keeps the rhythm in Breathe.', forIt: 'Scaricare la tensione e dare il ritmo a Respira.', img: 'g-squeeze' },
    { id: 'rotate',   en: 'Rotate',          it: 'Ruota',            fbEn: 'Rounded edges, smooth rotation.',          fbIt: 'Bordi arrotondati, rotazione fluida.' , forEn: 'Follow the wave during “Watch the wave”.', forIt: 'Accompagnare l’onda nell’esercizio “Osserva l’onda”.', img: 'g-rotate' },
    { id: 'trace',    en: 'Trace the dots',  it: 'Segui i puntini',  fbEn: 'Raised dots guide the fingertips.',        fbIt: 'I puntini in rilievo guidano i polpastrelli.' , forEn: 'Bring attention back to your fingertips.', forIt: 'Riportare l’attenzione sui polpastrelli.', img: 'g-trace' },
    { id: 'rubA',     en: 'Rub side A',      it: 'Strofina lato A',  fbEn: 'Dotted surface, repeated stimulation.',    fbIt: 'Superficie a puntini, stimolo ripetuto.' , forEn: 'Soothe restlessness with a steady rhythm.', forIt: 'Calmare l’agitazione con un ritmo costante.', img: 'g-trace' },
    { id: 'rubB',     en: 'Rub side B',      it: 'Strofina lato B',  fbEn: '3D ripples, varied tactile feedback.',     fbIt: 'Onde in rilievo, sensazioni tattili diverse.' , forEn: 'Thumb on the ripples during Ground.', forIt: 'Tenere il pollice sulle onde durante Radicati.', img: 'g-rubB' },
    { id: 'press',    en: 'Press & hold 2 s', it: 'Premi per 2 s',       fbEn: 'Starts the guided breathing sequence.',    fbIt: 'Avvia la sequenza di respiro guidato.' , forEn: 'Ask for guidance, any time, without opening the app.', forIt: 'Chiedere una guida in qualsiasi momento, senza aprire l’app.', img: 'g-press' },
    { id: 'rock',     en: 'Rock',            it: 'Dondola',          fbEn: 'Curved body, rhythmic rocking.',           fbIt: 'Corpo curvo, dondolio ritmico.' , forEn: 'A slow, self-soothing rhythm.', forIt: 'Trovare un ritmo lento che calma.', img: 'g-rock' },
    { id: 'double',   en: 'Double tap',      it: 'Doppio tocco',     fbEn: 'Voice guidance on / off.',                 fbIt: 'Attiva o disattiva la guida vocale.' , forEn: 'Stay discreet in public: touch only, no voice.', forIt: 'Usare SOMA in pubblico con discrezione: solo tatto, niente voce.', img: 'g-double' },
    { id: 'phone',    en: 'Tap phone on SOMA', it: 'Avvicina il telefono', fbEn: 'Temporary app pause.',               fbIt: 'Mette in pausa alcune app per un po’.' , forEn: 'Interrupt automatic scrolling and delivery apps.', forIt: 'Interrompere lo scorrimento automatico e le app di consegna.', img: 'g-phone' },
    { id: 'facedown', en: 'Turn face down',  it: 'Capovolgi',        fbEn: 'Stops the guidance, gently.',              fbIt: 'Interrompe la guida, con delicatezza.', forEn: 'End a session gently, whenever you want.', forIt: 'Chiudere una sessione con delicatezza, quando vuoi.', img: null }
  ];

  D.on = function (fn) { D.listeners.push(fn); };
  function emit(g) {
    D.listeners.forEach(fn => fn(g));
  }

  /* Dot pattern of side A — concentric rings, smaller towards the dial */
  function dotsA() {
    const rings = [[24, 14, 1.3], [32, 18, 1.6], [42, 22, 2.0], [53, 26, 2.4], [64, 30, 2.7], [74, 34, 2.9]];
    let s = '';
    rings.forEach(([r, n, size], ri) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (ri % 2 ? Math.PI / n : 0);
        const x = (120 + Math.cos(a) * r).toFixed(1), y = (120 + Math.sin(a) * r).toFixed(1);
        s += `<circle cx="${(+x + size * 0.28).toFixed(1)}" cy="${(+y + size * 0.36).toFixed(1)}" r="${size}" class="dot-sh"/><circle cx="${x}" cy="${y}" r="${size}" class="dot" style="--i:${ri * 40 + i}"/>`;
      }
    });
    return s;
  }
  function ripplesB() {
    let s = '';
    for (let r = 10; r <= 76; r += 9) s += `<circle cx="120" cy="120" r="${r}" fill="none" class="ripple" stroke-width="${r > 60 ? 2.4 : 2}"/>`;
    return s;
  }

  let uid = 0;
  D.svg = function () {
    const c = S.color();
    const u = 'p' + (++uid); // unique gradient ids: several copies may coexist
    return `
    <svg class="pebble side-${D.side} light-${D.light}" viewBox="0 0 240 240" aria-label="SOMA">
      <defs>
        <radialGradient id="rimGrad-${u}" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stop-color="${c.hex}"/>
          <stop offset="70%" stop-color="${c.hex}"/>
          <stop offset="100%" stop-color="${c.deep}"/>
        </radialGradient>
        <radialGradient id="faceGrad-${u}" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#FCFAF5"/>
          <stop offset="100%" stop-color="#ECE7DD"/>
        </radialGradient>
        <radialGradient id="dialGrad-${u}" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="45%" stop-color="#C9CCCF"/>
          <stop offset="100%" stop-color="#8E9398"/>
        </radialGradient>
        <linearGradient id="rimHi-${u}" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stop-color="#fff" stop-opacity=".32"/>
          <stop offset="45%" stop-color="#fff" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".10"/>
        </linearGradient>
        <radialGradient id="faceSh-${u}" cx="50%" cy="50%" r="50%">
          <stop offset="82%" stop-color="#000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000" stop-opacity=".10"/>
        </radialGradient>
        <filter id="glow-${u}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4"/>
        </filter>
      </defs>
      <ellipse cx="120" cy="226" rx="86" ry="8" fill="rgba(0,0,0,.10)"/>
      <circle cx="120" cy="120" r="108" fill="url(#rimGrad-${u})" class="rim" data-zone="body"/>
      <circle cx="120" cy="120" r="108" fill="url(#rimHi-${u})" pointer-events="none"/>
      <circle cx="120" cy="120" r="86" fill="${c.deep}" opacity=".35" pointer-events="none"/>
      <circle cx="120" cy="120" r="84" fill="url(#faceGrad-${u})" data-zone="body"/>
      <circle cx="120" cy="120" r="84" fill="url(#faceSh-${u})" pointer-events="none"/>
      <g class="face-a" data-zone="body">${dotsA()}</g>
      <g class="face-b" data-zone="body">${ripplesB()}</g>
      <g class="dial-g" data-zone="dial">
        <circle cx="120" cy="120" r="21" class="ring-glow" filter="url(#glow-${u})"/>
        <circle cx="120" cy="120" r="19" class="ring" fill="none" stroke-width="3"/>
        <circle cx="120" cy="120" r="19" class="ring-progress" fill="none" stroke-width="3" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${100 - D.pairProgress}" transform="rotate(-90 120 120)"/>
        <circle cx="120" cy="120" r="15" fill="url(#dialGrad-${u})" class="dial"/>
        <g class="dial-brush" pointer-events="none">${[4, 6.5, 9, 11.5, 13.5].map((r, i) => `<circle cx="120" cy="120" r="${r}" fill="none" stroke="${i % 2 ? '#fff' : '#7E848A'}" stroke-opacity=".22" stroke-width=".6"/>`).join('')}<ellipse cx="115" cy="114" rx="6" ry="3.5" fill="#fff" opacity=".55" transform="rotate(-30 115 114)"/></g>
      </g>
    </svg>`;
  };

  D.panel = function () {
    const c = S.color();
    const conn = S.state.paired ? L('Connected', 'Connesso') : L('Not paired', 'Non associato');
    return `
    <div class="soma-dev">
      <div class="side-head">
        <div>
          <div class="eyebrow">${L('The object', "L'oggetto")}</div>
          <h2 class="side-title">SOMA · ${L(c.en, c.it)}</h2>
        </div>
        <div class="dev-meta">
          <span class="pill ${S.state.paired ? 'pill-ok' : ''}"><i class="dotlive"></i>${conn}</span>
          <span class="pill">${L('Battery', 'Batteria')} ${D.battery}%</span>
        </div>
      </div>
      <div class="pebble-stage" id="pebbleStage">
        ${D.svg()}
        <div class="pebble-hint">${L('Press the body to hold · press the dial 2 s · double-tap the dial', 'Premi il corpo per tenerlo in mano · tieni premuto il centro 2 s · doppio tocco sul centro')}</div>
      </div>
      <div class="side-switch" role="group" aria-label="${L('Side', 'Lato')}">
        <button class="${D.side === 'A' ? 'is-on' : ''}" data-dev-side="A">${L('Side A · dots', 'Lato A · puntini')}</button>
        <button class="${D.side === 'B' ? 'is-on' : ''}" data-dev-side="B">${L('Side B · ripples', 'Lato B · onde')}</button>
      </div>
      <div class="gesture-grid">
        ${D.GESTURES.map(g => `<button class="gesture" data-gesture="${g.id}" title="${L(g.fbEn, g.fbIt)}"><span class="g-ico g-${g.id}"></span>${L(g.en, g.it)}</button>`).join('')}
      </div>
      <p class="side-note">${L('SOMA listens only during intentional interaction. When it is not held, it stays silent.', "SOMA ascolta solo durante l'interazione intenzionale. Quando non è in mano, resta in silenzio.")}</p>
    </div>`;
  };

  /* Re-render every mounted copy (desktop panel and/or mobile sheet) */
  D.refresh = function () {
    document.querySelectorAll('[data-mount="device"]').forEach(el => { el.innerHTML = D.panel(); });
  };

  D.setLight = function (mode) {
    D.light = mode;
    document.querySelectorAll('.pebble').forEach(svg => {
      svg.classList.remove('light-off', 'light-on', 'light-pulse', 'light-breathe', 'light-pair');
      svg.classList.add('light-' + mode);
    });
  };

  D.setPair = function (p) {
    D.pairProgress = p;
    document.querySelectorAll('.pebble .ring-progress').forEach(c => c.setAttribute('stroke-dashoffset', 100 - p));
  };

  D.animate = function (cls, ms = 900) {
    document.querySelectorAll('.pebble').forEach(svg => {
      svg.classList.remove(cls);
      void svg.getBBox();
      svg.classList.add(cls);
      setTimeout(() => svg.classList.remove(cls), ms);
    });
  };

  D.buzz = function () { D.animate('buzz', 500); };

  /* Perform a gesture (from a button or a direct interaction) */
  D.gesture = function (id) {
    const anim = { hold: 'squeeze', squeeze: 'squeeze', rotate: 'rotate', trace: 'trace', rubA: 'rub', rubB: 'rub', rock: 'rock', double: 'tap2', phone: 'nfc', press: 'press', facedown: 'flip' }[id];
    if (id === 'rubB' && D.side !== 'B') { D.side = 'B'; D.refresh(); }
    if (id === 'rubA' && D.side !== 'A') { D.side = 'A'; D.refresh(); }
    if (anim) D.animate(anim, id === 'trace' ? 1600 : 1000);
    if (id === 'squeeze' || id === 'hold') S.engine.grip(id === 'squeeze' ? 45 : 25);
    if (['rotate', 'trace', 'rubA', 'rubB', 'rock'].includes(id)) S.engine.grip(10);
    emit(id);
  };

  /* Show a gesture on the object without sending it to the app (used by the guide) */
  D.preview = function (id) {
    const anim = { hold: 'squeeze', squeeze: 'squeeze', rotate: 'rotate', trace: 'trace', rubA: 'rub', rubB: 'rub', rock: 'rock', double: 'tap2', phone: 'nfc', press: 'press', facedown: 'flip' }[id];
    if (id === 'rubB' && D.side !== 'B') { D.side = 'B'; D.refresh(); }
    if ((id === 'rubA' || id === 'trace') && D.side !== 'A') { D.side = 'A'; D.refresh(); }
    if (anim) D.animate(anim, id === 'trace' ? 1600 : 1000);
  };

  /* Direct manipulation on the SVG */
  function bindPointer(root) {
    let holdTimer = null, dialTimer = null, downAt = 0, zone = null, lastDialTap = 0, gripInt = null, pressFill = null;

    root.addEventListener('pointerdown', e => {
      const z = e.target.closest('[data-zone]');
      if (!z || !e.target.closest('.pebble')) return;
      e.preventDefault();
      zone = z.dataset.zone;
      downAt = Date.now();
      if (zone === 'body') {
        document.querySelectorAll('.pebble').forEach(s => s.classList.add('pressing'));
        gripInt = setInterval(() => S.engine.grip(6), 120);
        emit('holdstart');
      } else {
        const now = Date.now();
        if (now - lastDialTap < 350) { lastDialTap = 0; zone = null; D.gesture('double'); return; }
        lastDialTap = now;
        let p = 0;
        const before = D.light;
        document.querySelectorAll('.pebble').forEach(s => s.classList.add('dial-down'));
        pressFill = setInterval(() => { p += 5; D.setPair(Math.min(100, p)); }, 100);
        dialTimer = setTimeout(() => {
          clearInterval(pressFill); D.setPair(0); zone = null;
          document.querySelectorAll('.pebble').forEach(s => s.classList.remove('dial-down'));
          D.gesture('press');
          if (D.light === before && before === 'off') D.setLight('off');
        }, 2000);
      }
    });

    const up = () => {
      if (!zone) return;
      const held = Date.now() - downAt;
      if (zone === 'body') {
        clearInterval(gripInt);
        document.querySelectorAll('.pebble').forEach(s => s.classList.remove('pressing'));
        emit('holdend');
        emit(held < 1200 ? 'squeeze' : 'hold');
      } else {
        clearTimeout(dialTimer); clearInterval(pressFill);
        if (!S._pairing) D.setPair(0);
        document.querySelectorAll('.pebble').forEach(s => s.classList.remove('dial-down'));
      }
      zone = null;
    };
    root.addEventListener('pointerup', up);
    root.addEventListener('pointerleave', up);
    root.addEventListener('pointercancel', up);

    root.addEventListener('click', e => {
      const g = e.target.closest('[data-gesture]');
      if (g) D.gesture(g.dataset.gesture);
      const sd = e.target.closest('[data-dev-side]');
      if (sd) { D.side = sd.dataset.devSide; D.refresh(); }
    });
  }

  D.mount = function (el) {
    el.setAttribute('data-mount', 'device');
    el.innerHTML = D.panel();
    if (!el._bound) { bindPointer(el); el._bound = true; }
  };

  S.device = D;
})();
