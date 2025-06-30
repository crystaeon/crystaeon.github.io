const themeBtn = document.getElementById('theme-toggle');
const sun = document.querySelector('.sun-icon');
const moon = document.querySelector('.moon-icon');
let theme = localStorage.getItem('theme') || 'light';

function setTheme(t) {
  theme = t;
  document.documentElement.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
  localStorage.setItem('theme', t);
  sun.style.display = t === 'dark' ? 'none' : 'block';
  moon.style.display = t === 'dark' ? 'block' : 'none';
}
setTheme(theme);
if (themeBtn) themeBtn.onclick = () => setTheme(theme === 'light' ? 'dark' : 'light'); 