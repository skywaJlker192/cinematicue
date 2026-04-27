/**
 * CINEMATHEQUE — Cinema Booking Logic
 * Подключается к бэкенду http://localhost:3001
 * При отсутствии бэкенда — работает в offline-режиме с демо-данными
 */

const API = 'http://localhost:3001/api';

// ─── Demo data (offline fallback) ─────────────────────────────────────────────
const DEMO_CINEMAS = [
  { id:1, name:'IMAX Октябрь',              address:'Новый Арбат, 24',           city:'Москва', metro:'Арбатская',         rating:4.8, session_count:12, description:'Один из лучших IMAX-залов России. Экран 18×24 метра, звук Dolby Atmos.' },
  { id:2, name:'Синема Парк Vegas',          address:'Каширское шоссе, 61',       city:'Москва', metro:'Домодедовская',      rating:4.6, session_count:20, description:'Современный мегаплекс в ТЦ Vegas. 14 залов, IMAX и 4DX.' },
  { id:3, name:'Формула Кино Европейский',   address:'Киевская пл., 2',           city:'Москва', metro:'Киевская',           rating:4.5, session_count:16, description:'Кинотеатр в сердце Москвы. Удобное расположение у трёх линий метро.' },
  { id:4, name:'Люмьер',                     address:'ул. Пятницкая, 25с1',      city:'Москва', metro:'Третьяковская',      rating:4.7, session_count:8,  description:'Артхаусный кинотеатр. Авторское кино и ретроспективы.' },
  { id:5, name:'Каро 11 Октябрьское поле',   address:'ул. Маршала Бирюзова, 32', city:'Москва', metro:'Октябрьское поле',   rating:4.4, session_count:18, description:'Крупный кинотеатр на севере Москвы. 11 залов, Dolby Cinema.' },
];

const DEMO_FILMS = [
  { title:'Дюна: Часть вторая', genre:'Фантастика', poster:'images/dune2.webp',              duration:'2ч 46м' },
  { title:'F1',                  genre:'Спорт, Драма',poster:'images/f1.jpg',                 duration:'2ч 15м' },
  { title:'Оппенгеймер',         genre:'Биография',  poster:'images/oppenheimer.webp',       duration:'3ч 00м' },
  { title:'Дэдпул и Росомаха',   genre:'Экшн',       poster:'images/dedpool&wolverine.webp', duration:'2ч 10м' },
];

function makeDemoSessions(cinemaId) {
  const today = new Date();
  const sessions = [];
  let id = cinemaId * 100;
  DEMO_FILMS.forEach(film => {
    [0,1,2,3].forEach(dayOffset => {
      const d = new Date(today); d.setDate(today.getDate() + dayOffset);
      const dateStr = d.toISOString().split('T')[0];
      ['10:30','13:00','16:00','19:30','22:00'].slice(0,3).forEach(time => {
        sessions.push({
          id: ++id, cinema_id: cinemaId,
          film_title: film.title, film_genre: film.genre,
          film_poster: film.poster, film_duration: film.duration,
          date: dateStr, time_start: time,
          format: ['2D','3D','IMAX'][id%3],
          language: ['RU','RU Sub'][id%2],
          price_standard: 350 + (id%5)*50,
          price_comfort:  700 + (id%5)*50,
          price_vip:      1150 + (id%5)*50,
          hall_name: 'Зал ' + (1 + id%2),
          rows: 10, cols: 12,
          hall_id: cinemaId * 10 + (id%2),
        });
      });
    });
  });
  return sessions;
}

function makeDemoSeats(session) {
  const seats = []; let id = session.id * 1000;
  for (let r = 1; r <= session.rows; r++) {
    for (let c = 1; c <= session.cols; c++) {
      let cat = 'standard';
      if (r <= 2) cat = 'vip';
      else if (r >= session.rows - 1) cat = 'comfort';
      seats.push({
        id: ++id, session_id: session.id,
        row_num: r, seat_num: c, category: cat,
        status: Math.random() < 0.25 ? 'taken' : 'free',
      });
    }
  }
  return seats;
}

