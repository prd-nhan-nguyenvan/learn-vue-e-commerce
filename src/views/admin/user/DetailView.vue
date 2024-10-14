<template>
  <div class="container my-5">
    <div class="row justify-content-center align-items-stretch">
      <div class="col-lg-4 d-flex">
        <div class="card mb-4 text-center flex-fill">
          <div class="card-body">
            <img
              v-if="profile?.profile_picture"
              :src="profile?.profile_picture"
              alt="Profile Picture"
              class="rounded-circle mb-3"
              width="150"
              height="150"
            />
            <img
              v-else
              src="https://isobarscience-1bfd8.kxcdn.com/wp-content/uploads/2020/09/default-profile-picture1.jpg"
              alt="Default Profile Picture"
              class="rounded-circle mb-3"
              width="150"
              height="150"
            />

            <div class="d-flex justify-content-center align-items-center">
              <h5 class="me-2">{{ profile?.first_name }}&nbsp;{{ profile?.last_name }}</h5>
              <span class="badge" :class="getBadgeClass(currentUser?.role)">
                {{ currentUser?.role || 'No role available' }}
              </span>
            </div>

            <div class="mb-2">
              <strong class="fst-italic fw-normal">{{ currentUser?.username }}</strong>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 d-flex">
        <div class="card mb-4 flex-fill">
          <div class="card-body">
            <div class="row align-items-center mb-3">
              <h4 class="col">User Information</h4>
              <router-link class="btn btn-success col-auto me-3" :to="{ name: 'userManagement' }">
                Go Back
              </router-link>
            </div>
            <hr />
            <div class="mb-2 d-flex align-items-center">
              <strong>Email:&nbsp;</strong>
              <span>{{ currentUser?.email || 'No email available' }}</span>
            </div>
            <hr />
            <div class="mb-2 d-flex align-items-center">
              <strong>Phone:&nbsp;</strong>
              <span>{{ profile?.phone_number || 'No phone number available' }}</span>
            </div>
            <hr />
            <div class="mb-2 d-flex align-items-center">
              <strong>Address:&nbsp;</strong>
              <span>{{ profile?.address || 'No address available' }}</span>
            </div>
            <hr />
            <div class="mb-2 d-flex align-items-center">
              <strong>Bio:&nbsp;</strong>
              <span>{{ profile?.bio || 'No bio available' }}</span>
            </div>
            <hr />

            <div class="mb-2 d-flex align-items-center">
              <strong>Joined On:&nbsp;</strong>
              <span>{{
                currentUser?.date_joined
                  ? formatDate(currentUser?.date_joined)
                  : 'No join date available'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { formatDate, getBadgeClass } from '@/helpers'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const currentUser = computed(() => userStore.selectedUser)
const profile = computed(() => userStore.selectedUser?.profile)

onMounted(async () => {
  const id = Number(route.params.id)
  console.log('Loading...')
  try {
    await userStore.getUserById(id)
  } catch (error) {
    console.error({ error })
  }
})
</script>

<style scoped>
.card {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.badge {
  margin-top: -0.6rem;
  padding: auto;
}
</style>
