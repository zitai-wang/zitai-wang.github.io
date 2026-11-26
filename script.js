const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const languageToggle = document.querySelector('#language-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const header = document.querySelector('.site-header');
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
  if (languageToggle) {
    languageToggle.textContent = language === 'zh' ? 'EN' : '中文';
    languageToggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
  }
  localStorage.setItem('ziyi-language', language);
}

setLanguage(language);
languageToggle?.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));

menuToggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(open));
});

function closeMenu() {
  nav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}

const navLinks = [...document.querySelectorAll('#site-nav a[href^="#"]')];
const navSections = navLinks.map((link) => document.getElementById(link.hash.slice(1)));

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu();
    menuToggle?.focus();
  }
});

function updateNavigation() {
  const sectionStart = (header?.getBoundingClientRect().bottom ?? 0) + 20;
  let currentSection = navSections[0];

  for (const section of navSections) {
    if (section && section.getBoundingClientRect().top <= sectionStart) currentSection = section;
  }

  const hashTarget = document.getElementById(window.location.hash.slice(1));
  const linkedSection = hashTarget?.closest('.content-section, .hero');
  const atPageEnd = Math.ceil(window.scrollY + window.innerHeight) >= root.scrollHeight;

  // Short sections near the footer cannot always scroll up to the sticky header.
  if (atPageEnd && window.scrollY > 0) {
    const bounds = hashTarget?.getBoundingClientRect();
    currentSection = bounds && bounds.top >= sectionStart && bounds.top < window.innerHeight
      ? linkedSection
      : navSections.at(-1);
  }

  navLinks.forEach((link, index) => {
    if (navSections[index] === currentSection) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  backToTop?.classList.toggle('visible', window.scrollY > 420);
}

window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('hashchange', updateNavigation);
window.addEventListener('load', updateNavigation, { once: true });
document.fonts?.ready.then(updateNavigation);
languageToggle?.addEventListener('click', updateNavigation);
updateNavigation();
backToTop?.addEventListener('click', () => {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  document.querySelector('#name-heading')?.focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
});
