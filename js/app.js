/* SOMA — app shell: routing, events, AI console, toasts, tooltips. */
(function () {
  const A = {};
  const OB = ['welcome', 'code', 'pair', 'agree', 'programme', 'listening'];
  const TABS = ['today', 'practice', 'waves', 'me'];
  let view = 'today';
  const $ = (id) => document.getElementById(id);

  /* ---------------- Rendering ---------------- */
  A.render = function () {
    if (S.session.active) { S.session.render(); return; }
    const st = S.state;
    let html;
    if (!st.onboarded) {
      html = S.screens[OB[st.onboardStep]]();
    } else {
      html = S.screens[view]();
      if (TABS.includes(view)) html += S.tabbar(view);
    }
    const app = $('app');
    const keepScroll = app.dataset.view === view ? app.scrollTop : 0;
    app.innerHTML = html;
    app.dataset.view = st.onboarded ? view : OB[st.onboardStep];
    app.scrollTop = keepScroll;
    A.caption();
    if (view === 'report' && S.reportDraft.stage === 'analyzing') runAnalysis();
  };

  A.go = function (v) {
    view = v;
    $('app').scrollTop = 0;
    A.render();
  };

  A.setDark = function (on) {
    $('phone').classList.toggle('is-dark', on);
    statusbar();
  };

  /* ---------------- Status bar ---------------- */
  function statusbar() {
    $('statusbar').innerHTML = `<span class="sb-time">${S.fmt.time(new Date())}</span>
      <span class="sb-icons"><svg viewBox="0 0 18 12" width="17" height="11"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg viewBox="0 0 16 12" width="15" height="11"><path d="M8 11.5l2.2-2.6a3 3 0 0 0-4.4 0zM3.4 6.6a6.5 6.5 0 0 1 9.2 0l1.4-1.6a8.7 8.7 0 0 0-12 0zM0.6 3.4a10.8 10.8 0 0 1 14.8 0L16.8 1.8a13 13 0 0 0-17.6 0z"/></svg>
      <svg viewBox="0 0 26 12" width="25" height="12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="2" y="2" width="16" height="8" rx="1.6"/><rect x="23.5" y="4" width="1.8" height="4" rx="1" opacity=".5"/></svg></span>`;
  }

  /* ---------------- Caption under the phone (for presenting) ---------------- */
  A.caption = function () {
    const st = S.state;
    let c;
    if (S.session.active) {
      const step = S.session.active.steps[S.session.active.idx];
      c = {
        intro: L('Guided sequence · “I’m here with you.”', 'Sequenza guidata · “Sono qui con te.”'),
        breathe: L('1 · Breathe — squeeze SOMA as the circle swells', '1 · Respira — stringi SOMA mentre il cerchio si gonfia'),
        ground: L('2 · Ground — 5-4-3-2-1 senses, thumb on the ripples', '2 · Radicati — 5-4-3-2-1 sensi, pollice sulle onde'),
        surf: L('3 · Surf — urge surfing: the wave rises, peaks, passes (rotate SOMA)', '3 · Cavalca — urge surfing: l’onda sale, ha un picco, passa (ruota SOMA)'),
        pause: L('4 · Phone pause — delivery apps paused, agreed in therapy', '4 · Pausa telefono — app di consegna in pausa, concordata in terapia'),
        move: L('5 · Move — a short walk with music', '5 · Muoviti — una breve passeggiata con musica'),
        rest: L('6 · Rest — no questions tonight', '6 · Riposa — nessuna domanda stasera'),
        tipp: L('TIPP — cold water (DBT)', 'TIPP — acqua fredda (DBT)'),
        meal: L('A slower meal — mindful eating', 'Un pasto più lento — mindful eating'),
        kind: L('Self-compassion', 'Autocompassione')
      }[step];
    } else if (!st.onboarded) {
      c = [L('Onboarding · in session with the therapist', 'Onboarding · in seduta con il terapeuta'),
        'Activation · the clinic links the app to the patient’s care team',
        L('1 · Pairing in session — hold SOMA for three seconds', '1 · Associazione in seduta — tieni SOMA per tre secondi'),
        L('2 · What we agree on — consent, decided together and revocable', '2 · Su cosa siamo d’accordo — consenso deciso insieme e revocabile'),
        L('3 · The programme prescribed by the therapist', '3 · Il programma prescritto dal terapeuta'),
        L('4 · Listening first — why Soma stays quiet for three weeks', '4 · Prima, ascoltare — perché Soma resta in silenzio tre settimane')][st.onboardStep];
    } else {
      c = {
        today: L('Today · phase of the personal model, daily practice, insights', 'Oggi · fase del modello personale, pratica quotidiana, insight'),
        practice: L('Practice · evidence-based skills (CBT, DBT, mindfulness)', 'Pratica · abilità basate su evidenze (CBT, DBT, mindfulness)'),
        waves: L('Waves · what the data shows, in plain words', 'Onde · cosa mostrano i dati, in parole semplici'),
        me: L('Me · device, consent, settings set with the therapist', 'Io · dispositivo, consenso, impostazioni concordate'),
        morning: L('Morning after · plain words, one optional tap', 'Il mattino dopo · parole semplici, un tocco facoltativo'),
        report: L('Report · AI summary for the therapist, only agreed data', 'Report · sintesi IA per il terapeuta, solo dati concordati'),
        message: 'Care team · secure messages with the therapist (not for emergencies)'
      }[view];
    }
    $('caption').textContent = c || '';
  };

  /* ---------------- Toasts ---------------- */
  A.toast = function (msg, kind = '') {
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.innerHTML = `${S.miniPebble(18)}<span>${msg}</span>`;
    $('toasts').appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, 3200);
    const all = $('toasts').children;
    if (all.length > 2) all[0].remove();
  };

  /* ---------------- Modal sheet inside the phone ---------------- */
  A.modal = function (html) {
    A.closeModal();
    const m = document.createElement('div');
    m.className = 'modal-layer';
    m.innerHTML = `<div class="modal-backdrop" data-action="modal-close"></div><div class="modal-card" role="dialog" aria-modal="true">${html}</div>`;
    $('phone').appendChild(m);
    requestAnimationFrame(() => m.classList.add('in'));
  };
  A.closeModal = function () {
    document.querySelectorAll('.modal-layer').forEach(m => m.remove());
  };

  /* ---------------- AI console ---------------- */
  const SIGNALS = [
    { k: 'hr', en: 'Heart rate', it: 'Freq. cardiaca', u: 'bpm', d: 0, src: 'PPG' },
    { k: 'hrv', en: 'HRV', it: 'HRV', u: 'ms', d: 0, src: 'PPG' },
    { k: 'eda', en: 'Skin conductance', it: 'Conduttanza cutanea', u: 'µS', d: 1, src: 'EDA' },
    { k: 'temp', en: 'Skin temperature', it: 'Temperatura cutanea', u: '°C', d: 1, src: 'TEMP' },
    { k: 'grip', en: 'Grip pressure', it: 'Pressione della presa', u: '%', d: 0, src: 'GRIP' }
  ];
  const STAGES = [['SIGNALS', 'SEGNALI'], ['FEATURES', 'FEATURE'], ['BASELINE', 'BASELINE'], ['SIGNATURE', 'FIRMA'], ['INDEX', 'INDICE'], ['START', 'AVVIO']];

  function aiPanel() {
    return `
    <div class="ai">
      <div class="side-head">
        <div><div class="eyebrow">${L('On-device AI · simulated', 'IA sul dispositivo · simulata')}</div><h2 class="side-title">${L('What Soma hears', 'Cosa sente Soma')}</h2></div>
        <span class="pill" data-k="mode"></span>
      </div>
      <div class="pipeline">${STAGES.map((s, i) => `<span data-stage="${i}">${L(s[0], s[1])}</span>`).join('<i></i>')}</div>
      <div class="ai-index">
        <div data-k="gauge"></div>
        <div class="ai-index-meta">
          <b>${L('Wave index', 'Indice d’onda')}</b>
          <span>${L('probability, updated every 30 s', 'probabilità, aggiornata ogni 30 s')}</span>
          <span>${L('Threshold', 'Soglia')} <b data-k="thr"></b> · ${L('set with', 'concordata con')} ${S.esc(S.drName())}</span>
          <span>${L('Confidence', 'Confidenza')} <b data-k="conf"></b> · ${L('signature match', 'match con la firma')} <b data-k="match"></b></span>
        </div>
      </div>
      <div class="signals">
        ${SIGNALS.map(s => `<div class="sig"><span class="sig-name">${L(s.en, s.it)}<small>${s.src}</small></span><span class="sig-spark" data-spark="${s.k}"></span><span class="sig-val"><b data-val="${s.k}"></b> ${s.u}</span></div>`).join('')}
      </div>
      <div class="ai-actions">
        <button data-action="sim-wave" class="act-wave">${L('Simulate a rising urge', 'Simula un impulso che sale')}</button>
        <button data-action="sim-stress">${L('Ordinary stress', 'Stress ordinario')}</button>
        <button data-action="sim-calm">${L('Calm', 'Calma')}</button>
      </div>
      <div class="ai-log" data-k="log"></div>
      <div class="demo-box">
        <div class="eyebrow">Demo controls</div>
        <div class="demo-row"><span>Jump to</span>
          ${[[2, 'Week 2 · Listening'], [5, 'Week 5 · Learning'], [9, 'Week 9 · Guiding']].map(([w, l]) => `<button data-action="week" data-week="${w}" class="${S.state.week === w ? 'is-on' : ''}">${l}</button>`).join('')}
        </div>
        <div class="demo-row"><button data-action="morning-demo">Morning after</button><button data-action="restart-ob">Replay onboarding</button><button data-action="reset">Reset demo</button></div>
      </div>
      <p class="side-note">${L('Values are synthetic. The model compares your signals with your own baseline: no single signal is ever read as a binge episode.', 'I valori sono sintetici. Il modello confronta i segnali con la tua baseline: nessun singolo segnale viene mai letto come un episodio di abbuffata.')}</p>
    </div>`;
  }

  function mountAI(el) { el.setAttribute('data-mount', 'ai'); el.innerHTML = aiPanel(); updateAI(); }

  function updateAI() {
    const E = S.engine;
    const modeLabel = { calm: L('calm', 'calma'), rising: L('rising', 'in salita'), stress: L('stress', 'stress'), settling: L('settling', 'si calma') }[E.mode];
    document.querySelectorAll('[data-mount="ai"]').forEach(root => {
      const q = (s) => root.querySelector(s);
      const m = q('[data-k="mode"]'); if (!m) return;
      m.textContent = modeLabel; m.className = 'pill mode-' + E.mode;
      q('[data-k="gauge"]').innerHTML = S.charts.gauge(E.index, E.threshold(), { label: 'index' });
      q('[data-k="thr"]').textContent = Math.round(E.threshold() * 100) + '%';
      q('[data-k="conf"]').textContent = Math.round(E.confidence * 100) + '%';
      q('[data-k="match"]').textContent = Math.round(E.match * 100) + '%';
      root.querySelectorAll('[data-stage]').forEach(s => {
        const i = +s.dataset.stage;
        s.classList.toggle('lit', i <= E.stage);
        s.classList.toggle('fire', i === 5 && E.stage === 5);
      });
      SIGNALS.forEach(s => {
        const v = E.sig[s.k];
        q(`[data-val="${s.k}"]`).textContent = S.fmt.num(v, s.d);
        const range = { hr: [60, 110], hrv: [20, 65], eda: [1, 9], temp: [31.8, 33.6], grip: [0, 100] }[s.k];
        q(`[data-spark="${s.k}"]`).innerHTML = S.charts.spark(E.buf[s.k], { min: range[0], max: range[1], color: s.k === 'grip' ? 'var(--amber-deep)' : 'var(--olive-deep)', w: 110, h: 26 });
      });
      const log = q('[data-k="log"]');
      const html = E.log.slice(0, 7).map(l => `<div class="log-${l.kind}"><time>${S.fmt.time(l.at)}</time>${S.lang === 'it' ? l.it : l.en}</div>`).join('');
      if (log.innerHTML !== html) log.innerHTML = html;
    });
    const hr = document.querySelector('#sessHr b');
    if (hr) hr.textContent = Math.round(E.sig.hr);
  }

  /* ---------------- Mobile sheet ---------------- */
  let sheetTab = 'device';
  function sheetRender() {
    document.querySelectorAll('[data-sheet-tab]').forEach(b => {
      b.classList.toggle('is-on', b.dataset.sheetTab === sheetTab);
      b.textContent = b.dataset.sheetTab === 'device' ? 'SOMA object' : 'AI & demo';
    });
    const c = $('sheetContent');
    c.removeAttribute('data-mount');
    if (sheetTab === 'device') S.device.mount(c); else mountAI(c);
    c.scrollTop = 0;
  }
  function openSheet(tab) {
    if (tab) sheetTab = tab;
    $('sheet').classList.add('open');
    $('sheet').setAttribute('aria-hidden', 'false');
    sheetRender();
  }
  function closeSheet() {
    $('sheet').classList.remove('open');
    $('sheet').setAttribute('aria-hidden', 'true');
    $('sheetContent').removeAttribute('data-mount');
    $('sheetContent').innerHTML = '';
  }
  const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;

  /* ---------------- Wave detected by the model ---------------- */
  function onWave() {
    const st = S.state;
    if (!st.onboarded || S.session.active) return;
    const ph = S.phase();
    if (ph === 'guiding' && st.consent.autoStart) {
      S.engine.say('Two pulses, the amber ring. No question.', 'Due impulsi, l’anello ambra. Nessuna domanda.', 'start');
      if (isMobile()) closeSheet();
      S.session.start({ kind: 'full', trigger: 'auto' });
    } else if (ph === 'guiding') {
      S.device.buzz();
      A.toast(L('Soma recognised a wave. You chose to start guidance yourself — press the dial for 2 s.', 'Soma ha riconosciuto un’onda. Hai scelto di avviare tu la guida — premi il dial per 2 s.'));
    } else {
      st.listenedMoments++;
      S.save();
      S.engine.say('Phase: ' + ph + ' — noted, Soma does not start by itself yet.', 'Fase: ' + (ph === 'listening' ? 'ascolto' : 'apprendimento') + ' — annotato, Soma non parte ancora da solo.', 'info');
      A.toast(L('Soma noticed a moment like a wave and kept a note. It is still learning, so it stays quiet. Press the dial for 2 s if you want guidance.', 'Soma ha notato un momento simile a un’onda e l’ha annotato. Sta ancora imparando, quindi resta in silenzio. Premi il dial per 2 s se vuoi una guida.'));
      if (!S.session.active && TABS.includes(view)) A.render();
    }
    setTimeout(() => { if (!S.session.active && S.engine.mode === 'rising') S.engine.setMode('calm'); }, 6000);
  }

  let simTimer = null;
  function simulate(mode) {
    clearTimeout(simTimer);
    S.engine.setMode(mode);
    if (mode !== 'calm') simTimer = setTimeout(() => { if (!S.session.active && S.engine.mode === mode) S.engine.setMode('calm'); }, mode === 'rising' ? 45000 : 22000);
    if (mode === 'rising' && !isMobile()) A.toast(L('Watch the AI console on the right →', 'Guarda la console IA a destra →'));
    if (mode !== 'calm' && isMobile()) openSheet('ai');
  }

  /* ---------------- Device gestures ---------------- */
  let pairHold = null;
  function onGesture(g) {
    const st = S.state;
    if (g === 'holdstart' && !st.onboarded && OB[st.onboardStep] === 'pair' && !st.paired) { startPair(); return; }
    if (g === 'holdend') { stopPair(); return; }
    if (g === 'holdstart' || g === 'holdend') return;
    if (g === 'double') {
      st.voice = !st.voice; S.save();
      A.toast(st.voice ? L('Voice guidance on', 'Guida vocale attiva') : L('Voice off · discreet tactile support', 'Voce disattivata · supporto tattile discreto'));
      if (S.session.active) S.session.render(); else if (view === 'me') A.render();
      return;
    }
    if (S.session.onGesture(g)) return;
    if (!st.onboarded) return;
    const meta = S.device.GESTURES.find(x => x.id === g);
    if (g === 'press') { A.toast(L('Dial pressed for 2 s · guidance starts', 'Dial premuto 2 s · parte la guida')); if (isMobile()) closeSheet(); S.session.start({ kind: 'full', trigger: 'manual' }); return; }
    if (g === 'phone') { A.toast(L('Phone pause on · delivery apps paused for 20 min', 'Pausa telefono attiva · app di consegna in pausa per 20 min')); return; }
    if (g === 'facedown') { A.toast(L('Face down · Soma rests', 'Capovolto · Soma riposa')); return; }
    if (meta) A.toast(`<b>${L(meta.en, meta.it)}</b> · ${L(meta.fbEn, meta.fbIt)}`);
  }

  function startPair() {
    if (pairHold) return;
    S._pairing = true;
    let p = 0;
    const btn = $('pairBtn');
    if (btn) btn.classList.add('holding');
    S.device.setLight('pair');
    pairHold = setInterval(() => {
      p += 100 / 30;
      const arc = $('pairArc'); if (arc) arc.setAttribute('stroke-dashoffset', 100 - p);
      S.device.setPair(Math.min(100, p));
      const lab = document.querySelector('#pairBtn .hold-label');
      if (lab) lab.textContent = L('Pairing… ' + Math.min(3, Math.floor(p / 33.4) + 1) + ' of 3 s', 'Associazione… ' + Math.min(3, Math.floor(p / 33.4) + 1) + ' di 3 s');
      const fill = document.querySelector('#pairBtn .hold-fill'); if (fill) fill.style.width = p + '%';
      if (p >= 100) {
        clearInterval(pairHold); pairHold = null; S._pairing = false;
        S.state.paired = true; S.save();
        S.device.setPair(0); S.device.setLight('on'); S.device.buzz();
        setTimeout(() => S.device.setLight('off'), 2500);
        S.device.refresh();
        A.render();
        A.toast(L('Paired · the ring lights up', 'Associato · l’anello si accende'));
      }
    }, 100);
  }
  function stopPair() {
    if (!pairHold) return;
    clearInterval(pairHold); pairHold = null; S._pairing = false;
    S.device.setPair(0); S.device.setLight('off');
    const arc = $('pairArc'); if (arc) arc.setAttribute('stroke-dashoffset', 100);
    const btn = $('pairBtn');
    if (btn) { btn.classList.remove('holding'); btn.querySelector('.hold-fill').style.width = '0'; btn.querySelector('.hold-label').textContent = L('Keep holding for three seconds', 'Tieni premuto per tre secondi'); }
  }

  /* ---------------- Report analysis animation ---------------- */
  function runAnalysis() {
    const items = document.querySelectorAll('#aiSteps li');
    items.forEach((li, i) => {
      setTimeout(() => li.classList.add('doing'), i * 750);
      setTimeout(() => { li.classList.remove('doing'); li.classList.add('done'); }, i * 750 + 700);
    });
    setTimeout(() => { if (view === 'report' && S.reportDraft.stage === 'analyzing') { S.reportDraft.stage = 'preview'; A.render(); } }, items.length * 750 + 400);
  }

  function printReport() {
    $('printArea').innerHTML = S.reportDoc(true);
    setTimeout(() => window.print(), 50);
  }

  /* ---------------- Actions ---------------- */
  const ACT = {
    'ob-next': () => { S.state.onboardStep = Math.min(OB.length - 1, S.state.onboardStep + 1); S.save(); A.render(); $('app').scrollTop = 0; },
    'ob-finish': () => {
      S.state.onboarded = true; S.state.week = Math.max(1, S.state.week); S.save();
      view = 'today'; A.render();
      A.toast(L('Soma is listening. Week 1 of 3.', 'Soma è in ascolto. Settimana 1 di 3.'));
    },
    lang: (el) => { setLang(el.dataset.lang); },
    color: (el) => { S.state.color = el.dataset.color; S.save(); S.device.refresh(); A.render(); },
    tab: (el) => A.go(el.dataset.tab),
    home: () => A.go('today'),
    'open-device': () => { if (isMobile()) openSheet('device'); else { const p = $('devicePanel'); p.classList.remove('flash'); void p.offsetWidth; p.classList.add('flash'); } },
    'start-manual': () => S.session.start({ kind: 'full', trigger: 'manual' }),
    skill: (el) => S.session.start({ kind: el.dataset.skill, trigger: 'manual' }),
    'sess-next': () => S.session.nextAction(),
    'sess-stop': () => S.session.toRest(),
    'sess-finish': () => S.session.finish(),
    voice: () => onGesture('double'),
    morning: () => A.go('morning'),
    outcome: (el) => {
      const s = S.state.history.find(x => x.id === S.state.pendingMorning);
      if (s) { s.outcome = el.dataset.out; s._answered = true; s.falseStart = el.dataset.out === 'notwave' && s.trigger === 'auto'; }
      S.save(); A.render();
      setTimeout(() => { S.state.pendingMorning = null; S.save(); }, 50);
    },
    report: () => { S.reportDraft.stage = 'config'; A.go('report'); },
    'report-back': () => { S.reportDraft.stage = 'config'; A.render(); },
    period: (el) => { S.reportDraft.period = +el.dataset.period; A.render(); },
    'gen-report': () => { const n = $('reportNote'); if (n) S.reportDraft.note = n.value; S.reportDraft.stage = 'analyzing'; A.render(); },
    'send-report': (el) => {
      el.disabled = true; el.innerHTML = `<span class="spinner"></span> ${L('Sending securely…', 'Invio protetto…')}`;
      setTimeout(() => {
        S.reportDraft.stage = 'sent'; S.reportDraft.sentAt = Date.now();
        S.state.reports.push({ at: new Date().toISOString(), period: S.reportDraft.period });
        S.save(); A.render();
        A.toast('Report delivered to ' + S.drName() + ' <span class="sim">simulated</span>');
      }, 1400);
    },
    print: printReport,
    'verify-code': (el) => {
      const v = ($('actCode') || {}).value || '';
      if (v.trim().length < 4) { A.toast('Please enter the code from your clinic.'); return; }
      el.disabled = true; el.innerHTML = '<span class="spinner"></span> Checking…';
      setTimeout(() => { S.state.linked = true; S.save(); A.render(); }, 1100);
    },
    'tab-me': () => A.go('me'),
    message: () => A.go('message'),
    'send-message': () => {
      const t = $('msgText'); if (!t || !t.value.trim()) return;
      S.state.messages.push({ from: 'me', text: t.value.trim(), at: 'Today · ' + S.fmt.time(new Date()) });
      S.save(); A.render(); $('app').scrollTop = 99999;
      A.toast('Sent to ' + S.drName() + '. <span class="sim">simulated</span>');
    },
    'call-clinic': () => { A.closeModal(); A.toast('Calling ' + S.state.clinic + '… <span class="sim">simulated call</span>'); },
    'call-112': () => { A.closeModal(); A.toast('Calling emergency services · 112… <span class="sim">simulated call</span>'); },
    support: () => A.modal(`
      <div class="modal-ico">${S.icon('lifebuoy')}</div>
      <h3>Need support right now?</h3>
      <p>You don’t have to handle this alone.</p>
      <button class="btn btn-primary btn-block" data-action="call-clinic">${S.icon('phone')} Call ${S.esc(S.state.clinic)}</button>
      <button class="btn btn-danger btn-block" data-action="call-112">Emergency services · 112</button>
      <button class="btn btn-soft btn-block" data-action="modal-close">${S.session.active ? 'Continue with Soma' : 'Close'}</button>`),
    'modal-close': () => A.closeModal(),
    'morning-demo': () => {
      if (!S.state.onboarded) return;
      if (!S.state.pendingMorning) {
        const last = [...S.state.history].reverse().find(x => !x.falseStart);
        if (last) { last.outcome = null; last._answered = false; S.state.pendingMorning = last.id; }
      }
      if (S.session.active) return;
      S.save(); A.go('morning');
    },
    week: (el) => { S.state.week = +el.dataset.week; S.save(); document.querySelectorAll('[data-mount="ai"]').forEach(mountAI); if (!S.session.active) A.render(); A.toast('Now at week ' + S.state.week); },
    'sim-wave': () => simulate('rising'),
    'sim-stress': () => simulate('stress'),
    'sim-calm': () => simulate('calm'),
    'restart-ob': () => { if (S.session.active) return; S.state.onboarded = false; S.state.onboardStep = 0; S.state.paired = false; S.state.linked = false; S.save(); S.device.refresh(); A.render(); },
    reset: () => {
      if (!confirm(L('Reset the prototype to its initial state?', 'Riportare il prototipo allo stato iniziale?'))) return;
      S.reset(); S.save(); view = 'today'; S.device.refresh(); refreshChrome(); A.render();
    }
  };

  function setLang(l) {
    S.lang = l; S.state.lang = l; S.save();
    refreshChrome();
    A.render();
  }

  function refreshChrome() {
    document.documentElement.lang = S.lang;
    S.device.refresh();
    document.querySelectorAll('[data-mount="ai"]').forEach(mountAI);
    if ($('sheet').classList.contains('open')) sheetRender();
    $('fab').setAttribute('aria-label', L('Open SOMA object and AI console', 'Apri oggetto SOMA e console IA'));
  }

  /* ---------------- Event wiring ---------------- */
  function bind() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (el && ACT[el.dataset.action]) { e.preventDefault(); ACT[el.dataset.action](el); }
      if (e.target.closest('[data-sheet-close]')) closeSheet();
      const st = e.target.closest('[data-sheet-tab]');
      if (st) { sheetTab = st.dataset.sheetTab; sheetRender(); }
    });

    document.addEventListener('change', (e) => {
      const c = e.target.closest('[data-consent]');
      if (c) {
        S.state.consent[c.dataset.consent] = c.checked; S.save();
        if (view === 'report' || view === 'me') {
          A.toast(c.checked ? L('Shared from now on', 'Condiviso da ora in poi') : L('No longer shared', 'Non più condiviso'));
        }
      }
      const s = e.target.closest('[data-setting]');
      if (s && s.dataset.setting === 'voice') { S.state.voice = s.checked; S.save(); }
      if (s && s.dataset.setting === 'reminders') { S.state.reminders = s.checked; S.save(); A.toast(s.checked ? 'Reminder on · every day at ' + S.state.practiceTime : 'Reminder off'); }
    });
    document.addEventListener('input', (e) => { if (e.target.id === 'reportNote') S.reportDraft.note = e.target.value; });

    // Press-and-hold controls inside the phone
    document.addEventListener('pointerdown', (e) => {
      const h = e.target.closest('[data-hold]');
      if (!h) return;
      if (h.dataset.hold === 'pair') { e.preventDefault(); startPair(); }
      if (h.dataset.hold === 'squeeze') { h.classList.add('pressed'); S.engine.grip(40); S.device.animate('squeeze', 600); onGesture('squeeze'); }
    });
    const release = () => { stopPair(); document.querySelectorAll('[data-hold].pressed').forEach(x => x.classList.remove('pressed')); };
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);

    // Tooltips for charts
    const tip = document.createElement('div');
    tip.className = 'tip';
    $('phone').appendChild(tip);
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-tip]');
      if (!t || !$('phone').contains(t)) { tip.classList.remove('show'); return; }
      tip.textContent = t.getAttribute('data-tip');
      const pr = $('phone').getBoundingClientRect(), r = t.getBoundingClientRect();
      tip.classList.add('show');
      const x = Math.min(pr.width - tip.offsetWidth - 10, Math.max(10, r.left - pr.left + r.width / 2 - tip.offsetWidth / 2));
      const y = Math.max(50, r.top - pr.top - tip.offsetHeight - 8);
      tip.style.transform = `translate(${x}px, ${y}px)`;
    });

    $('fab').addEventListener('click', () => openSheet());

    S.device.on(onGesture);
    S.engine.on((type) => {
      if (type === 'tick') updateAI();
      if (type === 'log') updateAI();
      if (type === 'wave') onWave();
    });

    window.matchMedia('(max-width: 1023px)').addEventListener('change', () => { if (!isMobile()) closeSheet(); });
    setInterval(statusbar, 15000);
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    document.documentElement.lang = S.lang;
    S.device.mount($('devicePanel'));
    mountAI($('aiPanel'));
    statusbar();
    bind();
    S.engine.start();
    A.render();
    const sp = document.createElement('div');
    sp.className = 'splash';
    sp.innerHTML = `<div class="splash-mark">${S.logoMark()}</div><span>soma</span>`;
    $('phone').appendChild(sp);
    setTimeout(() => sp.classList.add('out'), 1300);
    setTimeout(() => sp.remove(), 1900);
  }

  S.app = A;
  document.addEventListener('DOMContentLoaded', boot);
})();
