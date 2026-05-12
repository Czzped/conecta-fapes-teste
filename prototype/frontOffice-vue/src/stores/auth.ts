import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type AccessType =
  | 'cidadao'
  | 'voluntario'
  | 'bolsista'
  | 'coordenador'
  | 'diretor'
  | 'reitor'

const STORAGE_KEY = 'auth'

interface AuthSnapshot {
  isLoggedIn: boolean
  accessType: AccessType | null
}

function loadInitial(): AuthSnapshot {
  if (typeof localStorage === 'undefined') return { isLoggedIn: false, accessType: null }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { isLoggedIn: false, accessType: null }
  } catch {
    return { isLoggedIn: false, accessType: null }
  }
}

function persist(snap: AuthSnapshot) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap))
  }
}

export const useAuthStore = defineStore('auth', () => {
  const initial = loadInitial()
  const isLoggedIn = ref(initial.isLoggedIn)
  const accessType = ref<AccessType | null>(initial.accessType)

  const role = computed(() => accessType.value)

  const isCidadao = computed(() => accessType.value === 'cidadao')
  const isBolsistaArea = computed(
    () => accessType.value !== null && accessType.value !== 'cidadao',
  )
  const landingRoute = computed<string>(() => {
    if (!isLoggedIn.value) return '/login'
    if (accessType.value === 'cidadao') return '/cidadao'
    if (accessType.value === 'reitor' || accessType.value === 'diretor') return '/dashboard'
    return '/'
  })

  function login(type: AccessType) {
    isLoggedIn.value = true
    accessType.value = type
    persist({ isLoggedIn: true, accessType: type })
  }

  function logout() {
    isLoggedIn.value = false
    accessType.value = null
    persist({ isLoggedIn: false, accessType: null })
  }

  function hasRole(allowed: AccessType[] | undefined): boolean {
    if (!allowed || allowed.length === 0) return true
    return accessType.value !== null && allowed.includes(accessType.value)
  }

  return {
    isLoggedIn,
    accessType,
    role,
    isCidadao,
    isBolsistaArea,
    landingRoute,
    login,
    logout,
    hasRole,
  }
})
