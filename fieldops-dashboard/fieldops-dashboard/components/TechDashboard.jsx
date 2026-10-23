'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ---------- Iconos (SVG en línea, sin dependencias) ---------- */
const P = {
  search: 'M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z', plus: 'M12 5v14M5 12h14',
  cal: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  clip: 'M21.4 11.1l-9.2 9.2a6 6 0 01-8.5-8.5l9.2-9.2a4 4 0 015.7 5.7l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5',
  dots: 'M12 5v.01M12 12v.01M12 19v.01', arrow: 'M7 17L17 7M8 7h9v9', right: 'M5 12h14M13 6l6 6-6 6',
  home: 'M3 11l9-8 9 8M5 10v10h14V10', truck: 'M1 5h13v11H1zM14 9h4l3 3v4h-7M6 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  chart: 'M3 3v18h18M7 15l4-5 3 3 5-7', sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2', smile: 'M12 22a10 10 0 100-20 10 10 0 000 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  x: 'M18 6L6 18M6 6l12 12',
};
const Ic = ({ n, c = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);

/* ---------- Tokens de estado (clases completas para que Tailwind las detecte) ---------- */
const TONE = { ok: 'bg-ok/10 text-ok', info: 'bg-info/10 text-info', hot: 'bg-hot/10 text-hot', warn: 'bg-warn/10 text-warn', mute: 'bg-mute/10 text-mute' };
const DOT = { ok: 'bg-ok', info: 'bg-info', hot: 'bg-hot', warn: 'bg-warn', mute: 'bg-mute' };
const STAT = { pend: ['Sin iniciar', 'mute'], camino: ['En camino', 'info'], sitio: ['En sitio', 'ok'], pausa: ['Pausado', 'warn'], fin: ['Finalizado', 'mute'] };
const FIELD = 'rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-info';

/* ---------- Datos de ejemplo ---------- */
const CREWS = [{ id: 'norte', n: 'Cuadrilla Norte', t: 'info' }, { id: 'sur', n: 'Cuadrilla Sur', t: 'ok' }, { id: 'este', n: 'Cuadrilla Este', t: 'hot' }];
const TECHS = [
  { id: 't1', n: 'Luis Peña', r: 'Técnico eléctrico', crew: 'norte', on: true, load: 84 }, { id: 't2', n: 'Ana Rosario', r: 'Supervisora', crew: 'sur', on: true, load: 72 },
  { id: 't3', n: 'Carlos Méndez', r: 'Líder de cuadrilla', crew: 'este', on: false, load: 45 }, { id: 't4', n: 'Rosa Almonte', r: 'Técnica de frío', crew: 'norte', on: true, load: 61 },
];
const COLS = [{ id: 'sin', n: 'Sin asignar' }, { id: 'prog', n: 'En progreso' }, { id: 'rev', n: 'Revisión / firma' }, { id: 'ok', n: 'Completado' }];
const J = (id, t, d, col, crew, tech, due, msg, att, st, addr, client) => ({ id, t, d, col, crew, tech, due, msg, att, st, addr, client });
const JOBS = [
  J('j1', 'Mantenimiento de aires', 'Revisión preventiva de 3 equipos, limpieza de filtros y carga de gas.', 'sin', 'norte', null, '24 Oct', 2, 1, 'pend', 'Av. Lincoln #1010, Piantini', 'Clínica Santa María'),
  J('j2', 'Cambio de panel eléctrico', 'Reemplazo del panel principal y verificación de tierra en la oficina.', 'prog', 'norte', 't1', '23 Oct', 4, 3, 'sitio', 'Plaza Norte, Los Prados', 'Supermercado Norte'),
  J('j3', 'Cámara frigorífica', 'Falla de compresor reportada. Llevar repuesto y manómetros.', 'prog', 'sur', 't2', '23 Oct', 1, 2, 'camino', 'Calle Principal #45', 'Supermercado Norte'),
  J('j4', 'Luminarias LED', 'Colocación de 12 luminarias en los pasillos del hotel.', 'prog', 'este', 't3', '25 Oct', 0, 1, 'pausa', 'Carretera Mella km 12', 'Hotel Costa Azul'),
  J('j5', 'Instalación de 4 cámaras', 'Sistema de seguridad en bodega. Falta la conformidad del cliente.', 'rev', 'sur', 't2', '22 Oct', 3, 5, 'sitio', 'Zona Industrial Haina', 'Almacenes Rivera'),
  J('j6', 'Planta eléctrica', 'Prueba de carga y cambio de aceite del generador de 60 kW.', 'rev', 'norte', 't4', '22 Oct', 2, 2, 'sitio', 'Av. Lincoln #1010', 'Clínica Santa María'),
  J('j7', 'Mantenimiento de minisplit', 'Doce equipos revisados y entregados con informe.', 'ok', 'este', 't3', '20 Oct', 1, 1, 'fin', 'Carretera Mella km 12', 'Hotel Costa Azul'),
  J('j8', 'Revisión de tablero', 'Medición de carga y ajuste de breakers en el taller.', 'ok', 'norte', 't1', '19 Oct', 1, 1, 'fin', 'Calle Duarte #88', 'Taller Reyes'),
  J('j9', 'Levantamiento de cámaras', 'Visita para cotizar el sistema de seguridad del colegio.', 'sin', 'sur', null, 'Sin fecha', 0, 0, 'pend', 'Av. Independencia #200', 'Colegio San José'),
];
const techOf = (id) => TECHS.find((t) => t.id === id);

/* ---------- Piezas ---------- */
const Av = ({ n, c = 'h-8 w-8' }) => (
  <span className={`${c} grid shrink-0 place-items-center rounded-full bg-ink/10 text-[11px] font-semibold text-ink`}>{n.split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
);
const Badge = ({ s }) => {
  const [l, t] = STAT[s];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONE[t]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[t]} ${s === 'camino' || s === 'sitio' ? 'motion-safe:animate-pulse' : ''}`} />{l}
    </span>
  );
};
const Kpi = ({ i, t, label, v, d, up }) => (
  <div className="rounded-card bg-card p-5 shadow-soft transition duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-full text-white ${DOT[t]}`}><Ic n={i} c="h-5 w-5" /></span>
        <span className="text-sm font-medium text-mute">{label}</span>
      </div>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-mute"><Ic n="arrow" /></span>
    </div>
    <div className="mt-5 flex items-end gap-2">
      <span className="text-4xl font-semibold tracking-tight">{v}</span>
      <span className={`mb-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${up ? TONE.ok : TONE.hot}`}>{up ? '↑' : '↓'} {d}</span>
    </div>
  </div>
);
function Job({ j, sel, onSel, onNext, onOpen, onDrag }) {
  const tc = techOf(j.tech);
  const mute = sel ? 'opacity-70' : 'text-mute';
  return (
    <article draggable onDragStart={() => onDrag(j.id)}
      className={`rounded-card p-5 transition duration-300 ease-soft ${sel ? 'bg-inv text-inv-ink shadow-lift' : 'bg-card shadow-soft hover:-translate-y-0.5 hover:shadow-lift'}`}>
      <button onClick={onSel} aria-pressed={sel} className="block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">
        <div className="flex items-start justify-between gap-2">
          <Badge s={j.st} /><Ic n="dots" c={`h-4 w-4 ${mute}`} />
        </div>
        <h3 className="mt-3 font-semibold leading-snug">{j.t}</h3>
        <p className={`mt-1.5 line-clamp-2 text-sm ${mute}`}>{j.d}</p>
        {sel && (
          <dl className="mt-4 grid gap-1 border-t border-current/15 pt-3 text-xs">
            <div className="flex justify-between gap-3"><dt className="opacity-60">Cliente</dt><dd className="text-right">{j.client}</dd></div>
            <div className="flex justify-between gap-3"><dt className="opacity-60">Dirección</dt><dd className="text-right">{j.addr}</dd></div>
          </dl>
        )}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-current/15 px-2.5 py-1.5"><Ic n="cal" c="h-3.5 w-3.5" />{j.due}</span>
          <span className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 ${mute}`}><Ic n="chat" c="h-3.5 w-3.5" />{j.msg}</span>
            <span className={`inline-flex items-center gap-1 ${mute}`}><Ic n="clip" c="h-3.5 w-3.5" />{j.att}</span>
            {tc ? <Av n={tc.n} c="h-7 w-7" /> : <span className="rounded-full border border-dashed border-current/30 px-2 py-0.5 opacity-70">Sin técnico</span>}
          </span>
        </div>
      </button>
      {sel && (
        <div className="mt-4 flex gap-2">
          <button onClick={onOpen} className="inline-flex flex-1 items-center justify-center rounded-full border border-current/25 px-4 py-2 text-sm font-semibold transition hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">Ver detalle</button>
          {j.col !== 'ok' && (
            <button onClick={onNext} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-inv-ink px-4 py-2 text-sm font-semibold text-inv transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">Avanzar <Ic n="right" /></button>
          )}
        </div>
      )}
    </article>
  );
}

/* ---------- Panel de detalle de un trabajo ---------- */
const STEPS = ['Asignado', 'En camino', 'En sitio', 'Revisión', 'Finalizado'];
const stepOf = (j) => (j.col === 'sin' ? 0 : j.col === 'ok' ? 4 : j.col === 'rev' ? 3 : j.st === 'sitio' ? 2 : 1);
function Detail({ j, onClose, onNext }) {
  const tc = techOf(j.tech), step = stepOf(j), crew = CREWS.find((c) => c.id === j.crew);
  const [chk, setChk] = useState([step >= 2, step >= 3, step >= 4]);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  const row = (a, b) => (<div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm last:border-0"><dt className="text-mute">{a}</dt><dd className="text-right font-medium">{b}</dd></div>);
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`Detalle de ${j.t}`} onClick={(e) => e.stopPropagation()} className="h-full w-[min(100vw,28rem)] overflow-y-auto bg-card p-6 text-ink shadow-lift">
        <div className="flex items-center justify-between"><Badge s={j.st} />
          <button autoFocus onClick={onClose} aria-label="Cerrar detalle" className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-mute focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"><Ic n="x" /></button></div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">{j.t}</h2>
        <p className="mt-2 text-sm text-mute">{j.d}</p>
        <dl className="mt-5 rounded-tile bg-canvas px-4">
          {row('Cliente', j.client)}{row('Dirección', j.addr)}{row('Fecha límite', j.due)}{row('Cuadrilla', crew ? crew.n : '—')}
          {row('Técnico', tc ? <span className="inline-flex items-center gap-2"><Av n={tc.n} c="h-6 w-6" />{tc.n}</span> : 'Sin asignar')}
        </dl>
        <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-mute">Avance</h3>
        <ol className="relative ml-2 grid gap-5 border-l border-line pl-6">
          {STEPS.map((s, i) => (
            <li key={s} className="relative text-sm">
              <span className={`absolute -left-[31px] top-0.5 h-4 w-4 rounded-full ring-4 ring-card ${i <= step ? 'bg-ok' : 'bg-line'}`} />
              <span className={i <= step ? 'font-semibold' : 'text-mute'}>{s}</span>{i === step && <span className="ml-2 text-xs text-ok">actual</span>}
            </li>
          ))}
        </ol>
        <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-mute">Lista de revisión</h3>
        <ul className="grid gap-2">
          {['Llegada confirmada', 'Fotos antes y después', 'Conformidad del cliente'].map((t, i) => (
            <li key={t}><label className="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5 text-sm"><input type="checkbox" checked={chk[i]} onChange={() => setChk((c) => c.map((v, k) => (k === i ? !v : v)))} className="h-4 w-4 accent-[rgb(var(--ok))]" />{t}</label></li>
          ))}
        </ul>
        <label className="mt-6 grid gap-1.5 text-sm text-mute">Notas del trabajo<textarea rows="3" className={FIELD} placeholder="Escribe una observación..." /></label>
        <div className="mt-6 flex gap-2">
          {j.col !== 'ok' && <button onClick={() => onNext(j)} className="flex-1 rounded-full bg-inv px-5 py-2.5 text-sm font-semibold text-inv-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">Avanzar de etapa</button>}
          <button onClick={onClose} className="flex-1 rounded-full border border-line px-5 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info">Cerrar</button>
        </div>
      </aside>
    </div>
  );
}

/* ---------- Dashboard principal ---------- */
export default function TechDashboard() {
  const [jobs, setJobs] = useState(JOBS), [q, setQ] = useState(''), [crew, setCrew] = useState('todas'), [sel, setSel] = useState('j2'), [drag, setDrag] = useState(null), [det, setDet] = useState(null);
  const dlg = useRef(null);
  const list = useMemo(() => jobs.filter((j) => (crew === 'todas' || j.crew === crew) && `${j.t} ${j.d} ${j.client}`.toLowerCase().includes(q.toLowerCase())), [jobs, q, crew]);
  const move = (id, col) => setJobs((js) => js.map((j) => (j.id === id ? { ...j, col, st: col === 'ok' ? 'fin' : col === 'rev' ? 'sitio' : col === 'prog' ? (j.st === 'pend' || j.st === 'fin' ? 'camino' : j.st) : 'pend' } : j)));
  const next = (j) => move(j.id, COLS[Math.min(COLS.findIndex((c) => c.id === j.col) + 1, 3)].id);
  const add = (e) => {
    e.preventDefault(); const f = new FormData(e.target);
    setJobs((js) => [J('n' + Date.now(), f.get('t'), f.get('d') || 'Sin descripción.', 'sin', f.get('c'), null, 'Sin fecha', 0, 0, 'pend', 'Por definir', '—'), ...js]);
    e.target.reset(); dlg.current.close();
  };
  const pct = jobs.length ? jobs.filter((j) => j.col === 'ok').length / jobs.length : 0, R = 52, C = 2 * Math.PI * R;
  const nav = [['home', 'Dashboard'], ['truck', 'Asignaciones'], ['users', 'Cuadrillas'], ['cal', 'Calendario'], ['chart', 'Reportes'], ['sliders', 'Ajustes']];

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 overflow-y-auto p-6 lg:flex" aria-label="Navegación principal">
        <div className="flex items-center gap-2 text-xl font-semibold tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-inv text-inv-ink"><Ic n="truck" /></span>FieldOps</div>
        <nav className="grid gap-1">
          {nav.map(([i, l], k) => (
            k === 0 ? (
            <a key={l} href="#" aria-current="page" className="flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 text-sm font-medium shadow-soft"><Ic n={i} c="h-[18px] w-[18px]" />{l}</a>
          ) : (
            <span key={l} aria-disabled="true" title="Esta sección aún no está construida" className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mute/70"><Ic n={i} c="h-[18px] w-[18px]" />{l}<span className="ml-auto rounded-full bg-canvas px-2 py-0.5 text-[10px] uppercase tracking-wide">Pronto</span></span>
          )
          ))}
        </nav>
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-mute">Cuadrillas</p>
          {CREWS.map((c) => (
            <button key={c.id} onClick={() => setCrew(crew === c.id ? 'todas' : c.id)} aria-pressed={crew === c.id} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${crew === c.id ? 'bg-card shadow-soft' : 'text-mute hover:bg-card/70 hover:text-ink'}`}>
              <span className="flex items-center gap-2.5"><span className={`h-2 w-2 rounded-full ${DOT[c.t]}`} />{c.n}</span>
              <span className="rounded-full bg-canvas px-2 text-xs">{jobs.filter((j) => j.crew === c.id).length}</span>
            </button>
          ))}
        </div>
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-mute">Técnicos</p>
          {TECHS.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2">
              <span className="relative"><Av n={t.n} /><span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-canvas ${t.on ? 'bg-ok' : 'bg-mute'}`} /></span>
              <span className="min-w-0 text-sm leading-tight"><span className="block truncate font-medium">{t.n}</span><span className="block truncate text-xs text-mute">{t.r}</span></span>
            </div>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:pl-0">
        <div className="rounded-[2rem] bg-card/60 p-4 sm:p-6">
          <header className="flex flex-wrap items-center gap-3">
            <h1 className="mr-auto text-2xl font-semibold tracking-tight sm:text-3xl">Gestión técnica</h1>
            <label className="relative">
              <span className="sr-only">Buscar trabajos</span>
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"><Ic n="search" /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar trabajo o cliente…" className={`${FIELD} w-64 rounded-full bg-card py-2.5 pl-10`} />
            </label>
            <label><span className="sr-only">Filtrar por cuadrilla</span>
              <select value={crew} onChange={(e) => setCrew(e.target.value)} className={`${FIELD} rounded-full bg-card`}>
                <option value="todas">Todas las cuadrillas</option>{CREWS.map((c) => <option key={c.id} value={c.id}>{c.n}</option>)}
              </select>
            </label>
            <button onClick={() => dlg.current.showModal()} className="inline-flex items-center gap-2 rounded-full bg-inv px-5 py-2.5 text-sm font-semibold text-inv-ink shadow-soft transition duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:ring-offset-canvas">
              <Ic n="plus" />Nueva asignación
            </button>
          </header>

          <section aria-label="Indicadores" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi i="users" t="ok" label="Cuadrillas activas" v="3" d="12 %" up />
            <Kpi i="cal" t="info" label="Tareas de hoy" v={jobs.length} d="23 %" up />
            <Kpi i="clock" t="hot" label="Tiempo de resolución" v="42 min" d="8 %" up={false} />
            <Kpi i="smile" t="warn" label="Satisfacción" v="4,8" d="3 %" up />
          </section>

          <div className="mt-6 grid gap-6 2xl:grid-cols-[1fr_20rem]">
            <section aria-label="Tablero de trabajos" className="grid auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-5 overflow-x-auto pb-2">
              {COLS.map((col) => {
                const items = list.filter((j) => j.col === col.id);
                return (
                  <div key={col.id} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag) move(drag, col.id); setDrag(null); }} className="min-w-0">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold tracking-tight">{col.n}</h2>
                      <span className="rounded-full border border-line bg-card px-3 py-1 text-sm">{items.length}</span>
                    </div>
                    <div className="grid content-start gap-4">
                      {items.map((j) => <Job key={j.id} j={j} sel={sel === j.id} onSel={() => setSel(sel === j.id ? null : j.id)} onNext={() => next(j)} onOpen={() => setDet(j.id)} onDrag={setDrag} />)}
                      {!items.length && <p className="rounded-card border border-dashed border-line p-6 text-center text-sm text-mute">Arrastra un trabajo aquí</p>}
                    </div>
                  </div>
                );
              })}
            </section>

            <aside aria-label="Productividad de hoy" className="h-fit rounded-card bg-card p-5 shadow-soft">
              <h2 className="text-lg font-semibold tracking-tight">Productividad de hoy</h2>
              <div className="relative mx-auto my-4 grid h-36 w-36 place-items-center">
                <svg viewBox="0 0 128 128" className="absolute inset-0 -rotate-90" aria-hidden="true">
                  <circle cx="64" cy="64" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="12" />
                  <circle cx="64" cy="64" r={R} fill="none" stroke="rgb(var(--ok))" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C * pct} ${C}`} className="transition-all duration-700 ease-soft" />
                </svg>
                <div className="text-center"><div className="text-3xl font-semibold">{Math.round(pct * 100)}%</div><div className="text-xs text-mute">completado</div></div>
              </div>
              <ul className="grid gap-4">
                {TECHS.map((t) => (
                  <li key={t.id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Av n={t.n} c="h-6 w-6" />{t.n.split(' ')[0]}</span><span className="font-semibold">{t.load}%</span></div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-label={`Carga de ${t.n}`} aria-valuenow={t.load} aria-valuemin="0" aria-valuemax="100">
                      <div className={`stripe h-full rounded-full ${DOT[CREWS.find((c) => c.id === t.crew).t]}`} style={{ width: `${t.load}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>

      {det && jobs.find((x) => x.id === det) && <Detail j={jobs.find((x) => x.id === det)} onClose={() => setDet(null)} onNext={next} />}

      <dialog ref={dlg} className="w-[min(92vw,28rem)] rounded-card bg-card p-6 text-ink shadow-lift backdrop:bg-black/40 backdrop:backdrop-blur-sm">
        <form onSubmit={add} className="grid gap-4">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Nueva asignación</h2>
            <button type="button" onClick={() => dlg.current.close()} aria-label="Cerrar" className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-mute"><Ic n="x" /></button></div>
          <label className="grid gap-1.5 text-sm text-mute">Trabajo<input name="t" required className={FIELD} placeholder="Ej. Cambio de breakers" /></label>
          <label className="grid gap-1.5 text-sm text-mute">Descripción<textarea name="d" rows="3" className={FIELD} /></label>
          <label className="grid gap-1.5 text-sm text-mute">Cuadrilla<select name="c" className={FIELD}>{CREWS.map((c) => <option key={c.id} value={c.id}>{c.n}</option>)}</select></label>
          <button className="rounded-full bg-inv px-5 py-2.5 text-sm font-semibold text-inv-ink">Crear asignación</button>
        </form>
      </dialog>
    </div>
  );
}
