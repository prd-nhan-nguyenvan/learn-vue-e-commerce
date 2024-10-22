<template>
  <!-- Product Card Grid View -->
  <div class="container py-5">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h1 class="display-4">Our Products</h1>
        <p class="lead">Browse through our exclusive collection</p>
      </div>
    </div>
    <div class="row">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCategoryStore, useProductStore } from '@/stores'
import { computed, onMounted } from 'vue'
import ProductCard from '@/views/products/components/ProductCard.vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const products = computed(() => productStore.products)

onMounted(() => {
  productStore.fetchProducts()

  categoryStore.fetchCategories()
})
</script>

<style lang="css" scoped>
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
</style>
