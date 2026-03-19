document.addEventListener('DOMContentLoaded', () => {
  // тема
  const toggle = document.querySelector('.bb8-toggle__checkbox');
  if (toggle) {
    const body = document.body;
    if (localStorage.getItem('theme') === 'light') {
      body.classList.add('light-theme');
      toggle.checked = true;
    }
    toggle.addEventListener('change', () => {
      body.classList.toggle('light-theme', toggle.checked);
      localStorage.setItem('theme', toggle.checked ? 'light' : 'dark');
    });
  }

  // прогресс чтения
  const progressBar = document.getElementById('reading-progress');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // кнопка наверх
  const backTopBtn = document.getElementById('back-to-top');

  function updateBackTop() {
    if (!backTopBtn) return;
    backTopBtn.classList.toggle('visible', window.scrollY > 300);
  }

  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateBackTop();
  }, { passive: true });

  updateProgress();
  updateBackTop();
});