// ─── State ────────────────────────────────────────────────────────────────────
let state = {
  offline: false,
  cinemas: [],
  selectedCinema: null,
  sessions: [],
  selectedSession: null,
  allSeats: [],
  selectedSeatIds: new Set(),
  currentOrder: null,
  currentTickets: [],
  userToken: localStorage.getItem('cine_user_token') || genToken(),
  ordersCount: 0,
};

function genToken() {
  const t = 'usr_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('cine_user_token', t);
  return t;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'Content-Type':'application/json', ...(opts.headers||{}) } });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'API error');
  return data.data;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, type='info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const icons = { info:'fa-circle-info', success:'fa-check-circle', error:'fa-exclamation-circle', dice:'fa-ticket-alt' };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fas ${icons[type]||'fa-circle-info'}"></i><span>${msg}</span>`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-show'));
  setTimeout(() => { t.classList.remove('toast-show'); t.addEventListener('transitionend',()=>t.remove(),{once:true}); }, 3000);
}

// ─── Step navigation ─────────────────────────────────────────────────────────
let currentStep = 1;
function goToStep(n) {
  currentStep = n;
  document.querySelectorAll('.booking-step-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.bstep').forEach((el,i) => {
    el.classList.toggle('active', i+1 <= n);
    el.classList.toggle('done',   i+1 < n);
  });
  const steps = ['step-cinemas','step-sessions','step-seats','step-payment'];
  const target = document.getElementById(steps[n-1]);
  if (target) { target.classList.remove('hidden'); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
}

// ─── Step 1: Load Cinemas ─────────────────────────────────────────────────────
async function loadCinemas() {
  const grid = document.getElementById('cinemas-grid');
  try {
    state.cinemas = await apiFetch(`${API}/cinemas`);
    state.offline = false;
  } catch {
    state.offline = true;
    state.cinemas = DEMO_CINEMAS;
    showToast('Работаем в демо-режиме (бэкенд не запущен)', 'info');
  }
  renderCinemas(state.cinemas);
  loadStats();
}

async function loadStats() {
  try {
    const stats = await apiFetch(`${API}/stats`);
    document.getElementById('stat-cinemas').textContent  = stats.cinemas;
    document.getElementById('stat-sessions').textContent = stats.sessions + '+';
    document.getElementById('stat-orders').textContent   = stats.paid;
  } catch { /* demo mode — leave defaults */ }
}

function renderCinemas(list) {
  const grid = document.getElementById('cinemas-grid');
  if (!list.length) { grid.innerHTML = '<p class="no-results">Кинотеатры не найдены</p>'; return; }
  grid.innerHTML = list.map(c => `
    <article class="cinema-card" data-id="${c.id}" data-metro="${c.metro||''}">
      <div class="cinema-card-header">
        <div class="cinema-card-icon"><i class="fas fa-film"></i></div>
        <div class="cinema-card-rating">
          <i class="fas fa-star"></i> ${c.rating.toFixed(1)}
        </div>
      </div>
      <div class="cinema-card-body">
        <h3 class="cinema-card-name">${c.name}</h3>
        <div class="cinema-card-meta">
          <span><i class="fas fa-map-marker-alt"></i> ${c.address}</span>
          ${c.metro ? `<span><i class="fas fa-subway"></i> м. ${c.metro}</span>` : ''}
        </div>
        <p class="cinema-card-desc">${c.description || ''}</p>
        <div class="cinema-card-footer">
          <span class="cinema-sessions-count"><i class="fas fa-calendar-alt"></i> ${c.session_count || 0} сеансов</span>
          <button class="btn btn-primary btn-sm btn-choose-cinema" data-id="${c.id}">
            Выбрать <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ─── Step 2: Sessions ─────────────────────────────────────────────────────────
async function selectCinema(id) {
  state.selectedCinema = state.cinemas.find(c => c.id == id);
  if (!state.selectedCinema) return;
  document.getElementById('sessions-cinema-name').textContent = state.selectedCinema.name;
  document.getElementById('sessions-cinema-addr').textContent = `${state.selectedCinema.address} · м. ${state.selectedCinema.metro||''}`;
  goToStep(2);
  await loadSessions(id);
}

async function loadSessions(cinemaId) {
  document.getElementById('sessions-list').innerHTML = '<div class="sessions-loading"><i class="fas fa-spinner fa-spin"></i> Загружаем расписание...</div>';
  try {
    if (state.offline) throw new Error('offline');
    state.sessions = await apiFetch(`${API}/cinemas/${cinemaId}/sessions`);
  } catch {
    state.sessions = makeDemoSessions(cinemaId);
  }
  renderDatePicker();
}

function getUniqueDates() {
  const dates = [...new Set(state.sessions.map(s => s.date))].sort();
  return dates;
}

function renderDatePicker() {
  const dates = getUniqueDates();
  const picker = document.getElementById('date-picker');
  picker.innerHTML = dates.map((d, i) => {
    const date = new Date(d + 'T00:00:00');
    const day  = date.toLocaleDateString('ru',{weekday:'short'});
    const num  = date.getDate();
    const mon  = date.toLocaleDateString('ru',{month:'short'});
    return `<button class="date-btn${i===0?' active':''}" data-date="${d}">
      <span class="date-day">${day}</span>
      <span class="date-num">${num}</span>
      <span class="date-mon">${mon}</span>
    </button>`;
  }).join('');

  if (dates.length) renderSessionsForDate(dates[0]);

  picker.querySelectorAll('.date-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSessionsForDate(btn.dataset.date);
    });
  });
}

function renderSessionsForDate(date) {
  const filtered = state.sessions.filter(s => s.date === date);
  const list = document.getElementById('sessions-list');
  if (!filtered.length) { list.innerHTML = '<p class="no-results">На эту дату нет сеансов</p>'; return; }

  // Group by film
  const byFilm = {};
  filtered.forEach(s => { (byFilm[s.film_title] = byFilm[s.film_title]||[]).push(s); });

  list.innerHTML = Object.entries(byFilm).map(([film, sessions]) => `
    <div class="film-sessions-group">
      <div class="fsg-header">
        <img src="${sessions[0].film_poster||'images/dune2.webp'}" alt="${film}" class="fsg-poster" loading="lazy">
        <div class="fsg-info">
          <h3 class="fsg-title">${film}</h3>
          <div class="fsg-meta">
            <span>${sessions[0].film_genre||''}</span>
            <span>${sessions[0].film_duration||''}</span>
          </div>
          <div class="fsg-times">
            ${sessions.map(s => `
              <button class="session-time-btn" data-id="${s.id}">
                <span class="stb-time">${s.time_start}</span>
                <span class="stb-format">${s.format}</span>
                <span class="stb-lang">${s.language}</span>
                <span class="stb-hall">${s.hall_name||'Зал'}</span>
                <span class="stb-price">от ₽${s.price_standard}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.session-time-btn').forEach(btn => {
    btn.addEventListener('click', () => selectSession(btn.dataset.id));
  });
}

// ─── Step 3: Seats ────────────────────────────────────────────────────────────
async function selectSession(id) {
  state.selectedSession = state.sessions.find(s => s.id == id);
  if (!state.selectedSession) return;
  const s = state.selectedSession;
  const dateLabel = new Date(s.date+'T00:00:00').toLocaleDateString('ru',{day:'numeric',month:'long'});
  document.getElementById('seats-session-info').textContent = `${s.film_title} · ${dateLabel} · ${s.time_start} · ${s.format}`;
  document.getElementById('pib-vip-price').textContent      = `₽${s.price_vip}`;
  document.getElementById('pib-comfort-price').textContent  = `₽${s.price_comfort}`;
  document.getElementById('pib-standard-price').textContent = `₽${s.price_standard}`;

  state.selectedSeatIds.clear();
  renderSelectionSummary();
  goToStep(3);
  await loadSeats(id);
}

async function loadSeats(sessionId) {
  const map = document.getElementById('seat-map');
  map.innerHTML = '<div class="seats-loading"><i class="fas fa-spinner fa-spin"></i></div>';
  try {
    if (state.offline) throw new Error('offline');
    const data = await apiFetch(`${API}/sessions/${sessionId}/seats`);
    state.allSeats = Array.isArray(data) ? data : data;
    if (!state.allSeats.length) throw new Error('empty');
  } catch {
    state.allSeats = makeDemoSeats(state.selectedSession);
  }
  renderSeatMap();
}

function renderSeatMap() {
  const map = document.getElementById('seat-map');
  const s   = state.selectedSession;
  const rows = Math.max(...state.allSeats.map(s => s.row_num));
  const cols = Math.max(...state.allSeats.map(s => s.seat_num));
  let html = '';
  for (let r = 1; r <= rows; r++) {
    html += `<div class="seat-row"><span class="row-label">${r}</span>`;
    for (let c = 1; c <= cols; c++) {
      const seat = state.allSeats.find(s => s.row_num===r && s.seat_num===c);
      if (!seat) { html += `<div class="seat seat-empty"></div>`; continue; }
      const cls = `seat seat-${seat.category} seat-${seat.status}`;
      const price = { vip: s.price_vip, comfort: s.price_comfort, standard: s.price_standard }[seat.category] || s.price_standard;
      html += `<div class="${cls}" data-id="${seat.id}" data-cat="${seat.category}" data-price="${price}" title="${seat.category.toUpperCase()} · Ряд ${r} Место ${c} · ₽${price}"></div>`;
    }
    html += `</div>`;
  }
  map.innerHTML = html;

  map.querySelectorAll('.seat:not(.seat-taken)').forEach(el => {
    el.addEventListener('click', () => toggleSeat(el));
  });
}

function toggleSeat(el) {
  const id    = parseInt(el.dataset.id);
  const price = parseInt(el.dataset.price);
  const cat   = el.dataset.cat;
  if (el.classList.contains('seat-taken')) return;

  if (state.selectedSeatIds.has(id)) {
    state.selectedSeatIds.delete(id);
    el.classList.remove('seat-selected');
    el.classList.add(`seat-${cat}`);
  } else {
    if (state.selectedSeatIds.size >= 6) { showToast('Максимум 6 мест за раз', 'info'); return; }
    state.selectedSeatIds.add(id);
    el.classList.remove(`seat-${cat}`);
    el.classList.add('seat-selected');
  }
  renderSelectionSummary();
}

function renderSelectionSummary() {
  const summary = document.getElementById('selection-summary');
  const count   = state.selectedSeatIds.size;
  if (count === 0) { summary.style.display='none'; return; }
  summary.style.display = 'flex';
  const s = state.selectedSession;
  let total = 0;
  const seatLabels = [];
  state.selectedSeatIds.forEach(id => {
    const seat = state.allSeats.find(s => s.id===id);
    if (seat) {
      const price = { vip:s.price_vip, comfort:s.price_comfort, standard:s.price_standard }[seat.category] || s.price_standard;
      total += price;
      seatLabels.push(`Р${seat.row_num}М${seat.seat_num}`);
    }
  });
  document.getElementById('sel-count').textContent     = `${count} ${count===1?'место':count<5?'места':'мест'} выбрано`;
  document.getElementById('sel-seats-list').textContent = seatLabels.join(', ');
  document.getElementById('sel-total-price').textContent = `₽${total.toLocaleString('ru')}`;
}

// ─── Step 4: Payment ─────────────────────────────────────────────────────────
function proceedToPayment() {
  if (!state.selectedSeatIds.size) { showToast('Выберите хотя бы одно место', 'info'); return; }
  const s = state.selectedSession;
  const c = state.selectedCinema;
  let total = 0;
  const selectedSeats = [];

  state.selectedSeatIds.forEach(id => {
    const seat = state.allSeats.find(s => s.id===id);
    if (seat) {
      const price = { vip:s.price_vip, comfort:s.price_comfort, standard:s.price_standard }[seat.category] || s.price_standard;
      total += price;
      selectedSeats.push({ ...seat, price });
    }
  });

  const dateLabel = new Date(s.date+'T00:00:00').toLocaleDateString('ru',{day:'numeric',month:'long',year:'numeric'});

  document.getElementById('order-details').innerHTML = `
    <div class="od-film">
      <img src="${s.film_poster||'images/dune2.webp'}" alt="${s.film_title}" class="od-poster">
      <div>
        <div class="od-film-title">${s.film_title}</div>
        <div class="od-meta">${dateLabel} · ${s.time_start}</div>
        <div class="od-meta">${c.name} · ${s.hall_name||'Зал'}</div>
        <div class="od-meta">${s.format} · ${s.language}</div>
      </div>
    </div>
    <div class="od-seats">
      ${selectedSeats.map(seat => `
        <div class="od-seat-row">
          <span class="od-seat-cat cat-${seat.category}">${catLabel(seat.category)}</span>
          <span>Ряд ${seat.row_num}, Место ${seat.seat_num}</span>
          <span class="od-seat-price">₽${seat.price.toLocaleString('ru')}</span>
        </div>
      `).join('')}
    </div>
    <div class="od-total">
      <span>Итого</span>
      <strong>₽${total.toLocaleString('ru')}</strong>
    </div>
  `;

  document.getElementById('pay-final-total').textContent = `₽${total.toLocaleString('ru')}`;
  document.getElementById('pay-btn-amount').textContent  = `₽${total.toLocaleString('ru')}`;
  goToStep(4);
}

function catLabel(cat) {
  return { vip:'VIP', comfort:'Комфорт', standard:'Стандарт' }[cat] || cat;
}

// ─── Payment ─────────────────────────────────────────────────────────────────
async function processPayment() {
  const btn = document.getElementById('btn-pay');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обрабатываем...';

  try {
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1800));

    const seatIds = [...state.selectedSeatIds];
    let order, tickets;

    if (state.offline) {
      // Demo mode: create local order
      order = {
        id: Date.now(),
        session_id: state.selectedSession.id,
        user_token: state.userToken,
        status: 'paid',
        total_price: [...state.selectedSeatIds].reduce((sum, id) => {
          const seat = state.allSeats.find(s=>s.id===id);
          if (!seat) return sum;
          const p = { vip:state.selectedSession.price_vip, comfort:state.selectedSession.price_comfort, standard:state.selectedSession.price_standard };
          return sum + (p[seat.category]||p.standard);
        }, 0),
        created_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
      };
      tickets = seatIds.map(id => {
        const seat = state.allSeats.find(s=>s.id===id);
        return { id, order_id:order.id, seat_id:id, category:seat?.category||'standard',
          price:seat?{ vip:state.selectedSession.price_vip, comfort:state.selectedSession.price_comfort, standard:state.selectedSession.price_standard }[seat.category]:450,
          barcode:`CT-DEMO-${id}-${Date.now()}`,
          row_num: seat?.row_num, seat_num: seat?.seat_num,
        };
      });

      // Mark seats as taken in local state
      seatIds.forEach(id => {
        const seat = state.allSeats.find(s=>s.id===id);
        if (seat) seat.status = 'taken';
      });

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('cine_orders')||'[]');
      saved.unshift({ order, tickets, session: state.selectedSession, cinema: state.selectedCinema });
      localStorage.setItem('cine_orders', JSON.stringify(saved.slice(0,50)));

    } else {
      // Create order
      const created = await apiFetch(`${API}/orders`, {
        method: 'POST',
        body: JSON.stringify({ session_id: state.selectedSession.id, seat_ids: seatIds, user_token: state.userToken })
      });

      // Pay immediately
      const paid = await apiFetch(`${API}/orders/${created.order.id}/pay`, { method:'PUT' });
      order   = paid.order;
      tickets = paid.tickets;

      // Refresh seat map
      seatIds.forEach(id => {
        const seat = state.allSeats.find(s=>s.id===id);
        if (seat) seat.status = 'taken';
      });
    }

    state.currentOrder   = order;
    state.currentTickets = tickets;
    state.selectedSeatIds.clear();
    state.ordersCount++;
    updateOrdersBadge();
    showSuccessModal(order, tickets);

  } catch(err) {
    showToast('Ошибка оплаты: ' + err.message, 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-lock"></i> Оплатить <span id="pay-btn-amount">' + document.getElementById('pay-btn-amount')?.textContent + '</span>';
  }
}

function showSuccessModal(order, tickets) {
  const list = document.getElementById('ticket-list');
  const s    = state.selectedSession;
  const c    = state.selectedCinema;
  const dateLabel = new Date(s.date+'T00:00:00').toLocaleDateString('ru',{day:'numeric',month:'long'});

  list.innerHTML = tickets.map(t => `
    <div class="ticket-item">
      <div class="ticket-item-left">
        <div class="ticket-film">${s.film_title}</div>
        <div class="ticket-info">${dateLabel} · ${s.time_start} · ${s.format}</div>
        <div class="ticket-info">${c?.name||''} · Ряд ${t.row_num} Место ${t.seat_num}</div>
        <div class="ticket-cat cat-${t.category}">${catLabel(t.category)}</div>
      </div>
      <div class="ticket-item-right">
        <div class="ticket-price">₽${t.price.toLocaleString('ru')}</div>
        <div class="ticket-barcode">${generateBarcodeSVG(t.barcode||'')}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('success-modal').classList.add('open');
}

function generateBarcodeSVG(code) {
  // Simple visual barcode (decorative)
  const bars = Array.from({length:30}, (_,i) => `<rect x="${i*3}" y="0" width="${1+i%3}" height="30" fill="currentColor" opacity="${0.5+Math.random()*0.5}"/>`).join('');
  return `<svg width="90" height="30" viewBox="0 0 90 30">${bars}</svg>`;
}

// ─── My Orders ────────────────────────────────────────────────────────────────
function updateOrdersBadge() {
  const badge = document.getElementById('orders-badge');
  const saved = state.offline ? JSON.parse(localStorage.getItem('cine_orders')||'[]') : [];
  const count = saved.length || state.ordersCount;
  if (count > 0) { badge.textContent = count > 9 ? '9+' : count; badge.style.display = 'flex'; }
}

async function openOrdersModal() {
  document.getElementById('orders-modal').classList.add('open');
  const list = document.getElementById('orders-list');
  list.innerHTML = '<div class="orders-loading"><i class="fas fa-spinner fa-spin"></i> Загружаем...</div>';

  let orders = [];
  try {
    if (state.offline) throw new Error('offline');
    orders = await apiFetch(`${API}/orders?user_token=${state.userToken}`);
  } catch {
    const saved = JSON.parse(localStorage.getItem('cine_orders')||'[]');
    orders = saved.map(e => ({
      ...e.order,
      film_title: e.session?.film_title||'',
      date: e.session?.date||'',
      time_start: e.session?.time_start||'',
      format: e.session?.format||'',
      cinema_name: e.cinema?.name||'',
      cinema_address: e.cinema?.address||'',
      tickets: e.tickets||[],
    }));
  }

  if (!orders.length) {
    list.innerHTML = '<div class="no-orders"><i class="fas fa-ticket-alt"></i><p>Заказов пока нет</p></div>';
    return;
  }

  list.innerHTML = orders.map(order => {
    const dateLabel = order.date ? new Date(order.date+'T00:00:00').toLocaleDateString('ru',{day:'numeric',month:'long',year:'numeric'}) : '';
    const statusClass = { paid:'status-paid', pending:'status-pending', cancelled:'status-cancelled' }[order.status] || 'status-pending';
    const statusText  = { paid:'ОПЛАЧЕН', pending:'ОЖИДАЕТ ОПЛАТЫ', cancelled:'ОТМЕНЁН' }[order.status] || order.status;
    return `
      <div class="order-item">
        <div class="order-item-top">
          <div>
            <div class="order-film-name">${order.film_title}</div>
            <div class="order-item-meta">${dateLabel} · ${order.time_start||''} · ${order.format||''}</div>
            <div class="order-item-meta">${order.cinema_name||''}</div>
          </div>
          <div class="order-status-badge ${statusClass}">${statusText}</div>
        </div>
        ${(order.tickets||[]).length ? `<div class="order-tickets-mini">
          ${order.tickets.slice(0,3).map(t=>`<span class="otm-ticket cat-${t.category}">Р${t.row_num}М${t.seat_num}</span>`).join('')}
          ${order.tickets.length>3?`<span class="otm-more">+${order.tickets.length-3}</span>`:''}
        </div>` : ''}
        <div class="order-item-footer">
          <span class="order-total">₽${(order.total_price||0).toLocaleString('ru')}</span>
          ${order.status==='pending'?`<button class="btn-cancel-order" data-id="${order.id}">Отменить</button>`:''}
        </div>
      </div>
    `;
  }).join('');

  // Cancel handlers
  list.querySelectorAll('.btn-cancel-order').forEach(btn => {
    btn.addEventListener('click', () => cancelOrder(btn.dataset.id));
  });
}

async function cancelOrder(id) {
  try {
    if (state.offline) {
      const saved = JSON.parse(localStorage.getItem('cine_orders')||'[]');
      const idx   = saved.findIndex(e => e.order.id == id);
      if (idx>=0) { saved[idx].order.status = 'cancelled'; localStorage.setItem('cine_orders', JSON.stringify(saved)); }
    } else {
      await apiFetch(`${API}/orders/${id}/cancel`, { method:'PUT' });
    }
    showToast('Заказ отменён', 'info');
    openOrdersModal();
  } catch(e) { showToast('Ошибка: ' + e.message, 'error'); }
}

// ─── Card input masks ─────────────────────────────────────────────────────────
function initCardMasks() {
  document.getElementById('card-number')?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  });
  document.getElementById('card-expiry')?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').slice(0,4);
    if (v.length>=3) v = v.slice(0,2)+'/'+v.slice(2);
    e.target.value = v;
  });
  document.getElementById('card-cvv')?.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,3);
  });
  document.getElementById('card-name')?.addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z ]/g,'');
  });
}

