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
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>'
  };
  S.icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  const I = S.icon;

  /* Mini pebble used in toasts and chips (follows the chosen colour) */
  S.miniPebble = (size = 28) => {
    const c = S.color();
    return `<svg class="mini-pebble" width="${size}" height="${Math.round(size * 0.69)}" viewBox="0 0 350 241" aria-hidden="true"><ellipse cx="175" cy="120.5" rx="175" ry="120.5" fill="${c.hex}"/><ellipse cx="175" cy="120" rx="129" ry="89" fill="#FAF6F3"/><circle cx="175" cy="120" r="38" fill="none" stroke="#F3B880" stroke-width="10"/><circle cx="175" cy="120" r="32" fill="#8C8A86"/></svg>`;
  };

  /* The SOMA logo (from the designers' SVG), drawn inline so it can animate */
  const DOTS = [[213.18,165.95],[228.41,148.37],[234.41,127.37],[233.62,106.67],[226.62,88.67],[213.94,74.48],[196.69,64.63],[175.81,61.09],[154.24,64.24],[136.09,74.69],[124.09,88.03],[117.09,106.29],[115.09,126.63],[121.09,148.22],[135.09,165.69],[154.09,176.9],[175.09,180.9],[197.09,176.9]];
  S.logoMark = (cls = '', rim) => `<svg class="logo-mark ${cls}" viewBox="0 0 350 241" aria-hidden="true">
    <ellipse cx="174.95" cy="120.58" rx="174.95" ry="120.58" fill="${rim || '#A4A667'}"/>
    <ellipse cx="174.71" cy="120.05" rx="129.32" ry="89.12" fill="#FAF6F3"/>
    <g fill="#8C8A86" class="lm-dots">${DOTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.85"/>`).join('')}</g>
    <circle class="lm-ring" cx="174.58" cy="120.26" r="38.2" fill="none" stroke="#F3B880" stroke-width="5"/>
    <circle cx="174.56" cy="120.27" r="32.49" fill="#8C8A86"/>
  </svg>`;
  S.wordmark = (cls = '') => `<img class="wordmark ${cls}" src="assets/brand/logo-wordmark.svg" alt="soma">`;

  /* Illustrations used in the practice cards and dark sessions */
  S.illus = (kind, dark) => {
    const arrows = `<g class="il-arrows" stroke="#F2B27A" stroke-width="7" stroke-linecap="round" fill="none"><path class="ar-l" d="M-130 120h75M-75 100l22 20-22 20"/><path class="ar-r" d="M480 120h-75M425 100l-22 20 22 20"/></g>`;
    const extra = {
      breathe: arrows,
      ground: `<g transform="translate(205 20) rotate(32)"><rect x="0" y="-80" width="44" height="150" rx="22" fill="#F4C9A4" stroke="#C98A5C" stroke-width="3"/><path d="M8 -50h28M8 -38h28" stroke="#C98A5C" stroke-width="3" stroke-linecap="round"/></g><path d="M118 92a62 62 0 0 1 30-26" stroke="#F2B27A" stroke-width="6" fill="none" stroke-linecap="round"/>`,
      surf: `<path class="il-wave" d="M-120 210c60 0 80-70 120-70s60 70 110 70 80-70 120-70 60 70 110 70 70-70 110-70" fill="none" stroke="#F2B27A" stroke-width="6" stroke-linecap="round"/>`,
      move: `<g stroke="#F2B27A" stroke-width="6" fill="none" stroke-linecap="round"><path d="M-40 60a160 160 0 0 0 0 120"/><path d="M390 60a160 160 0 0 1 0 120"/></g>`,
      meal: `<g transform="translate(250 150)"><path d="M0 0h110a55 55 0 0 1-110 0z" fill="#FBEBD9" stroke="#C98A5C" stroke-width="4"/><path d="M30-30v18M55-36v24M80-30v18" stroke="#F2B27A" stroke-width="5" stroke-linecap="round"/></g>`,
      kind: `<path d="M175 236s-38-22-38-48a20 20 0 0 1 38-10 20 20 0 0 1 38 10c0 26-38 48-38 48z" fill="#F2B27A"/>`
    }[kind] || '';
    return `<svg class="illus il-${kind} ${dark ? 'on-dark' : ''}" viewBox="-140 -20 630 280" aria-hidden="true"><g class="il-body">${S.logoMark('').replace(/<\/?svg[^>]*>/g, '')}</g>${extra}</svg>`;
  };

  const toggle = (key, on, label, sub, attr = 'data-consent') => `
    <label class="row toggle-row">
      <span class="row-text"><span class="row-title">${label}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span>
      <input type="checkbox" class="switch" ${attr}="${key}" ${on ? 'checked' : ''}>
    </label>`;

  /* Screen header: back chevron on the left, then title and subtitle (as in the designs) */
  const head = (eyebrow, title, sub, back, right) => `
    <header class="scr-head">
      <div class="topbar">
        ${back ? `<button class="back-btn" data-action="${back}" aria-label="${L('Back', 'Indietro')}">${I('back')}</button>` : '<span></span>'}
        ${right || ''}
      </div>
      ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
      <h1>${title}</h1>
      ${sub ? `<p class="sub">${sub}</p>` : ''}
    </header>`;
  S.head = head;

  S.drName = () => S.lang === 'it' ? st().therapist.replace('Dr.', 'Dott.ssa') : st().therapist;

  /* ================= ONBOARDING (designs 1–12) ================= */

  S.screens = {};

  /* Italian article before a percentage: l'8%, l'11%, l'80%, il 73% */
  S.artPct = n => (/^(8|11|1$)/.test(String(n)) ? 'L’' : 'Il ') + n + '%';

  S.langSwitch = () => `
    <div class="lang-switch" role="group" aria-label="${L('Language', 'Lingua')}">
      <button class="${S.lang === 'it' ? 'is-on' : ''}" data-action="lang" data-lang="it">IT</button>
      <button class="${S.lang === 'en' ? 'is-on' : ''}" data-action="lang" data-lang="en">EN</button>
    </div>`;

  // 2 · Welcome
  S.screens.welcome = () => `
    <div class="scr scr-welcome">
      ${S.langSwitch()}
      <div class="welcome-brand">${S.wordmark('breathing')}</div>
      <h1 class="welcome-title">${L('A space to find yourself again.', 'Uno spazio per ritrovarti.')}</h1>
      <p class="welcome-sub">${L('Your experience, one step at a time.', 'La tua esperienza, un passo alla volta.')}</p>
      <div class="welcome-actions">
        <button class="btn btn-primary btn-block" data-action="ob-go" data-to="login">${L('Sign in with email', 'Accedi con email')}</button>
        <button class="btn btn-outline btn-block" data-action="ob-go" data-to="signup">${L('Create an account', 'Crea un account')}</button>
        <p class="tiny">${L('You can set up SOMA together with your therapist.', 'Puoi configurare SOMA insieme al terapeuta.')}</p>
      </div>
    </div>`;

  // 3 · Sign in
  S.screens.login = () => `
    <div class="scr">
      ${head(null, L('Welcome back.', 'Bentornato/a.'), L('Sign in to continue your journey.', 'Accedi per continuare il tuo percorso.'), 'ob-back')}
      <label class="field"><span>Email</span><input type="email" value="laura.r@email.it" placeholder="nome@email.it" autocomplete="off"></label>
      <label class="field"><span>Password</span><input type="password" value="somasoma" placeholder="••••••••" autocomplete="off"></label>
      <button class="link-btn right" data-action="toast" data-msg="${L('We’ve sent you a link to reset your password.', 'Ti abbiamo inviato un link per reimpostare la password.')}">${L('Forgot your password?', 'Password dimenticata?')}</button>
      <div class="foot mid">
        <button class="btn btn-primary btn-block" data-action="ob-go" data-to="together">${L('Sign in', 'Accedi')}</button>
        <p class="tiny">${L('Don’t have an account yet?', 'Non hai ancora un account?')}<br><button class="link-btn" data-action="ob-go" data-to="signup">${L('Sign up', 'Registrati')}</button></p>
      </div>
    </div>`;

  // 4 · Sign up
  S.screens.signup = () => `
    <div class="scr">
      ${head(null, L('Let’s start with you.', 'Iniziamo da te.'), L('The information you enter stays yours.', 'Le informazioni che inserisci restano tue.'), 'ob-back')}
      <label class="field"><span>${L('What would you like to be called?', 'Come vuoi essere chiamato/a?')}</span><input id="suName" value="${esc(st().name)}" placeholder="${L('Your name', 'Il tuo nome')}" autocomplete="off"></label>
      <label class="field"><span>Email</span><input type="email" value="laura.r@email.it" placeholder="nome@email.it" autocomplete="off"></label>
      <label class="field"><span>Password</span><input type="password" placeholder="${L('At least 8 characters', 'Almeno 8 caratteri')}" value="somasoma" autocomplete="off"></label>
      <div class="note note-green">${L('SOMA accompanies your therapy, but it does not replace clinical support.', 'SOMA accompagna il percorso terapeutico, ma non sostituisce il supporto clinico.')}</div>
      <div class="foot mid">
        <button class="btn btn-primary btn-block" data-action="signup">${L('Continue', 'Continua')}</button>
        <p class="tiny">${L('Already have an account?', 'Hai già un account?')}<br><button class="link-btn" data-action="ob-go" data-to="login">${L('Sign in', 'Accedi')}</button></p>
      </div>
    </div>`;

  // 5 · Verify email
  S.screens.verify = () => `
    <div class="scr">
      ${head(null, L('Check your email.', 'Controlla la tua email.'), L('We sent you a confirmation code.', 'Ti abbiamo inviato un codice di conferma.'), 'ob-back')}
      <div class="soft-circle">${I('note')}</div>
      <div class="code-boxes">${['4', '8', '2', '1'].map((d, i) => `<input maxlength="1" inputmode="numeric" value="${d}" aria-label="${L('Digit', 'Cifra')} ${i + 1}">`).join('')}</div>
      <div class="foot mid">
        <button class="btn btn-primary btn-block" data-action="verify-email" id="verifyBtn">${L('Verify code', 'Verifica codice')}</button>
        <button class="link-btn" data-action="toast" data-msg="${L('New code sent.', 'Nuovo codice inviato.')}">${L('Send a new code', 'Invia un nuovo codice')}</button>
      </div>
    </div>`;

  // 6 · Together, calmly
  S.screens.together = () => `
    <div class="scr">
      ${head(null, L('Together, calmly.', 'Insieme, con calma.'), L('Before you start, agree on the journey with your therapist.', 'Prima di iniziare, concorda il percorso con il tuo terapeuta.'), 'ob-back')}
      <div class="logo-center">${S.logoMark('breathing')}</div>
      <section class="card steps-card">
        <div><b>01 ${L('Connect the handheld', 'Collega il palmare')}</b><span>${L('Pair your device.', 'Associa il tuo dispositivo.')}</span></div>
        <div><b>02 ${L('Set the agreements', 'Definisci gli accordi')}</b><span>${L('Choose what to share.', 'Scegli cosa condividere.')}</span></div>
        <div><b>03 ${L('Discover the programme', 'Scopri il programma')}</b><span>${L('Learn to use SOMA.', 'Impara a utilizzare SOMA.')}</span></div>
      </section>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Start the setup', 'Inizia la configurazione')}</button></div>
    </div>`;

  // 7 · Pairing
  S.screens.pair = () => `
    <div class="scr">
      ${head(null, L('Welcome to', 'Benvenuto/a su') + ' <span class="brand-word">soma</span>.', L('guided setup during the session', 'configurazione guidata durante la seduta'), 'ob-back')}
      <div class="pair-stage">
        <svg viewBox="-40 -40 430 321" class="pair-arc" aria-hidden="true">
          <ellipse cx="175" cy="120.5" rx="205" ry="150" fill="none" stroke="#EADFD3" stroke-width="3"/>
          <path d="M175 -29.5 A205 150 0 0 1 175 270.5 A205 150 0 0 1 175 -29.5" fill="none" stroke="#F2B27A" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" id="pairArc"/>
        </svg>
        ${S.logoMark('pair-logo')}
      </div>
      <p class="center-text">${L('Hold soma in the palm of your hand', 'Tieni soma nel palmo della mano')}<br><span class="muted">${L('for three seconds to pair it.', 'per tre secondi per associarlo.')}</span></p>
      <div class="foot">
        <button class="btn btn-muted btn-block hold-btn" id="pairBtn" data-hold="pair"><span class="hold-fill"></span><span class="hold-label">${L('Press and hold to pair', 'Tieni premuto per associare')}</span></button>
        <p class="tiny">${L('…or hold the SOMA object on the side.', '…oppure tieni premuto l’oggetto SOMA a lato.')}</p>
      </div>
    </div>`;

  // 8 · Paired
  S.screens.paired = () => `
    <div class="scr">
      ${head(null, L('Here it is, connected!', 'Eccoci, è connesso!'), L('Your SOMA is ready to accompany you.', 'Il tuo SOMA è pronto ad accompagnarti.'), 'ob-back')}
      <div class="paired-badge"><div class="paired-circle">${S.logoMark('')}</div><span class="check-badge">${I('check')}</span></div>
      <p class="center-text"><b>SOMA · ${L('connected', 'connesso')}</b><br><span class="muted small">${L('Battery', 'Batteria')} ${S.device.battery}%</span></p>
      <div class="swatches">${S.COLORS.map(c => `<button class="swatch ${c.id === st().color ? 'is-on' : ''}" style="--c:${c.hex}" data-action="color" data-color="${c.id}" aria-label="${L(c.en, c.it)}"><span></span><small>${L(c.en, c.it)}</small></button>`).join('')}</div>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Continue', 'Continua')}</button></div>
    </div>`;

  // 9 · Guidance preferences
  S.screens.prefs = () => `
    <div class="scr">
      ${head(null, L('How would you like to be guided?', 'Come vuoi essere guidato/a?'), L('You can change these preferences whenever you want.', 'Puoi cambiare queste preferenze quando vuoi.'), 'ob-back')}
      <h3 class="sec-title">${L('Support mode', 'Modalità di supporto')}</h3>
      <section class="card list">
        ${toggle('voice', st().voice, L('Sounds and voice', 'Suoni e voce'), L('Voice instructions, when you want them.', 'Istruzioni vocali, quando lo desideri.'), 'data-setting')}
        ${toggle('haptics', st().haptics, L('Haptic feedback', 'Feedback tattile'), L('Gentle vibrations of the handheld.', 'Piccole vibrazioni del palmare.'), 'data-setting')}
      </section>
      <h3 class="sec-title">${L('When do you prefer quiet?', 'Quando preferisci tranquillità?')}</h3>
      <section class="card quiet-card">
        <div><span>${L('Quiet hours', 'Ore silenziose')}</span><b>${st().settings.quietFrom} — ${st().settings.quietTo}</b></div>
        <button class="link-btn" data-action="toast" data-msg="${L('Quiet hours are set together with your therapist.', 'Le ore silenziose si decidono insieme al terapeuta.')}">${L('Edit', 'Modifica')} ›</button>
      </section>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Save and continue', 'Salva e continua')}</button></div>
    </div>`;

  // 02 · Agreements (what to share)
  S.screens.agree = () => {
    const c = st().consent;
    return `
    <div class="scr">
      ${head(null, L('What do you want to share?', 'Cosa vuoi condividere?'), L('Decided with your therapist. You can change it at any session.', 'Lo decidi con il terapeuta. Puoi cambiarlo a ogni seduta.'), 'ob-back')}
      <section class="card list">
        ${toggle('autoStart', c.autoStart, L('Soma may start guiding by itself', 'Soma può iniziare a guidarti da solo'), L('when it recognises your waves', 'quando riconosce le tue onde'))}
      </section>
      <h3 class="sec-title">${L('Share with your therapist', 'Condividi con il terapeuta')}</h3>
      <section class="card list">
        ${toggle('times', c.times, L('Times and duration of guidance', 'Orari e durata della guida'))}
        ${toggle('exercises', c.exercises, L('Exercises completed', 'Esercizi completati'))}
        ${toggle('settle', c.settle, L('How quickly your body settled', 'Quanto in fretta il corpo si è calmato'))}
        ${toggle('notes', c.notes, L('Your notes', 'Le tue note'))}
        ${toggle('raw', c.raw, L('Raw body signals', 'Segnali corporei grezzi'))}
      </section>
      <p class="tiny left">${I('shield', 'ico-inline')} ${L('Signals are processed on the device. No single signal is ever read as a binge episode.', 'I segnali sono elaborati sul dispositivo. Nessun singolo segnale viene mai letto come un episodio di abbuffata.')}</p>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Save and continue', 'Salva e continua')}</button></div>
    </div>`;
  };

  // 10 · Support network
  S.screens.support = () => `
    <div class="scr">
      ${head(null, L('A support network.', 'Una rete di supporto.'), L('Connect with the professional who follows you.', 'Collegati con il professionista che ti segue.'), 'ob-back')}
      <div class="soft-circle big">${I('heart')}</div>
      <label class="field"><span>${L('Invitation code', 'Codice di invito')}</span><input id="actCode" class="code-input" value="SOMA-4821" placeholder="Es. SOMA-4821" autocomplete="off" spellcheck="false"></label>
      <div class="foot">
        <button class="btn btn-primary btn-block" data-action="verify-code" id="linkBtn">${L('Connect the professional', 'Collega il professionista')}</button>
        <button class="link-btn" data-action="skip-link">${L('I’ll do it later', 'Lo farò più tardi')}</button>
      </div>
    </div>`;

  // 11 · Programme
  S.screens.programme = () => `
    <div class="scr">
      ${head(null, L('A journey for you.', 'Un percorso per te.'), L('Proposed by your therapist and editable together.', 'Proposto dal terapeuta e modificabile insieme.'), 'ob-back')}
      <section class="card card-green prog-head"><span class="eyebrow">${L('Shared programme', 'Programma condiviso')}</span><b>${L('Evening waves · Support plan', 'Onde serali · Piano di supporto')}</b></section>
      <ol class="prog-list">
        ${S.PROGRAMME.map((p, i) => `<li class="prog-item"><span class="num">${i + 1}</span><span class="row-text"><span class="row-title">${L(p.en, p.it)}</span><span class="row-sub">${L(p.subEn, p.subIt)}</span></span></li>`).join('')}
      </ol>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-next">${L('Got it, continue', 'Ho capito, continua')}</button></div>
    </div>`;

  // 12 · Phases
  S.screens.phases = () => `
    <div class="scr">
      ${head(null, L('Let’s get to know each other first.', 'Prima conosciamoci.'), L('Automatic start is not immediate.', 'L’avvio automatico non è immediato.'), 'ob-back')}
      <section class="card timeline">
        <div class="tl-item on"><i></i><div><small>${L('Weeks 1–3', 'Settimane 1–3')}</small><b>${L('Listening', 'Ascolto')}</b><span>${L('Use the manual support.', 'Usa il supporto manuale.')}</span></div></div>
        <div class="tl-item"><i></i><div><small>${L('Weeks 3–6', 'Settimane 3–6')}</small><b>${L('Learning', 'Apprendimento')}</b><span>${L('Recognition to be verified.', 'Riconoscimento da verificare.')}</span></div></div>
        <div class="tl-item"><i></i><div><small>${L('After the review', 'Dopo la valutazione')}</small><b>${L('Agreed guidance', 'Guida concordata')}</b><span>${L('Only with consent and validation.', 'Solo con consenso e validazione.')}</span></div></div>
      </section>
      <div class="note note-peach">${L('You can ask SOMA for help manually at any time.', 'Puoi chiedere aiuto a SOMA manualmente in qualunque momento.')}</div>
      <div class="foot"><button class="btn btn-primary btn-block" data-action="ob-finish">${L('Go to your home', 'Vai alla tua home')}</button></div>
    </div>`;

  /* ================= TAB BAR ================= */
  const TAB_ICONS = {
    today: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    practice: '<circle cx="12" cy="7.5" r="3.5"/><circle cx="12" cy="16.5" r="3.5"/><circle cx="7.5" cy="12" r="3.5"/><circle cx="16.5" cy="12" r="3.5"/>',
    waves: '<path d="M3 14c2.5-5 5.5-5 9 0s6.5 5 9 0"/>',
    me: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'
  };
  S.tabbar = (active) => `
    <nav class="tabbar" aria-label="${L('Main', 'Principale')}">
      ${[['today', L('Today', 'Oggi')], ['practice', L('Practice', 'Pratica')], ['waves', L('Waves', 'Onde')], ['me', L('Me', 'Io')]].map(([id, label]) =>
        `<button class="tab ${active === id ? 'is-on' : ''}" data-action="tab" data-tab="${id}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TAB_ICONS[id]}</svg><span>${label}</span></button>`).join('')}
    </nav>`;

  const sens = () => ({ low: L('low', 'bassa'), medium: L('medium', 'media'), high: L('high', 'alta') })[st().settings.sensitivity];
  S.sens = sens;

  function insights() {
    const h = S.sessionsVisible();
    const list = [];
    if (S.phase() === 'listening' && st().week <= 2) {
      list.push(L('Not much to say yet — and that’s expected. Soma needs a few weeks of ordinary days to know your baseline.', 'Ancora poco da dire — ed è normale. Soma ha bisogno di qualche settimana di giornate normali per conoscere i tuoi valori abituali.'));
    }
    if (h.length > 4) {
      const ev = h.filter(s => new Date(s.at).getHours() >= 20).length / h.length;
      list.push(L(`${Math.round(ev * 100)}% of your waves began after 20:00, often after a long time on the phone.`, `${S.artPct(Math.round(ev * 100))} delle tue onde sono iniziate dopo le 20:00, spesso dopo molto tempo passato al telefono.`));
    }
    if (st().week >= 4) {
      const s = S.weekStats();
      const first = s.settle.find(v => v != null), last = [...s.settle].reverse().find(v => v != null);
      if (first && last) list.push(L(`Your body settles faster: from about ${Math.round(first)} minutes in week 1 to ${Math.round(last)} now.`, `Il tuo corpo si calma più in fretta: da circa ${Math.round(first)} minuti nella prima settimana ai ${Math.round(last)} di adesso.`));
    }
    return list;
  }

  /* ================= TODAY (designs 13–14) ================= */
  S.screens.today = () => {
    const online = st().online !== false;
    const pm = st().pendingMorning && st().history.find(s => s.id === st().pendingMorning);
    const ins = insights();
    const g = S.device.GESTURES[(new Date().getDate()) % 6];
    const status = online
      ? `<button class="status-pill" data-action="open-device"><i class="dot-on"></i>SOMA ${S.device.battery}%</button>`
      : `<button class="status-pill off" data-action="open-device"><i class="dot-off"></i>Offline</button>`;
    const right = `<div class="top-right"><button class="bell" data-action="notifications" aria-label="${L('Messages for you', 'Messaggi per te')}">${I('bell')}<i class="badge"></i></button>${status}</div>`;
    return `
    <div class="scr scr-tab">
      ${head(null, L('Hi, ', 'Ciao, ') + esc(st().name) + '.', online ? L('Take the time you need.', 'Prenditi il tempo che ti serve.') : L('Today you can start calmly.', 'Oggi puoi iniziare con calma.'), null, right)}

      ${online ? `
      <section class="card card-green gesture-card">
        <div><span class="eyebrow">${L('Today’s gesture', 'Il gesto di oggi')}</span><b>${L(g.en, g.it)}</b><span>${L(g.fbEn, g.fbIt)}</span>
        <button class="pill pill-white" data-action="guide">${L('Discover the gesture', 'Scopri il gesto')}</button></div>
        <div class="gesture-art">${S.logoMark('')}</div>
      </section>` : `
      <section class="card card-peach">
        <b class="card-title">${L('SOMA is not connected', 'SOMA non è collegato')}</b>
        <p>${L('Bring the handheld closer and check Bluetooth. Practice in the app is still available.', 'Avvicina il palmare e controlla il Bluetooth. La pratica dall’app resta disponibile.')}</p>
        <button class="pill pill-white" data-action="reconnect">${L('Retry connection', 'Riprova connessione')}</button>
      </section>`}

      ${pm ? `
      <button class="card morning-card" data-action="morning">
        <span class="eyebrow">${L('About last night', 'A proposito di ieri sera')}</span>
        <b>${L('Plain words, one optional tap.', 'Parole semplici, un tocco facoltativo.')}</b>
        <span class="chev">${I('chev')}</span>
      </button>` : ''}

      ${online ? `
      <div class="sec-row"><h3 class="sec-title">${L('To practise', 'Per esercitarti')}</h3><button class="link-btn" data-action="tab" data-tab="practice">${L('See all', 'Vedi tutto')} ›</button></div>
      <section class="card">
        <b class="card-title">${L('Breathe with SOMA', 'Respira con SOMA')}</b>
        <p class="muted">${L('Squeeze and release · 3 min', 'Stringi e rilascia · 3 min')}</p>
        <button class="pill pill-peach" data-action="skill" data-skill="breathe">${L('Start the practice', 'Inizia la pratica')}</button>
      </section>

      <h3 class="sec-title">${L('When you feel the need', 'Quando ne senti il bisogno')}</h3>
      <section class="card">
        <b class="card-title">${L('A gesture, a moment.', 'Un gesto, un momento.')}</b>
        <p>${L('You can press and hold the centre of SOMA to start the guidance.', 'Puoi tenere premuto il centro di SOMA per avviare la guida.')}</p>
        <button class="pill pill-green" data-action="start-manual">${L('Guide me now', 'Guidami adesso')}</button>
      </section>` : `
      <h3 class="sec-title">${L('Also available offline', 'Disponibili anche offline')}</h3>
      <button class="card row-card" data-action="skill" data-skill="breathe"><span class="row-text"><span class="row-title">${L('Guided breathing', 'Respirazione guidata')}</span><span class="row-sub">${L('Uses only the phone', 'Usa solo il telefono')}</span></span>${I('chev')}</button>
      <button class="card row-card" data-action="skill" data-skill="ground"><span class="row-text"><span class="row-title">Grounding 5-4-3-2-1</span><span class="row-sub">${L('Come back to the present moment', 'Ritorna al momento presente')}</span></span>${I('chev')}</button>
      <div class="note note-green">${L('You can always stop a practice or choose not to start it.', 'Puoi sempre interrompere una pratica o scegliere di non iniziarla.')}</div>`}

      <button class="card row-card" data-action="mood"><span class="row-text"><span class="row-title">${L('How do you feel?', 'Come ti senti?')}</span><span class="row-sub">${L('One tap, no judgement', 'Un tocco, senza giudizio')}</span></span>${I('chev')}</button>

      ${ins.length ? `
      <section class="card insight">
        <div class="eyebrow">${I('spark', 'ico-inline')} ${L('Soma noticed', 'Soma ha notato')}</div>
        ${ins.slice(0, 2).map(t => `<p>${t}</p>`).join('')}
      </section>` : ''}

      <section class="card card-row next-session">
        <span class="round-ico">${I('calendar')}</span>
        <div class="grow"><div class="eyebrow">${L('Next session', 'Prossima seduta')}</div><b>${esc(S.drName())} · ${L('Tue 18:30', 'mar 18:30')}</b></div>
        <button class="pill pill-green" data-action="report">${L('Prepare', 'Prepara')}</button>
      </section>
    </div>`;
  };

  /* ================= MOOD (design 15) ================= */
  S.screens.mood = () => {
    const opts = [['calm', L('Calm', 'Sereno/a'), 'm-green'], ['tense', L('Tense', 'In tensione'), 'm-peach'], ['tired', L('Tired', 'Stanco/a'), 'm-grey'], ['unsure', L('Not sure', 'Non so'), 'm-green2']];
    const sel = S.moodPick;
    return `
    <div class="scr">
      ${head(null, L('How do you feel?', 'Come ti senti?'), L('You can observe yourself, without judging.', 'Puoi osservarti, senza giudicarti.'), 'home')}
      <p class="center-text mood-q">${L('Right now I feel…', 'In questo momento mi sento…')}</p>
      <div class="moods">${opts.map(([id, label, cls]) => `<button class="mood ${cls} ${sel === id ? 'is-on' : ''}" data-action="mood-pick" data-mood="${id}"><i></i>${label}</button>`).join('')}</div>
      <p class="tiny">${L('“Not sure” is a valid answer too.', 'Anche “non so” è una risposta valida.')}</p>
      <div class="foot mid">
        <button class="btn btn-primary btn-block" data-action="mood-save">${L('Save', 'Salva')}</button>
        <button class="link-btn" data-action="home">${L('Skip for now', 'Salta per ora')}</button>
      </div>
    </div>`;
  };

  /* ================= NOTIFICATIONS (design 16) ================= */
  S.screens.notifications = () => `
    <div class="scr scr-tab">
      ${head(null, L('A message for you.', 'Un messaggio per te.'), L('Only useful reminders, no pressure.', 'Solo promemoria utili, senza pressione.'), 'home')}
      ${[
        [L('Your practice is ready', 'La tua pratica è pronta'), L('Squeeze and release · 3 minutes', 'Stringi e rilascia · 3 minuti'), L('Today · 18:00', 'Oggi · 18:00'), 'skill', 'breathe'],
        [L('Programme updated', 'Programma aggiornato'), L('A change shared with your therapist', 'Un cambiamento condiviso con il terapeuta'), L('Yesterday · 16:40', 'Ieri · 16:40'), 'tab', 'practice'],
        [L('Time for you', 'Hai tempo per te'), L('Reflections can wait', 'Le riflessioni possono aspettare'), L('Mon · 09:00', 'Lun · 09:00'), 'mood', '']
      ].map(([t, s, w, a, v]) => `
        <button class="card notif" data-action="${a}" ${a === 'skill' ? `data-skill="${v}"` : a === 'tab' ? `data-tab="${v}"` : ''}>
          <i></i><span class="row-text"><span class="row-title">${t}</span><span class="row-sub">${s}</span><span class="when">${w}</span></span>
        </button>`).join('')}
    </div>`;

  /* ================= PRACTICE (design 17) ================= */
  S.screens.practice = () => `
    <div class="scr scr-tab">
      ${head(null, L('Exercises with soma.', 'Esercizi con soma.'), L('Each activity has a gesture to follow.', 'Ogni attività ha un gesto da seguire.'))}
      <button class="card card-green guide-entry" data-action="guide">
        <span class="grow"><span class="eyebrow">${L('Discover the handheld', 'Scopri il palmare')}</span><b>${L('10 gestures to know', '10 gesti da conoscere')}</b></span>${I('chev')}
      </button>
      <h3 class="sec-title">${L('Choose a practice', 'Scegli una pratica')}</h3>
      ${S.SKILLS.map((s, i) => `
        <button class="card row-card skill-row" data-action="skill" data-skill="${s.id}">
          <span class="dot-circle ${i % 3 === 0 ? 'peach' : i % 3 === 1 ? 'green' : 'grey'}"></span>
          <span class="row-text"><span class="row-title">${L(s.en, s.it)}</span><span class="row-sub">${L(s.subEn, s.subIt)}</span></span>${I('chev')}
        </button>`).join('')}
      <section class="card prog-mini">
        <div class="card-row"><div><div class="eyebrow">${L('Your programme', 'Il tuo programma')}</div><b class="card-title">${L('Evening waves', 'Onde serali')}</b></div>
        <button class="pill pill-green" data-action="start-manual">${L('Run', 'Avvia')}</button></div>
        <p class="tiny left">${L('Edited by ' + S.drName() + ' on 14 Oct.', 'Modificato da ' + S.drName() + ' il 14 ott.')}</p>
      </section>
    </div>`;

  /* ================= PRACTICE INTRO (designs 18, 20) ================= */
  S.screens.skill = () => {
    const s = S.SKILLS.find(x => x.id === S.currentSkill) || S.SKILLS[0];
    return `
    <div class="scr">
      ${head(null, L(s.titleEn, s.titleIt), L(s.metaEn, s.metaIt), 'skill-back')}
      <section class="card card-green illus-card">
        <span class="eyebrow">${L(s.cardEn, s.cardIt)}</span>
        ${S.illus(s.id)}
        <b class="illus-cap">${L(s.capEn, s.capIt)}</b>
      </section>
      <h3 class="sec-title">${L(s.howTitleEn, s.howTitleIt)}</h3>
      <p class="body-text">${L(s.howEn, s.howIt)}</p>
      ${s.noteEn ? `<div class="note note-peach small">${L(s.noteEn, s.noteIt)}</div>` : ''}
      <div class="foot"><button class="btn btn-primary btn-block" data-action="skill-start">${L(s.ctaEn, s.ctaIt)}</button></div>
    </div>`;
  };

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
    ate: L('ate, and that’s okay', 'ho mangiato, e va bene così'),
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
      ${head(L('Waves', 'Onde'), L('How your waves are changing.', 'Come stanno cambiando le tue onde.'), L('Week 1 → week ' + w + '. Only what you agreed to keep.', 'Settimana 1 → settimana ' + w + '. Solo ciò che hai scelto di conservare.') + ' <span class="sim">' + L('demo data', 'dati demo') + '</span>')}

      <div class="tiles">
        <div class="tile"><small>${L('Guided waves', 'Onde guidate')}</small><b>${thisWeek}</b><span>${L('this week', 'questa settimana')}</span></div>
        <div class="tile"><small>${L('Time to settle', 'Tempo per calmarsi')}</small><b>${lastSettle ? S.fmt.num(lastSettle, 0) : '–'}<em> min</em></b><span>${firstSettle ? L('from ' + Math.round(firstSettle) + ' in week 1', 'da ' + Math.round(firstSettle) + ' nella sett. 1') : ''}</span></div>
        <div class="tile"><small>${L('Waves start', 'Le onde iniziano')}</small><b>${mt || '–'}</b><span>${L('mostly', 'di solito')}</span></div>
      </div>

      <section class="card chart-card">
        <h3>${L('Guided waves per week', 'Onde guidate per settimana')}</h3>
        ${S.charts.bars(s.weeks.map((wk, i) => ({ label: (S.lang === 'it' ? 'sett ' : 'wk ') + wk, value: s.counts[i], tip: (S.lang === 'it' ? 'Settimana ' : 'Week ') + wk + ': ' + s.counts[i] + ' ' + L('guided', 'guidate') + ' (' + s.auto[i] + ' ' + L('started by Soma', 'avviate da Soma') + ')' })), { label: L('Guided waves per week', 'Onde guidate per settimana'), max: 8 })}
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
          [L('heart rate', 'freq. cardiaca'), L('HRV drop', 'calo HRV'), L('EDA peaks', 'picchi di sudorazione'), L('grip', 'forza della presa'), L('stillness', 'immobilità'), L('evening', 'sera'), L('skipped meal', 'pasto saltato')].map(l => ({ label: l })),
          [{ name: L('ordinary stress', 'stress ordinario'), values: [0.42, 0.35, 0.4, 0.3, 0.25, 0.4, 0.2], color: 'var(--slate)', dashed: true },
           { name: L('your waves', 'le tue onde'), values: [0.78, 0.7, 0.92, 0.55, 0.72, 0.85, 0.62], color: 'var(--olive-deep)', fill: 'rgba(122,132,60,.16)' }],
          { label: 'signature' })}
        ${w >= 3 ? `<div class="legend"><span><i style="background:var(--olive-deep)"></i>${L('your waves', 'le tue onde')}</span><span><i class="dash"></i>${L('an ordinary stressful evening, no wave', 'una serata stressante normale, nessuna onda')}</span></div>` : ''}
      </section>

      <section class="card chart-card">
        <h3>${L('How well Soma knows your waves', 'Quanto bene Soma conosce le tue onde')}</h3>
        ${S.charts.lines([{ name: L('starts confirmed as waves', 'avvii confermati come onde'), values: confirm, color: 'var(--olive-deep)', label: confirm[confirm.length - 1] + '%' }], confirm.map((_, i) => (S.lang === 'it' ? 'sett ' : 'wk ') + (i + 1)), { min: 0, max: 100, ticks: [0, 50, 100], tickFmt: v => v + '%', valFmt: v => v + '%', label: 'learning' })}
        <p class="chart-note">${L('Starts confirmed by your morning taps. In weeks 1–5 the model runs silently (“would have started”).', 'Avvii confermati dalle tue risposte del mattino. Nelle settimane 1–5 il modello lavora in silenzio e registra solo quando sarebbe partito.')} ${L('False starts now', 'Falsi avvii ora')}: <b>${S.fmt.num(falseStarts, 1)} / ${L('week', 'sett.')}</b></p>
      </section>

      <section class="card">
        <h3>${L('Recent waves', 'Onde recenti')}</h3>
        ${recent.length ? `<ul class="wave-list">${recent.map(x => { const d = new Date(x.at); return `
          <li>
            <span class="wl-dot ${x.trigger}"></span>
            <span class="row-text"><span class="row-title">${S.fmt.day(d)} · ${S.fmt.time(d)}</span>
            <span class="row-sub">${x.trigger === 'auto' ? L('Soma started', 'avviata da Soma') : L('you started', 'avviata da te')} · ${x.minutes} min${x.settle ? ' · ' + L('settled in ', 'calma dopo ') + S.fmt.num(x.settle, 0) + ' min' : ''}</span></span>
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
        <div><h1>${esc(st().name)} R.</h1><p class="sub">${L('Patient', 'Paziente')} · ${esc(st().clinic)}</p></div>
      </header>

      <div class="list-label">${L('Care team', 'Team di cura')}</div>
      <section class="card team-card">
        <div class="team-top">
          <div class="avatar dr">B</div>
          <div class="grow"><b>${esc(S.drName())}</b><span>${L('Psychotherapist', 'Psicoterapeuta')} · CBT-E</span></div>
        </div>
        <div class="team-next">${I('calendar', 'ico-inline')} ${L('Next session · Tue 18:30 · in person', 'Prossima seduta · mar 18:30 · in presenza')}</div>
        <div class="team-actions">
          <button class="btn btn-soft btn-sm" data-action="message">${I('note')} ${L('Message', 'Messaggio')}</button>
          <button class="btn btn-soft btn-sm" data-action="call-clinic">${I('phone')} ${L('Call clinic', 'Chiama il centro')}</button>
        </div>
      </section>

      <div class="list-label">${L('Your SOMA', 'Il tuo SOMA')}</div>
      <section class="card">
        <div class="card-row">${S.miniPebble(36)}<div class="grow"><b>SOMA · ${L(S.color().en, S.color().it)}</b><div class="muted small">${st().paired ? L('Connected', 'Connesso') : L('Not paired', 'Non associato')} · ${L('battery', 'batteria')} ${S.device.battery}% · firmware 1.2.0</div></div></div>
        <div class="swatches small">${S.COLORS.map(col => `<button class="swatch ${col.id === st().color ? 'is-on' : ''}" style="--c:${col.hex}" data-action="color" data-color="${col.id}" aria-label="${L(col.en, col.it)}"><span></span></button>`).join('')}</div>
        <label class="row toggle-row"><span class="row-text"><span class="row-title">${L('Voice guidance', 'Guida vocale')}</span><span class="row-sub">${L('double-tap the dial to switch', 'doppio tocco al centro di SOMA per attivarla o disattivarla')}</span></span><input type="checkbox" class="switch" data-setting="voice" ${st().voice ? 'checked' : ''}></label>
        <button class="row link-row" data-action="guide"><span class="row-text"><span class="row-title">${L('How to use SOMA', 'Come si usa SOMA')}</span><span class="row-sub">${L('gestures and what they are for', 'i gesti e a cosa servono')}</span></span>${I('chev')}</button>
        <label class="row toggle-row"><span class="row-text"><span class="row-title">${L('Daily practice reminder', 'Promemoria pratica quotidiana')}</span><span class="row-sub">${L('every day at ', 'ogni giorno alle ')}${st().practiceTime}</span></span><input type="checkbox" class="switch" data-setting="reminders" ${st().reminders ? 'checked' : ''}></label>
      </section>

      <div class="list-label">${L('What we agreed on', 'Cosa abbiamo concordato')}</div>
      <section class="card list">
        ${toggle('autoStart', c.autoStart, L('Soma may start guiding by itself', 'Soma può iniziare a guidarti da solo'))}
        ${toggle('times', c.times, L('Share times and duration', 'Condividi orari e durata'))}
        ${toggle('exercises', c.exercises, L('Share exercises completed', 'Condividi gli esercizi completati'))}
        ${toggle('settle', c.settle, L('Share how quickly you settled', 'Condividi quanto in fretta il corpo si è calmato'))}
        ${toggle('notes', c.notes, L('Share your notes', 'Condividi le tue note'))}
        ${toggle('raw', c.raw, L('Share raw body signals', 'Condividi i segnali corporei grezzi'))}
      </section>

      <div class="list-label">${L('Set with ', 'Impostazioni concordate con ')}${esc(S.drName())}</div>
      <section class="card list kv">
        <div class="row"><span>${L('Recognition sensitivity', 'Sensibilità del riconoscimento')}</span><b>${sens()}</b></div>
        <div class="row"><span>${L('Quiet hours', 'Ore silenziose')}</span><b>${se.quietFrom}–${se.quietTo}</b></div>
        <div class="row"><span>${L('Max sessions per day', 'Sessioni massime al giorno')}</span><b>${se.maxSessions}</b></div>
        <div class="row"><span>${L('If distress stays high', 'Se il disagio resta alto')}</span><b>${L('suggest calling the clinic', 'ti suggerisce di chiamare il centro')}</b></div>
      </section>

      <button class="card help-card" data-action="support">
        <span class="round-ico">${I('lifebuoy')}</span>
        <div><b>${L('Get help now', 'Chiedi aiuto ora')}</b><p>${L('If you feel unsafe or in crisis, contact your clinic or emergency services.', 'Se non ti senti al sicuro o sei in crisi, contatta il tuo centro o i servizi di emergenza.')}</p></div>
        <span class="chev">${I('chev')}</span>
      </button>

      <div class="list-label">${L('Language', 'Lingua')}</div>
      <div class="seg">
        <button class="${S.lang === 'it' ? 'is-on' : ''}" data-action="lang" data-lang="it">Italiano</button>
        <button class="${S.lang === 'en' ? 'is-on' : ''}" data-action="lang" data-lang="en">English</button>
      </div>

      <section class="about">
        ${S.logoMark('about-mark')}
        <p><b>SOMA</b> · ${L('version', 'versione')} 1.0.0</p>
        <p class="tiny">${L('SOMA supports your therapy, it does not replace it. It is not an emergency service.', 'SOMA sostiene la tua terapia, non la sostituisce. Non è un servizio di emergenza.')}</p>
        <p class="tiny">${L('Demo build for the thesis presentation · Politecnico di Bari. Patient, care team, history and AI analysis are simulated.', 'Versione demo per la presentazione della tesi · Politecnico di Bari. Paziente, team di cura, storico e analisi IA sono simulati.')}</p>
      </section>
    </div>`;
  };

  /* ================= HOW TO USE SOMA ================= */
  S.guideBack = 'practice';
  S.screens.guide = () => `
    <div class="scr scr-guide">
      ${head(L('Your SOMA', 'Il tuo SOMA'), L('How to use SOMA', 'Come si usa SOMA'), L('What the hand does, how SOMA answers, what it is for.', 'Cosa fa la mano, come risponde SOMA, a cosa serve.'), 'guide-back')}
      <figure class="guide-hero"><img src="assets/img/hands-float.jpg" alt="${L('SOMA floating between two hands', 'SOMA sospeso tra due mani')}"></figure>
      <section class="card guide-basics">
        <div><b>${L('Hold it', 'Tienilo in mano')}</b><span>${L('SOMA listens only while you hold it. When it rests, it stays silent.', 'SOMA ascolta solo mentre lo tieni in mano. Quando è appoggiato, resta in silenzio.')}</span></div>
        <div><b>${L('Press the dial for 2 s', 'Tieni premuto il centro per 2 s')}</b><span>${L('Guidance starts, without opening the app.', 'Parte la guida, senza aprire l’app.')}</span></div>
        <div><b>${L('Turn it face down', 'Capovolgilo')}</b><span>${L('Guidance stops, gently.', 'La guida si ferma, con delicatezza.')}</span></div>
      </section>
      <div class="list-label">${L('Gestures', 'Gesti')}</div>
      <ul class="gesture-list">
        ${S.device.GESTURES.map(g => `
          <li>
            <button class="g-card" data-action="try-gesture" data-g="${g.id}">
              <span class="g-thumb">${g.img ? `<img src="assets/img/${g.img}.jpg" alt="${esc(L(g.en, g.it))}" loading="lazy">` : I('rest')}</span>
              <span class="g-text"><b>${esc(L(g.en, g.it))}</b><span>${esc(L(g.fbEn, g.fbIt))}</span><em>${esc(L(g.forEn, g.forIt))}</em></span>
              <span class="g-try">${L('Try', 'Prova')}</span>
            </button>
          </li>`).join('')}
      </ul>
      <div class="list-label">${L('Among the things you carry', 'Tra le cose che porti con te')}</div>
      <div class="carry">
        ${[1, 2, 3].map(i => `<img src="assets/img/everyday-${i}.jpg" alt="${L('SOMA clipped to a bag', 'SOMA agganciato a una borsa')}" loading="lazy">`).join('')}
      </div>
      <p class="tiny">${L('Soft silicone base · bio-based polycarbonate shell · 2200 K amber light ring · Qi2 wireless charging dish.', 'Base in silicone morbido · guscio in policarbonato bio-based · anello luminoso ambra 2200 K · base di ricarica wireless Qi2.')}</p>
    </div>`;

  /* ================= MESSAGES (care team) ================= */
  S.screens.message = () => {
    const first = { from: 'dr', text: L('Hi ' + st().name + ', I have added the “Evening waves” programme we discussed. Try the daily practice at 18:00 and we will look at how it went on Tuesday.', 'Ciao ' + st().name + ', ho aggiunto il programma “Onde serali” di cui abbiamo parlato. Prova la pratica quotidiana alle 18:00 e martedì vediamo insieme com’è andata.'), at: L('Mon 14 Oct · 17:02', 'lun 14 ott · 17:02') };
    const msgs = [first].concat(st().messages);
    return `
    <div class="scr scr-msg">
      ${head(L('Care team', 'Team di cura'), esc(S.drName()), L('Psychotherapist', 'Psicoterapeuta') + ' · ' + esc(st().clinic), 'tab-me')}
      <div class="notice">${I('info', 'ico-inline')} ${L('Usually replies within 1 working day. Not for emergencies.', 'Di solito risponde entro 1 giorno lavorativo. Non per le emergenze.')}</div>
      <div class="thread">
        ${msgs.map(m => `<div class="bubble ${m.from === 'me' ? 'me' : 'dr'}"><p>${esc(m.text)}</p><time>${esc(m.at)}</time></div>`).join('')}
      </div>
      <div class="composer">
        <textarea id="msgText" rows="2" placeholder="${L('Write a message…', 'Scrivi un messaggio…')}"></textarea>
        <button class="icon-btn send" data-action="send-message" aria-label="${L('Send', 'Invia')}">${I('send')}</button>
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
        <div class="card thanks">${I('heart')}<p>${L('Thank you. This helps Soma learn your waves — nothing else to do today.', 'Grazie. La tua risposta aiuta Soma a riconoscere meglio le tue onde. Per oggi non serve altro.')}</p></div>
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
      (c.settle && first && last ? ` Il tempo mediano necessario al corpo per calmarsi è passato da ${Math.round(first)} a ${Math.round(last)} minuti.` : '') +
      ` ${/^(8|11|1$)/.test(String(pct(d.passed))) ? 'Nell’' : 'Nel '}${pct(d.passed)}% dei mattini successivi, ${st().name} ha riferito che l'onda è passata; ${d.ate} volt${d.ate === 1 ? 'a' : 'e'} ha riferito di aver mangiato: un dato registrato senza giudizio.` +
      (c.exercises ? ` La pratica quotidiana è stata svolta in ${d.prDays} giorni su ${d.prMax}.` : '')
    );
    const discuss = [
      c.times ? L(`${pct(d.evening)}% of waves began after 20:00 and ${pct(d.weekday)}% on Mon–Thu. Would moving the daily practice closer to the evening help?`, `${S.artPct(pct(d.evening))} delle onde sono iniziate dopo le 20:00, e ${S.artPct(pct(d.weekday)).toLowerCase()} tra lunedì e giovedì. Spostare la pratica quotidiana verso sera potrebbe aiutare?`) : null,
      c.exercises ? L(`On average ${S.fmt.num(d.steps, 1)} of 5 steps were completed. “Watch the wave” most often came just before settling; “Move” was often skipped late at night.`, `In media sono stati completati ${S.fmt.num(d.steps, 1)} passi su 5. “Osserva l’onda” è il passo dopo cui più spesso arriva la calma; “Muoviti” viene spesso saltato a tarda notte.`) : null,
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
        <div class="rd-meta"><b>${L('Report for', 'Report per')} ${esc(S.drName())}</b><span>${esc(st().name)} R. · ${L('weeks', 'settimane')} ${d.from}–${d.to}</span><span>${L('Generated', 'Generato il')} ${S.fmt.date(today)}</span></div>
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
      <section class="rd-shared"><h4>${L('Shared by agreement', 'Condiviso secondo gli accordi')}</h4>
        <div class="rd-chips">${shared.map(([k, l]) => `<span class="${c[k] ? 'on' : 'off'}">${c[k] ? '✓' : '—'} ${l}</span>`).join('')}</div>
      </section>
      <footer class="rd-foot">${L('SOMA informs therapy, it does not replace it. No single signal is interpreted as a binge-eating episode. Demo report: patient and data are fictitious.', 'SOMA informa la terapia, non la sostituisce. Nessun singolo segnale è interpretato come un episodio di abbuffata. Report demo: paziente e dati sono fittizi.')}</footer>
    </article>`;
  };

  S.screens.report = () => {
    const r = S.reportDraft, c = st().consent;
    if (r.stage === 'analyzing') {
      const steps = [
        L('Collecting the sessions from SOMA', 'Raccolgo le sessioni da SOMA'),
        L('Comparing with your personal baseline', 'Confronto con i tuoi valori abituali'),
        L('Looking for patterns in timing and context', 'Cerco ricorrenze negli orari e nel contesto'),
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
        ${head(L('Report', 'Report'), r.stage === 'sent' ? L('Sent.', 'Inviato.') : L('Ready to share', 'Pronto da condividere'), r.stage === 'sent' ? L(S.drName() + ' will see it before your session.', S.drName() + ' lo vedrà prima della seduta.') : L('Read it first. You decide.', 'Leggilo prima di inviarlo. Decidi tu.'), 'report-back')}
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
      <p class="tiny left">${L('This follows what you agreed on. Change it in Me → What we agreed on.', 'Rispecchia ciò che avete concordato. Puoi cambiarlo in Io → Cosa abbiamo concordato.')}</p>
      ${c.notes ? `
        <div class="list-label">${L('A note for ' + S.drName() + ' (optional)', 'Una nota per ' + S.drName() + ' (facoltativa)')}</div>
        <textarea class="note" id="reportNote" rows="3" placeholder="${L('Anything you’d like to talk about…', 'Qualcosa di cui vorresti parlare…')}">${esc(r.note)}</textarea>` : ''}
      <div class="foot"><button class="btn btn-primary btn-block" data-action="gen-report">${I('spark')} ${L('Prepare the report', 'Prepara il report')}</button></div>
    </div>`;
  };
})();
