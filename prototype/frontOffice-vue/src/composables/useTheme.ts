import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'theme'

function readStored(): 'light' | 'dark' {
  if (typeof localStorage === 'undefined') return 'dark'
  const v = localStorage.getItem(STORAGE_KEY)
  return v === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  if (theme === 'dark') html.classList.add('dark')
  else html.classList.remove('dark')
}

export function useTheme() {
  const isDark = ref(readStored() === 'dark')

  let observer: MutationObserver | null = null

  function set(theme: 'light' | 'dark') {
    isDark.value = theme === 'dark'
    applyTheme(theme)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }

  function toggle() {
    set(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    applyTheme(isDark.value ? 'dark' : 'light')

    observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isDark, toggle, set }
}
