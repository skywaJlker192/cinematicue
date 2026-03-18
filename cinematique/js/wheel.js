/* =====================================================
   CINEMATHEQUE — wheel.js
   Колесо удачи: скидки на подписку
   - Canvas-рендер красивого колеса с секторами
   - Физика вращения с инерцией
   - Промокоды привязаны к секторам
   - Реальное изменение цен при активации
   - localStorage: одно вращение в 24ч
   ===================================================== */

// ── ПРИЗЫ ─────────────────────────────────────────────
const PRIZES = [
  { label: 'СКИДКА 50%', code: 'CINE50',    discount: 0.50, color: '#b8860b', textColor: '#fff', emoji: '🔥' },
  { label: 'СКИДКА 10%', code: 'CINE10',    discount: 0.10, color: '#1a1a2e', textColor: '#cca43b', emoji: '🎬' },
  { label: 'СКИДКА 30%', code: 'CINE30',    discount: 0.30, color: '#cca43b', textColor: '#000',    emoji: '⭐' },
  { label: 'НЕ ПОВЕЗЛО', code: null,         discount: 0,    color: '#111',    textColor: '#555',    emoji: '😔' },
  { label: 'СКИДКА 20%', code: 'CINE20',    discount: 0.20, color: '#2a1a00', textColor: '#e09f3e', emoji: '🎥' },
  { label: 'СКИДКА 15%', code: 'CINE15',    discount: 0.15, color: '#16213e', textColor: '#cca43b', emoji: '🍿' },
  { label: 'МЕСЯЦ FREE', code: 'CINEFREE',  discount: 1.00, color: '#0f3460', textColor: '#fff',    emoji: '🎁' },
  { label: 'СКИДКА 5%',  code: 'CINE5',     discount: 0.05, color: '#1a0a00', textColor: '#cca43b', emoji: '🎦' },
];

// ── БАЗОВЫЕ ЦЕНЫ ──────────────────────────────────────
const BASE_PRICES = { basic: 199, standard: 399, premium: 599 };

// ── СОСТОЯНИЕ ─────────────────────────────────────────
let spinning    = false;
let currentAngle = 0;
let activePromo  = JSON.parse(localStorage.getItem('cine_promo') || 'null');
let wonPrize     = null;

const SEGMENT    = (2 * Math.PI) / PRIZES.length;

