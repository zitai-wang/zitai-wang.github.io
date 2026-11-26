const root = document.documentElement;
const languageToggle = document.querySelector('#language-toggle');
const themeToggle = document.querySelector('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // The controls remain usable when persistent storage is unavailable.
  }
}

function setLanguage(language) {
  const chinese = language === 'zh';
  root.lang = chinese ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-lang]').forEach((element) => {
    element.hidden = element.dataset.lang !== language;
  });
  languageToggle.textContent = chinese ? 'EN' : '中文';
  languageToggle.setAttribute('aria-label', chinese ? 'Switch to English' : '切换到中文');
  updateThemeLabel();
}

function updateThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  const chinese = root.lang === 'zh-CN';
  const label = chinese ? (dark ? '切换到浅色模式' : '切换到深色模式') :
    (dark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

function setTheme(theme) {
  root.dataset.theme = theme;
  themeColor?.setAttribute('content', theme === 'dark' ? '#20212b' : '#ffffff');
  updateThemeLabel();
}

const savedTheme = readPreference('ziyi-theme');
let themeOverride = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null;
setTheme(themeOverride ?? (systemTheme.matches ? 'dark' : 'light'));
setLanguage(readPreference('ziyi-language') === 'zh' ? 'zh' : 'en');

languageToggle.addEventListener('click', () => {
  const language = root.lang === 'en' ? 'zh' : 'en';
  setLanguage(language);
  savePreference('ziyi-language', language);
});

themeToggle.addEventListener('click', () => {
  themeOverride = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(themeOverride);
  savePreference('ziyi-theme', themeOverride);
});

systemTheme.addEventListener('change', ({ matches }) => {
  if (!themeOverride) setTheme(matches ? 'dark' : 'light');
});
