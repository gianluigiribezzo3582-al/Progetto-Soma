/* SOMA — the guided sequence (dark screens).
 * Durations are compressed for the presentation; labels keep the real ones.
 */
(function () {
  const I = (n, c) => S.icon(n, c);
  const SS = { active: null };

  const STEP_META = {
    breathe: { eyEn: 'BREATHE', eyIt: 'RESPIRA' },
    ground:  { eyEn: 'GROUND',  eyIt: 'RADICATI' },
    surf:    { eyEn: 'SURF',    eyIt: 'CAVALCA' },
    pause:   { eyEn: 'PHONE PAUSE', eyIt: 'PAUSA TELEFONO' },
    move:    { eyEn: 'MOVE',    eyIt: 'MUOVITI' },
    tipp:    { eyEn: 'TIPP · COLD WATER', eyIt: 'TIPP · ACQUA FREDDA' },
    meal:    { eyEn: 'A SLOWER MEAL', eyIt: 'UN PASTO PIÙ LENTO' },
    kind:    { eyEn: 'SELF-COMPASSION', eyIt: 'AUTOCOMPASSIONE' }
  };

  function later(fn, ms) { const t = setTimeout(fn, ms); SS.active && SS.active.timers.push(['t', t]); return t; }
  function every(fn, ms) { const t = setInterval(fn, ms); SS.active && SS.active.timers.push(['i', t]); return t; }
  function clearTimers() {
    if (!SS.active) return;
    SS.active.timers.forEach(([k, t]) => k === 't' ? clearTimeout(t) : clearInterval(t));
    SS.active.timers = [];
  }

  /* opts: { kind: 'full' | skillId, trigger: 'auto' | 'manual' } */
  SS.start = function (opts) {
    if (SS.active) return;
    const kind = opts.kind || 'full';
    let steps;
    if (kind === 'full') steps = ['intro', 'breathe', 'ground', 'surf', 'move', 'rest'];
    else steps = [kind, 'rest']; // a single practice starts straight from its intro screen
    SS.active = { kind, trigger: opts.trigger || 'manual', steps, idx: 0, done: [], timers: [], squeezes: 0, startedAt: Date.now() };
    if (kind === 'full') S.engine.startSession();
    S.app.setDark(true);
    if (opts.trigger === 'auto') { S.device.setLight('pulse'); S.device.buzz(); setTimeout(() => S.device.buzz(), 700); }
    else S.device.setLight('on');
    SS.render();
  };

  SS.next = function () {
    const a = SS.active; if (!a) return;
    const cur = a.steps[a.idx];
    if (cur !== 'intro' && cur !== 'rest' && !a.done.includes(cur)) a.done.push(cur);
    clearTimers();
    a.idx = Math.min(a.steps.length - 1, a.idx + 1);
    SS.render();
  };

  /* The on-screen "Next" link: inside Ground it moves to the next sense */
  SS.nextAction = function () {
    const a = SS.active; if (!a) return;
    if (a.steps[a.idx] === 'ground' && SS.groundNext) SS.groundNext(); else SS.next();
  };

  SS.togglePause = function () {
    const a = SS.active; if (!a) return;
    a.paused = !a.paused;
    const b = document.getElementById('pauseBtn');
    if (b) b.textContent = a.paused ? L('Resume', 'Riprendi') : L('Pause', 'Pausa');
  };

  SS.toRest = function () {
    const a = SS.active; if (!a) return;
    clearTimers();
    a.idx = a.steps.length - 1;
    SS.render();
  };

  SS.finish = function () {
    const a = SS.active; if (!a) return;
    clearTimers();
    S.device.setLight('off');
    const metrics = a.kind === 'full' ? S.engine.endSession() : null;
    SS.active = null;
    S.app.setDark(false);
    if (a.kind === 'full') {
      const st = S.state;
      const rec = {
        id: 'live-' + Date.now(),
        at: new Date(a.startedAt).toISOString(),
        week: st.week,
        trigger: a.trigger,
        falseStart: false,
        minutes: metrics ? metrics.minutes : 8,
        settle: metrics ? metrics.settle : null,
        steps: a.done.length,
        hrPeak: metrics ? metrics.hrPeak : 98,
        hrEnd: metrics ? metrics.hrEnd : 74,
        outcome: null,
        live: true
      };
      st.history.push(rec);
      st.pendingMorning = rec.id;
      S.save();
      S.app.toast(L('Saved. Tomorrow morning, one optional question.', 'Salvato. Domattina, una domanda facoltativa.'));
    } else {
      // count as daily practice
      const w = S.state.week - 1;
      if (S.state.practicedOn !== new Date().toDateString()) S.state.practice[w] = Math.min(7, (S.state.practice[w] || 0) + 1);
      S.state.practicedOn = new Date().toDateString();
      S.app.toast(L('Practice done for today.', 'Pratica di oggi completata.'));
      S.save();
    }
    S.app.go('today');
  };

  /* ---------- Device events while a session is open ---------- */
  SS.onGesture = function (g) {
    const a = SS.active; if (!a) return false;
    const step = a.steps[a.idx];
    if (g === 'facedown') { a.idx < a.steps.length - 1 ? SS.toRest() : SS.finish(); return true; }
    if (step === 'breathe' && (g === 'squeeze' || g === 'hold')) {
      a.squeezes++;
      const fb = document.getElementById('breatheFb');
      if (fb) { fb.textContent = L('In rhythm · ', 'A ritmo · ') + a.squeezes; fb.classList.remove('pop'); void fb.offsetWidth; fb.classList.add('pop'); }
      return true;
    }
    if (step === 'surf' && g === 'rotate') { a.surfBoost = (a.surfBoost || 0) + 0.12; return true; }
    if (step === 'ground' && (g === 'trace' || g === 'rubB' || g === 'rubA')) { SS.groundNext && SS.groundNext(); return true; }
    if (step === 'intro' && (g === 'squeeze' || g === 'hold' || g === 'press')) { SS.next(); return true; }
    return false;
  };

  /* ---------- Rendering (designs 19–22) ---------- */
  function segs(a) {
    const real = a.steps.filter(s => s !== 'intro');
    const pos = real.indexOf(a.steps[a.idx]);
    return `<div class="segs">${real.map((_, i) => `<i class="${i < pos ? 'on' : i === pos ? 'on cur' : ''}"></i>`).join('')}</div>`;
  }

  /* opts: title, sub, button (html), next (false hides the small skip link), nextLabel */
  function frame(a, inner, opts = {}) {
    const step = a.steps[a.idx];
    return `
      <div class="scr scr-dark step-${step}">
        <div class="topbar">
          ${step !== 'rest' ? `<button class="back-btn" data-action="sess-stop" aria-label="${L('Stop', 'Ferma')}">${I('back')}</button>` : '<span></span>'}
          <div class="dark-tools">
            <span class="hr-live" id="sessHr" title="${L('Heart rate (from SOMA)', 'Frequenza cardiaca (da SOMA)')}">${I('heart')} <b>${Math.round(S.engine.sig.hr)}</b></span>
            <button class="icon-btn ghost" data-action="support" aria-label="${L('Get help now', 'Chiedi aiuto ora')}">${I('lifebuoy')}</button>
            <button class="icon-btn ghost" data-action="voice" aria-label="${L('Voice', 'Voce')}">${I('voice', S.state.voice ? '' : 'off')}</button>
          </div>
        </div>
        ${opts.title ? `<h1 class="dark-h1">${opts.title}</h1>` : ''}
        ${opts.sub ? `<p class="dark-lead" id="${opts.subId || ''}">${opts.sub}</p>` : ''}
        ${step === 'intro' ? '' : segs(a)}
        ${inner}
        <div class="dark-foot">
          ${opts.button || ''}
          ${opts.next !== false ? `<button class="link-next" data-action="sess-next">${opts.nextLabel || L('Skip', 'Salta')} ${I('chev')}</button>` : ''}
          <p>${L('Turn Soma face down to stop', 'Capovolgi Soma per fermarti')}</p>
        </div>
      </div>`;
  }
  const darkBtn = (label, action, id) => `<button class="btn btn-dark btn-block" data-action="${action}" ${id ? `id="${id}"` : ''}>${label}</button>`;

  const R = {};

  R.intro = (a) => frame(a, `
    <div class="center-stack">
      <div class="intro-pebble">${S.logoMark('pulse-mark')}</div>
      <h2 class="dark-title">${L('I’m here with you.', 'Sono qui con te.')}</h2>
      <p class="amber">${L('Let’s breathe together.', 'Respiriamo insieme.')}</p>
      <p class="dark-sub">${a.trigger === 'auto'
        ? L('Soma began because your body showed the signs of a wave.', 'Soma è partito perché il tuo corpo ha mostrato i segni di un’onda.')
        : L('You asked for a moment. That is already a step.', 'Hai chiesto un momento. È già un passo.')}</p>
    </div>`, { button: darkBtn(L('Begin', 'Inizia'), 'sess-next'), next: false });

  R.breathe = (a) => frame(a, `
    <div class="center-stack">
      <div class="breath-illus" id="breath" data-hold="squeeze">${S.illus('breathe', true)}</div>
      <p class="instr" id="breathWord">${L('SQUEEZE GENTLY', 'STRINGI DELICATAMENTE')}</p>
      <p class="dark-sub strong" id="breathSub">${L('Then release as you breathe out.', 'Poi rilascia mentre espiri.')}</p>
      <p class="breathe-fb" id="breatheFb">${L('Squeeze SOMA, or press the drawing', 'Stringi SOMA, oppure premi il disegno')}</p>
      <p class="timer-line" id="breathTime">00:00 / 03:00</p>
    </div>`, { title: L('Breathe in calmly.', 'Inspira con calma.'), sub: L('Follow the pressure of your hands.', 'Segui la pressione delle mani.'), button: darkBtn(L('Pause', 'Pausa'), 'sess-pause', 'pauseBtn') });

  const SENSES = () => [
    { n: 5, sub: L('One sense at a time.', 'Un senso per volta.'), t: L('Look around you.', 'Guarda intorno a te.'), a: L('5 things you can see', '5 cose che puoi vedere'), h: L('You don’t need to name them out loud.', 'Non devi nominarle ad alta voce.') },
    { n: 4, sub: L('4 things you can feel.', '4 cose che puoi percepire.'), t: L('Follow soma one dot after another', 'Segui un puntino dopo l’altro di soma'), a: '', h: L('Notice four sensations: texture, temperature, pressure and contact.', 'Nota quattro sensazioni: rilievo, temperatura, pressione e contatto.') },
    { n: 3, sub: L('3 things you can hear.', '3 cose che puoi sentire.'), t: L('Listen.', 'Ascolta.'), a: L('3 sounds, near or far', '3 suoni, vicini o lontani'), h: L('Silence counts too.', 'Anche il silenzio conta.') },
    { n: 2, sub: L('2 things you can smell.', '2 cose che puoi annusare.'), t: L('Breathe through your nose.', 'Respira dal naso.'), a: L('2 smells around you', '2 odori intorno a te'), h: L('The smell of your hands or of the air is fine.', 'Va bene anche l’odore delle tue mani o dell’aria.') },
    { n: 1, sub: L('1 thing you can taste.', '1 cosa che puoi gustare.'), t: L('A taste.', 'Un sapore.'), a: L('1 thing you can taste', '1 cosa che puoi gustare'), h: L('A sip of water, or the taste in your mouth right now.', 'Un sorso d’acqua, o il sapore che hai in bocca adesso.') }
  ];
  const senseCircle = (n) => {
    const dots = [...Array(n)].map((_, i) => { const ang = -Math.PI / 2 + (i / n) * Math.PI * 2; return `<circle cx="${(80 + Math.cos(ang) * 48).toFixed(1)}" cy="${(80 + Math.sin(ang) * 48).toFixed(1)}" r="5" fill="#F2B27A"/>`; }).join('');
    return `<svg viewBox="0 0 160 160" class="sense-circle" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="none" stroke="#A3A567" stroke-width="2.5"/>${dots}<text x="80" y="96" text-anchor="middle">${n}</text></svg>`;
  };

  R.ground = (a) => {
    const s = SENSES()[0];
    return frame(a, `
    <div class="center-stack">
      <div id="senseArt">${senseCircle(5)}</div>
      <p class="sense-title" id="senseTitle">${s.t}</p>
      <p class="amber" id="senseAmber">${s.a}</p>
      <p class="dark-sub" id="senseHint">${s.h}</p>
    </div>`, { title: 'Grounding 5-4-3-2-1', sub: s.sub, subId: 'groundSub', button: darkBtn(L('Continue', 'Continua'), 'sess-next'), next: false });
  };

  R.surf = (a) => frame(a, `
    <div class="center-stack">
      <svg class="wave-svg" viewBox="0 0 260 140" aria-hidden="true">
        <path id="wavePath" d="M10,120 C70,120 90,20 130,20 C170,20 190,120 250,120" fill="none" stroke="#A3A567" stroke-width="3" stroke-linecap="round"/>
        <circle id="waveDot" r="7" fill="#fff" stroke="var(--amber)" stroke-width="2.5"/>
      </svg>
      <p class="amber" id="waveMsg">${L('It is rising. You don’t have to do anything.', 'Sta salendo. Non devi fare nulla.')}</p>
      <div class="big-timer" id="waveTimer">0:00</div>
      <p class="dark-sub small">${L('minutes with you', 'minuti con te')}</p>
    </div>`, { title: L('Watch the wave.', 'Osserva l’onda.'), sub: L('Follow it with the dial, or touch the two textures.', 'Seguila con il dial, o sfiora le due texture.') });

  R.move = (a) => {
    const until = new Date(Date.now() + 20 * 60000);
    return frame(a, `
    <div class="center-stack">
      <div class="round-big walker">${I('move')}</div>
      <p class="dark-sub">${L('Your walking playlist is starting.<br>Ten minutes, around the block.', 'La tua playlist per camminare sta partendo.<br>Dieci minuti, intorno all’isolato.')}</p>
      <div class="dark-card">${I('pause', 'ico-inline')} <span><b>${L('Phone pause on', 'Pausa telefono attiva')}</b><small>${L('delivery apps until', 'app di consegna fino alle')} ${S.fmt.time(until)}</small></span></div>
    </div>`, { title: L('Move.', 'Muoviti.'), sub: L('Let’s go for a short walk.', 'Facciamo una breve passeggiata.'), button: `<div class="dark-actions"><button class="btn btn-amber" data-action="sess-next">${L('I’m walking', 'Sto camminando')}</button><button class="btn btn-dark" data-action="sess-next">${L('Not now', 'Non ora')}</button></div>`, next: false });
  };

  R.tipp = (a) => frame(a, `
    <div class="center-stack">
      <div class="round-big cold">${I('cold')}</div>
      <div class="big-timer" id="tippTimer">0:30</div>
      <p class="dark-sub">${L('Thirty seconds. Notice the temperature, nothing else.', 'Trenta secondi. Nota la temperatura, nient’altro.')}</p>
    </div>`, { title: L('Cold water.', 'Acqua fresca.'), sub: L('On your face, or hold something cold.', 'Sul viso, o tieni in mano qualcosa di freddo.') });

  R.meal = (a) => frame(a, `
    <div class="center-stack">
      <div class="breath-illus small">${S.illus('meal', true)}</div>
      <p class="sense-title" id="mealTip"></p>
      <p class="dark-sub small">${L('No rules. Just a little more attention.', 'Nessuna regola. Solo un po’ più di attenzione.')}</p>
    </div>`, { title: L('A mindful meal.', 'Un pasto consapevole.'), sub: L('Listen to the sensations.', 'Ascolta le sensazioni.') });

  R.kind = (a) => frame(a, `
    <div class="center-stack">
      <div class="intro-pebble small">${S.logoMark('pulse-mark')}</div>
      <p class="sense-title" id="kindTip"></p>
    </div>`, { title: L('A few kind words.', 'Qualche parola gentile.'), sub: L('Hold SOMA in your palm.', 'Tieni SOMA nel palmo.') });

  R.rest = (a) => frame(a, `
    <div class="center-stack rest">
      <div class="intro-pebble small">${S.logoMark('')}</div>
      <h2 class="dark-title">${L('You stayed with yourself.', 'Hai scelto di restare con te.')}</h2>
      <p class="amber">${L('Whatever happens next,<br>it’s ok. Rest now.', 'Qualunque cosa succeda adesso,<br>va bene. Ora riposa.')}</p>
      <p class="dark-sub">${L('Nothing to answer tonight.<br>We can look at it tomorrow.', 'Niente a cui rispondere stasera.<br>Possiamo guardarci domani.')}</p>
    </div>`, { button: darkBtn(L('Close', 'Chiudi'), 'sess-finish'), next: false });

  /* ---------- Per-step behaviour ---------- */
  const SETUP = {};

  SETUP.intro = (a) => { later(() => { if (SS.active === a && a.steps[a.idx] === 'intro') SS.next(); }, 7000); };

  SETUP.breathe = (a) => {
    S.device.setLight('breathe');
    const total = 6; let cycle = 0, phase = 0, sec = 4, elapsed = 0;
    const el = document.getElementById('breath');
    const word = document.getElementById('breathWord'), sub = document.getElementById('breathSub'), time = document.getElementById('breathTime');
    const shown = () => S.fmt.mmss(Math.round(elapsed * 180 / (total * 8))).padStart(5, '0') + ' / 03:00';
    const setPhase = () => {
      el.classList.toggle('swell', phase === 0);
      el.classList.toggle('soften', phase === 1);
      word.textContent = phase === 0 ? L('SQUEEZE GENTLY', 'STRINGI DELICATAMENTE') : L('RELEASE SLOWLY', 'RILASCIA PIANO');
      sub.textContent = phase === 0 ? L('Then release as you breathe out.', 'Poi rilascia mentre espiri.') : L('Let go as you breathe out.', 'Lascia andare mentre espiri.');
    };
    setPhase(); time.textContent = shown();
    every(() => {
      if (a.paused) return;
      sec--; elapsed++;
      if (sec <= 0) { phase = 1 - phase; sec = 4; if (phase === 0) cycle++; setPhase(); }
      time.textContent = shown();
      if (cycle >= total) SS.next();
    }, 1000);
  };

  SETUP.ground = (a) => {
    S.device.setLight('on');
    const senses = SENSES();
    let i = 0;
    const show = () => {
      const s = senses[i];
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      const art = document.getElementById('senseArt'); if (!art) return;
      art.innerHTML = senseCircle(s.n);
      set('senseTitle', s.t); set('senseAmber', s.a); set('senseHint', s.h); set('groundSub', s.sub);
      art.classList.remove('fade'); void art.offsetWidth; art.classList.add('fade');
    };
    SS.groundNext = () => { i++; if (i >= senses.length) { SS.groundNext = null; SS.next(); } else show(); };
    show();
    every(() => { if (!a.paused && SS.groundNext) SS.groundNext(); }, 12000);
  };

  SETUP.surf = (a) => {
    S.device.setLight('on');
    const path = document.getElementById('wavePath'), dot = document.getElementById('waveDot');
    const msg = document.getElementById('waveMsg'), tm = document.getElementById('waveTimer');
    const len = path.getTotalLength();
    let t = 0, secs = 0, stage = 0;
    a.surfBoost = 0; a.surfDone = false;
    const motion = every(() => {
      t = Math.min(1, t + 1 / 300 + a.surfBoost); a.surfBoost = 0;
      secs += 0.1 * 6;
      const p = path.getPointAtLength(len * t);
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
      tm.textContent = S.fmt.mmss(secs);
      const ns = t < 0.4 ? 0 : t < 0.6 ? 1 : 2;
      if (ns !== stage) {
        stage = ns;
        msg.textContent = [L('It is rising. You don’t have to do anything.', 'Sta salendo. Non devi fare nulla.'), L('This is the peak. Stay. It will pass.', 'Questo è il picco. Resta. Passerà.'), L('It has passed its peak.', 'Ha superato il suo picco.')][ns];
      }
      if (t >= 1 && !a.surfDone) { a.surfDone = true; clearInterval(motion); later(() => SS.next(), 1800); }
    }, 100);
  };

  SETUP.pause = () => { S.app.toast(L('Phone pause on · delivery apps paused for 20 min', 'Pausa telefono attiva · app di consegna in pausa per 20 min')); later(() => SS.next(), 5000); };

  SETUP.tipp = () => {
    let s = 30; const el = document.getElementById('tippTimer');
    every(() => { s--; el.textContent = S.fmt.mmss(s); if (s <= 0) SS.next(); }, 1000);
  };

  SETUP.meal = () => {
    const tips = [
      L('Look at the plate for a moment. Colours, shapes.', 'Guarda il piatto per un momento. Colori, forme.'),
      L('Put the fork down between bites.', 'Appoggia la forchetta tra un boccone e l’altro.'),
      L('Notice the temperature and the texture.', 'Nota la temperatura e la consistenza.'),
      L('Halfway: how hungry are you now, from 1 to 10?', 'A metà: quanta fame hai adesso, da 1 a 10?'),
      L('You can stop or continue. Both are fine.', 'Puoi fermarti o continuare. Vanno bene entrambe.')
    ];
    let i = 0; const el = document.getElementById('mealTip');
    const show = () => { el.textContent = tips[i]; el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade'); };
    show();
    every(() => { i++; if (i >= tips.length) SS.next(); else show(); }, 6000);
  };

  SETUP.kind = () => {
    const tips = [
      L('This is a hard moment. Hard moments pass.', 'Questo è un momento difficile. I momenti difficili passano.'),
      L('Many people feel this way. You are not alone in it.', 'Molte persone si sentono così. In questo, non c’è solitudine.'),
      L('May I be as kind to myself as I would be to a friend.', 'Che io possa essere gentile con me come lo sarei con un’amica o un amico.')
    ];
    let i = 0; const el = document.getElementById('kindTip');
    const show = () => { el.textContent = tips[i]; el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade'); };
    show();
    every(() => { i++; if (i >= tips.length) SS.next(); else show(); }, 6000);
  };

  SETUP.rest = () => { S.device.setLight('off'); };

  SS.render = function () {
    const a = SS.active; if (!a) return;
    const step = a.steps[a.idx];
    document.getElementById('app').innerHTML = (R[step] || R.rest)(a);
    S.app.caption();
    (SETUP[step] || (() => {}))(a);
  };

  S.session = SS;
})();
