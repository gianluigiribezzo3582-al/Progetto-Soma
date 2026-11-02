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
    if (kind === 'full') steps = ['intro', 'breathe', 'ground', 'surf', 'pause', 'move', 'rest'];
    else steps = ['intro', kind === 'surf' ? 'surf' : kind, 'rest'];
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

  /* ---------- Rendering ---------- */
  function segs(a) {
    const real = a.steps.filter(s => s !== 'intro');
    const pos = a.idx - 1;
    return `<div class="segs">${real.map((_, i) => `<i class="${i <= pos ? 'on' : ''}"></i>`).join('')}</div>`;
  }

  function frame(a, inner, opts = {}) {
    const meta = STEP_META[a.steps[a.idx]];
    return `
      <div class="scr scr-dark step-${a.steps[a.idx]}">
        <div class="dark-top">
          ${a.steps[a.idx] === 'intro' ? '<div class="segs"></div>' : segs(a)}
          <div class="dark-tools">
            <span class="hr-live" id="sessHr" title="${L('Heart rate (from SOMA)', 'Frequenza cardiaca (da SOMA)')}">${I('heart')} <b>${Math.round(S.engine.sig.hr)}</b></span>
            <button class="icon-btn ghost" data-action="support" aria-label="${L('Get help now', 'Chiedi aiuto ora')}">${I('lifebuoy')}</button>
            <button class="icon-btn ghost" data-action="voice" aria-label="${L('Voice', 'Voce')}">${I('voice', S.state.voice ? '' : 'off')}</button>
            ${a.steps[a.idx] !== 'rest' ? `<button class="icon-btn ghost" data-action="sess-stop" aria-label="${L('Stop', 'Ferma')}">${I('close')}</button>` : ''}
          </div>
        </div>
        ${meta ? `<div class="step-eyebrow">${L(meta.eyEn, meta.eyIt)}</div>` : ''}
        ${inner}
        <div class="dark-foot">
          ${opts.next !== false ? `<button class="link-next" data-action="sess-next">${opts.nextLabel || L('Next', 'Avanti')} ${I('chev')}</button>` : ''}
          <p>${L('Turn Soma face down to stop', 'Capovolgi Soma per fermarti')}</p>
        </div>
      </div>`;
  }

  const R = {};

  R.intro = (a) => frame(a, `
    <div class="center-stack">
      <div class="intro-pebble">${S.logoMark('pulse-mark')}</div>
      <h2 class="dark-title">${L('I’m here with you.', 'Sono qui con te.')}</h2>
      <p class="amber">${L('Let’s breathe together.', 'Respiriamo insieme.')}</p>
      <p class="dark-sub">${a.trigger === 'auto'
        ? L('Soma began because your body showed the signs of a wave.', 'Soma è partito perché il tuo corpo ha mostrato i segni di un’onda.')
        : L('You asked for a moment. That is already a step.', 'Hai chiesto un momento. È già un passo.')}</p>
    </div>`, { nextLabel: L('Begin', 'Inizia') });

  R.breathe = (a) => frame(a, `
    <h2 class="step-title">${L('Squeeze as it swells.', 'Stringi mentre si gonfia.')}</h2>
    <div class="center-stack">
      <div class="breath" id="breath" data-hold="squeeze">
        <div class="breath-halo"></div>
        <div class="breath-ring"></div>
        <div class="breath-core"><span id="breathWord">${L('squeeze', 'stringi')}</span><small id="breathSec">4 ${L('seconds', 'secondi')}</small></div>
      </div>
      <p class="dark-sub">${L('…and release as it softens.', '…e rilascia mentre si ammorbidisce.')}</p>
      <p class="breathe-fb" id="breatheFb">${L('Squeeze SOMA — or press the circle', 'Stringi SOMA — o premi il cerchio')}</p>
      <div class="bar"><i id="breathBar"></i></div>
    </div>`);

  R.ground = (a) => frame(a, `
    <h2 class="step-title">${L('Trace the circles under your thumb.', 'Segui i cerchi sotto il pollice.')}</h2>
    <div class="center-stack">
      <svg class="ripples" viewBox="0 0 200 200" aria-hidden="true">
        ${[20, 36, 52, 68, 84].map((r, i) => `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${i % 2 ? '#7C7FB8' : '#C9C27A'}" stroke-width="1.6" opacity="${0.5 + i * 0.1}"/>`).join('')}
        <circle r="5" fill="var(--amber)" class="tracer"><animateMotion dur="6s" repeatCount="indefinite" path="M100,32 a68,68 0 1,1 -0.1,0"/></circle>
      </svg>
      <p class="sense" id="sense"></p>
      <p class="dark-sub small">${L('You don’t need to say them aloud.', 'Non serve dirle ad alta voce.')}</p>
      <div class="sense-dots" id="senseDots">${[5, 4, 3, 2, 1].map(n => `<i>${n}</i>`).join('')}</div>
    </div>`, { nextLabel: L('Next sense', 'Senso successivo') });

  R.surf = (a) => frame(a, `
    <h2 class="step-title">${L('Follow the wave with the dial.', 'Segui l’onda con il dial.')}</h2>
    <div class="center-stack">
      <svg class="wave-svg" viewBox="0 0 260 140" aria-hidden="true">
        <path id="wavePath" d="M10,120 C70,120 90,20 130,20 C170,20 190,120 250,120" fill="none" stroke="#C9C27A" stroke-width="2.5" stroke-linecap="round"/>
        <circle id="waveDot" r="6.5" fill="#fff" stroke="var(--amber)" stroke-width="2"/>
      </svg>
      <p class="amber" id="waveMsg">${L('It is rising. You don’t have to do anything.', 'Sta salendo. Non devi fare nulla.')}</p>
      <div class="big-timer" id="waveTimer">0:00</div>
      <p class="dark-sub small">${L('minutes with you', 'minuti con te')}</p>
    </div>`);

  R.pause = (a) => {
    const until = new Date(Date.now() + 20 * 60000);
    return frame(a, `
    <h2 class="step-title">${L('Some apps can wait.', 'Alcune app possono aspettare.')}</h2>
    <div class="center-stack">
      <div class="round-big">${I('pause')}</div>
      <div class="dark-card">${I('pause', 'ico-inline')} <span><b>${L('Phone pause on', 'Pausa telefono attiva')}</b><small>${L('delivery apps until', 'app di consegna fino alle')} ${S.fmt.time(until)}</small></span></div>
      <p class="dark-sub">${L('Agreed with ' + S.drName() + '. It starts by itself and ends by itself.', 'Concordata con ' + S.drName() + '. Parte da sola e finisce da sola.')}</p>
    </div>`);
  };

  R.move = (a) => {
    const until = new Date(Date.now() + 20 * 60000);
    return frame(a, `
    <h2 class="step-title">${L('Let’s go for a short walk.', 'Facciamo una breve passeggiata.')}</h2>
    <div class="center-stack">
      <div class="round-big walker">${I('move')}</div>
      <p class="dark-sub">${L('Your walking playlist is starting.<br>Ten minutes, around the block.', 'La tua playlist per camminare sta partendo.<br>Dieci minuti, intorno all’isolato.')}</p>
      <div class="dark-card">${I('pause', 'ico-inline')} <span><b>${L('Phone pause on', 'Pausa telefono attiva')}</b><small>${L('delivery apps until', 'app di consegna fino alle')} ${S.fmt.time(until)}</small></span></div>
      <div class="dark-actions"><button class="btn btn-amber" data-action="sess-next">${L('I’m walking', 'Sto camminando')}</button><button class="btn btn-ghost-dark" data-action="sess-next">${L('Not now', 'Non ora')}</button></div>
    </div>`, { next: false });
  };

  R.tipp = (a) => frame(a, `
    <h2 class="step-title">${L('Cool water on your face, or hold something cold.', 'Acqua fresca sul viso, o tieni in mano qualcosa di freddo.')}</h2>
    <div class="center-stack">
      <div class="round-big cold">${I('cold')}</div>
      <div class="big-timer" id="tippTimer">0:30</div>
      <p class="dark-sub">${L('Thirty seconds. Notice the temperature, nothing else.', 'Trenta secondi. Nota la temperatura, nient’altro.')}</p>
    </div>`);

  R.meal = (a) => frame(a, `
    <h2 class="step-title">${L('A slower meal.', 'Un pasto più lento.')}</h2>
    <div class="center-stack">
      <div class="round-big">${I('meal')}</div>
      <p class="sense" id="mealTip"></p>
      <p class="dark-sub small">${L('No rules. Just a little more attention.', 'Nessuna regola. Solo un po’ più di attenzione.')}</p>
    </div>`);

  R.kind = (a) => frame(a, `
    <h2 class="step-title">${L('A few kind words.', 'Qualche parola gentile.')}</h2>
    <div class="center-stack">
      <div class="intro-pebble small">${S.logoMark('pulse-mark')}</div>
      <p class="sense" id="kindTip"></p>
    </div>`);

  R.rest = (a) => frame(a, `
    <div class="center-stack rest">
      <h2 class="dark-title">${L('You stayed with yourself.', 'Hai scelto di restare con te.')}</h2>
      <p class="amber">${L('Whatever happens next,<br>it’s ok. Rest now.', 'Qualunque cosa succeda adesso,<br>va bene. Ora riposa.')}</p>
      <p class="dark-sub">${L('Nothing to answer tonight.<br>We can look at it tomorrow.', 'Niente a cui rispondere stasera.<br>Possiamo guardarci domani.')}</p>
      <button class="btn btn-ghost-dark" data-action="sess-finish">${L('Close', 'Chiudi')}</button>
    </div>`, { next: false });

  /* ---------- Per-step behaviour ---------- */
  const SETUP = {};

  SETUP.intro = (a) => { later(() => { if (SS.active === a && a.steps[a.idx] === 'intro') SS.next(); }, 6000); };

  SETUP.breathe = (a) => {
    S.device.setLight('breathe');
    const total = 6; let cycle = 0, phase = 0, sec = 4;
    const el = document.getElementById('breath');
    const word = document.getElementById('breathWord'), sc = document.getElementById('breathSec'), bar = document.getElementById('breathBar');
    const setPhase = () => {
      el.classList.toggle('swell', phase === 0);
      el.classList.toggle('soften', phase === 1);
      word.textContent = phase === 0 ? L('squeeze', 'stringi') : L('release', 'rilascia');
    };
    setPhase();
    every(() => {
      sec--;
      if (sec <= 0) { phase = 1 - phase; sec = 4; if (phase === 0) cycle++; setPhase(); }
      sc.textContent = sec + ' ' + (sec === 1 ? L('second', 'secondo') : L('seconds', 'secondi'));
      bar.style.width = Math.min(100, ((cycle * 8 + (phase * 4) + (4 - sec)) / (total * 8)) * 100) + '%';
      if (cycle >= total) SS.next();
    }, 1000);
  };

  SETUP.ground = (a) => {
    S.device.setLight('on');
    const prompts = [
      L('Now name five things you can see.', 'Ora nomina cinque cose che puoi vedere.'),
      L('Four things you can feel.', 'Quattro cose che puoi sentire al tatto.'),
      L('Three things you can hear.', 'Tre cose che puoi udire.'),
      L('Two things you can smell.', 'Due cose di cui senti l’odore.'),
      L('One thing you can taste.', 'Una cosa di cui senti il sapore.')
    ];
    let i = 0;
    const show = () => {
      const el = document.getElementById('sense'); if (!el) return;
      el.textContent = prompts[i];
      el.classList.remove('fade'); void el.offsetWidth; el.classList.add('fade');
      document.querySelectorAll('#senseDots i').forEach((d, k) => d.classList.toggle('on', k <= i));
    };
    SS.groundNext = () => { i++; if (i >= prompts.length) { SS.groundNext = null; SS.next(); } else show(); };
    show();
    every(() => SS.groundNext && SS.groundNext(), 7000);
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