// ── CANVAS РЕНДЕР ─────────────────────────────────────
function drawWheel(canvas, angle) {
  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const cx  = W / 2;
  const cy  = W / 2;
  const R   = cx - 8;

  ctx.clearRect(0, 0, W, W);

  // тень колеса
  ctx.save();
  ctx.shadowColor = 'rgba(204,164,59,0.35)';
  ctx.shadowBlur  = 32;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();

  // секторы
  PRIZES.forEach((prize, i) => {
    const startAngle = angle + i * SEGMENT;
    const endAngle   = startAngle + SEGMENT;
    const midAngle   = startAngle + SEGMENT / 2;

    // сектор
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();

    // граница сектора
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, startAngle, endAngle);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(204,164,59,0.4)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // эмодзи + текст
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(midAngle);

    // эмодзи
    ctx.font = `${W * 0.048}px serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(prize.emoji, R * 0.75, 0);

    // текст скидки
    ctx.font = `bold ${W * 0.038}px 'Rajdhani', sans-serif`;
    ctx.fillStyle   = prize.textColor;
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur  = 4;
    ctx.fillText(prize.label, R * 0.44, 0);

    ctx.restore();
  });

  // внешнее золотое кольцо
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = '#cca43b';
  ctx.lineWidth   = 3;
  ctx.stroke();

  // внутренний центр
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.12);
  grad.addColorStop(0, '#e0b030');
  grad.addColorStop(1, '#8a6000');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = '#fff3';
  ctx.lineWidth = 2;
  ctx.stroke();

  // иконка в центре
  ctx.font = `${W * 0.06}px serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🎬', cx, cy);
}

// ── НАРИСОВАТЬ СТРЕЛКУ-УКАЗАТЕЛЬ ──────────────────────
function drawPointer(canvas) {
  const ctx = canvas.getContext('2d');
  const cx  = canvas.width / 2;
  const R   = canvas.width / 2 - 8;

  ctx.save();
  ctx.translate(cx, 10);

  // треугольник
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(-14, -32);
  ctx.lineTo(14, -32);
  ctx.closePath();

  const g = ctx.createLinearGradient(0, -32, 0, -6);
  g.addColorStop(0, '#e0b030');
  g.addColorStop(1, '#cca43b');
  ctx.fillStyle = g;
  ctx.shadowColor = 'rgba(204,164,59,0.6)';
  ctx.shadowBlur  = 10;
  ctx.fill();

  ctx.strokeStyle = '#fff';
  ctx.lineWidth   = 1;
  ctx.stroke();

  ctx.restore();
}

// ── АНИМАЦИЯ ВРАЩЕНИЯ ─────────────────────────────────
function spinWheel(canvas, onDone) {
  if (spinning) return;
  spinning = true;

  // взвешенный случайный приз:
  // idx: [0]=50%  [1]=10%  [2]=30%  [3]=НЕ ПОВЕЗЛО  [4]=20%  [5]=15%  [6]=FREE  [7]=5%
  //       редкий  частый   редкий   очень частый      средний  средний  супер редкий  очень частый
  const weights   = [3, 18, 5, 25, 9, 13, 1, 22];
  const totalW    = weights.reduce((a, b) => a + b, 0);
  let rnd = Math.random() * totalW, prizeIdx = 0;
  for (let i = 0; i < weights.length; i++) {
    rnd -= weights[i];
    if (rnd <= 0) { prizeIdx = i; break; }
  }

  // угол, на котором должен остановиться центр выигравшего сектора
  // стрелка смотрит вверх = -π/2. Центр сектора i = i*SEGMENT + SEGMENT/2
  // нам нужно angle + (prizeIdx*SEGMENT + SEGMENT/2) = -π/2 + 2πk
  const targetOffset = -Math.PI / 2 - (prizeIdx * SEGMENT + SEGMENT / 2);
  const fullRotations = (5 + Math.floor(Math.random() * 4)) * 2 * Math.PI;
  const targetAngle   = targetOffset + fullRotations;

  const startAngle  = currentAngle;
  const angleDelta  = targetAngle - (startAngle % (2 * Math.PI)) + Math.ceil((targetAngle - startAngle) / (2 * Math.PI)) * 2 * Math.PI;
  const duration    = 4500 + Math.random() * 1200;
  const startTime   = performance.now();

  // ease-out cubic
  function easeOut(t) { return 1 - Math.pow(1 - t, 3.5); }

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    currentAngle = startAngle + angleDelta * easeOut(t);

    drawWheel(canvas, currentAngle);
    drawPointer(canvas);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      // нормализуем угол
      currentAngle = currentAngle % (2 * Math.PI);
      onDone(PRIZES[prizeIdx], prizeIdx);
    }
  }

  requestAnimationFrame(frame);
}

// ── ЦЕНЫ: применить скидку ─────────────────────────────
function applyDiscountToPrices(discount) {
  const plans = [
    { el: document.querySelector('.plan-price-basic'),    base: BASE_PRICES.basic },
    { el: document.querySelector('.plan-price-standard'), base: BASE_PRICES.standard },
    { el: document.querySelector('.plan-price-premium'),  base: BASE_PRICES.premium },
  ];

  plans.forEach(({ el, base }) => {
    if (!el) return;
    const original = el.querySelector('.price-original');
    const current  = el.querySelector('.price-current');
    const badge    = el.querySelector('.price-discount-badge');
    if (!current) return;

    if (discount === 0) {
      if (original) original.style.display = 'none';
      if (badge)    badge.style.display    = 'none';
      current.innerHTML = `${base} ₽ <span>/ мес</span>`;
      return;
    }

    const newPrice = discount >= 1 ? 0 : Math.round(base * (1 - discount));

    if (original) {
      original.style.display = 'inline';
      original.textContent   = `${base} ₽`;
    }
    if (badge) {
      badge.style.display = 'inline-flex';
      badge.textContent   = discount >= 1 ? 'FREE' : `-${Math.round(discount * 100)}%`;
    }
    current.innerHTML = discount >= 1
      ? `<span class="price-free">БЕСПЛАТНО</span> <span>/ 1 мес</span>`
      : `${newPrice} ₽ <span>/ мес</span>`;
  });
}

