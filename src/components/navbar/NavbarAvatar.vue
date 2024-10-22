<template>
  <ul class="navbar-nav mb-2 mb-lg-0" v-if="!isAuthenticated">
    <NavbarItem routeName="login" label="Login" />
    <NavbarItem routeName="signup" label="Sign Up" />
  </ul>

  <!-- Avatar Dropdown -->
  <div v-else class="navbar-nav flex align-items-center">
    <NavbarItem routeName="cart" label="Cart" icon="shopping_cart">
      <span
        v-if="cartCount"
        class="position-absolute top-5 start-95 translate-middle badge rounded-pill bg-danger"
        >{{ cartCount }}</span
      >
    </NavbarItem>
    <div class="nav-item dropdown">
      <a
        class="nav-link d-flex align-items-center"
        href="#"
        id="avatarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div
          class="avatar bg-info text-white d-flex align-items-center justify-content-center me-2"
        >
          <span>{{ profile?.first_name?.charAt(0).toUpperCase() || 'O' }}</span>
        </div>
      </a>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="avatarDropdown">
        <li>
          <router-link class="dropdown-item" :to="{ name: 'profile' }">Profile</router-link>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <li>
          <button @click="logout" class="dropdown-item">Logout</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore, useCartStore } from '@/stores'
import { useRouter } from 'vue-router'

import NavbarItem from './NavbarItem.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const profile = computed(() => authStore.user)

const cartCount = computed(() => cartStore.cartItems.length)
const logout = async () => {
  authStore.logout() // Assuming you have a logout action in your Pinia store
  // Assuming you have a logout action in your Pinia store
  router.push({ name: 'login' }) // Redirect to login after logout
}
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
</style>
