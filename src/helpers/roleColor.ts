import { ROLE_ADMIN, ROLE_STAFF, ROLE_USER } from './constants'

export const getBadgeClass = (role: string | undefined) => {
  if (!role) return ''
  switch (role) {
    case ROLE_ADMIN:
      return 'bg-danger' // Red badge for admin
    case ROLE_STAFF:
      return 'bg-warning' // Yellow badge for staff
    case ROLE_USER:
      return 'bg-primary' // Blue badge for regular users
    default:
      return 'bg-secondary' // Gray badge for undefined roles
  }
}
