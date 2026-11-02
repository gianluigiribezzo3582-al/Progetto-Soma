/* SOMA — tiny bilingual layer.
 * Every visible string is written inline as L('English', 'Italiano'),
 * so both languages live side by side and are easy to edit.
 */
window.S = window.S || {};

S.lang = 'en';

function L(en, it) {
  return S.lang === 'it' ? it : en;
}

S.fmt = {
  time(d) {
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return h + ':' + m;
  },
  day(d) {
    return d.toLocaleDateString(S.lang === 'it' ? 'it-IT' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  },
  dayLong(d) {
    return d.toLocaleDateString(S.lang === 'it' ? 'it-IT' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  },
  date(d) {
    return d.toLocaleDateString(S.lang === 'it' ? 'it-IT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  },
  num(n, digits = 0) {
    return Number(n).toLocaleString(S.lang === 'it' ? 'it-IT' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  },
  mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
};

/* Greeting that follows the clock, never judgemental */
S.greeting = function (name) {
  const h = new Date().getHours();
  if (h < 5) return L('Still awake, ' + name + '?', 'È tardi, ' + name);
  if (h < 12) return L('Good morning, ' + name, 'Buongiorno, ' + name);
  if (h < 18) return L('Good afternoon, ' + name, 'Buon pomeriggio, ' + name);
  return L('Good evening, ' + name, 'Buonasera, ' + name);
};