function resetPrices() {
  applyDiscountToPrices(0);
}

// ── ПРИМЕНИТЬ ПРОМОКОД ─────────────────────────────────
function activatePromo(prize) {
  if (!prize || !prize.code) return;

  activePromo = { code: prize.code, discount: prize.discount, label: prize.label, ts: Date.now() };
  localStorage.setItem('cine_promo', JSON.stringify(activePromo));

  applyDiscountToPrices(prize.discount);
  updatePromoUI();
}

// ── UI ПРОМОКОДА ──────────────────────────────────────
function updatePromoUI() {
  const field  = document.getElementById('promo-input');
  const status = document.getElementById('promo-status');
  const applyBtn = document.getElementById('promo-apply-btn');

  if (!activePromo) {
    if (status) status.textContent = '';
    return;
  }

  if (field)  field.value = activePromo.code;
  if (status) {
    status.className = 'promo-status promo-active';
    status.innerHTML = `<i class="fas fa-check-circle"></i> Скидка ${Math.round(activePromo.discount * 100)}% применена ко всем тарифам!`;
  }
  if (applyBtn) {
    applyBtn.textContent = 'Сбросить';
    applyBtn.classList.add('applied');
  }
  applyDiscountToPrices(activePromo.discount);
}

function handlePromoApply() {
  const field    = document.getElementById('promo-input');
  const applyBtn = document.getElementById('promo-apply-btn');
  const status   = document.getElementById('promo-status');
  if (!field) return;

  const val = field.value.trim().toUpperCase();

  // сброс
  if (activePromo && applyBtn?.classList.contains('applied')) {
    activePromo = null;
    localStorage.removeItem('cine_promo');
    field.value = '';
    if (status) status.textContent = '';
    applyBtn.textContent = 'Применить';
    applyBtn.classList.remove('applied');
    resetPrices();
    return;
  }

  // поиск промокода
  const found = PRIZES.find(p => p.code === val);
  if (found && found.discount > 0) {
    activatePromo(found);
    showWheelToast(`Промокод ${val} активирован! ${found.label}`, 'success');
  } else {
    if (status) {
      status.className = 'promo-status promo-error';
      status.innerHTML = '<i class="fas fa-times-circle"></i> Промокод не найден или недействителен';
      setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    }
  }
}

// ── TOAST (локальный) ──────────────────────────────────
function showWheelToast(msg, type = 'info') {
  // используем тот же контейнер что и catalog.js если есть
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success:'fa-check-circle', info:'fa-circle-info', prize:'fa-trophy' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type]||'fa-circle-info'}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => toast.remove(), {once:true});
  }, 3500);
}

