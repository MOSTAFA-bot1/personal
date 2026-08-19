document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  const themeToggle = document.querySelector('.input');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.documentElement.dataset.theme = 'light';
  }

  if (themeToggle) {
    themeToggle.checked = document.documentElement.dataset.theme === 'light';

    themeToggle.addEventListener('change', () => {
      const isLight = themeToggle.checked;
      document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
