<template>
  <li class="nav-item" v-if="isAuthenticated">
    <router-link
      class="nav-link"
      :class="{ active: isActiveRoute(routeName) }"
      :to="{ name: routeName }"
      aria-current="page"
    >
      {{ label }}
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  routeName: string
  label: string
  roles?: string[]
}

const props = defineProps<Props>()

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  if (!props.roles) return true

  const userRole = authStore.user?.role
  if (!userRole) return false

  return props.roles.includes(userRole)
})

const route = useRoute()

const isActiveRoute = (path: string) => route.name === path
</script>
