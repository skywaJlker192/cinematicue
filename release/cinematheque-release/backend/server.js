/**
 * CINEMATHEQUE — Backend Server
 * Node.js + Express + JSON-файл (без компиляции, работает на любом Windows)
 *
 * Запуск:
 *   cd backend
 *   npm install
 *   node server.js
 *
 *  → сервер: http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// ─── JSON "база данных" ───────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return null;
  }
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}
function nextId(arr) {
  return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1;
}

// ─── Seed данные ─────────────────────────────────────────────
function buildSeed() {
  const cinemas = [
    {
      id: 1,
      name: 'Каро 11 Охта',
      address: 'Якорная ул., 5А',
      city: 'Санкт-Петербург',
      metro: 'Ладожская',
      rating: 4.7,
      description: '11 залов, Dolby Atmos, премьеры мирового кино.'
    },
    {
      id: 2,
      name: 'Формула Кино Галерея',
      address: 'Лиговский пр., 30А',
      city: 'Санкт-Петербург',
      metro: 'Площадь Восстания',
      rating: 4.5,
      description: 'Современный кинотеатр в ТРЦ Галерея, 10 залов.'
    },
    {
      id: 3,
      name: 'Мираж Синема ТРК Питерлэнд',
      address: 'Приморский пр., 72',
      city: 'Санкт-Петербург',
      metro: 'Беговая',
      rating: 4.6,
      description: 'IMAX, VIP-залы с кожаными креслами, панорамный экран.'
    },
    {
      id: 4,
      name: 'Синема Парк Гранд Каньон',
      address: 'пр. Энгельса, 154',
      city: 'Санкт-Петербург',
      metro: 'Проспект Просвещения',
      rating: 4.4,
      description: '14 залов, IMAX, 4DX, детская комната.'
    },
    {
      id: 5,
      name: 'Аврора',
      address: 'Невский пр., 60',
      city: 'Санкт-Петербург',
      metro: 'Маяковская',
      rating: 4.8,
      description: 'Исторический кинотеатр в центре, арт-хаус и премьеры.'
    }
  ];

  const films = [
    {
      title: 'Дюна: Часть вторая',
      genre: 'Фантастика',
      poster: 'images/dune2.webp',
      duration: '2ч 46м'
    },
    {
      title: 'F1',
      genre: 'Спорт, Драма',
      poster: 'images/f1.jpg',
      duration: '2ч 15м'
    },
    {
      title: 'Оппенгеймер',
      genre: 'Биография',
      poster: 'images/oppenheimer.webp',
      duration: '3ч 00м'
    },
    {
      title: 'Дэдпул и Росомаха',
      genre: 'Экшн',
      poster: 'images/dedpool&wolverine.webp',
      duration: '2ч 10м'
    },
    {
      title: 'Головоломка 2',
      genre: 'Мультфильм',
      poster: 'images/insideout2.webp',
      duration: '1ч 40м'
    }
  ];

  const halls = [];
  const sessions = [];
  const seats = [];
  let hallId = 1,
    sessionId = 1,
    seatId = 1;

  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  const times = ['10:00', '12:30', '15:00', '17:30', '20:00', '22:30'];
  const formats = ['2D', '3D', 'IMAX', 'Dolby'];
  const langs = ['RU', 'RU Sub'];

  cinemas.forEach((c) => {
    const hallDefs = [
      { name: 'Зал 1 — IMAX', rows: 12, cols: 14 },
      { name: 'Зал 2 — Комфорт', rows: 10, cols: 12 }
    ];

    // случайный набор от 3 до 5 фильмов для каждого кинотеатра
    const shuffledFilms = [...films].sort(() => Math.random() - 0.5);
    const filmsForThisCinema = shuffledFilms.slice(
      0,
      3 + Math.floor(Math.random() * 3)
    ); // 3..5

    hallDefs.forEach((hd) => {
      const hall = {
        id: hallId++,
        cinema_id: c.id,
        name: hd.name,
        rows: hd.rows,
        cols: hd.cols
      };
      halls.push(hall);

      filmsForThisCinema.forEach((film) => {
        dates.slice(0, 4).forEach((date) => {
          const sessionsCount = 1 + Math.floor(Math.random() * 2); // 1 или 2 сеанса
          for (let sc = 0; sc < sessionsCount; sc++) {
            const t = times[Math.floor(Math.random() * times.length)];
            const fmt = formats[Math.floor(Math.random() * formats.length)];
            const lang = langs[Math.floor(Math.random() * langs.length)];
            const stdP =
              350 +
              Math.floor(Math.random() * 5) * 50 +
              Math.floor(Math.random() * 3 - 1) * 50;
            const sid = sessionId++;
            sessions.push({
              id: sid,
              cinema_id: c.id,
              hall_id: hall.id,
              film_title: film.title,
              film_genre: film.genre,
              film_poster: film.poster,
              film_duration: film.duration,
              date,
              time_start: t,
              format: fmt,
              language: lang,
              price_standard: stdP,
              price_comfort: stdP + 300,
              price_vip: stdP + 750,
              hall_name: hall.name,
              rows: hall.rows,
              cols: hall.cols
            });

            for (let r = 1; r <= hall.rows; r++) {
              for (let col = 1; col <= hall.cols; col++) {
                let cat = 'standard';
                if (r <= 2) cat = 'vip';
                else if (r >= hall.rows - 1) cat = 'comfort';
                seats.push({
                  id: seatId++,
                  session_id: sid,
                  hall_id: hall.id,
                  row_num: r,
                  seat_num: col,
                  category: cat,
                  status: Math.random() < 0.22 ? 'taken' : 'free'
                });
              }
            }
          }
        });
      });
    });
  });

  return {
    cinemas,
    halls,
    sessions,
    seats,
    orders: [],
    tickets: [],
    users: []
  };
}

function getDB() {
  let db = readDB();
  if (!db) {
    db = buildSeed();
    writeDB(db);
    console.log('✅ База создана');
  }
  return db;
}

// ─── API ──────────────────────────────────────────────────────

// GET /api/cinemas
app.get('/api/cinemas', (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  const result = db.cinemas.map((c) => ({
    ...c,
    session_count: db.sessions.filter(
      (s) => s.cinema_id === c.id && s.date >= today
    ).length
  }));
  result.sort((a, b) => b.rating - a.rating);
  res.json({ ok: true, data: result });
});

// GET /api/cinemas/:id
app.get('/api/cinemas/:id', (req, res) => {
  const db = getDB();
  const c = db.cinemas.find((x) => x.id === +req.params.id);
  if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data: c });
});

// GET /api/cinemas/:id/sessions?date=YYYY-MM-DD
app.get('/api/cinemas/:id/sessions', (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  let list = db.sessions.filter((s) => s.cinema_id === +req.params.id);
  if (req.query.date) list = list.filter((s) => s.date === req.query.date);
  else list = list.filter((s) => s.date >= today);
  list.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.time_start.localeCompare(b.time_start)
  );
  res.json({ ok: true, data: list });
});

// GET /api/sessions/:id/seats
app.get('/api/sessions/:id/seats', (req, res) => {
  const db = getDB();
  const sid = +req.params.id;
  const session = db.sessions.find((s) => s.id === sid);
  if (!session) return res.status(404).json({ ok: false, error: 'Not found' });
  const seats = db.seats
    .filter((s) => s.session_id === sid)
    .sort((a, b) => a.row_num - b.row_num || a.seat_num - b.seat_num);
  res.json({ ok: true, session, data: seats });
});

// GET /api/available-dates/:cinemaId
app.get('/api/available-dates/:cinemaId', (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  const dates = [
    ...new Set(
      db.sessions
        .filter((s) => s.cinema_id === +req.params.cinemaId && s.date >= today)
        .map((s) => s.date)
    )
  ]
    .sort()
    .slice(0, 14);
  res.json({ ok: true, data: dates });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  res.json({
    ok: true,
    data: {
      cinemas: db.cinemas.length,
      sessions: db.sessions.filter((s) => s.date >= today).length,
      orders: db.orders.length,
      paid: db.orders.filter((o) => o.status === 'paid').length
    }
  });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { session_id, seat_ids, user_token } = req.body;
  if (!session_id || !seat_ids?.length || !user_token)
    return res.status(400).json({ ok: false, error: 'Missing fields' });

  const db = getDB();
  const session = db.sessions.find((s) => s.id === +session_id);
  if (!session)
    return res.status(404).json({ ok: false, error: 'Session not found' });

  const selectedSeats = db.seats.filter(
    (s) => seat_ids.includes(s.id) && s.session_id === +session_id
  );
  if (selectedSeats.length !== seat_ids.length)
    return res.status(400).json({ ok: false, error: 'Some seats not found' });

  const taken = selectedSeats.filter((s) => s.status !== 'free');
  if (taken.length)
    return res
      .status(409)
      .json({
        ok: false,
        error: 'Seats already taken',
        taken: taken.map((s) => s.id)
      });

  const priceMap = {
    standard: session.price_standard,
    comfort: session.price_comfort,
    vip: session.price_vip
  };
  const total = selectedSeats.reduce(
    (sum, s) => sum + (priceMap[s.category] || session.price_standard),
    0
  );

  const orderId = nextId(db.orders);
  const order = {
    id: orderId,
    session_id: +session_id,
    user_token,
    status: 'pending',
    total_price: total,
    created_at: new Date().toISOString(),
    paid_at: null,
    cancelled_at: null
  };
  db.orders.push(order);

  const newTickets = selectedSeats.map((seat) => {
    const price = priceMap[seat.category] || session.price_standard;
    const ticket = {
      id: nextId(db.tickets),
      order_id: orderId,
      session_id: +session_id,
      seat_id: seat.id,
      category: seat.category,
      price,
      barcode: `CT-${orderId}-${seat.id}`,
      row_num: seat.row_num,
      seat_num: seat.seat_num,
      created_at: new Date().toISOString()
    };
    db.tickets.push(ticket);
    // mark seat selected
    seat.status = 'selected';
    return ticket;
  });

  writeDB(db);
  res.json({ ok: true, data: { order, tickets: newTickets, session } });
});

// PUT /api/orders/:id/pay
app.put('/api/orders/:id/pay', (req, res) => {
  const db = getDB();
  const order = db.orders.find((o) => o.id === +req.params.id);
  if (!order) return res.status(404).json({ ok: false, error: 'Not found' });
  if (order.status !== 'pending')
    return res
      .status(400)
      .json({ ok: false, error: `Cannot pay: ${order.status}` });

  order.status = 'paid';
  order.paid_at = new Date().toISOString();

  const tickets = db.tickets.filter((t) => t.order_id === order.id);
  tickets.forEach((t) => {
    const seat = db.seats.find((s) => s.id === t.seat_id);
    if (seat) seat.status = 'taken';
  });

  writeDB(db);
  res.json({ ok: true, data: { order, tickets } });
});

// PUT /api/orders/:id/cancel
app.put('/api/orders/:id/cancel', (req, res) => {
  const db = getDB();
  const order = db.orders.find((o) => o.id === +req.params.id);
  if (!order) return res.status(404).json({ ok: false, error: 'Not found' });
  if (order.status === 'cancelled')
    return res.status(400).json({ ok: false, error: 'Already cancelled' });

  order.status = 'cancelled';
  order.cancelled_at = new Date().toISOString();

  db.tickets
    .filter((t) => t.order_id === order.id)
    .forEach((t) => {
      const seat = db.seats.find((s) => s.id === t.seat_id);
      if (seat) seat.status = 'free';
    });

  writeDB(db);
  res.json({ ok: true, data: order });
});

// GET /api/orders?user_token=xxx
app.get('/api/orders', (req, res) => {
  const { user_token } = req.query;
  if (!user_token)
    return res.status(400).json({ ok: false, error: 'user_token required' });

  const db = getDB();
  const orders = db.orders.filter((o) => o.user_token === user_token);

  const result = orders
    .map((order) => {
      const session = db.sessions.find((s) => s.id === order.session_id) || {};
      const cinema = db.cinemas.find((c) => c.id === session.cinema_id) || {};
      const tickets = db.tickets.filter((t) => t.order_id === order.id);
      return {
        ...order,
        film_title: session.film_title || '',
        date: session.date || '',
        time_start: session.time_start || '',
        format: session.format || '',
        cinema_name: cinema.name || '',
        cinema_address: cinema.address || '',
        tickets
      };
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  res.json({ ok: true, data: result });
});

// ─── Start ────────────────────────────────────────────────────
getDB(); // инициализация при старте
// ==================== АККАУНТЫ ====================

// Регистрация
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ ok: false, error: 'Email и пароль обязательны' });

    const db = getDB();
    if (db.users.find((u) => u.email === email)) {
      return res
        .status(409)
        .json({ ok: false, error: 'Пользователь уже существует' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: nextId(db.users),
      email,
      password: hashed,
      subscription: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = 'usr_' + user.id + '_' + Math.random().toString(36).slice(2);
    res.json({
      ok: true,
      token,
      user: { id: user.id, email, subscription: false }
    });
  } catch {
    res.status(500).json({ ok: false, error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find((u) => u.email === email);
    if (!user)
      return res
        .status(401)
        .json({ ok: false, error: 'Неверный email или пароль' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ ok: false, error: 'Неверный email или пароль' });

    const token = 'usr_' + user.id + '_' + Math.random().toString(36).slice(2);
    res.json({
      ok: true,
      token,
      user: { id: user.id, email, subscription: user.subscription }
    });
  } catch {
    res.status(500).json({ ok: false, error: 'Ошибка сервера' });
  }
});

// Получение профиля
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, error: 'Токен не предоставлен' });
  const token = authHeader.replace('Bearer ', '');
  const match = token.match(/^usr_(\d+)_/);
  if (!match)
    return res.status(401).json({ ok: false, error: 'Неверный токен' });

  const userId = parseInt(match[1]);
  const db = getDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user)
    return res.status(404).json({ ok: false, error: 'Пользователь не найден' });

  res.json({
    ok: true,
    user: { id: user.id, email: user.email, subscription: user.subscription }
  });
});

// Обновление подписки
app.put('/api/profile/subscription', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ ok: false, error: 'Требуется авторизация' });
  const token = authHeader.replace('Bearer ', '');
  const match = token.match(/^usr_(\d+)_/);
  if (!match)
    return res.status(401).json({ ok: false, error: 'Неверный токен' });

  const userId = parseInt(match[1]);
  const db = getDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user)
    return res.status(404).json({ ok: false, error: 'Пользователь не найден' });

  user.subscription = req.body.subscription === true;
  writeDB(db);
  res.json({ ok: true, subscription: user.subscription });
});

// ==================== АККАУНТЫ ====================
const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ ok: false, error: 'Email и пароль обязательны' });

    const db = getDB();
    if (db.users.find((u) => u.email === email)) {
      return res
        .status(409)
        .json({ ok: false, error: 'Пользователь уже существует' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: nextId(db.users),
      email,
      password: hashed,
      subscription: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = 'usr_' + user.id + '_' + Math.random().toString(36).slice(2);
    res.json({
      ok: true,
      token,
      user: { id: user.id, email, subscription: false }
    });
  } catch {
    res.status(500).json({ ok: false, error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();
    const user = db.users.find((u) => u.email === email);
    if (!user)
      return res
        .status(401)
        .json({ ok: false, error: 'Неверный email или пароль' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ ok: false, error: 'Неверный email или пароль' });

    const token = 'usr_' + user.id + '_' + Math.random().toString(36).slice(2);
    res.json({
      ok: true,
      token,
      user: { id: user.id, email, subscription: user.subscription }
    });
  } catch {
    res.status(500).json({ ok: false, error: 'Ошибка сервера' });
  }
});
// Временный тестовый аккаунт для продолжения практики
(function ensureTestUser() {
  const db = getDB();
  if (!db.users.find((u) => u.email === 'test@mail.ru')) {
    const bcrypt = require('bcrypt');
    const hashed = bcrypt.hashSync('123456', 10);
    db.users.push({
      id: nextId(db.users),
      email: 'test@mail.ru',
      password: hashed,
      subscription: false,
      createdAt: new Date().toISOString()
    });
    writeDB(db);
    console.log('✅ Добавлен тестовый пользователь test@mail.ru / 123456');
  }
})();
app.listen(PORT, () => {
  console.log(`\n🎬  CINEMATHEQUE Backend запущен`);
  console.log(`    http://localhost:${PORT}\n`);
  console.log(`    Открой в браузере: http://localhost:${PORT}/index.html`);
  console.log(`    API:              http://localhost:${PORT}/api/cinemas\n`);
});
