// Appearance preference (Light/Dark/Auto), mirroring the iOS
// AppearancePreference + @AppStorage pattern. "system" follows the OS via
// prefers-color-scheme; "light"/"dark" pin it explicitly. The `dark` class
// on <html> drives Tailwind's dark: variant (see the custom-variant in
// index.css).

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'appearancePreference';

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getThemePreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function applyTheme(preference: ThemePreference): void {
  const isDark = preference === 'dark' || (preference === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', isDark);
}

export function setThemePreference(preference: ThemePreference): void {
  localStorage.setItem(STORAGE_KEY, preference);
  applyTheme(preference);
}

export function initTheme(): void {
  applyTheme(getThemePreference());
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      applyTheme('system');
    }
  });
}
