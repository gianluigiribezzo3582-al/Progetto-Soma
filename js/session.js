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
    else steps = ({ breathe: ['breathe', 'rest'], ground: ['ground', 'groundDone'], surf: ['surf', 'move', 'rest'], move: ['move', 'rest'], kind: ['kind'], meal: ['meal'], tipp: ['tipp', 'rest'] })[kind] || [kind, 'rest'];
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
    if (!['intro', 'rest', 'groundDone'].includes(cur) && !a.done.includes(cur)) a.done.push(cur);
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

  SS.finish = function (target) {
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
        done: a.done.slice(),
        hrPeak: metrics ? metrics.hrPeak : 98,
        hrEnd: metrics ? metrics.hrEnd : 74,
        outcome: null,
        live: true
      };
      st.history.push(rec);
      st.pendingMorning = rec.id;
      S.save();
      S.app.toast(L('Saved. Tomorrow morning, one optional question.', 'Salvato. Domattina troverai una sola domanda, facoltativa.'));
    } else {
      // count as daily practice
      const w = S.state.week - 1;
      if (S.state.practicedOn !== new Date().toDateString()) S.state.practice[w] = Math.min(7, (S.state.practice[w] || 0) + 1);
      S.state.practicedOn = new Date().toDateString();
      S.app.toast(L('Practice done for today.', 'Pratica di oggi completata.'));
      S.save();
    }
    S.app.go(target || (a.kind === 'full' ? 'today' : 'practice'));
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

  /* ---------- Rendering (designs 19–31, 37, 42) ---------- */
  const PROG = ['breathe', 'ground', 'surf', 'move', 'rest'];
  function segBar(n, on) {
    return `<div class="segs" id="segs">${[...Array(n)].map((_, i) => `<i class="${i < on ? 'on' : ''}"></i>`).join('')}</div>`;
  }
  function segs(a, opts) {
    if (opts.segs === false) return '';
    if (opts.segs) return segBar(opts.segs[0], opts.segs[1]);
    if (a.kind !== 'full') return '';
    const pos = PROG.indexOf(a.steps[a.idx]);
    return pos < 0 ? '' : segBar(PROG.length, pos + 1);
  }

  /* opts: title, sub, button (html), link (html), segs ([n, on] | false) */
  function frame(a, inner, opts = {}) {
    const step = a.steps[a.idx];
    const end = ['rest', 'groundDone', 'kind', 'meal'].includes(step);
    return `
      <div class="scr scr-dark step-${step}">
        <div class="topbar">
          <button class="back-btn" data-action="${end ? 'sess-finish' : 'sess-stop'}" aria-label="${L('Back', 'Indietro')}">${I('back')}</button>
          <div class="dark-tools">
            <span class="hr-live" id="sessHr" title="${L('Heart rate (from SOMA)', 'Frequenza cardiaca (da SOMA)')}">${I('heart')} <b>${Math.round(S.engine.sig.hr)}</b></span>
            <button class="icon-btn ghost" data-action="support" aria-label="${L('Get help now', 'Chiedi aiuto ora')}">${I('lifebuoy')}</button>
            <button class="icon-btn ghost" data-action="voice" aria-label="${L('Voice', 'Voce')}">${I('voice', S.state.voice ? '' : 'off')}</button>
          </div>
        </div>
        ${opts.title ? `<h1 class="dark-h1">${opts.title}</h1>` : ''}
        ${opts.sub ? `<p class="dark-lead" id="${opts.subId || ''}">${opts.sub}</p>` : ''}
        ${step === 'intro' ? '' : segs(a, opts)}
        ${inner}
        <div class="dark-foot">
          ${opts.button || ''}
          ${opts.link || ''}
        </div>
      </div>`;
  }
  const darkBtn = (label, action, id, to) => `<button class="btn btn-dark btn-block" data-action="${action}" ${id ? `id="${id}"` : ''} ${to ? `data-to="${to}"` : ''}>${label}</button>`;
  const darkLink = (label, action) => `<button class="link-next" data-action="${action}">${label}</button>`;

  const R = {};

  R.intro = (a) => frame(a, `
    <div class="center-stack">
      <div class="intro-pebble">${S.logoMark('pulse-mark')}</div>
      <h2 class="dark-title">${L('I’m here with you.', 'Sono qui con te.')}</h2>
      <p class="amber">${L('Let’s breathe together.', 'Respiriamo insieme.')}</p>
      <p class="dark-sub">${a.trigger === 'auto'
        ? L('Soma began because your body showed the signs of a wave.', 'Soma è partito perché il tuo corpo ha mostrato i segni di un’onda.')
        : L('You asked for a moment. That is already a step.', 'Hai chiesto un momento. È già un passo.')}</p>
    </div>`, { button: darkBtn(L('Begin', 'Inizia'), 'sess-next') });

  R.breathe = (a) => frame(a, `
    <div class="center-stack">
      <div class="breath-illus" id="breath" data-hold="squeeze">${S.illus('breathe', true)}</div>
      <p class="instr" id="breathWord">${L('SQUEEZE GENTLY', 'STRINGI DELICATAMENTE')}</p>
      <p class="dark-sub strong" id="breathSub">${L('Then release as you breathe out.', 'Poi rilascia mentre espiri.')}</p>
      <p class="breathe-fb" id="breatheFb">${L('Squeeze SOMA, or press the drawing', 'Stringi SOMA, oppure premi il disegno')}</p>
      <p class="timer-line" id="breathTime">00:00 / 03:00</p>
    </div>`, { title: L('Breathe in calmly.', 'Inspira con calma.'), sub: L('Follow the pressure of your hands.', 'Segui la pressione delle mani.'), segs: a.kind === 'full' ? undefined : [3, 1], button: darkBtn(L('Pause', 'Pausa'), 'sess-pause', 'pauseBtn'), link: darkLink(L('Skip', 'Salta') + ' ›', 'sess-next') });

  const SENSES = () => [
    { n: 5, sub: L('One sense at a time.', 'Un senso per volta.'), t: L('Look around you.', 'Guarda intorno a te.'), a: L('5 things you can see', '5 cose che puoi vedere'), h: L('You don’t need to name them out loud.', 'Non devi nominarle ad alta voce.'), bold: true },
    { n: 4, sub: L('4 things you can feel.', '4 cose che puoi percepire.'), t: L('Follow the dots of SOMA, one at a time', 'Segui i puntini di SOMA, uno alla volta'), a: '', h: L('Notice four sensations: texture, temperature, pressure and contact.', 'Nota quattro sensazioni: rilievo, temperatura, pressione e contatto.'), bold: true },
    { n: 3, sub: L('3 things you can hear.', '3 cose che puoi ascoltare.'), t: L('Listen around you', 'Ascolta intorno a te'), a: '', h: L('Pay attention to three sounds, near or far.', 'Presta attenzione a tre suoni, vicini o lontani.') },
    { n: 2, sub: L('2 things you can smell.', '2 cose che puoi annusare.'), t: L('Notice two smells', 'Riconosci due odori'), a: '', h: L('If there are no smells, listen to the rhythm of your breath.', 'In assenza di odori, ascolta il ritmo del tuo respiro.') },
    { n: 1, sub: L('1 thing you can taste.', '1 cosa che puoi assaporare.'), t: L('Notice a taste', 'Riconosci un sapore'), a: '', h: L('Feel a taste that is there, or recall one from memory.', 'Senti un gusto presente o rievocane uno a memoria.') }
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
    </div>`, { title: 'Grounding 5-4-3-2-1', sub: s.sub, subId: 'groundSub', segs: [5, 1], button: darkBtn(L('Continue', 'Continua'), 'sess-next', 'groundBtn') });
  };

  R.groundDone = (a) => frame(a, `
    <div class="center-stack">
      <div class="intro-pebble">${S.logoMark('')}</div>
      <p class="sense-title light">${L('One detail at a time.', 'Un dettaglio alla volta.')}</p>
      <p class="dark-sub">${L('You can always start again from here.<br>No hurry and no judgement.', 'Ogni volta puoi ripartire da qui.<br>Senza fretta e senza giudizio.')}</p>
    </div>`, { title: L('Grounding complete', 'Grounding completato'), sub: L('You came back to what surrounds you.', 'Sei tornata a ciò che ti circonda.'), segs: false, button: darkBtn(L('Back to practice', 'Torna alla pratica'), 'sess-finish', null, 'practice') });

  const guideWords = () => {
    const w = L(S.state.guideWords.en, S.state.guideWords.it);
    const i = w.indexOf('. ');
    return i > 0 ? [w.slice(0, i + 1), w.slice(i + 2)] : [w, ''];
  };
  R.surf = (a) => {
    const [t1, t2] = guideWords();
    return frame(a, `
    <div class="center-stack">
      <svg class="wave-svg" viewBox="0 0 300 120" aria-hidden="true">
        <path id="wavePath" d="M4 104 C40 104 70 22 110 22 S170 92 220 100 S270 104 296 104" fill="none" stroke="#F2B780" stroke-width="3" stroke-linecap="round"/>
        <circle id="waveDot" r="6" fill="#F2B780"/>
      </svg>
      <p class="sense-title">${S.esc(t1)}</p>
      <p class="dark-sub">${S.esc(t2)}</p>
      <div class="big-timer" id="waveTimer">00:00</div>
      <p class="dark-sub small">${L('time elapsed', 'tempo trascorso')}</p>
    </div>`, { title: L('Watch the wave.', 'Osserva l’onda.'), sub: L('Urge surfing · one moment at a time', 'Urge surfing · un momento alla volta'),
      button: darkBtn(L('Go on to the walk', 'Passa alla camminata'), 'sess-next'), link: darkLink(L('End the practice', 'Termina la pratica'), a.kind === 'full' ? 'sess-stop' : 'sess-finish') });
  };

  R.move = (a) => frame(a, `
    <div class="center-stack">
      <svg class="steps-svg" viewBox="0 0 120 150" aria-hidden="true">
        <path d="M44 8c-8 10 4 18 18 26s22 22 4 34-30 18-36 32" fill="none" stroke="#A3A567" stroke-width="2.4" stroke-linecap="round"/>
        <g fill="#F2B780"><ellipse cx="52" cy="38" rx="5" ry="10" transform="rotate(-30 52 38)"/><ellipse cx="80" cy="70" rx="5" ry="10" transform="rotate(-15 80 70)"/><ellipse cx="54" cy="96" rx="5" ry="10" transform="rotate(-20 54 96)"/></g>
      </svg>
      <p class="sense-title">${L('Bring your attention to your steps.', 'Porta l’attenzione ai passi.')}</p>
      <p class="dark-sub">${L('Feel your feet touching the ground.<br>Notice what is around you.<br>Walk without looking for a performance.', 'Senti i piedi appoggiarsi a terra.<br>Nota ciò che ti circonda.<br>Cammina senza cercare una prestazione.')}</p>
    </div>`, { title: L('Walk calmly.', 'Cammina con calma.'), sub: L('Mindful movement · at your own pace', 'Movimento consapevole · al tuo ritmo'), button: darkBtn(L('Finish and rest', 'Concludi e riposa'), 'sess-next') });

  R.tipp = (a) => frame(a, `
    <div class="center-stack">
      <div class="round-big cold">${I('cold')}</div>
      <div class="big-timer" id="tippTimer">0:30</div>
      <p class="dark-sub">${L('Thirty seconds. Notice the temperature, nothing else.', 'Trenta secondi. Nota la temperatura, nient’altro.')}</p>
    </div>`, { title: L('Cold water.', 'Acqua fresca.'), sub: L('On your face, or hold something cold.', 'Sul viso, o tieni in mano qualcosa di freddo.'), button: darkBtn(L('Continue', 'Continua'), 'sess-next') });

  R.meal = (a) => frame(a, `
    <div class="center-stack">
      <svg class="calm-circle" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="none" stroke="#A3A567" stroke-width="2.5"/><circle class="breathing-ring" cx="80" cy="80" r="50" fill="none" stroke="#A3A567" stroke-width="2.5"/></svg>
      <p class="sense-title">${L('Notice the taste and the texture.', 'Nota il sapore e la consistenza.')}</p>
      <p class="dark-sub">${L('Take the time to observe<br>what you feel while you eat.<br>There is no right pace to reach.', 'Prenditi il tempo per osservare<br>ciò che senti mentre mangi.<br>Non c’è un ritmo giusto da raggiungere.')}</p>
    </div>`, { title: L('A mindful meal.', 'Un pasto consapevole.'), sub: L('Listen to the sensations, without judging them.', 'Ascolta le sensazioni, senza giudicarle.'), segs: false, button: darkBtn(L('Back to practices', 'Torna alle pratiche'), 'sess-finish', null, 'practice') });

  R.kind = (a) => frame(a, `
    <div class="center-stack">
      <svg class="calm-circle" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="none" stroke="#A3A567" stroke-width="2.5"/><path d="M80 112s-30-17-30-38a16 16 0 0 1 30-8 16 16 0 0 1 30 8c0 21-30 38-30 38z" fill="none" stroke="#F2B780" stroke-width="3" stroke-linejoin="round"/></svg>
      <p class="sense-title">${L('You don’t have to judge yourself.', 'Non devi giudicarti.')}</p>
      <p class="dark-sub strong">${L('“This moment is difficult.<br>I can treat myself with kindness.”', '“Questo momento è difficile.<br>Posso trattarmi con gentilezza.”')}</p>
      <p class="dark-sub small">${L('You can repeat it to yourself, if it feels right.', 'Puoi ripetertelo, se ti fa sentire a tuo agio.')}</p>
    </div>`, { title: L('Speak to yourself kindly.', 'Parlati con gentilezza.'), sub: L('Self-compassion · a space for you', 'Autocompassione · uno spazio per te'), segs: false, button: darkBtn(L('Back to practices', 'Torna alle pratiche'), 'sess-finish', null, 'practice') });

  R.rest = (a) => frame(a, `
    <div class="center-stack rest">
      <svg class="calm-circle" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="none" stroke="#A3A567" stroke-width="2.5"/><circle class="breathing-dot" cx="80" cy="80" r="5" fill="#F2B780"/></svg>
      <p class="sense-title">${L('You gave yourself a moment.', 'Ti sei dedicata un momento.')}</p>
      <p class="dark-sub">${L('Now you can rest.<br>There is nothing to fill in now.', 'Ora puoi riposare.<br>Non c’è nulla da compilare adesso.')}</p>
    </div>`, { title: L('Stay with yourself.', 'Resta con te.'), sub: L('The guidance ends here.', 'La guida finisce qui.'), segs: a.kind === 'full' ? undefined : false, button: darkBtn(L('Back to home', 'Torna alla home'), 'sess-finish', null, 'today') });

  /* ---------- Per-step behaviour ---------- */
  const SETUP = {};

  SETUP.intro = (a) => { later(() => { if (SS.active === a && a.steps[a.idx] === 'intro') SS.next(); }, 7000); };

  SETUP.breathe = (a) => {
    S.device.setLight('breathe');
    const total = 6; let cycle = 0, phase = 0, sec = 4, elapsed = 0;
    const el = document.getElementById('breath');
    const word = document.getElementById('breathWord'), sub = document.getElementById('breathSub'), time = document.getElementById('breathTime');
    const shownSec = () => Math.round(elapsed * 180 / (total * 8));
    const shown = () => S.fmt.mmss(shownSec()).padStart(5, '0') + ' / 03:00';
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
      if (a.kind !== 'full') { const sg = document.getElementById('segs'); if (sg) sg.outerHTML = segBar(3, Math.min(3, 1 + Math.floor(shownSec() / 60))); }
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
      document.getElementById('senseTitle').classList.toggle('light', !s.bold);
      document.getElementById('senseAmber').hidden = !s.a;
      const sg = document.getElementById('segs'); if (sg) sg.outerHTML = segBar(5, i + 1);
      set('groundBtn', i === senses.length - 1 ? L('Finish', 'Termina') : L('Continue', 'Continua'));
      art.classList.remove('fade'); void art.offsetWidth; art.classList.add('fade');
    };
    SS.groundNext = () => { i++; if (i >= senses.length) { SS.groundNext = null; SS.next(); } else show(); };
    show();
  };

  SETUP.surf = (a) => {
    S.device.setLight('on');
    const path = document.getElementById('wavePath'), dot = document.getElementById('waveDot');
    const tm = document.getElementById('waveTimer');
    const len = path.getTotalLength();
    let t = 0, secs = 0;
    a.surfBoost = 0;
    every(() => {
      if (a.paused) return;
      t = (t + 1 / 400 + a.surfBoost) % 1; a.surfBoost = 0;
      secs += 0.1 * 6;
      const p = path.getPointAtLength(len * t);
      dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
      tm.textContent = S.fmt.mmss(secs).padStart(5, '0');
    }, 100);
  };

  SETUP.tipp = () => {
    let s = 30; const el = document.getElementById('tippTimer');
    every(() => { s--; el.textContent = S.fmt.mmss(s); if (s <= 0) SS.next(); }, 1000);
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
