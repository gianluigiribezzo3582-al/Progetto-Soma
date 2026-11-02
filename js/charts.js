/* SOMA — small hand-made SVG charts.
 * Rules followed: thin marks, rounded data ends anchored to the baseline,
 * recessive grid, direct labels instead of numbers on every point,
 * hover tooltips through [data-tip] (handled globally in app.js).
 */
(function () {
  const C = {};
  const INK = 'var(--ink-3)';
  const GRID = 'var(--grid)';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  /* Vertical bars, one hue; the current/last bar is emphasised. */
  C.bars = function (data, o = {}) {
    const W = o.w || 300, H = o.h || 130, pb = 18, pt = 8;
    const max = o.max || Math.max(...data.map(d => d.value), 1);
    const n = data.length, gap = 2;
    const bw = Math.min(22, (W - gap * (n - 1)) / n - 6);
    const step = (W - bw) / Math.max(1, n - 1);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '')}">`;
    s += `<line x1="0" x2="${W}" y1="${H - pb}" y2="${H - pb}" stroke="${GRID}" stroke-width="1"/>`;
    data.forEach((d, i) => {
      const h = Math.max(d.value > 0 ? 3 : 0, (d.value / max) * (H - pb - pt));
      const x = i * step, y = H - pb - h;
      const last = i === n - 1;
      const fill = last ? (o.accent || 'var(--olive-deep)') : (o.fill || 'var(--bar)');
      // rounded top only: path with 4px radius
      const r = Math.min(4, bw / 2, h);
      if (h > 0) {
        s += `<path d="M${x},${H - pb} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${H - pb} Z" fill="${fill}"/>`;
      }
      // generous hit target
      s += `<rect x="${x - 3}" y="${pt}" width="${bw + 6}" height="${H - pb - pt}" fill="transparent" data-tip="${esc(d.tip || d.label + ': ' + d.value)}"/>`;
      if (d.showLabel !== false && (i === 0 || last || o.allLabels)) {
        s += `<text x="${x + bw / 2}" y="${H - 4}" text-anchor="middle" class="ax">${esc(d.label)}</text>`;
      }
      if (last && o.valueOnLast) {
        s += `<text x="${x + bw / 2}" y="${y - 4}" text-anchor="middle" class="ax strong">${esc(o.valueOnLast)}</text>`;
      }
    });
    return s + '</svg>';
  };

  /* Lines on one shared axis. series: [{name, values, color, dashed, label}] */
  C.lines = function (series, labels, o = {}) {
    const W = o.w || 300, H = o.h || 140, pl = o.pl ?? 26, pr = 8, pt = 10, pb = 18;
    const all = series.flatMap(s => s.values.filter(v => v != null));
    const min = o.min ?? Math.min(0, ...all);
    const max = o.max ?? Math.max(...all);
    const n = labels.length;
    const X = i => pl + (i / Math.max(1, n - 1)) * (W - pl - pr);
    const Y = v => pt + (1 - (v - min) / (max - min || 1)) * (H - pt - pb);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '')}">`;
    (o.ticks || [min, max]).forEach(t => {
      s += `<line x1="${pl}" x2="${W - pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="${GRID}" stroke-width="1"/>`;
      s += `<text x="${pl - 5}" y="${Y(t) + 3}" text-anchor="end" class="ax">${esc(o.tickFmt ? o.tickFmt(t) : t)}</text>`;
    });
    [0, n - 1].forEach(i => { s += `<text x="${X(i)}" y="${H - 4}" text-anchor="${i ? 'end' : 'start'}" class="ax">${esc(labels[i])}</text>`; });
    series.forEach(se => {
      const pts = se.values.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
      s += `<path d="${d}" fill="none" stroke="${se.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${se.dashed ? 'stroke-dasharray="5 4"' : ''}/>`;
      const lp = pts[pts.length - 1];
      if (lp) {
        s += `<circle cx="${lp[0]}" cy="${lp[1]}" r="4" fill="${se.color}" stroke="var(--card)" stroke-width="2"/>`;
        if (se.label) s += `<text x="${lp[0] - 6}" y="${lp[1] - 8}" text-anchor="end" class="ax strong">${esc(se.label)}</text>`;
      }
    });
    // hover columns
    for (let i = 0; i < n; i++) {
      const tip = labels[i] + ' — ' + series.map(se => se.name + ': ' + (se.values[i] == null ? '–' : (o.valFmt ? o.valFmt(se.values[i]) : se.values[i]))).join(' · ');
      const w = (W - pl - pr) / Math.max(1, n - 1);
      s += `<rect x="${X(i) - w / 2}" y="${pt}" width="${w}" height="${H - pt - pb}" fill="transparent" data-tip="${esc(tip)}"/>`;
    }
    return s + '</svg>';
  };

  /* Radar: axes [{label}], series [{name, values 0..1, color, fill}] */
  C.radar = function (axes, series, o = {}) {
    const W = o.w || 280, H = o.h || 240, cx = W / 2, cy = H / 2 + 4, R = Math.min(W, H) / 2 - 34;
    const n = axes.length;
    const P = (i, v) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
      return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v];
    };
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '')}">`;
    [0.33, 0.66, 1].forEach(k => {
      s += `<polygon points="${axes.map((_, i) => P(i, k).join(',')).join(' ')}" fill="none" stroke="${GRID}" stroke-width="1"/>`;
    });
    axes.forEach((a, i) => {
      const [x, y] = P(i, 1), [lx, ly] = P(i, 1.2);
      s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
      s += `<text x="${lx}" y="${ly + 3}" text-anchor="${Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'}" class="ax">${esc(a.label)}</text>`;
    });
    series.forEach(se => {
      const pts = se.values.map((v, i) => P(i, v));
      s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${se.fill || 'none'}" stroke="${se.color}" stroke-width="2" stroke-linejoin="round" ${se.dashed ? 'stroke-dasharray="4 3"' : ''}/>`;
      pts.forEach((p, i) => {
        s += `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="transparent" data-tip="${esc(se.name + ' · ' + axes[i].label + ': ' + Math.round(se.values[i] * 100) + '%')}"/>`;
      });
    });
    return s + '</svg>';
  };

  /* Sparkline for live signals */
  C.spark = function (values, o = {}) {
    const W = o.w || 120, H = o.h || 30;
    if (!values.length) return `<svg class="spark" viewBox="0 0 ${W} ${H}"></svg>`;
    const min = o.min ?? Math.min(...values), max = o.max ?? Math.max(...values);
    const X = i => (i / Math.max(1, values.length - 1)) * (W - 4) + 2;
    const Y = v => 2 + (1 - (v - min) / (max - min || 1)) * (H - 4);
    const d = values.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
    const lx = X(values.length - 1), ly = Y(values[values.length - 1]);
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="${o.color || 'currentColor'}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${lx}" cy="${ly}" r="2.5" fill="${o.color || 'currentColor'}"/></svg>`;
  };

  /* 24-hour strip: when waves start. One dot per wave. */
  C.clock = function (times, o = {}) {
    const W = o.w || 300, H = o.h || 64, pl = 6, pr = 6;
    const X = m => pl + (m / 1440) * (W - pl - pr);
    let s = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '')}">`;
    s += `<rect x="${X(19 * 60)}" y="6" width="${X(24 * 60) - X(19 * 60)}" height="${H - 26}" rx="6" fill="var(--amber-soft)"/>`;
    s += `<line x1="${pl}" x2="${W - pr}" y1="${H - 20}" y2="${H - 20}" stroke="${GRID}"/>`;
    [0, 6, 12, 18, 24].forEach(h => {
      s += `<text x="${X(h * 60)}" y="${H - 6}" text-anchor="${h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}" class="ax">${String(h).padStart(2, '0')}:00</text>`;
    });
    const rows = {};
    times.forEach(t => {
      const m = t.h * 60 + t.m;
      const k = Math.round(m / 12);
      rows[k] = (rows[k] || 0) + 1;
      const y = H - 26 - (rows[k] - 1) * 7;
      s += `<circle cx="${X(m)}" cy="${y}" r="3" fill="${t.color || 'var(--olive-deep)'}" stroke="var(--card)" stroke-width="1"/>`;
      s += `<circle cx="${X(m)}" cy="${y}" r="7" fill="transparent" data-tip="${esc(t.tip || '')}"/>`;
    });
    return s + '</svg>';
  };

  /* Semicircle gauge for the wave index */
  C.gauge = function (value, threshold, o = {}) {
    const W = o.w || 200, H = o.h || 112, cx = W / 2, cy = H - 10, R = Math.min(W / 2, H) - 14;
    const A = v => Math.PI * (1 - v);
    const pt = v => [cx + Math.cos(A(v)) * R, cy - Math.sin(A(v)) * R];
    const arc = (a, b) => {
      const [x1, y1] = pt(a), [x2, y2] = pt(b);
      return `M${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2}`;
    };
    const v = Math.max(0.001, Math.min(1, value));
    const [tx, ty] = pt(threshold);
    const [ix, iy] = [cx + Math.cos(A(threshold)) * (R - 12), cy - Math.sin(A(threshold)) * (R - 12)];
    const [ox, oy] = [cx + Math.cos(A(threshold)) * (R + 10), cy - Math.sin(A(threshold)) * (R + 10)];
    return `<svg class="gauge" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '')}">
      <path d="${arc(0, 1)}" fill="none" stroke="var(--track)" stroke-width="10" stroke-linecap="round"/>
      <path d="${arc(0, v)}" fill="none" stroke="${value >= threshold ? 'var(--amber)' : 'var(--olive)'}" stroke-width="10" stroke-linecap="round"/>
      <line x1="${ix}" y1="${iy}" x2="${ox}" y2="${oy}" stroke="var(--ink-2)" stroke-width="2" stroke-linecap="round"/>
      <text x="${cx}" y="${cy - 14}" text-anchor="middle" class="gauge-val">${Math.round(value * 100)}%</text>
    </svg>`;
  };

  S.charts = C;
})();
