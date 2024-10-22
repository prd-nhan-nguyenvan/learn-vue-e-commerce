<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center mb-4">Sign Up</h1>

            <!-- Sign Up Form -->
            <form @submit.prevent="handleSignup">
              <!-- Email Input -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  placeholder="Enter your email"
                  v-model="registerData.email"
                  required
                />
                <!-- Error Message -->
                <div
                  v-if="error?.email && error.email.length > 0"
                  class="text-danger mt-1"
                  role="alert"
                >
                  {{ error.email[0] }}
                </div>
              </div>

              <!-- Username Input -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  placeholder="Enter your username"
                  v-model="registerData.username"
                  required
                />
                <div
                  v-if="error?.username && error.username.length > 0"
                  class="text-danger mt-1"
                  role="alert"
                >
                  {{ error.username[0] }}
                </div>
              </div>

              <!-- Password Input -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  placeholder="Enter your password"
                  v-model="registerData.password"
                  required
                />
                <div
                  v-if="error?.password && error.password.length > 0"
                  class="text-danger mt-1"
                  role="alert"
                >
                  {{ error.password[0] }}
                </div>
              </div>

              <button type="submit" :disabled="loading" class="btn btn-primary w-100">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-if="loading">Signing up...</span>
                <span v-else>Sign Up</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Register } from '@/services'
import { signup } from '@/services/auth.service'
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface SignupError {
  email?: string[] // Assuming it can be an array of strings
  username?: string[] // Same here
  password?: string[] // Same here
}

const router = useRouter()

const registerData = ref<Register>({
  email: '',
  password: '',
  username: ''
})
const loading = ref(false)
const error = ref<SignupError | null>(null)

const handleSignup = async () => {
  loading.value = true
  error.value = null
  try {
    await signup(registerData.value)
    await Swal.fire({
      title: 'Success!',
      text: 'You have successfully signed up. Please log in.',
      icon: 'success',
      confirmButtonText: 'OK'
    })

    router.push({ name: 'login' })
  } catch (err: any) {
    error.value = err
    if (
      error.value?.email &&
      error.value.email.length > 0 &&
      error.value.email[0].includes('already exists')
    ) {
      error.value.email = ['Email already exists!']
    }
    if (
      error.value?.username &&
      error.value.username.length > 0 &&
      error.value.username[0].includes('already exists')
    ) {
      error.value.username = ['Username already exists!']
    }
    if (error.value?.password && error.value.password.length > 0) {
      if (error.value.password[0].includes('too short'))
        error.value.password = ['Password must be at least 8 characters long!']
      if (error.value.password[0].includes('common'))
        error.value.password = ['Password is too common!']
    }
  } finally {
    loading.value = false
  }
}
</script>
