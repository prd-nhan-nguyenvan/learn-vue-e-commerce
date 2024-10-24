<template>
  <div class="category-section my-5">
    <div class="col-12 text-center mb-4">
      <h1 class="display-4">Categories</h1>
    </div>
    <div class="row" v-if="!loading">
      <router-link
        class="col-md-2 my-2 mx-2 text-decoration-none"
        v-for="(category, index) in categories"
        :key="index"
        :to="{ name: 'category', params: { slug: category.slug } }"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title text-primary">{{ category.name }}</h5>
          </div>
        </div>
      </router-link>
    </div>
    <div v-else class="d-flex justify-content-center">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores'
import { computed, onMounted } from 'vue'

const categoryStore = useCategoryStore()

const categories = computed(() => categoryStore.categories)
const loading = computed(() => categoryStore.loading)
onMounted(async () => {
  console.log('Loading...')
  if (!categoryStore.isInitialFetch) {
    await categoryStore.fetchCategories()
  }
  console.log('Done loading')
})
</script>
