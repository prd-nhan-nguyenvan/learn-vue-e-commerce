<template>
  <main class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Users</h1>
      <div class="input-group w-50">
        <input
          type="text"
          v-model="searchQuery"
          @input="debouncedSearch"
          placeholder="Search users..."
          class="form-control"
        />
        <button class="btn btn-outline-primary d-flex align-items-center" @click="debouncedSearch">
          <i class="material-icons">search</i>
        </button>
      </div>
    </div>

    <div v-if="loading" class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-show="error" class="alert alert-danger text-center" role="alert">
      {{ error }}
    </div>

    <!-- Users Table -->
    <div v-if="!loading && users.length" class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col" class="text-nowrap">
              Email
              <button
                class="btn btn-link p-0 ms-2"
                @click="handleSort('email')"
                aria-label="Sort by Email"
              >
                <i class="material-icons" v-if="orderFields === '-email'">north</i>
                <i class="material-icons" v-else-if="orderFields === 'email'">south</i>
                <i class="material-icons" v-else>sort</i>
              </button>
            </th>
            <th scope="col" class="text-nowrap">Username</th>
            <th scope="col" class="text-nowrap">
              Role
              <button
                class="btn btn-link p-0 ms-2"
                @click="handleSort('role')"
                aria-label="Sort by Email"
              >
                <i class="material-icons" v-if="orderFields === '-role'">north</i>
                <i class="material-icons" v-else-if="orderFields === 'role'">south</i>
                <i class="material-icons" v-else>sort</i>
              </button>
            </th>
            <th scope="col" class="text-nowrap">Active</th>
            <th scope="col" class="text-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ user.email }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span class="badge" :class="getBadgeClass(user.role)">
                {{ user.role || 'No role available' }}
              </span>
            </td>
            <td>
              <span class="badge" :class="user.is_active ? 'bg-success' : 'bg-danger'">
                {{ user.is_active ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <div class="d-flex">
                <router-link
                  class="btn btn-sm btn-secondary me-2"
                  :to="{ name: 'userDetail', params: { id: user.id } }"
                >
                  <i class="material-icons">visibility</i>
                </router-link>
                <button class="btn btn-sm btn-danger" @click="handleBlockUser(user)">
                  <i class="material-icons">block</i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      :loading="loading"
      @previous="loadPrevious"
      @next="loadNext"
      @goToPage="goToPage"
    />
  </main>
</template>

<script setup lang="ts">
import Pagination from '@/components/utils/Pagination.vue'
import { useUserStore } from '@/stores'
import { onMounted, computed, ref, watch } from 'vue'
import { debounce, getBadgeClass } from '@/helpers'
import type { UserList } from '@/services'
import Swal from 'sweetalert2'
import { usePagination } from '@/composables/usePagination'
import type { userListQuery } from '@/services/user.service'

const userStore = useUserStore()

const searchQuery = ref('')
const orderFields = ref('')
const recordPerPage = ref(5)

const users = computed(() => userStore.users)
const loading = computed(() => userStore.loading)
const error = computed(() => userStore.error)

const query = computed<userListQuery>(() => ({
  search: searchQuery.value,
  ordering: orderFields.value,
  limit: recordPerPage.value
}))

const handleBlockUser = async (user: UserList) => {
  const confirmation = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, block it!'
  })

  if (confirmation.isConfirmed) {
    try {
      await userStore.blockUser(user)
      Swal.fire({
        title: 'Blocked!',
        text: `${user.username} is blocked!`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to block ${user.username}: ${error.message || 'Please try again later.'}`,
        icon: 'error',
        confirmButtonText: 'Okay'
      })
    }
  }
}

const debouncedSearch = debounce(async () => {
  await userStore.fetchUsers(query.value)
}, 300)

watch(query, debouncedSearch)

const handleSort = (field: string) => {
  orderFields.value = orderFields.value === field ? `-${field}` : field

  debouncedSearch()
}

const { goToPage, loadPrevious, loadNext, currentPage, totalPages, setTotalCount } = usePagination(
  (paginationQuery) => userStore.fetchUsers(paginationQuery),
  recordPerPage.value
)

watch([currentPage], async () => {
  await goToPage(currentPage.value, { ...query.value })
})

onMounted(async () => {
  await userStore.fetchUsers(query.value)
  setTotalCount(userStore.count)
})
</script>