// ── РЕЗУЛЬТАТ ВРАЩЕНИЯ ────────────────────────────────
function showWinResult(prize) {
  const resultBox = document.getElementById('wheel-result');
  if (!resultBox) return;

  if (!prize.code) {
    resultBox.innerHTML = `
      <div class="wheel-result-inner wheel-result-lose">
        <div class="win-emoji">😔</div>
        <div class="win-label">Не повезло в этот раз</div>
        <div class="win-sub">Попробуй ещё раз через 24 часа</div>
      </div>`;
    resultBox.classList.add('visible');
    return;
  }

  resultBox.innerHTML = `
    <div class="wheel-result-inner wheel-result-win">
      <div class="win-emoji">${prize.emoji}</div>
      <div class="win-label">${prize.label}!</div>
      <div class="win-code">Промокод: <strong>${prize.code}</strong></div>
      <button class="btn-activate-promo" id="btn-activate-promo">
        <i class="fas fa-tag"></i> Активировать скидку
      </button>
    </div>`;
  resultBox.classList.add('visible');

  document.getElementById('btn-activate-promo')?.addEventListener('click', () => {
    activatePromo(prize);
    showWheelToast(`${prize.label} активирована! Промокод ${prize.code}`, 'prize');
    // скролл к ценам
    document.querySelector('.pricing-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // скопировать промокод в поле
    const field = document.getElementById('promo-input');
    if (field) field.value = prize.code;
  });
}

// ── COOLDOWN: 1 раз в 24ч ─────────────────────────────
function getLastSpin() { return +localStorage.getItem('cine_wheel_ts') || 0; }
function setLastSpin() { localStorage.setItem('cine_wheel_ts', Date.now()); }
function canSpin()     { return Date.now() - getLastSpin() > 24 * 60 * 60 * 1000; }

function updateSpinBtn(btn) {
  if (!btn) return;
  if (canSpin()) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-play"></i> Крутить!';
    btn.classList.remove('btn-spin-cooldown');
  } else {
    const remaining = 24 * 60 * 60 * 1000 - (Date.now() - getLastSpin());
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-clock"></i> Повторить через ${h}ч ${m}м`;
    btn.classList.add('btn-spin-cooldown');
  }
}

// ── ИНИЦИАЛИЗАЦИЯ ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // BB-8 тема (общий код)
  const toggle = document.querySelector('.bb8-toggle__checkbox');
  if (toggle) {
    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-theme'); toggle.checked = true; }
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('light-theme', toggle.checked);
      localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
    });
  }

  const canvas  = document.getElementById('wheel-canvas');
  if (!canvas) return;

  const spinBtn = document.getElementById('wheel-spin-btn');
  const openBtn = document.getElementById('wheel-open-btn');
  const modal   = document.getElementById('wheel-modal');
  const closeBtn= document.getElementById('wheel-modal-close');

  // первичный рендер
  drawWheel(canvas, 0);
  drawPointer(canvas);

  // открыть/закрыть модалку колеса
  openBtn?.addEventListener('click', () => {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    drawWheel(canvas, currentAngle);
    drawPointer(canvas);
    updateSpinBtn(spinBtn);
  });

  function closeWheelModal() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeWheelModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeWheelModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWheelModal(); });

  // кнопка «Крутить»
  spinBtn?.addEventListener('click', () => {
    if (!canSpin() || spinning) return;

    setLastSpin();
    updateSpinBtn(spinBtn);

    // скрыть старый результат
    const resultBox = document.getElementById('wheel-result');
    if (resultBox) resultBox.classList.remove('visible');

    spinWheel(canvas, (prize) => {
      wonPrize = prize;
      showWinResult(prize);
      showWheelToast(prize.code ? `Выпало: ${prize.label}!` : 'Не повезло в этот раз :(', prize.code ? 'prize' : 'info');
      // перерисовать pointer поверх
      drawPointer(canvas);
    });
  });

  // промокод
  document.getElementById('promo-apply-btn')?.addEventListener('click', handlePromoApply);
  document.getElementById('promo-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handlePromoApply();
  });

  // восстановить активный промо из localStorage
  if (activePromo) {
    updatePromoUI();
  }

  // [DEV] тайный сброс кулдауна — только для разработчика
  // в консоли браузера набери: __wheelReset()
  window.__wheelReset = () => {
    localStorage.removeItem('cine_wheel_ts');
    updateSpinBtn(spinBtn);
    console.log('%c✅ Колесо сброшено! Можно крутить.', 'color:#cca43b;font-size:14px;font-weight:bold;');
  };

  // таймер обновления кнопки
  setInterval(() => updateSpinBtn(spinBtn), 60000);
});
