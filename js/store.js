/* SOMA — state, persistence and the simulated history.
 * Nothing leaves the browser: everything lives in memory + localStorage.
 */
(function () {
  const KEY = 'soma-prototype-v4';

  /* ---------- Static content ---------- */

  S.COLORS = [
    { id: 'sage',       hex: '#8DAA7B', deep: '#6F8C5E', en: 'Sage',       it: 'Salvia' },
    { id: 'lilac',      hex: '#9B86CF', deep: '#7B66B0', en: 'Lilac',      it: 'Lilla' },
    { id: 'sky',        hex: '#5FB3E6', deep: '#3D93C7', en: 'Sky Blue',   it: 'Azzurro' },
    { id: 'terracotta', hex: '#C9693F', deep: '#A9532D', en: 'Terracotta', it: 'Terracotta' },
    { id: 'ochre',      hex: '#DE9F3A', deep: '#BE8224', en: 'Ochre',      it: 'Ocra' },
    { id: 'warm',       hex: '#ECEAE4', deep: '#CFCBC2', en: 'Light warm', it: 'Bianco caldo' }
  ];

  /* The guided sequence prescribed by the therapist ("Evening waves") */
  S.PROGRAMME = [
    { id: 'breathe', icon: 'breathe', en: 'Breathe',     it: 'Respira',        subEn: 'squeeze and release · 90 s',   subIt: 'stringi e rilascia · 90 s',      sec: 90 },
    { id: 'ground',  icon: 'ground',  en: 'Ground',      it: 'Radicati',       subEn: 'thumb on the ripples · 3 min', subIt: 'pollice sulle onde · 3 min',     sec: 180 },
    { id: 'surf',    icon: 'surf',    en: 'Surf',        it: 'Cavalca',        subEn: 'follow the wave · up to 10 min', subIt: "segui l'onda · fino a 10 min", sec: 600 },
    { id: 'pause',   icon: 'pause',   en: 'Phone pause', it: 'Pausa telefono', subEn: 'starts automatically',         subIt: 'parte da sola',                  sec: 0 },
    { id: 'move',    icon: 'move',    en: 'Move',        it: 'Muoviti',        subEn: 'a short walk with music',      subIt: 'una breve passeggiata con musica', sec: 600 },
    { id: 'rest',    icon: 'rest',    en: 'Rest',        it: 'Riposa',         subEn: 'a few kind words',             subIt: 'qualche parola gentile',         sec: 60 }
  ];

  /* Evidence-based library (Practice tab) */
  S.SKILLS = [
    { id: 'surf',    icon: 'surf',    en: 'Urge surfing',          it: 'Urge surfing',            min: 3,  prescribed: true,
      descEn: 'Observe the urge without acting on it: it rises, peaks and passes.',
      descIt: "Osserva l'impulso senza agire: sale, raggiunge il picco e passa." },
    { id: 'breathe', icon: 'breathe', en: 'Squeeze and release',   it: 'Stringi e rilascia',      min: 3,  prescribed: true,
      descEn: 'Rhythmic tactile breathing: squeeze as it swells, release as it softens.',
      descIt: 'Respiro tattile ritmico: stringi quando si gonfia, rilascia quando si ammorbidisce.' },
    { id: 'ground',  icon: 'ground',  en: 'Grounding 5-4-3-2-1',   it: 'Grounding 5-4-3-2-1',     min: 4,  prescribed: true,
      descEn: 'Come back to the present through the five senses.',
      descIt: 'Torna al presente attraverso i cinque sensi.' },
    { id: 'tipp',    icon: 'cold',    en: 'TIPP: cold water',      it: 'TIPP: acqua fredda',      min: 1,  prescribed: false,
      descEn: 'A DBT skill: cool temperature to bring intense arousal down fast.',
      descIt: "Abilità DBT: il freddo per abbassare rapidamente un'attivazione intensa." },
    { id: 'meal',    icon: 'meal',    en: 'A slower meal',         it: 'Un pasto più lento',      min: 15, prescribed: false,
      descEn: 'Mindful eating: slower bites, more senses, no rules.',
      descIt: 'Mindful eating: bocconi più lenti, più sensi, nessuna regola.' },
    { id: 'kind',    icon: 'rest',    en: 'Self-compassion',       it: 'Autocompassione',         min: 3,  prescribed: false,
      descEn: 'A few minutes of non-judgemental words for yourself.',
      descIt: 'Qualche minuto di parole non giudicanti verso te.' }
  ];

  /* ---------- Seeded random, so the demo history is stable ---------- */
  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /* ---------- Simulated 9-week history (the "Sara R. · week 9" story) ---------- */
  function buildHistory(today) {
    const r = rng(20261102);
    const perWeek = [6, 5, 7, 5, 4, 4, 3, 3, 2];          // guided waves per week
    const settle  = [11, 10.4, 9.6, 8.8, 8.1, 7.4, 6.9, 6.4, 6]; // median minutes to settle
    const sessions = [];
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 62); // week 9 = the last seven days, ending today

    for (let w = 0; w < 9; w++) {
      const days = [];
      while (days.length < perWeek[w]) {
        const d = Math.floor(r() * 7);
        if (!days.includes(d)) days.push(d);
      }
      days.sort();
      days.forEach((d, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        if (date > today) return;
        // Evening cluster around 21:23, with spread
        const minutes = Math.round(21 * 60 + 23 + (r() - 0.5) * 150 + (r() < 0.12 ? -420 : 0));
        date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
        const auto = w >= 5 && r() < 0.8;                      // self-activation only from week 6
        const falseStart = auto && r() < Math.max(0.08, 0.45 - w * 0.05);
        const st = Math.max(3, settle[w] + (r() - 0.5) * 3);
        const steps = falseStart ? 1 : 3 + Math.floor(r() * 4);
        const outcomes = ['rode', 'rode', 'rode', 'ate', 'skip'];
        sessions.push({
          id: 'h' + w + '-' + i,
          at: date.toISOString(),
          week: w + 1,
          trigger: auto ? 'auto' : 'manual',
          falseStart,
          minutes: falseStart ? 2 : Math.round(st + 4 + r() * 8),
          settle: falseStart ? null : Math.round(st * 10) / 10,
          steps: Math.min(6, steps),
          hrPeak: Math.round(96 + r() * 14),
          hrEnd: Math.round(72 + r() * 8),
          outcome: falseStart ? 'notwave' : outcomes[Math.floor(r() * outcomes.length)],
          note: null
        });
      });
    }

    // Daily practice (squeeze-and-release, 18:00): days completed per week
    const practice = [3, 4, 5, 5, 6, 5, 6, 7, 5];
    return { sessions, practice, weekOneMonday: start.toISOString() };
  }

  /* ---------- Default state ---------- */
  function defaults() {
    const today = new Date();
    const h = buildHistory(today);
    return {
      lang: 'it', // Italian first, English available from the language switch
      onboarded: false,
      linked: false,
      reminders: true,
      messages: [],
      onboardStep: 0,
      name: 'Sara',
      therapist: 'Dr. Bianchi',
      clinic: 'Centro DCA · Bari',
      color: 'sage',
      paired: false,
      week: 1,
      voice: true,
      consent: { autoStart: true, times: true, exercises: true, settle: true, notes: false, raw: false },
      settings: { sensitivity: 'medium', quietFrom: '00:30', quietTo: '07:00', maxSessions: 3 },
      practiceTime: '18:00',
      history: h.sessions,
      practice: h.practice,
      weekOneMonday: h.weekOneMonday,
      pendingMorning: null,
      listenedMoments: 0,
      reports: [],
      checkins: []
    };
  }

  /* ---------- Persistence (best effort: works without storage too) ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* private mode, blocked storage… */ }
    return defaults();
  }

  S.state = load();
  S.lang = S.state.lang === 'en' ? 'en' : 'it';

  S.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.state)); } catch (e) { /* ignore */ }
  };

  S.reset = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    S.state = defaults();
    S.lang = S.state.lang;
  };

  S.color = function () {
    return S.COLORS.find(c => c.id === S.state.color) || S.COLORS[0];
  };

  /* Phase of the personal model, by week */
  S.phase = function (week = S.state.week) {
    if (week <= 3) return 'listening';
    if (week <= 5) return 'learning';
    return 'guiding';
  };

  S.sessionsVisible = function () {
    // In earlier weeks only the history up to that week exists
    return S.state.history.filter(s => s.week <= S.state.week);
  };
})();
