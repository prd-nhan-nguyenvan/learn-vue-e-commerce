<template>
  <div class="container my-5">
    <HeroSection @search="searchProduct"></HeroSection>
    <!-- Category section -->

    <div class="featured-products my-5">
      <ProductListView :category="category"></ProductListView>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import ProductListView from './products/ListView.vue'
import { useCategoryStore, useProductStore } from '@/stores'
import CategorySection from '@/components/home/CategorySection.vue'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const route = useRoute()

const searchProduct = async (searchText: string) => {
  if (!searchText.trim()) {
    return
  }
  const query: { q: string; limit?: number; offset?: number } = {
    q: searchText.trim()
  }
  await productStore.searchProducts(query)
}

const category = computed(() => route.params.slug as string)

const fetchCategory = async (slug: string) => {
  try {
    if (typeof slug === 'string') {
      const categoryId = await categoryStore.getCategoryIdBySlug(slug)
      if (categoryId) {
        await productStore.fetchProductsByCategory(categoryId)
      }
    } else {
      console.error('Invalid slug:', slug)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await fetchCategory(route.params.slug as string)
})

watch(
  () => route.params.slug,
  (newSlug) => {
    fetchCategory(newSlug as string)
  }
)
</script>
