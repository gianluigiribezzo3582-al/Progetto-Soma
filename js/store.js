/* SOMA — state, persistence and the simulated history.
 * Nothing leaves the browser: everything lives in memory + localStorage.
 */
(function () {
  const KEY = 'soma-prototype-v5';

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
    { id: 'breathe', icon: 'breathe', en: 'Breathe',          it: 'Respira',        subEn: '90 seconds · squeeze and release', subIt: '90 secondi · stringi e rilascia', sec: 90 },
    { id: 'ground',  icon: 'ground',  en: 'Ground',           it: 'Radicati',       subEn: '3 minutes · explore the textures', subIt: '3 minuti · esplora le texture',   sec: 180 },
    { id: 'surf',    icon: 'surf',    en: 'Watch the wave',   it: 'Osserva l’onda', subEn: 'Up to 10 minutes',                 subIt: 'Fino a 10 minuti',                sec: 600 },
    { id: 'move',    icon: 'move',    en: 'Move',             it: 'Muoviti',        subEn: 'A short walk',                     subIt: 'Passeggiata breve',               sec: 600 },
    { id: 'rest',    icon: 'rest',    en: 'Rest',             it: 'Riposa',         subEn: 'A gentle message',                 subIt: 'Un messaggio gentile',            sec: 60 }
  ];

  /* Practice library (designs 17, 18, 20) */
  S.SKILLS = [
    { id: 'breathe', icon: 'breathe', en: 'Breathe', it: 'Respira', subEn: 'Squeeze and release · 3 min', subIt: 'Stringi e rilascia · 3 min', min: 3, prescribed: true,
      titleEn: 'Breathe with your hands.', titleIt: 'Respira con le mani.', metaEn: 'Slow breathing · 3 minutes', metaIt: 'Respirazione lenta · 3 minuti',
      cardEn: 'A slow movement', cardIt: 'Un movimento lento', capEn: 'Squeeze · Release', capIt: 'Stringi · Rilascia',
      howTitleEn: 'How it works', howTitleIt: 'Come funziona',
      howEn: 'Hold SOMA in your palm. Squeeze gently as you breathe in, then let the pressure go as you breathe out.', howIt: 'Tieni SOMA nel palmo. Stringi delicatamente mentre inspiri, poi lascia andare la pressione espirando.',
      noteEn: 'If you feel discomfort, reduce the pressure.', noteIt: 'Se senti disagio, riduci la pressione.', ctaEn: 'Start the practice', ctaIt: 'Inizia la pratica' },
    { id: 'ground', icon: 'ground', en: 'Grounding', it: 'Grounding', subEn: 'Follow the dots · 4 min', subIt: 'Segui i puntini · 4 min', min: 4, prescribed: true,
      titleEn: 'Come back to the present.', titleIt: 'Ritorna al presente.', metaEn: 'Grounding 5-4-3-2-1 · 4 min', metaIt: 'Grounding 5-4-3-2-1 · 4 min',
      cardEn: 'Start from touch', cardIt: 'Comincia dal tatto', capEn: 'Follow the dots with your finger.', capIt: 'Segui i puntini con il dito.',
      howTitleEn: 'One sense at a time', howTitleIt: 'Un senso alla volta',
      howEn: 'First explore the texture of SOMA. Then notice what you see, touch, hear, smell or taste, without forcing anything.', howIt: 'Prima esplora la texture di SOMA. Poi osserva ciò che vedi, tocchi, senti, annusi o gusti, senza forzare nulla.',
      ctaEn: 'Start grounding', ctaIt: 'Inizia il grounding' },
    { id: 'surf', icon: 'surf', en: 'Watch the wave', it: 'Osserva l’onda', subEn: 'Touch the two textures · 10 min', subIt: 'Sfiora le due texture · 10 min', min: 10, prescribed: true,
      titleEn: 'Watch the wave.', titleIt: 'Osserva l’onda.', metaEn: 'Urge surfing · up to 10 minutes', metaIt: 'Urge surfing · fino a 10 minuti',
      cardEn: 'It rises, then it passes', cardIt: 'Sale, poi passa', capEn: 'Touch side A, then side B.', capIt: 'Sfiora il lato A, poi il lato B.',
      howTitleEn: 'How it works', howTitleIt: 'Come funziona',
      howEn: 'An urge is like a wave: it rises, reaches a peak and passes. You don’t have to do anything, just watch it while your fingers move across the textures.', howIt: 'Un impulso è come un’onda: sale, arriva al picco e passa. Non devi fare nulla, solo osservarla mentre le dita scorrono sulle texture.',
      ctaEn: 'Start the practice', ctaIt: 'Inizia la pratica' },
    { id: 'move', icon: 'move', en: 'Move', it: 'Muoviti', subEn: 'Rock SOMA', subIt: 'Fai oscillare SOMA', min: 5, prescribed: false,
      titleEn: 'Move.', titleIt: 'Muoviti.', metaEn: 'A short walk · 5–10 minutes', metaIt: 'Passeggiata breve · 5–10 minuti',
      cardEn: 'A slow rhythm', cardIt: 'Un ritmo lento', capEn: 'Rock SOMA, then walk.', capIt: 'Fai oscillare SOMA, poi cammina.',
      howTitleEn: 'How it works', howTitleIt: 'Come funziona',
      howEn: 'Rock SOMA slowly in your hand to find a rhythm, then take a short walk around the block with your playlist.', howIt: 'Fai oscillare SOMA lentamente nella mano per trovare un ritmo, poi fai una breve passeggiata con la tua playlist.',
      ctaEn: 'Start the practice', ctaIt: 'Inizia la pratica' },
    { id: 'meal', icon: 'meal', en: 'Mindful meal', it: 'Pasto consapevole', subEn: 'Listen to the sensations', subIt: 'Ascolta le sensazioni', min: 15, prescribed: false,
      titleEn: 'A mindful meal.', titleIt: 'Un pasto consapevole.', metaEn: 'Mindful eating · 15 minutes', metaIt: 'Mindful eating · 15 minuti',
      cardEn: 'No rules', cardIt: 'Nessuna regola', capEn: 'Slower bites, more senses.', capIt: 'Bocconi più lenti, più sensi.',
      howTitleEn: 'How it works', howTitleIt: 'Come funziona',
      howEn: 'SOMA suggests a few small pauses during the meal to notice taste, temperature and hunger. You can stop or continue: both are fine.', howIt: 'SOMA suggerisce qualche piccola pausa durante il pasto per notare sapore, temperatura e fame. Puoi fermarti o continuare: vanno bene entrambe.',
      ctaEn: 'Start the practice', ctaIt: 'Inizia la pratica' },
    { id: 'kind', icon: 'rest', en: 'Self-compassion', it: 'Autocompassione', subEn: 'Hold SOMA in your palm', subIt: 'Tieni SOMA nel palmo', min: 3, prescribed: false,
      titleEn: 'A few kind words.', titleIt: 'Qualche parola gentile.', metaEn: 'Self-compassion · 3 minutes', metaIt: 'Autocompassione · 3 minuti',
      cardEn: 'Held in your hand', cardIt: 'Tenuto nel palmo', capEn: 'Hold SOMA close.', capIt: 'Tieni SOMA vicino a te.',
      howTitleEn: 'How it works', howTitleIt: 'Come funziona',
      howEn: 'Hold SOMA in your palm and read a few non-judgemental words for yourself, as you would for a friend.', howIt: 'Tieni SOMA nel palmo e leggi qualche parola non giudicante per te, come faresti con un’amica o un amico.',
      ctaEn: 'Start the practice', ctaIt: 'Inizia la pratica' }
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
          steps: Math.min(5, steps),
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
      haptics: true,
      online: true,
      moods: [],
      messages: [],
      onboardStep: 'welcome',
      name: 'Laura',
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
