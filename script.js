const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const languageToggle = document.querySelector('#language-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

const savedTheme = localStorage.getItem('ziyi-theme');
if (savedTheme === 'dark' || savedTheme === 'light') root.dataset.theme = savedTheme;

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ziyi-theme', root.dataset.theme);
});

let language = localStorage.getItem('ziyi-language') === 'zh' ? 'zh' : 'en';
const englishMarkup = new Map(
  [...document.querySelectorAll('[data-en][data-zh]')].map((element) => [element, element.innerHTML])
);

function setLanguage(nextLanguage) {
  language = nextLanguage;
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en][data-zh]').forEach((element) => {
    if (language === 'en') element.innerHTML = englishMarkup.get(element);
    else element.textContent = element.dataset.zh;
  });
  if (languageToggle) languageToggle.textContent = language === 'zh' ? 'EN' : '中文';
  localStorage.setItem('ziyi-language', language);
}

setLanguage(language);
languageToggle?.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
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
}, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.2, 0.5] });

sections.forEach((section) => observer.observe(section));
