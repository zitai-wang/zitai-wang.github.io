const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const languageToggle = document.querySelector('#language-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const backToTop = document.querySelector('.back-to-top');

const storedTheme = localStorage.getItem('ziyi-theme');
if (storedTheme === 'dark' || storedTheme === 'light') root.dataset.theme = storedTheme;

function setTheme(theme) {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111820' : '#ffffff');
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  localStorage.setItem('ziyi-theme', theme);
}

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

let language = localStorage.getItem('ziyi-language') === 'zh' ? 'zh' : 'en';
function setLanguage(nextLanguage) {
  language = nextLanguage;
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-lang]').forEach((element) => {
    element.hidden = element.dataset.lang !== language;
  });
  if (languageToggle) languageToggle.textContent = language === 'zh' ? 'EN' : '中文';
  localStorage.setItem('ziyi-language', language);
}

setLanguage(language);
languageToggle?.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));

menuToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const navLinks = [...document.querySelectorAll('#site-nav a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
}, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .2, .5] });

sections.forEach((section) => observer.observe(section));

function updateBackToTop() {
  backToTop?.classList.toggle('visible', window.scrollY > 420);
}

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
