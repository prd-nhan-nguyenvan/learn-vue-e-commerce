<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarToggler"
        aria-controls="navbarToggler"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <NavbarBrand />
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <NavbarItem routeName="home" label="Home" />
        <NavbarItem routeName="categories" label="Category" :roles="ADMIN_STAFF_ROLE" />
        <NavbarItem routeName="products" label="Product" :roles="ADMIN_STAFF_ROLE" />
        <NavbarItem routeName="userManagement" label="User" :roles="[ROLE_ADMIN]" />
      </ul>
      <NavbarAvatar />
    </div>
  </nav>
</template>

<script setup lang="ts">
import NavbarAvatar from '@/components/navbar/NavbarAvatar.vue'
import NavbarItem from '@/components/navbar/NavbarItem.vue'
import NavbarBrand from '@/components/navbar/NavbarBrand.vue'

import { ADMIN_STAFF_ROLE, ROLE_ADMIN } from '@/helpers'
</script>