// ─── Metro filter ─────────────────────────────────────────────────────────────
function initMetroFilter() {
  document.querySelectorAll('.cf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const metro = btn.dataset.metro;
      const filtered = metro === 'all' ? state.cinemas : state.cinemas.filter(c => c.metro === metro);
      renderCinemas(filtered);
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Theme
  const toggle = document.getElementById('theme-toggle-cinema');
  if (toggle) {
    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-theme'); toggle.checked = true; }
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('light-theme', toggle.checked);
      localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
    });
  }

  loadCinemas();
  initMetroFilter();
  initCardMasks();
  updateOrdersBadge();

  // Cinema selection (delegated)
  document.getElementById('cinemas-grid').addEventListener('click', e => {
    const btn = e.target.closest('.btn-choose-cinema');
    if (btn) selectCinema(btn.dataset.id);
  });

  // Back buttons
  document.getElementById('back-to-cinemas')?.addEventListener('click', () => goToStep(1));
  document.getElementById('back-to-sessions')?.addEventListener('click', () => goToStep(2));
  document.getElementById('back-to-seats')?.addEventListener('click', () => goToStep(3));

  // Proceed to payment
  document.getElementById('btn-proceed-payment')?.addEventListener('click', proceedToPayment);

  // Pay
  document.getElementById('btn-pay')?.addEventListener('click', processPayment);

  // Pay method switch
  document.querySelectorAll('.pay-method').forEach(el => {
    el.querySelector('input')?.addEventListener('change', () => {
      document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
      el.classList.add('active');
      const val = el.querySelector('input').value;
      document.getElementById('card-form').style.display = val === 'card' ? 'block' : 'none';
    });
  });

  // Success modal
  document.getElementById('btn-view-orders')?.addEventListener('click', () => {
    document.getElementById('success-modal').classList.remove('open');
    openOrdersModal();
  });
  document.getElementById('btn-download-tickets')?.addEventListener('click', () => {
    showToast('Билеты сохранены (демо)', 'success');
  });
  document.getElementById('success-modal')?.addEventListener('click', e => {
    if (e.target.id==='success-modal') document.getElementById('success-modal').classList.remove('open');
  });

  // Orders modal
  document.getElementById('my-orders-fab')?.addEventListener('click', openOrdersModal);
  document.getElementById('orders-modal-close')?.addEventListener('click', () => document.getElementById('orders-modal').classList.remove('open'));
  document.getElementById('orders-modal')?.addEventListener('click', e => {
    if (e.target.id==='orders-modal') document.getElementById('orders-modal').classList.remove('open');
  });

  // Back to top
  const topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    window.addEventListener('scroll', () => topBtn.classList.toggle('visible', scrollY>400), {passive:true});
    topBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  }

  // ESC
  document.addEventListener('keydown', e => {
    if (e.key==='Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    }
  });
});
