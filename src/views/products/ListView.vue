<template>
  <!-- Product Card Grid View -->
  <div class="container">
    <div class="row">
      <div class="row">
        <div
          v-for="product in products"
          :key="product.id"
          class="col-lg-4 col-md-6 col-sm-6 d-flex"
        >
          <ProductCart :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { computed, onMounted, ref } from 'vue'
import ProductCart from './components/ProductCart.vue'
import Swal from 'sweetalert2'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const { fetchProducts } = productStore
const { fetchCategories } = categoryStore

const recordsOptions = [5, 10, 20, 50]

const products = computed(() => productStore.products)

// Methods

onMounted(() => {
  console.log('Loading Products...')
  fetchProducts()

  console.log('Loading Categories...')
  fetchCategories()
})
</script>

<style lang="css" scoped>
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}
</style>
