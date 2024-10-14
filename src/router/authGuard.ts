import { useSystemMessageStore, useAuthStore } from '@/stores'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export const authGuard = async (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  const systemMessageStore = useSystemMessageStore()

  const userRole = authStore.user?.role
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      systemMessageStore.setMessage(
        `You must log in to access ${to.name?.toString().toUpperCase()} page!!!`
      )

      next(to.fullPath ? { name: 'login', query: { next: to.fullPath } } : { name: 'login' })
    } else {
      const allowedRoles: string[] = Array.isArray(to.meta.role) ? to.meta.role : []

      if (!allowedRoles.length) {
        next()
      } else if (!userRole) {
        next(to.fullPath ? { name: 'login', query: { next: to.fullPath } } : { name: 'login' })
      } else if (!allowedRoles.includes(userRole)) {
        systemMessageStore.setMessage(
          `You haven't permission for access ${to.name?.toString().toUpperCase()} page!!!`
        )
        next({ name: 'home' })
      } else {
        systemMessageStore.clearMessage()
        next()
      }
    }
  } else {
    systemMessageStore.clearMessage()
    next()
  }
}
