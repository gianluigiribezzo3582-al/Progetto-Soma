/* SOMA — screens (pure functions returning HTML). */
(function () {
  const st = () => S.state;
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  S.esc = esc;

  /* ---------------- Icons (stroke, 24px) ---------------- */
  const P = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    practice: '<path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    waves: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
    me: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    breathe: '<path d="M8 4c-3 2-4 6-4 9a4 4 0 0 0 8 0V4M16 4c3 2 4 6 4 9a4 4 0 0 1-8 0"/>',
    ground: '<circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/>',
    surf: '<path d="M2 18c4 0 5-12 10-12s6 12 10 12"/>',
    pause: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    move: '<circle cx="13" cy="4" r="2"/><path d="M10 22l2-7 3 3v4M8 12l3-4 4 1 3 3M12 15l-1-5"/>',
    rest: '<path d="M20 15A8 8 0 1 1 9 4a6 6 0 0 0 11 11z"/>',
    cold: '<path d="M12 2v20M4 6l16 12M20 6L4 18"/>',
    meal: '<path d="M4 11h16a8 8 0 0 1-16 0zM8 4v3M12 3v4M16 4v3"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    voice: '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    note: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 12h6M9 16h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'
  };
  S.icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const I = S.icon;

  /* Mini pebble used in headers */
  S.miniPebble = (size = 28) => {
    const c = S.color();
    return `<svg class="mini-pebble" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="${c.hex}"/><circle cx="20" cy="20" r="13" fill="#F7F3EB"/><circle cx="20" cy="20" r="4.5" fill="#C9CCCF" stroke="#F2B27A" stroke-width="1.2"/></svg>`;
  };

  S.logoMark = (cls = '') => `<svg class="logo-mark ${cls}" viewBox="0 0 120 120" aria-hidden="true">
    <path class="lm-arc" d="M 96 26 A 50 50 0 1 1 22 30" fill="none" stroke="var(--amber)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="34" fill="none" stroke="var(--olive)" stroke-width="13"/>
    <circle cx="60" cy="60" r="27.5" fill="#FBF8F2"/>
    <g fill="#8A8D86" class="lm-dots">${[...Array(16)].map((_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${(60 + Math.cos(a) * 21).toFixed(1)}" cy="${(60 + Math.sin(a) * 21).toFixed(1)}" r="1.4"/>`; }).join('')}</g>
    <circle cx="60" cy="60" r="13" fill="none" stroke="var(--amber)" stroke-width="2"/>
    <circle cx="60" cy="60" r="10.5" fill="#D9DAD6"/>
  </svg>`;

  const toggle = (key, on, label, sub) => `
    <label class="row toggle-row">
      <span class="row-text"><span class="row-title">${label}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span>
      <input type="checkbox" class="switch" data-consent="${key}" ${on ? 'checked' : ''}>
    </label>`;

  const head = (eyebrow, title, sub, back) => `
    <header class="scr-head">
      ${back ? `<button class="icon-btn back" data-action="${back}" aria-label="${L('Back', 'Indietro')}">${I('back')}</button>` : ''}
      ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
      <h1>${title}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
    </header>`;

  const withDr = () => L('With ' + st().therapist, 'Con ' + st().therapist.replace('Dr.', 'Dott.ssa'));
  S.drName = () => S.lang === 'it' ? st().therapist.replace('Dr.', 'Dott.ssa') : st().therapist;

  /* ================= ONBOARDING ================= */

  function obDots(i) {
    return `<div class="ob-dots" aria-hidden="true">${[0, 1, 2, 3, 4].map(k => `<i class="${k === i ? 'on' : k < i ? 'done' : ''}"></i>`).join('')}</div>`;
  }

  S.screens = {};

  S.screens.welcome = () => `
    <div class="scr scr-welcome">
      <div class="welcome-mark">${S.logoMark('breathing')}</div>
      <h1 class="welcome-title">${L('Welcome to Soma', 'Ti diamo il benvenuto in Soma')}</h1>
      <p class="welcome-sub">${L('A space to pause, reconnect and take care of yourself.', 'Uno spazio per fermarti, riconnetterti e prenderti cura di te.')}</p>
      <div class="welcome-foot">
        <button class="btn btn-primary btn-block" data-action="ob-next">Get started</button>
        <p class="tiny">SOMA is prescribed and set up together with your care team.</p>
      </div>
    </div>`;

  S.screens.code = () => {
    const linked = st().linked;
    return `
    <div class="scr">
      ${obDots(0)}
      ${head('Step 1 of 5', linked ? 'Your care team' : 'Connect to your care team', linked ? 'Check that these details are right.' : 'Enter the activation code you received from your clinic.')}
      ${linked ? `
        <section class="card team-card">
          <div class="team-top">
            <div class="avatar dr">${'B'}</div>
            <div><b>${esc(S.drName())}</b><span>Psychotherapist · CBT-E</span></div>
          </div>
          <div class="kv-mini">
            <div><span>Clinic</span><b>${esc(st().clinic)}</b></div>
            <div><span>Patient</span><b>${esc(st().name)} R.</b></div>
            <div><span>Programme</span><b>Evening waves</b></div>
          </div>
        </section>
        <p class="tiny left">${I('shield', 'ico-inline')} Only your care team can see what you choose to share.</p>
        <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">This is my care team</button></div>
      ` : `
        <label class="field">
          <span>Activation code</span>
          <input id="actCode" class="code-input" value="BRI-4821" autocomplete="off" spellcheck="false" inputmode="text" aria-label="Activation code">
        </label>
        <p class="tiny left">You can find it on the sheet your therapist gave you in session.</p>
        <div class="foot"><button class="btn btn-primary btn-block" data-action="verify-code" id="verifyBtn">Continue</button></div>
      `}
    </div>`;
  };

  S.screens.pair = () => {
    const paired = st().paired;
    return `
    <div class="scr">
      ${obDots(1)}
      ${head(withDr(), paired ? L('Soma is yours.', 'Soma è tuo.') : L('Pair your Soma', 'Associa il tuo Soma'), L('set up together, in session', 'configurato insieme, in seduta'))}
      <div class="pair-visual ${paired ? 'is-paired' : ''}" id="pairVisual">
        <svg viewBox="0 0 200 200" class="pair-svg" aria-hidden="true">
          <circle cx="100" cy="100" r="86" fill="none" stroke="var(--track)" stroke-width="3"/>
          <circle cx="100" cy="100" r="86" fill="none" stroke="var(--amber)" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="${paired ? 0 : 100}" transform="rotate(-90 100 100)" id="pairArc"/>
          <circle cx="100" cy="100" r="52" fill="none" stroke="${S.color().hex}" stroke-width="20" id="pairRim"/>
          <circle cx="100" cy="100" r="40" fill="#FBF8F2"/>
          ${[...Array(22)].map((_, i) => { const a = i / 22 * Math.PI * 2; return `<circle cx="${(100 + Math.cos(a) * 31).toFixed(1)}" cy="${(100 + Math.sin(a) * 31).toFixed(1)}" r="1.6" fill="#8A8D86"/>`; }).join('')}
          <circle cx="100" cy="100" r="19" fill="none" stroke="var(--amber)" stroke-width="2.5" class="pair-ring"/>
          <circle cx="100" cy="100" r="16" fill="#D7D9D6"/>
        </svg>
      </div>
      ${paired ? `
        <p class="center-text">${L('The ring lit up. Which one is yours?', "L'anello si è acceso. Qual è il tuo?")}</p>
        <div class="swatches">${S.COLORS.map(c => `<button class="swatch ${c.id === st().color ? 'is-on' : ''}" style="--c:${c.hex}" data-action="color" data-color="${c.id}" aria-label="${L(c.en, c.it)}"><span></span><small>${L(c.en, c.it)}</small></button>`).join('')}</div>
        <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Continue', 'Continua')}</button></div>
      ` : `
        <p class="center-text">${L('Hold Soma in your palm for three seconds to pair it.', 'Tieni Soma nel palmo per tre secondi per associarlo.')}</p>
        <div class="foot">
          <button class="btn btn-primary btn-block hold-btn" id="pairBtn" data-hold="pair"><span class="hold-fill"></span><span class="hold-label">${L('Press and hold to pair', 'Tieni premuto per associare')}</span></button>
          <p class="tiny">${L('…or hold the SOMA object on the side.', "…oppure tieni premuto l'oggetto SOMA a lato.")}</p>
        </div>
      `}
    </div>`;
  };

  S.screens.agree = () => {
    const c = st().consent;
    return `
    <div class="scr">
      ${obDots(2)}
      ${head(withDr(), L('What we agree on', 'Su cosa siamo d’accordo'), L('you can change it at any session', 'puoi cambiarlo a ogni seduta'))}
      <div class="card list">
        ${toggle('autoStart', c.autoStart, L('Soma may start guiding by itself', 'Soma può iniziare a guidarti da solo'), L('when it recognises your waves', 'quando riconosce le tue onde'))}
      </div>
      <div class="list-label">${L('Share with ' + S.drName() + ':', 'Condividi con ' + S.drName() + ':')}</div>
      <div class="card list">
        ${toggle('times', c.times, L('Times and duration of guidance', 'Orari e durata della guida'))}
        ${toggle('exercises', c.exercises, L('Exercises completed', 'Esercizi completati'))}
        ${toggle('settle', c.settle, L('How quickly your body settled', 'Quanto in fretta il corpo si è calmato'))}
        ${toggle('notes', c.notes, L('Your notes', 'Le tue note'))}
        ${toggle('raw', c.raw, L('Raw body signals', 'Segnali corporei grezzi'))}
      </div>
      <p class="tiny left">${I('shield', 'ico-inline')} ${L('Signals are processed on the device. No single signal is ever read as a binge episode.', 'I segnali sono elaborati sul dispositivo. Nessun singolo segnale viene mai letto come un episodio di abbuffata.')}</p>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('We agree', 'Siamo d’accordo')}</button></div>
    </div>`;
  };

  S.screens.programme = () => `
    <div class="scr">
      ${obDots(3)}
      ${head(withDr(), L('Your programme', 'Il tuo programma'), L('“Evening waves” · prescribed today', '“Onde serali” · prescritto oggi'))}
      <ol class="prog-list">
        ${S.PROGRAMME.map((p, i) => `
          <li class="prog-item">
            <span class="prog-dot">${I(p.icon)}</span>
            <span class="row-text"><span class="row-title"><b>${i + 1}</b> ${L(p.en, p.it)}</span><span class="row-sub">${L(p.subEn, p.subIt)}</span></span>
          </li>`).join('')}
      </ol>
      <p class="tiny">${L('Daily practice: squeeze-and-release, ' + st().practiceTime, 'Pratica quotidiana: stringi-e-rilascia, ' + st().practiceTime)}</p>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Continue', 'Continua')}</button></div>
    </div>`;

  S.screens.listening = () => `
    <div class="scr">
      ${obDots(4)}
      ${head(L('Weeks 1–3', 'Settimane 1–3'), L('Listening first.', 'Prima, ascoltare.'), L('why Soma stays quiet at first', 'perché all’inizio Soma resta in silenzio'))}
      <div class="phase-cards">
        <div class="phase-card ph-listen"><small>${L('weeks 1–3', 'settimane 1–3')}</small><b>${L('Listening', 'Ascolto')}</b><span>${L('learns what is normal for you', 'impara cosa è normale per te')}</span></div>
        <div class="phase-card ph-learn"><small>${L('weeks 3–6', 'settimane 3–6')}</small><b>${L('Learning', 'Apprendimento')}</b><span>${L('learns the shape of your waves', 'impara la forma delle tue onde')}</span></div>
        <div class="phase-card ph-guide"><small>${L('week 6 →', 'settimana 6 →')}</small><b>${L('Guiding', 'Guida')}</b><span>${L('starts when it recognises one', 'parte quando ne riconosce una')}</span></div>
      </div>
      <p class="body-text">${L('Meanwhile, press the dial for two seconds and Soma will guide you.', 'Nel frattempo, premi il dial per due secondi e Soma ti guiderà.')}</p>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-finish">${L('Start listening', 'Inizia l’ascolto')}</button></div>
    </div>`;

  /* ================= TABS ================= */

  S.tabbar = (active) => `
    <nav class="tabbar" aria-label="${L('Main', 'Principale')}">
      ${[['today', L('Today', 'Oggi')], ['practice', L('Practice', 'Pratica')], ['waves', L('Waves', 'Onde')], ['me', L('Me', 'Io')]].map(([id, label]) =>
        `<button class="tab ${active === id ? 'is-on' : ''}" data-action="tab" data-tab="${id}">${I(id)}<span>${label}</span></button>`).join('')}
    </nav>`;

  function phaseCard() {
    const w = st().week, ph = S.phase();
    const pct = Math.min(100, (w / 9) * 100);
    const text = {
      listening: L('Soma is learning what is normal for you. It stays quiet for now — press the dial for 2 s whenever you want guidance.', 'Soma sta imparando cosa è normale per te. Per ora resta in silenzio — premi il dial per 2 s quando vuoi una guida.'),
      learning: L('Soma is learning the shape of your waves. It may let you know, but never starts by itself.', 'Soma sta imparando la forma delle tue onde. Può avvisarti, ma non parte mai da solo.'),
      guiding: st().consent.autoStart
        ? L('Soma can start by itself when it recognises a wave. Sensitivity ' + sens() + ' · quiet hours ' + st().settings.quietFrom + '–' + st().settings.quietTo + '.', 'Soma può partire da solo quando riconosce un’onda. Sensibilità ' + sens() + ' · ore di silenzio ' + st().settings.quietFrom + '–' + st().settings.quietTo + '.')
        : L('Soma recognises your waves, but you chose to start guidance yourself.', 'Soma riconosce le tue onde, ma hai scelto di avviare tu la guida.')
    }[ph];
    const label = { listening: L('Listening', 'Ascolto'), learning: L('Learning', 'Apprendimento'), guiding: L('Guiding', 'Guida') }[ph];
    return `
      <section class="card phase-now ph-${ph}">
        <div class="phase-top">
          <span class="eyebrow">${L('Week', 'Settimana')} ${w} · ${label}</span>
          ${ph === 'listening' && st().listenedMoments ? `<span class="pill">${st().listenedMoments} ${L('moments noted', 'momenti annotati')}</span>` : ''}
        </div>
        <div class="phase-track"><i style="width:${pct}%"></i><span style="left:33.3%"></span><span style="left:55.5%"></span></div>
        <div class="phase-legend"><span>${L('Listening', 'Ascolto')}</span><span>${L('Learning', 'Apprend.')}</span><span>${L('Guiding', 'Guida')}</span></div>
        <p>${text}</p>
      </section>`;
  }
  const sens = () => ({ low: L('low', 'bassa'), medium: L('medium', 'media'), high: L('high', 'alta') })[st().settings.sensitivity];

  function insights() {
    const ph = S.phase();
    const h = S.sessionsVisible();
    const list = [];
    if (ph === 'listening' && st().week <= 2) {
      list.push(L('Not much to say yet — and that’s expected. Soma needs a few weeks of ordinary days to know your baseline.', 'Ancora poco da dire — ed è normale. Soma ha bisogno di qualche settimana di giorni normali per conoscere la tua baseline.'));
    }
    if (h.length > 4) {
      const ev = h.filter(s => new Date(s.at).getHours() >= 20).length / h.length;
      list.push(L(`${Math.round(ev * 100)}% of your waves began after 20:00, often after a long time on the phone.`, `Il ${Math.round(ev * 100)}% delle tue onde è iniziato dopo le 20:00, spesso dopo molto tempo al telefono.`));
    }
    if (st().week >= 4) {
      const s = S.weekStats();
      const first = s.settle.find(v => v != null), last = [...s.settle].reverse().find(v => v != null);
      if (first && last) list.push(L(`Your body settles faster: from about ${Math.round(first)} minutes in week 1 to ${Math.round(last)} now.`, `Il tuo corpo si calma prima: da circa ${Math.round(first)} minuti nella settimana 1 a ${Math.round(last)} ora.`));
      list.push(L('“Surf” is the step after which you most often settle.', '“Cavalca” è il passo dopo il quale più spesso ti calmi.'));
    }
    return list;
  }

  S.screens.today = () => {
    const now = new Date();
    const ins = insights();
    const pm = st().pendingMorning && st().history.find(s => s.id === st().pendingMorning);
    const pr = st().practice[st().week - 1] ?? 0;
    return `
    <div class="scr scr-tab">
      <header class="today-head">
        <div>
          <div class="eyebrow">${S.fmt.dayLong(now)}</div>
          <h1>${esc(S.greeting(st().name))}</h1>
        </div>
        <button class="dev-chip" data-action="open-device" aria-label="SOMA">${S.miniPebble(30)}<span><b>SOMA</b><small>${st().paired ? L('Connected', 'Connesso') : L('Not paired', 'Non associato')} · ${S.device.battery}%</small></span></button>
      </header>

      ${pm ? `
      <button class="card morning-card" data-action="morning">
        <span class="eyebrow">${L('About last night', 'A proposito di ieri sera')}</span>
        <b>${L('Plain words, one optional tap.', 'Parole semplici, un tocco facoltativo.')}</b>
        <span class="chev">${I('chev')}</span>
      </button>` : ''}

      <button class="moment-btn" data-action="start-manual">
        <span class="moment-ring"></span>
        <span class="moment-text"><b>${L('I need a moment', 'Ho bisogno di un momento')}</b><small>${L('or press the dial for 2 seconds', 'oppure premi il dial per 2 secondi')}</small></span>
      </button>

      ${phaseCard()}

      <section class="card">
        <div class="card-row">
          <div><div class="eyebrow">${L('Daily practice', 'Pratica quotidiana')} · ${st().practiceTime}</div><b class="card-title">${L('Squeeze and release', 'Stringi e rilascia')}</b><span class="muted"> · 3 min</span></div>
          <button class="btn btn-soft btn-sm" data-action="skill" data-skill="breathe">${I('play')} ${L('Start', 'Inizia')}</button>
        </div>
        <div class="week-dots" aria-label="${L('Last seven days', 'Ultimi sette giorni')}">
          ${[6, 5, 4, 3, 2, 1, 0].map((back, i) => {
            const d = new Date(now); d.setDate(now.getDate() - back);
            const past = Math.min(6, pr);
            const done = back === 0 ? st().practicedOn === now.toDateString() : (6 - i) <= past;
            const lab = (S.lang === 'it' ? 'DLMMGVS' : 'SMTWTFS')[d.getDay()];
            return `<span class="${done ? 'done' : ''} ${back === 0 ? 'today' : ''}"><i>${done ? I('check') : ''}</i>${lab}</span>`;
          }).join('')}
        </div>
      </section>

      ${ins.length ? `
      <section class="card insight">
        <div class="eyebrow">${I('spark', 'ico-inline')} ${L('Soma noticed', 'Soma ha notato')}</div>
        ${ins.slice(0, 2).map(t => `<p>${t}</p>`).join('')}
      </section>` : ''}

      <section class="card card-row next-session">
        <span class="round-ico">${I('calendar')}</span>
        <div class="grow"><div class="eyebrow">${L('Next session', 'Prossima seduta')}</div><b>${esc(S.drName())} · ${L('Tue 18:30', 'Mar 18:30')}</b></div>
        <button class="btn btn-soft btn-sm" data-action="report">Prepare</button>
      </section>
    </div>`;
  };

  S.screens.practice = () => `
    <div class="scr scr-tab">
      ${head(L('Practice', 'Pratica'), L('Skills for calm water.', 'Abilità per acque calme.'))}
      <div class="skill-grid">
        ${S.SKILLS.map(s => `
          <button class="skill ${s.prescribed ? 'is-rx' : ''}" data-action="skill" data-skill="${s.id}">
            ${I(s.icon)}
            <b>${L(s.en, s.it)}</b>
            <small>${s.min} min${s.prescribed ? ' · ' + L('prescribed', 'prescritto') : ''}</small>
          </button>`).join('')}
      </div>
      <section class="card">
        <div class="card-row"><div><div class="eyebrow">${L('Your programme', 'Il tuo programma')}</div><b class="card-title">${L('“Evening waves”', '“Onde serali”')}</b></div>
        <button class="btn btn-soft btn-sm" data-action="start-manual">${I('play')} ${L('Run', 'Avvia')}</button></div>
        <ol class="prog-list compact">
          ${S.PROGRAMME.map((p, i) => `<li class="prog-item"><span class="prog-dot">${I(p.icon)}</span><span class="row-text"><span class="row-title"><b>${i + 1}</b> ${L(p.en, p.it)}</span><span class="row-sub">${L(p.subEn, p.subIt)}</span></span></li>`).join('')}
        </ol>
        <p class="tiny left">${L('Edited by ' + S.drName() + ' on 14 Oct. Words and durations can change; the structure stays evidence-based.', 'Modificato da ' + S.drName() + ' il 14 ott. Parole e durate possono cambiare; la struttura resta basata su evidenze.')}</p>
      </section>
    </div>`;

  /* ---------- Aggregates used by Waves + Report ---------- */
  S.weekStats = function (fromWeek = 1, toWeek = st().week) {
    const weeks = [], counts = [], settle = [], auto = [], practice = [];
    for (let w = fromWeek; w <= toWeek; w++) {
      const ss = st().history.filter(s => s.week === w && !s.falseStart);
      weeks.push(w);
      counts.push(ss.length);
      const sv = ss.map(s => s.settle).filter(v => v != null).sort((a, b) => a - b);
      settle.push(sv.length ? sv[Math.floor(sv.length / 2)] : null);
      auto.push(ss.filter(s => s.trigger === 'auto').length);
      practice.push(st().practice[w - 1] ?? 0);
    }
    return { weeks, counts, settle, auto, practice };
  };

  function medianTime(list) {
    if (!list.length) return null;
    const m = list.map(s => { const d = new Date(s.at); let v = d.getHours() * 60 + d.getMinutes(); if (v < 360) v += 1440; return v; }).sort((a, b) => a - b);
    const v = m[Math.floor(m.length / 2)] % 1440;
    return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0');
  }
  S.medianTime = medianTime;

  S.outcomeLabel = (o) => ({
    rode: L('the wave passed', "l'onda è passata"),
    ate: L('ate, and that’s okay', 'ho mangiato, va bene così'),
    notwave: L('not a wave', 'non era un’onda'),
    skip: L('no answer', 'nessuna risposta')
  })[o] || L('no answer yet', 'ancora nessuna risposta');

  S.screens.waves = () => {
    const w = st().week;
    const s = S.weekStats();
    const vis = S.sessionsVisible();
    const real = vis.filter(x => !x.falseStart);
    const thisWeek = s.counts[s.counts.length - 1];
    const firstSettle = s.settle.find(v => v != null);
    const lastSettle = [...s.settle].reverse().find(v => v != null);
    const mt = medianTime(real);
    const recent = [...vis].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
    const confirm = [45, 55, 62, 70, 76, 80, 84, 86, 88].slice(0, w);
    const falseStarts = [5.5, 3.8, 2.6, 2, 1.5, 1.2, 1, 0.8, 0.7][w - 1];

    return `
    <div class="scr scr-tab">
      ${head(L('Waves', 'Onde'), L('How your waves are changing.', 'Come stanno cambiando le tue onde.'), L('Week 1 → week ' + w + '. Only what you agreed to keep.', 'Settimana 1 → settimana ' + w + '. Solo ciò che hai scelto di conservare.'))}

      <div class="tiles">
        <div class="tile"><small>${L('Guided waves', 'Onde guidate')}</small><b>${thisWeek}</b><span>${L('this week', 'questa settimana')}</span></div>
        <div class="tile"><small>${L('Time to settle', 'Tempo per calmarsi')}</small><b>${lastSettle ? S.fmt.num(lastSettle, 0) : '–'}<em> min</em></b><span>${firstSettle ? L('from ' + Math.round(firstSettle) + ' in week 1', 'da ' + Math.round(firstSettle) + ' nella sett. 1') : ''}</span></div>
        <div class="tile"><small>${L('Waves start', 'Le onde iniziano')}</small><b>${mt || '–'}</b><span>${L('mostly', 'di solito')}</span></div>
      </div>

      <section class="card chart-card">
        <h3>${L('Guided waves per week', 'Onde guidate per settimana')}</h3>
        ${S.charts.bars(s.weeks.map((wk, i) => ({ label: (S.lang === 'it' ? 'sett ' : 'wk ') + wk, value: s.counts[i], tip: (S.lang === 'it' ? 'Settimana ' : 'Week ') + wk + ': ' + s.counts[i] + ' ' + L('guided', 'guidate') + ' (' + s.auto[i] + ' ' + L('auto', 'auto') + ')' })), { label: L('Guided waves per week', 'Onde guidate per settimana'), max: 8 })}
        <p class="chart-note">${L('Fewer waves needed guidance over time. The current week is still running.', 'Col tempo, meno onde hanno avuto bisogno di guida. La settimana in corso non è finita.')}</p>
      </section>

      <section class="card chart-card">
        <h3>${L('Time to settle (median, minutes)', 'Tempo per calmarsi (mediana, minuti)')}</h3>
        ${S.charts.lines([{ name: L('minutes', 'minuti'), values: s.settle, color: 'var(--olive-deep)', label: lastSettle ? Math.round(lastSettle) + ' min' : '' }], s.weeks.map(x => (S.lang === 'it' ? 'sett ' : 'wk ') + x), { min: 0, max: 12, ticks: [0, 6, 12], valFmt: v => S.fmt.num(v, 1) + ' min', label: 'settle' })}
      </section>

      <section class="card chart-card">
        <h3>${L('When waves start', 'Quando iniziano le onde')}</h3>
        ${S.charts.clock(real.map(x => { const d = new Date(x.at); return { h: d.getHours(), m: d.getMinutes(), color: x.trigger === 'auto' ? 'var(--amber-deep)' : 'var(--olive-deep)', tip: S.fmt.day(d) + ' · ' + S.fmt.time(d) + ' · ' + (x.trigger === 'auto' ? L('Soma started', 'avviata da Soma') : L('you started', 'avviata da te')) }; }), { label: 'clock' })}
        <div class="legend"><span><i style="background:var(--olive-deep)"></i>${L('you started', 'avviata da te')}</span><span><i style="background:var(--amber-deep)"></i>${L('Soma started', 'avviata da Soma')}</span><span><i class="sq" style="background:var(--amber-soft)"></i>${L('evening window', 'fascia serale')}</span></div>
      </section>

      <section class="card chart-card">
        <h3>${L('Your wave signature', 'La firma delle tue onde')}</h3>
        <p class="chart-note top">${L('What your body does in the 20–40 minutes before a wave, compared with an ordinary stressful evening.', 'Cosa fa il tuo corpo nei 20–40 minuti prima di un’onda, rispetto a una normale serata stressante.')}</p>
        ${w < 3 ? `<div class="empty">${L('Soma needs about three weeks to draw this.', 'Soma ha bisogno di circa tre settimane per disegnarla.')}</div>` : S.charts.radar(
          [L('heart rate', 'freq. cardiaca'), L('HRV drop', 'calo HRV'), L('EDA peaks', 'picchi EDA'), L('grip', 'presa'), L('stillness', 'immobilità'), L('evening', 'sera'), L('skipped meal', 'pasto saltato')].map(l => ({ label: l })),
          [{ name: L('ordinary stress', 'stress ordinario'), values: [0.42, 0.35, 0.4, 0.3, 0.25, 0.4, 0.2], color: 'var(--slate)', dashed: true },
           { name: L('your waves', 'le tue onde'), values: [0.78, 0.7, 0.92, 0.55, 0.72, 0.85, 0.62], color: 'var(--olive-deep)', fill: 'rgba(122,132,60,.16)' }],
          { label: 'signature' })}
        ${w >= 3 ? `<div class="legend"><span><i style="background:var(--olive-deep)"></i>${L('your waves', 'le tue onde')}</span><span><i class="dash"></i>${L('an ordinary stressful evening, no wave', 'una serata stressante normale, nessuna onda')}</span></div>` : ''}
      </section>

      <section class="card chart-card">
        <h3>${L('How well Soma knows your waves', 'Quanto bene Soma conosce le tue onde')}</h3>
        ${S.charts.lines([{ name: L('starts confirmed as waves', 'avvii confermati come onde'), values: confirm, color: 'var(--olive-deep)', label: confirm[confirm.length - 1] + '%' }], confirm.map((_, i) => (S.lang === 'it' ? 'sett ' : 'wk ') + (i + 1)), { min: 0, max: 100, ticks: [0, 50, 100], tickFmt: v => v + '%', valFmt: v => v + '%', label: 'learning' })}
        <p class="chart-note">${L('Starts confirmed by your morning taps. In weeks 1–5 the model runs silently (“would have started”).', 'Avvii confermati dai tuoi tocchi del mattino. Nelle settimane 1–5 il modello lavora in silenzio (“sarebbe partito”).')} ${L('False starts now', 'Falsi avvii ora')}: <b>${S.fmt.num(falseStarts, 1)} / ${L('week', 'sett.')}</b></p>
      </section>

      <section class="card">
        <h3>${L('Recent waves', 'Onde recenti')}</h3>
        ${recent.length ? `<ul class="wave-list">${recent.map(x => { const d = new Date(x.at); return `
          <li>
            <span class="wl-dot ${x.trigger}"></span>
            <span class="row-text"><span class="row-title">${S.fmt.day(d)} · ${S.fmt.time(d)}</span>
            <span class="row-sub">${x.trigger === 'auto' ? L('Soma started', 'avviata da Soma') : L('you started', 'avviata da te')} · ${x.minutes} min${x.settle ? ' · ' + L('settled in ', 'calma in ') + S.fmt.num(x.settle, 0) + ' min' : ''}</span></span>
            <span class="wl-out">${S.outcomeLabel(x.outcome)}</span>
          </li>`; }).join('')}</ul>` : `<div class="empty">${L('No waves yet.', 'Ancora nessuna onda.')}</div>`}
      </section>

      <button class="btn btn-primary btn-block" data-action="report">${I('note')} ${L('Prepare report for ' + S.drName(), 'Prepara il report per ' + S.drName())}</button>
    </div>`;
  };

  S.screens.me = () => {
    const c = st().consent, se = st().settings;
    return `
    <div class="scr scr-tab">
      <header class="me-head">
        <div class="avatar">${esc(st().name[0] || 'S')}</div>
        <div><h1>${esc(st().name)} R.</h1><p class="sub">Patient · ${esc(st().clinic)}</p></div>
      </header>

      <div class="list-label">Care team</div>
      <section class="card team-card">
        <div class="team-top">
          <div class="avatar dr">B</div>
          <div class="grow"><b>${esc(S.drName())}</b><span>Psychotherapist · CBT-E</span></div>
        </div>
        <div class="team-next">${I('calendar', 'ico-inline')} Next session · Tue 18:30 · in person</div>
        <div class="team-actions">
          <button class="btn btn-soft btn-sm" data-action="message">${I('note')} Message</button>
          <button class="btn btn-soft btn-sm" data-action="call-clinic">${I('phone')} Call clinic</button>
        </div>
      </section>

      <div class="list-label">Your SOMA</div>
      <section class="card">
        <div class="card-row">${S.miniPebble(36)}<div class="grow"><b>SOMA · ${S.color().en}</b><div class="muted small">${st().paired ? 'Connected' : 'Not paired'} · battery ${S.device.battery}% · firmware 1.2.0</div></div></div>
        <div class="swatches small">${S.COLORS.map(col => `<button class="swatch ${col.id === st().color ? 'is-on' : ''}" style="--c:${col.hex}" data-action="color" data-color="${col.id}" aria-label="${col.en}"><span></span></button>`).join('')}</div>
        <label class="row toggle-row"><span class="row-text"><span class="row-title">Voice guidance</span><span class="row-sub">double-tap the dial to switch</span></span><input type="checkbox" class="switch" data-setting="voice" ${st().voice ? 'checked' : ''}></label>
        <label class="row toggle-row"><span class="row-text"><span class="row-title">Daily practice reminder</span><span class="row-sub">every day at ${st().practiceTime}</span></span><input type="checkbox" class="switch" data-setting="reminders" ${st().reminders ? 'checked' : ''}></label>
      </section>

      <div class="list-label">What we agreed on</div>
      <section class="card list">
        ${toggle('autoStart', c.autoStart, 'Soma may start guiding by itself')}
        ${toggle('times', c.times, 'Share times and duration')}
        ${toggle('exercises', c.exercises, 'Share exercises completed')}
        ${toggle('settle', c.settle, 'Share how quickly you settled')}
        ${toggle('notes', c.notes, 'Share your notes')}
        ${toggle('raw', c.raw, 'Share raw body signals')}
      </section>

      <div class="list-label">Set with ${esc(S.drName())}</div>
      <section class="card list kv">
        <div class="row"><span>Recognition sensitivity</span><b>${sens()}</b></div>
        <div class="row"><span>Quiet hours</span><b>${se.quietFrom}–${se.quietTo}</b></div>
        <div class="row"><span>Max sessions per day</span><b>${se.maxSessions}</b></div>
        <div class="row"><span>If distress stays high</span><b>suggest calling the clinic</b></div>
      </section>

      <button class="card help-card" data-action="support">
        <span class="round-ico">${I('lifebuoy')}</span>
        <div><b>Get help now</b><p>If you feel unsafe or in crisis, contact your clinic or emergency services.</p></div>
        <span class="chev">${I('chev')}</span>
      </button>

      <section class="about">
        ${S.logoMark('about-mark')}
        <p><b>SOMA</b> · version 1.0.0</p>
        <p class="tiny">SOMA supports your therapy, it does not replace it. It is not an emergency service.</p>
      </section>
    </div>`;
  };

  /* ================= MESSAGES (care team) ================= */
  S.screens.message = () => {
    const msgs = [{ from: 'dr', text: 'Hi Sara, I have added the “Evening waves” programme we discussed. Try the daily practice at 18:00 and we will look at how it went on Tuesday.', at: 'Mon 14 Oct · 17:02' }].concat(st().messages);
    return `
    <div class="scr scr-msg">
      ${head('Care team', esc(S.drName()), 'Psychotherapist · ' + esc(st().clinic), 'tab-me')}
      <div class="notice">${I('info', 'ico-inline')} Usually replies within 1 working day. Not for emergencies.</div>
      <div class="thread">
        ${msgs.map(m => `<div class="bubble ${m.from === 'me' ? 'me' : 'dr'}"><p>${esc(m.text)}</p><time>${esc(m.at)}</time></div>`).join('')}
      </div>
      <div class="composer">
        <textarea id="msgText" rows="2" placeholder="Write a message…"></textarea>
        <button class="icon-btn send" data-action="send-message" aria-label="Send">${I('send')}</button>
      </div>
    </div>`;
  };

  /* ================= MORNING AFTER ================= */
  S.screens.morning = () => {
    const s = st().history.find(x => x.id === st().pendingMorning) || [...st().history].pop();
    const d = new Date(s.at);
    const answered = s.outcome && s._answered;
    return `
    <div class="scr scr-morning">
      ${head(L('This morning', 'Stamattina'), L('Good morning.', 'Buongiorno.'), null, 'home')}
      <div class="morning-body">
        <p class="big-text">${d.toDateString() === new Date().toDateString()
          ? L(`Earlier today at ${S.fmt.time(d)}, Soma was with you for ${s.minutes} minutes.`, `Oggi alle ${S.fmt.time(d)}, Soma è stato con te per ${s.minutes} minuti.`)
          : L(`Last night at ${S.fmt.time(d)}, Soma was with you for ${s.minutes} minutes.`, `Ieri sera alle ${S.fmt.time(d)}, Soma è stato con te per ${s.minutes} minuti.`)}</p>
        ${s.settle ? `<p class="big-text soft">${L(`Your body settled after about ${Math.round(s.settle)} minutes.`, `Il tuo corpo si è calmato dopo circa ${Math.round(s.settle)} minuti.`)}</p>` : ''}
        <p class="big-text soft">${L('You stayed with yourself.', 'Hai scelto di restare con te.')}</p>
      </div>
      ${answered ? `
        <div class="card thanks">${I('heart')}<p>${L('Thank you. This helps Soma learn your waves — nothing else to do today.', 'Grazie. Questo aiuta Soma a imparare le tue onde — per oggi non c’è altro da fare.')}</p></div>
        <div class="foot"><button class="btn btn-primary btn-block" data-action="home">${L('Close', 'Chiudi')}</button></div>
      ` : `
        <div class="list-label">${L('If you want, one tap about last night:', 'Se vuoi, un tocco su ieri sera:')}</div>
        <div class="taps">
          <button class="tap" data-action="outcome" data-out="rode">${L('The wave passed', 'L’onda è passata')}</button>
          <button class="tap" data-action="outcome" data-out="ate">${L('I ate, and that’s okay', 'Ho mangiato, e va bene così')}</button>
          <button class="tap" data-action="outcome" data-out="notwave">${L('It wasn’t a wave', 'Non era un’onda')}</button>
          <button class="tap ghost" data-action="outcome" data-out="skip">${L('I’d rather not say', 'Preferisco non dirlo')}</button>
        </div>
        <p class="tiny">${st().consent.notes ? L('Your notes are shared with ' + S.drName() + '.', 'Le tue note sono condivise con ' + S.drName() + '.') : L('Your notes stay private unless you choose to share them.', 'Le tue note restano private, a meno che tu non scelga di condividerle.')}</p>
      `}
    </div>`;
  };

  /* ================= REPORT ================= */
  S.reportDraft = { period: 4, note: '', stage: 'config', sentAt: null };

  function reportData() {
    const w = st().week, p = S.reportDraft.period;
    const from = Math.max(1, p === 0 ? 1 : w - p + 1);
    const ws = S.weekStats(from, w);
    const sess = st().history.filter(s => s.week >= from && s.week <= w);
    const real = sess.filter(s => !s.falseStart);
    const total = real.length;
    const auto = real.filter(s => s.trigger === 'auto').length;
    const sv = real.map(s => s.settle).filter(Boolean).sort((a, b) => a - b);
    const med = sv.length ? sv[Math.floor(sv.length / 2)] : null;
    const steps = real.length ? real.reduce((a, s) => a + s.steps, 0) / real.length : 0;
    const prDays = ws.practice.reduce((a, b) => a + b, 0);
    const prMax = ws.practice.length * 7;
    const evening = real.filter(s => new Date(s.at).getHours() >= 20).length;
    const passed = real.filter(s => s.outcome === 'rode').length;
    const ate = real.filter(s => s.outcome === 'ate').length;
    const weekday = real.filter(s => { const d = new Date(s.at).getDay(); return d >= 1 && d <= 4; }).length;
    return { from, to: w, ws, sess, real, total, auto, med, steps, prDays, prMax, evening, passed, ate, weekday, falseStarts: sess.filter(s => s.falseStart).length, mt: medianTime(real) };
  }
  S.reportData = reportData;

  S.reportDoc = function (forPrint) {
    const d = reportData(), c = st().consent;
    const first = d.ws.settle.find(v => v != null), last = [...d.ws.settle].reverse().find(v => v != null);
    const pct = x => d.total ? Math.round((x / d.total) * 100) : 0;
    const summary = L(
      `Over weeks ${d.from}–${d.to}, ${st().name} used SOMA's guidance ${d.total} times` + (c.times ? `, mostly in the evening (median start ${d.mt || '–'})` : '') + '.' +
      (c.settle && first && last ? ` The median time for the body to settle went from ${Math.round(first)} to ${Math.round(last)} minutes.` : '') +
      ` ${pct(d.passed)}% of the mornings after, ${st().name} reported that the wave passed; ${d.ate} time${d.ate === 1 ? '' : 's'} they reported eating, described without judgement.` +
      (c.exercises ? ` Daily practice was completed on ${d.prDays} of ${d.prMax} days.` : ''),
      `Nelle settimane ${d.from}–${d.to}, ${st().name} ha usato la guida di SOMA ${d.total} volte` + (c.times ? `, soprattutto la sera (inizio mediano ${d.mt || '–'})` : '') + '.' +
      (c.settle && first && last ? ` Il tempo mediano perché il corpo si calmasse è passato da ${Math.round(first)} a ${Math.round(last)} minuti.` : '') +
      ` Nel ${pct(d.passed)}% dei mattini successivi, ${st().name} ha riferito che l'onda è passata; ${d.ate} volt${d.ate === 1 ? 'a' : 'e'} ha riferito di aver mangiato, senza giudizio.` +
      (c.exercises ? ` La pratica quotidiana è stata svolta in ${d.prDays} giorni su ${d.prMax}.` : '')
    );
    const discuss = [
      c.times ? L(`${pct(d.evening)}% of waves began after 20:00 and ${pct(d.weekday)}% on Mon–Thu. Would moving the daily practice closer to the evening help?`, `Il ${pct(d.evening)}% delle onde è iniziato dopo le 20:00 e il ${pct(d.weekday)}% tra lunedì e giovedì. Spostare la pratica quotidiana verso sera potrebbe aiutare?`) : null,
      c.exercises ? L(`On average ${S.fmt.num(d.steps, 1)} of 6 steps were completed. “Surf” most often came just before settling; “Move” was often skipped late at night.`, `In media sono stati completati ${S.fmt.num(d.steps, 1)} passi su 6. “Cavalca” precede più spesso la calma; “Muoviti” viene spesso saltato a tarda notte.`) : null,
      L(`Soma started by itself ${d.auto} times; ${d.falseStarts} start${d.falseStarts === 1 ? ' was' : 's were'} marked “not a wave”. Is the sensitivity still right?`, `Soma è partito da solo ${d.auto} volte; ${d.falseStarts} avvi${d.falseStarts === 1 ? 'o è stato segnato' : 'i sono stati segnati'} come “non era un’onda”. La sensibilità è ancora adatta?`)
    ].filter(Boolean);
    const shared = [
      ['times', L('times and duration', 'orari e durata')], ['exercises', L('exercises completed', 'esercizi completati')],
      ['settle', L('time to settle', 'tempo per calmarsi')], ['notes', L('personal notes', 'note personali')], ['raw', L('raw body signals', 'segnali corporei grezzi')]
    ];
    const bars = S.charts.bars(d.ws.weeks.map((wk, i) => ({ label: (S.lang === 'it' ? 'sett ' : 'wk ') + wk, value: d.ws.counts[i], tip: (S.lang === 'it' ? 'Settimana ' : 'Week ') + wk + ': ' + d.ws.counts[i] })), { max: Math.max(4, ...d.ws.counts) + 1, allLabels: d.ws.weeks.length <= 5, w: 300, h: 110 });
    const today = new Date();
    return `
    <article class="report-doc ${forPrint ? 'for-print' : ''}">
      <header class="rd-head">
        <div class="rd-brand">${S.logoMark('rd-mark')}<span>soma</span></div>
        <div class="rd-meta"><b>${L('Report for', 'Report per')} ${esc(S.drName())}</b><span>${esc(st().name)} R. · ${L('weeks', 'settimane')} ${d.from}–${d.to}</span><span>${L('Generated', 'Generato')} ${S.fmt.date(today)}</span></div>
      </header>
      <section><h4>${I('spark', 'ico-inline')} ${L('Summary in plain words', 'Sintesi in parole semplici')}</h4><p>${summary}</p></section>
      <section class="rd-tiles">
        <div><small>${L('Guided waves', 'Onde guidate')}</small><b>${d.total}</b><span>${d.auto} ${L('started by Soma', 'avviate da Soma')}</span></div>
        ${c.settle ? `<div><small>${L('Median time to settle', 'Tempo mediano per calmarsi')}</small><b>${d.med ? S.fmt.num(d.med, 0) : '–'} min</b><span>${first ? L('from ' + Math.round(first) + ' min', 'da ' + Math.round(first) + ' min') : ''}</span></div>` : ''}
        ${c.exercises ? `<div><small>${L('Daily practice', 'Pratica quotidiana')}</small><b>${d.prDays}/${d.prMax}</b><span>${L('days', 'giorni')}</span></div>` : ''}
        ${c.times ? `<div><small>${L('Waves start', 'Inizio onde')}</small><b>${d.mt || '–'}</b><span>${L('median', 'mediana')}</span></div>` : ''}
      </section>
      <section><h4>${L('Guided waves per week', 'Onde guidate per settimana')}</h4>${bars}</section>
      <section><h4>${L('Points to discuss in session', 'Punti da discutere in seduta')}</h4><ul>${discuss.map(x => `<li>${x}</li>`).join('')}</ul></section>
      ${c.notes && S.reportDraft.note ? `<section><h4>${L('A note from', 'Una nota da')} ${esc(st().name)}</h4><blockquote>${esc(S.reportDraft.note)}</blockquote></section>` : ''}
      <section class="rd-shared"><h4>${L('Shared by agreement', 'Condiviso per accordo')}</h4>
        <div class="rd-chips">${shared.map(([k, l]) => `<span class="${c[k] ? 'on' : 'off'}">${c[k] ? '✓' : '—'} ${l}</span>`).join('')}</div>
      </section>
      <footer class="rd-foot">${L('SOMA informs therapy, it does not replace it. No single signal is interpreted as a binge-eating episode.', 'SOMA informa la terapia, non la sostituisce. Nessun singolo segnale è interpretato come un episodio di abbuffata. Prototipo — dati simulati.')}</footer>
    </article>`;
  };

  S.screens.report = () => {
    const r = S.reportDraft, c = st().consent;
    if (r.stage === 'analyzing') {
      const steps = [
        L('Collecting the sessions from SOMA', 'Raccolgo le sessioni da SOMA'),
        L('Comparing with your personal baseline', 'Confronto con la tua baseline personale'),
        L('Looking for patterns in timing and context', 'Cerco schemi negli orari e nel contesto'),
        L('Removing what you chose not to share', 'Rimuovo ciò che hai scelto di non condividere'),
        L('Writing it in plain, non-judgemental words', 'Scrivo con parole semplici e non giudicanti')
      ];
      return `
      <div class="scr">
        ${head(L('Report', 'Report'), L('Preparing your report…', 'Preparo il tuo report…'), L('On this phone. Nothing is sent until you decide.', 'Su questo telefono. Nulla viene inviato finché non decidi tu.'))}
        <div class="ai-orb">${S.logoMark('spin')}</div>
        <ul class="ai-steps" id="aiSteps">${steps.map((s, i) => `<li data-i="${i}"><span class="st-ico"></span>${s}</li>`).join('')}</ul>
      </div>`;
    }
    if (r.stage === 'preview' || r.stage === 'sent') {
      return `
      <div class="scr scr-report">
        ${head(L('Report', 'Report'), r.stage === 'sent' ? L('Sent.', 'Inviato.') : L('Ready to share', 'Pronto da condividere'), r.stage === 'sent' ? L(S.drName() + ' will see it before your session.', S.drName() + ' lo vedrà prima della seduta.') : L('Read it first. You decide.', 'Leggilo prima. Decidi tu.'), 'report-back')}
        ${S.reportDoc(false)}
        <div class="foot sticky">
          ${r.stage === 'sent'
            ? `<div class="sent-ok">${I('check')} ${L('Delivered to ' + S.drName(), 'Consegnato a ' + S.drName())} · ${S.fmt.time(new Date(r.sentAt))}</div><button class="btn btn-soft btn-block" data-action="print">${I('download')} ${L('Save as PDF', 'Salva come PDF')}</button>`
            : `<button class="btn btn-primary btn-block" data-action="send-report" id="sendBtn">${I('send')} ${L('Send to ' + S.drName(), 'Invia a ' + S.drName())}</button><button class="btn btn-soft btn-block" data-action="print">${I('download')} ${L('Save as PDF', 'Salva come PDF')}</button>`}
        </div>
      </div>`;
    }
    const items = [
      ['times', L('Times and duration of guidance', 'Orari e durata della guida')], ['exercises', L('Exercises completed', 'Esercizi completati')],
      ['settle', L('How quickly your body settled', 'Quanto in fretta il corpo si è calmato')], ['notes', L('Your notes', 'Le tue note')], ['raw', L('Raw body signals', 'Segnali corporei grezzi')]
    ];
    return `
    <div class="scr">
      ${head(L('Report', 'Report'), L('For your next session', 'Per la prossima seduta'), L('Soma turns the weeks into a short, readable summary for ' + S.drName() + '.', 'Soma trasforma le settimane in una sintesi breve e leggibile per ' + S.drName() + '.'), 'home')}
      <div class="list-label">${L('Period', 'Periodo')}</div>
      <div class="seg">
        ${[[2, L('2 weeks', '2 settimane')], [4, L('4 weeks', '4 settimane')], [0, L('Since start', 'Dall’inizio')]].map(([v, l]) => `<button class="${r.period === v ? 'is-on' : ''}" data-action="period" data-period="${v}">${l}</button>`).join('')}
      </div>
      <div class="list-label">${L('What will be included', 'Cosa sarà incluso')}</div>
      <section class="card list">
        ${items.map(([k, l]) => `<div class="row incl ${c[k] ? 'on' : 'off'}"><span class="incl-ico">${c[k] ? I('check') : I('close')}</span><span class="row-title">${l}</span><span class="muted small">${c[k] ? L('shared', 'condiviso') : L('not shared', 'non condiviso')}</span></div>`).join('')}
      </section>
      <p class="tiny left">${L('This follows what you agreed on. Change it in Me → What we agreed on.', 'Segue ciò su cui vi siete accordati. Puoi cambiarlo in Io → Su cosa ci siamo accordati.')}</p>
      ${c.notes ? `
        <div class="list-label">${L('A note for ' + S.drName() + ' (optional)', 'Una nota per ' + S.drName() + ' (facoltativa)')}</div>
        <textarea class="note" id="reportNote" rows="3" placeholder="${L('Anything you’d like to talk about…', 'Qualcosa di cui vorresti parlare…')}">${esc(r.note)}</textarea>` : ''}
      <div class="foot"><button class="btn btn-primary btn-block" data-action="gen-report">${I('spark')} ${L('Prepare the report', 'Prepara il report')}</button></div>
    </div>`;
  };
})();
