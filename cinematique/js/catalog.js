const FILMS = [
  { id:1,  title:'Очень странные дела',    image:'images/strange_things.jpeg', year:2026, duration:'5 Сезонов',   genre:'Ужасы, Фантастика',   rating:8.9, type:'series',  isNew:true,  badges:[{text:'Final',cls:'badge-new'},{text:'Series',cls:'badge-series'}], description:'Финальный сезон культового сериала о Хокинсе. Группа подростков сталкивается с последней угрозой из Изнанки — и на этот раз ставки как никогда высоки. Мощная концовка одного из лучших сериалов эпохи стриминга.' },
  { id:2,  title:'Дюна: Часть вторая',     image:'images/dune2.webp',          year:2024, duration:'2ч 46м',      genre:'Фантастика, Эпик',    rating:8.9, type:'movie',   isNew:false, badges:[], description:'Пол Атрейдес объединяется с Чани и фрименами, чтобы отомстить заговорщикам, уничтожившим его семью. Дени Вильнёв создал эпический шедевр о власти, пророчестве и цене войны. IMAX-зрелище.' },
  { id:3,  title:'F1',                     image:'images/f1.jpg',              year:2025, duration:'2ч 15м',      genre:'Спорт, Драма',        rating:8.5, type:'movie',   isNew:true,  badges:[{text:'New',cls:'badge-new'}], description:'Легенда Формулы-1 возвращается на трассу, чтобы наставить молодого напарника. Режиссёр "Топ Ган: Мэверик" Джозеф Косински снял самый зрелищный спортивный фильм года.' },
  { id:4,  title:'Фоллаут',                image:'images/i.webp',              year:2024, duration:'2 Сезона',    genre:'Постапокалипсис',     rating:8.7, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Жительница убежища выходит на поверхность и попадает в жестокий постъядерный мир. Amazon создал один из лучших адаптационных сериалов в истории — с юмором, экшном и сердцем.' },
  { id:5,  title:'Оппенгеймер',            image:'images/oppenheimer.webp',    year:2023, duration:'3ч 00м',      genre:'Биография, Драма',    rating:9.4, type:'movie',   isNew:false, badges:[{text:'4K',cls:'badge-res'}], description:'История создателя атомной бомбы — триумф и моральная трагедия человека, изменившего мир. Кристофер Нолан снял свой самый личный и философский фильм. Три «Оскара».' },
  { id:6,  title:'Сёгун',                  image:'images/shogun.webp',         year:2024, duration:'Мини-сериал', genre:'Исторический',        rating:9.2, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Европейский мореплаватель оказывается в средневековой Японии в разгар политических интриг. 18 номинаций на «Эмми», победа в 8 категориях.' },
  { id:7,  title:'Падение империи',        image:'images/civilwar.webp',       year:2024, duration:'1ч 49м',      genre:'Военный, Триллер',    rating:7.8, type:'movie',   isNew:false, badges:[], description:'Журналисты пересекают разрывающуюся Америку, чтобы добраться до Белого дома. Провокационный политический триллер о хрупкости демократии и цене правды.' },
  { id:8,  title:'Медведь',               image:'images/bear.webp',            year:2023, duration:'4 Сезона',    genre:'Драмеди',             rating:8.8, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Шеф-повар мирового уровня возвращается в Чикаго, чтобы спасти семейный ресторан. Один из самых напряжённых и эмоциональных сериалов современности.' },
  { id:9,  title:'Фуриоса: Сага',         image:'images/furiosa.webp',         year:2024, duration:'2ч 28м',      genre:'Боевик, Фантастика',  rating:8.0, type:'movie',   isNew:false, badges:[], description:'Происхождение одного из самых культовых персонажей современного кино. Джордж Миллер рассказывает о детстве и становлении Фуриосы в пустошах Безумного Макса.' },
  { id:10, title:'Аватар: Огонь и пепел', image:'images/avatar.webp',          year:2025, duration:'3ч 10м',      genre:'Фантастика',          rating:9.1, type:'movie',   isNew:true,  badges:[{text:'2025',cls:'badge-new'}], description:'Третья глава саги о Пандоре. Семья Салли сталкивается с новой угрозой — огненным народом. Джеймс Кэмерон снова переписывает правила визуальных эффектов.' },
  { id:11, title:'Кунг-фу Панда 4',       image:'images/panda4.webp',          year:2024, duration:'1ч 34м',      genre:'Мультфильм',          rating:7.8, type:'cartoon', isNew:false, badges:[], description:'По возвращается с новым приключением, где ему предстоит найти себе преемника. Яркий мультфильм для всей семьи с отличным юмором.' },
  { id:12, title:'Годзилла и Конг',       image:'images/gk.webp',              year:2024, duration:'1ч 55м',      genre:'Фантастика, Боевик',  rating:7.0, type:'movie',   isNew:false, badges:[], description:'Годзилла и Конг объединяются против нового колоссального врага из Полой Земли. Максимум монстр-экшна для фанатов серии.' },
  { id:13, title:'Каскадеры',             image:'images/duble.jpg',            year:2024, duration:'2ч 06м',      genre:'Комедия, Боевик',     rating:7.6, type:'movie',   isNew:false, badges:[], description:'Каскадёр вынужден расследовать исчезновение кинозвезды прямо во время съёмок. Дэвид Литч создал любовное письмо людям кино — смешное, зрелищное и трогательное.' },
  { id:14, title:'Дэдпул и Росомаха',     image:'images/dedpool&wolverine.webp',year:2024,duration:'2ч 10м',      genre:'Комикс, Экшн',        rating:8.2, type:'movie',   isNew:false, badges:[], description:'Дэдпул врывается в киновселенную Marvel вместе с Росомахой. Самый кассовый фильм с рейтингом R в истории — безумный, четвёртостенный и невероятно смешной.' },
  { id:15, title:'Одни из нас',           image:'images/thelastofus.jpg',      year:2025, duration:'2 Сезона',    genre:'Драма, Ужасы',        rating:9.0, type:'series',  isNew:true,  badges:[{text:'S2',cls:'badge-new'},{text:'Series',cls:'badge-series'}], description:'Второй сезон основан на событиях Part II. История Элли продолжается с ещё большей болью и глубиной. Белла Рэмзи и Кэти Янг — два открытия года.' },
  { id:16, title:'Дом Дракона',           image:'images/dragon.webp',          year:2024, duration:'2 Сезона',    genre:'Фэнтези',             rating:8.6, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Гражданская война в доме Таргариенов. Танец Дракона — война за Железный трон. Лучший приквел «Игры Престолов» из возможных.' },
  { id:17, title:'Задача 3-х тел',        image:'images/zadacha.jpg',          year:2024, duration:'1 Сезон',     genre:'Sci-Fi',              rating:7.9, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Адаптация трилогии Лю Цысиня от создателей «Игры Престолов». Физик обнаруживает, что человечество получило послание из космоса — и оно не несёт добра.' },
  { id:18, title:'Пацаны',                image:'images/boys.webp',            year:2024, duration:'4 Сезона',    genre:'Экшн, Сатира',        rating:8.7, type:'series',  isNew:false, badges:[{text:'Series',cls:'badge-series'}], description:'Группа простых людей противостоит продажным супергероям-корпоратам. Самая злая, смешная и актуальная сатира на супергеройское кино и современное общество.' },
  { id:19, title:'Барби',                 image:'images/barbie.webp',          year:2023, duration:'1ч 54м',      genre:'Комедия',             rating:7.9, type:'movie',   isNew:false, badges:[], description:'Барби и Кен отправляются в реальный мир. Грета Гервиг создала постмодернистский шедевр, который смешит, трогает и заставляет думать одновременно.' },
  { id:20, title:'Головоломка 2',         image:'images/insideout2.webp',      year:2024, duration:'1ч 40м',      genre:'Мультфильм',          rating:8.4, type:'cartoon', isNew:false, badges:[], description:'Райли 13 лет — и к старым эмоциям присоединяется тревога. Pixar на пике формы: глубокий, смешной и точный фильм о подростковом взрослении.' },
  { id:21, title:'Человек-паук: Паутина', image:'images/sm.webp',             year:2023, duration:'2ч 20м',      genre:'Анимация',            rating:9.0, type:'cartoon', isNew:false, badges:[], description:'Майлз Моралес путешествует по мультивселенной и встречает армию Людей-пауков. Sony переизобрела анимационное кино — каждый кадр как произведение искусства.' },
];

let wishlist = JSON.parse(localStorage.getItem('cine_wishlist') || '{}');
let recentlyViewed = JSON.parse(localStorage.getItem('cine_recent') || '[]');
let activeFilter = 'all';
let activeSortKey = 'default';
let currentModalId = null;
let searchQuery = '';

function saveWishlist() { localStorage.setItem('cine_wishlist', JSON.stringify(wishlist)); }
function saveRecent() { localStorage.setItem('cine_recent', JSON.stringify(recentlyViewed)); }

function pluralFilm(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'фильм';
  if ([2,3,4].includes(n % 10) && ![12,13,14].includes(n % 100)) return 'фильма';
  return 'фильмов';

}

// toast уведомления
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { info:'fa-circle-info', success:'fa-heart', remove:'fa-heart-broken', dice:'fa-dice' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || 'fa-circle-info'}"></i><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => toast.remove(), { once:true });
  }, 2800);
}

function showSkeletons(count = 8) {
  const grid = document.getElementById('js-films-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: count }, () => `
    <article class="film-card skeleton-card">
      <div class="skeleton-poster"></div>
      <div class="card-info">
        <div class="skeleton-line skeleton-line-sm"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-line-sm"></div>
      </div>
    </article>`).join('');
}

function renderCard(film) {
  const inW = !!wishlist[film.id];
  const badgesHTML = [
    `<span class="badge badge-rating">${film.rating}</span>`,
    ...film.badges.map(b => `<span class="badge ${b.cls}">${b.text}</span>`)
  ].join('');
  return `
    <article class="film-card js-card card-hidden" data-id="${film.id}">
      <div class="card-poster">
        <img src="${film.image}" alt="${film.title}" class="card-img js-open-modal" data-id="${film.id}" loading="lazy">
        <div class="card-badges">${badgesHTML}</div>
        <button class="wishlist-btn${inW?' active':''}" data-id="${film.id}">
          <i class="fa${inW?'s':'r'} fa-heart"></i>
        </button>
      </div>
      <div class="card-info">
        <div>
          <div class="card-meta"><span>${film.year}</span><span>${film.duration}</span></div>
          <h3 class="card-title js-open-modal" data-id="${film.id}">${film.title}</h3>
          <div class="card-genre">${film.genre}</div>
        </div>
      </div>
    </article>`;
}

function renderCatalog(films) {
  const grid = document.getElementById('js-films-grid');
  if (!grid) return;
  if (!films.length) {
    grid.innerHTML = '<div class="empty-msg"><i class="fas fa-ghost"></i><p>Ничего не найдено :(</p></div>';
    renderCounter();
    return;
  }
  grid.innerHTML = films.map(renderCard).join('');
  setTimeout(() => {
    const cards = grid.querySelectorAll('.js-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('card-hidden'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    cards.forEach(c => observer.observe(c));
  }, 10);
  renderCounter();
}

function renderCounter() {
  const el = document.getElementById('films-count');
  if (!el) return;
  const grid = document.getElementById('js-films-grid');
  const visible = grid?.querySelectorAll('.film-card:not(.skeleton-card)').length || 0;
  el.textContent = `${visible} ${pluralFilm(visible)}`;
}

function getFilteredSortedFilms() {
  let arr = activeFilter === 'all' ? FILMS : FILMS.filter(f => f.type === activeFilter);
  if (activeSortKey === 'rating') arr.sort((a, b) => b.rating - a.rating);
  else if (activeSortKey === 'year') arr.sort((a, b) => b.year - a.year);
  else if (activeSortKey === 'title') arr.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  return arr;
}

function applyFilter(f) {
  activeFilter = f;
  searchQuery = '';
  const input = document.querySelector('.poda-input');
  if (input) input.value = '';
  renderCatalog(getFilteredSortedFilms());
  document.querySelectorAll('.js-filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === f));
}

function toggleWishlist(id) {
  const film = FILMS.find(f => f.id == id);
  if (!film) return;
  if (wishlist[id]) {
    delete wishlist[id];
    showToast(`«${film.title}» удалён из избранного`, 'remove');
  } else {
    wishlist[id] = { id: film.id, title: film.title, image: film.image };
    showToast(`«${film.title}» добавлен в избранное`, 'success');
  }
  saveWishlist();
  renderCatalog(searchQuery ? FILMS.filter(f => f.title.toLowerCase().includes(searchQuery) || f.genre.toLowerCase().includes(searchQuery)) : getFilteredSortedFilms());
}

function addToRecent(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x => x != id)].slice(0, 6);
  saveRecent();
  renderRecent();
}

function renderRecent() {
  const list = document.getElementById('recently-list');
  if (!list) return;
  const items = recentlyViewed.map(id => {
    const f = FILMS.find(x => x.id == id);
    return f ? `<div class="recent-item js-open-modal" data-id="${f.id}"><img src="${f.image}" alt="${f.title}"><span>${f.title}</span></div>` : '';
  }).join('');
  list.innerHTML = items || '<div class="recent-empty">История пуста</div>';
}

function openFilmModal(id) {
  const film = FILMS.find(f => f.id == id);
  if (!film) return;
  currentModalId = id;
  addToRecent(id);
  const modal = document.getElementById('film-modal');
  const inW = !!wishlist[id];
  const wBtn = document.getElementById('modal-wishlist-btn');
  if (wBtn) {
    wBtn.dataset.id = id;
    wBtn.innerHTML = `<i class="fa${inW?'s':'r'} fa-heart"></i> ${inW ? 'В избранном' : 'В избранное'}`;
    wBtn.classList.toggle('active', inW);
  }
  const badgesHTML = [
    `<span class="badge badge-rating">${film.rating}</span>`,
    ...film.badges.map(b => `<span class="badge ${b.cls}">${b.text}</span>`)
  ].join('');
  document.getElementById('modal-img').innerHTML = `<img src="${film.image}" alt="${film.title}">`;
  document.getElementById('modal-badges').innerHTML = badgesHTML;
  document.getElementById('modal-title').textContent = film.title;
  document.getElementById('modal-meta').innerHTML = `<span>${film.year}</span> • <span>${film.duration}</span> • <span>${film.genre}</span>`;
  document.getElementById('modal-desc').textContent = film.description;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFilmModal() {
  const modal = document.getElementById('film-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentModalId = null;
}

function navigateModal(dir) {
  if (!currentModalId) return;
  const idx = FILMS.findIndex(f => f.id == currentModalId);
  if (idx === -1) return;
  const newIdx = (idx + dir + FILMS.length) % FILMS.length;
  closeFilmModal();
  setTimeout(() => openFilmModal(FILMS[newIdx].id), 400);
}

function openWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  const container = document.getElementById('wishlist-items');
  const ids = Object.keys(wishlist);
  if (!ids.length) {
    container.innerHTML = '<div class="wl-empty"><i class="far fa-heart"></i><p>Ваше избранное пока пусто</p></div>';
  } else {
    const html = ids.map(id => {
      const f = FILMS.find(x => x.id == id);
      if (!f) return '';
      return `
        <div class="wl-card">
          <img src="${f.image}" alt="${f.title}" class="js-open-modal" data-id="${f.id}">
          <div class="wl-info">
            <h4 class="js-open-modal" data-id="${f.id}">${f.title}</h4>
            <p>${f.year} • ${f.genre}</p>
          </div>
          <button class="wl-remove" data-id="${f.id}"><i class="fas fa-times"></i></button>
        </div>`;
    }).join('');
    container.innerHTML = html;
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function openRandomFilm() {
  const film = FILMS[Math.floor(Math.random() * FILMS.length)];
  showToast(`Ваша судьба: «${film.title}»`, 'dice');
  setTimeout(() => openFilmModal(film.id), 400);
}

function applySearch(query) {
  searchQuery = query.toLowerCase().trim();
  if (!searchQuery) { renderCatalog(getFilteredSortedFilms()); return; }
  renderCatalog(FILMS.filter(f =>
    f.title.toLowerCase().includes(searchQuery) ||
    f.genre.toLowerCase().includes(searchQuery)
  ));
}

function initBackToTop() {
  const btn = document.getElementById('back-to-top-index');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

// инит
document.addEventListener('DOMContentLoaded', () => {
  // тема
  const toggle = document.querySelector('.bb8-toggle__checkbox');
  if (toggle) {
    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-theme'); toggle.checked = true; }
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('light-theme', toggle.checked);
      localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
    });
  }

  const grid = document.getElementById('js-films-grid');
  if (!grid) return;

  showSkeletons(8);
  setTimeout(() => {
    renderCatalog(getFilteredSortedFilms());
    renderCounter();
    renderRecent();
  }, 350);

  document.querySelectorAll('.js-filter-btn').forEach(btn =>
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter))
  );

  document.getElementById('sort-select')?.addEventListener('change', e => {
    activeSortKey = e.target.value;
    if (searchQuery) applySearch(searchQuery); else renderCatalog(getFilteredSortedFilms());
  });

  document.querySelector('.poda-input')?.addEventListener('input', e => applySearch(e.target.value));

  grid.addEventListener('click', e => {
    const trigger = e.target.closest('.js-open-modal');
    if (trigger) { openFilmModal(trigger.dataset.id); return; }
    const wBtn = e.target.closest('.wishlist-btn');
    if (wBtn) { toggleWishlist(wBtn.dataset.id); return; }
  });

  document.getElementById('recently-list')?.addEventListener('click', e => {
    const item = e.target.closest('.js-open-modal');
    if (item) openFilmModal(item.dataset.id);
  });

  document.getElementById('wishlist-toggle-btn')?.addEventListener('click', openWishlistModal);
  document.getElementById('btn-lucky')?.addEventListener('click', openRandomFilm);
  document.getElementById('modal-wishlist-btn')?.addEventListener('click', e => toggleWishlist(e.currentTarget.dataset.id));
  document.getElementById('modal-prev')?.addEventListener('click', () => navigateModal(-1));
  document.getElementById('modal-next')?.addEventListener('click', () => navigateModal(1));
  document.getElementById('film-modal-close')?.addEventListener('click', closeFilmModal);
  document.getElementById('film-modal')?.addEventListener('click', e => { if (e.target.id === 'film-modal') closeFilmModal(); });
  document.getElementById('wishlist-modal-close')?.addEventListener('click', closeWishlistModal);
  document.getElementById('wishlist-modal')?.addEventListener('click', e => { if (e.target.id === 'wishlist-modal') closeWishlistModal(); });

  document.getElementById('wishlist-items')?.addEventListener('click', e => {
    const r = e.target.closest('.wl-remove');
    if (r) toggleWishlist(r.dataset.id);
  });

  document.addEventListener('keydown', e => {
    const isOpen = document.getElementById('film-modal')?.classList.contains('open');
    if (isOpen && e.key === 'ArrowRight') navigateModal(1);
    if (isOpen && e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'Escape') { closeFilmModal(); closeWishlistModal(); }
  });

  initBackToTop();
});
