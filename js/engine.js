/* SOMA — simulated on-device AI.
 *
 * Mirrors the pipeline in the thesis ("A model that learns one"):
 *   SIGNALS  PPG · EDA · temp · grip · motion · context
 *   FEATURES HR above rest while still · HRV drop · EDA peaks
 *   BASELINE what is normal for you, hour by hour
 *   SIGNATURE your own pattern of the 20–40 min before a wave
 *   INDEX    probability + confidence, every 30 s
 *   START    threshold set with the therapist · quiet hours
 *
 * Nothing here is a medical algorithm: values are synthetic and the
 * "model" is a transparent weighted score, good enough to tell the story.
 */
(function () {
  const BASE = { hr: 72, hrv: 55, eda: 2.0, temp: 33.2 };

  const TARGETS = {
    calm:     { hr: 72,  hrv: 55, eda: 2.0, temp: 33.2, still: 0.30 },
    rising:   { hr: 101, hrv: 28, eda: 6.5, temp: 32.1, still: 0.88 }, // a wave building while still
    stress:   { hr: 88,  hrv: 40, eda: 4.0, temp: 32.9, still: 0.25 }, // ordinary stressful moment
    settling: { hr: 73,  hrv: 52, eda: 2.3, temp: 33.1, still: 0.50 }
  };

  const W = { hr: 0.45, hrv: 0.40, eda: 0.50, temp: 0.25, still: 0.50, evening: 0.35, grip: 0.15 };
  const BIAS = 2.6;
  const THRESH = { low: 0.80, medium: 0.72, high: 0.62 };

  const E = {
    mode: 'calm',
    sig: { hr: 72, hrv: 55, eda: 2.0, temp: 33.2, grip: 4, still: 0.3 },
    buf: { hr: [], hrv: [], eda: [], temp: [], grip: [], index: [] },
    features: {},
    index: 0.05,
    confidence: 0.35,
    match: 0.1,
    above: 0,
    stage: -1,
    log: [],
    cooldown: 0,
    session: null, // { startedAt, settledAt }
    listeners: [],
    timer: null
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const noise = (a) => (Math.random() - 0.5) * 2 * a;
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  E.threshold = function () {
    return THRESH[S.state.settings.sensitivity] || THRESH.medium;
  };

  E.on = function (fn) { E.listeners.push(fn); };
  function emit(type, data) { E.listeners.forEach(fn => fn(type, data)); }

  E.say = function (en, it, kind = 'info') {
    E.log.unshift({ at: new Date(), en, it, kind });
    E.log = E.log.slice(0, 40);
    emit('log');
  };

  E.setMode = function (mode) {
    if (E.mode === mode) return;
    E.mode = mode;
    E.above = 0;
    if (mode === 'rising') {
      E.say('Context: evening, at home, phone in hand for 18 min.', 'Contesto: sera, a casa, telefono in mano da 18 min.', 'ctx');
    } else if (mode === 'stress') {
      E.say('Arousal up while moving — looks like ordinary stress.', 'Attivazione in aumento in movimento — sembra stress ordinario.', 'info');
    } else if (mode === 'calm') {
      E.say('Signals back near your evening baseline.', 'Segnali vicini alla tua baseline serale.', 'ok');
    }
    emit('mode', mode);
  };

  /* Grip pressure from the object (squeeze etc.) */
  E.grip = function (amount) {
    E.sig.grip = clamp(E.sig.grip + amount, 0, 100);
  };

  E.startSession = function () {
    E.session = { startedAt: Date.now(), settledAt: null, hrPeak: Math.round(E.sig.hr) };
    E.cooldown = 9999;
    setTimeout(() => { if (E.session) E.setMode('settling'); }, 2500);
  };

  E.endSession = function () {
    const s = E.session;
    E.session = null;
    E.cooldown = 25;
    if (E.mode !== 'calm') E.setMode('calm');
    if (!s) return null;
    // Demo time runs about 6× faster than real time
    const settleSec = s.settledAt ? (s.settledAt - s.startedAt) / 1000 : (Date.now() - s.startedAt) / 1000;
    return {
      settle: Math.round(clamp(settleSec / 6, 2.5, 14) * 10) / 10,
      minutes: Math.max(1, Math.round((Date.now() - s.startedAt) / 1000 / 6 + 4)),
      hrPeak: s.hrPeak,
      hrEnd: Math.round(E.sig.hr)
    };
  };

  function push(k, v) {
    E.buf[k].push(v);
    if (E.buf[k].length > 60) E.buf[k].shift();
  }

  function tick() {
    const tg = TARGETS[E.mode];
    const k = E.mode === 'settling' ? 0.045 : E.mode === 'rising' ? 0.06 : 0.08;
    const s = E.sig;
    s.hr += (tg.hr - s.hr) * k + noise(0.9);
    s.hrv += (tg.hrv - s.hrv) * k + noise(1.2);
    s.temp += (tg.temp - s.temp) * k * 0.6 + noise(0.02);
    s.still += (tg.still - s.still) * 0.1 + noise(0.02);
    // EDA: tonic level + phasic peaks (more frequent when a wave is building)
    const peakChance = E.mode === 'rising' ? 0.28 : E.mode === 'stress' ? 0.12 : 0.03;
    s.eda += (tg.eda - s.eda) * k + noise(0.05) + (Math.random() < peakChance ? 0.9 + Math.random() : 0);
    s.grip += (4 - s.grip) * 0.12 + noise(0.6);
    s.grip = clamp(s.grip, 0, 100);
    s.still = clamp(s.still, 0, 1);

    push('hr', s.hr); push('hrv', s.hrv); push('eda', s.eda); push('temp', s.temp); push('grip', s.grip);

    // FEATURES — deviations from the personal baseline
    const h = new Date().getHours();
    const evening = (h >= 19 || h < 1 || E.mode === 'rising') ? 1 : 0;
    const f = {
      hr: clamp((s.hr - BASE.hr) / 8, -1, 2.5),
      hrv: clamp((BASE.hrv - s.hrv) / 10, -1, 2.5),
      eda: clamp((s.eda - BASE.eda) / 1.5, -1, 2.5),
      temp: clamp((BASE.temp - s.temp) / 0.4, -1, 2.5),
      still: s.still * 2 - 1,
      evening,
      grip: clamp(s.grip / 40, 0, 1.5)
    };
    E.features = f;

    // SIGNATURE match + INDEX
    let z = -BIAS;
    for (const key in W) z += W[key] * f[key];
    const raw = sigmoid(z);
    E.index = E.index * 0.7 + raw * 0.3;
    E.match = clamp(0.15 + 0.85 * sigmoid((f.hr + f.hrv + f.eda + f.still * 1.5 - 3) * 1.1), 0, 1);
    E.confidence = clamp(E.confidence + (E.index > 0.5 ? 0.03 : -0.015), 0.3, 0.95);
    push('index', E.index);

    // Which pipeline stage is "lit"
    E.stage = E.index > E.threshold() ? 5 : E.index > 0.5 ? 4 : E.index > 0.3 ? 3 : (f.hr > 0.8 || f.eda > 0.8) ? 1 : 0;

    // Narration, only on meaningful changes
    if (E.mode === 'rising') {
      if (Math.abs(f.hr - 1.6) < 0.08) E.say('HR above rest while still (+' + Math.round(s.hr - BASE.hr) + ' bpm).', 'FC sopra il riposo senza movimento (+' + Math.round(s.hr - BASE.hr) + ' bpm).', 'feat');
      if (Math.abs(f.hrv - 1.5) < 0.08) E.say('HRV dropping — ' + Math.round(s.hrv) + ' ms.', 'HRV in calo — ' + Math.round(s.hrv) + ' ms.', 'feat');
      if (E.match > 0.7 && !E._matched) { E._matched = true; E.say('Similar to your evening waves (match ' + Math.round(E.match * 100) + '%).', 'Simile alle tue onde serali (match ' + Math.round(E.match * 100) + '%).', 'sig'); }
    } else { E._matched = false; }

    if (E.session && !E.session.settledAt && s.hr - BASE.hr < 5 && E.mode === 'settling') {
      E.session.settledAt = Date.now();
      E.say('Your body is settling.', 'Il tuo corpo si sta calmando.', 'ok');
      emit('settled');
    }

    // START decision (the app checks phase, consent and quiet hours)
    if (E.cooldown > 0) E.cooldown--;
    if (E.index >= E.threshold()) E.above++; else E.above = 0;
    if (E.above === 3 && E.cooldown === 0 && !E.session) {
      E.say('Index ' + Math.round(E.index * 100) + '% ≥ threshold ' + Math.round(E.threshold() * 100) + '% · confidence ' + Math.round(E.confidence * 100) + '%.', 'Indice ' + Math.round(E.index * 100) + '% ≥ soglia ' + Math.round(E.threshold() * 100) + '% · confidenza ' + Math.round(E.confidence * 100) + '%.', 'start');
      E.cooldown = 40;
      emit('wave');
    }

    emit('tick');
  }

  E.start = function () {
    if (E.timer) return;
    for (let i = 0; i < 40; i++) tick();   // warm buffers
    E.log = [];
    E.say('Listening. Signals only while SOMA is held.', 'In ascolto. Segnali solo mentre SOMA è in mano.', 'ok');
    E.timer = setInterval(tick, 1000);
  };

  S.engine = E;
})();
