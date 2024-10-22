<template>
  <div class="container mt-5">
    <div class="row" v-if="product">
      <div class="col-md-6 mb-4">
        <img
          :src="
            product?.image
              ? product.image
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdD7G7FFg1UKZFXhyP45b4AvY-qKEFvfjj3w&s'
          "
          class="img-fluid rounded shadow-sm"
          alt=""
        />
      </div>
      <div class="col-md-6 mb-4">
        <div class="p-4 border rounded shadow-sm">
          <h2 class="mb-4">{{ product?.name }}</h2>
          <div class="mb-3">
            <a href="">
              <span class="badge bg-dark me-1" v-if="!loading">{{
                getCategoryName(product?.category)
              }}</span>
            </a>
            <a href="">
              <span class="badge bg-info me-1">New</span>
            </a>
            <a href="">
              <span class="badge bg-danger me-1" v-if="product?.on_sell">On Sell</span>
            </a>
          </div>

          <div class="lead" v-if="product?.on_sell">
            <h5 class="me-1">
              <s>{{ formatCurrency(product.price) }}</s>
            </h5>
            <span class="mb-1 me-1 text-success"> {{ formatCurrency(product.sell_price) }}</span>
          </div>
          <div class="lead" v-else>
            <span class="mb-1 me-1">{{ formatCurrency(product?.price) }}</span>
          </div>

          <strong><p class="mt-4" style="font-size: 20px">Description</p></strong>

          <p>
            {{ product?.description }}
          </p>

          <button
            class="btn btn-primary ms-1"
            @click="handleAddToCard(product)"
            v-if="!itemQuantity"
          >
            Add to cart
            <i class="fas fa-shopping-cart ms-1"></i>
          </button>
          <button class="btn btn-secondary ms-1" disabled v-else>
            Already in cart
            <i class="fas fa-check ms-1"></i>
          </button>
        </div>
      </div>
    </div>

    <hr />

    <!-- Relative Products -->
  </div>
</template>

<script setup lang="ts">
import { useCartStore, useCategoryStore, useProductStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { addToCartHelper, formatCurrency, getCategoryName } from '@/helpers'
import type { EnhancedProduct } from '@/services/product.service'

const loading = ref(false)

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const route = useRoute()

const product = computed(() => productStore.selectedProduct)

const router = useRouter()

const handleAddToCard = (product: EnhancedProduct) => {
  addToCartHelper(product, router)
}
const cartStore = useCartStore()

const itemQuantity = computed(() => cartStore.itemQuantity(product.value?.id || 0))

onMounted(async () => {
  await categoryStore.fetchCategories()
  try {
    const slug = route.params.slug
    if (typeof slug === 'string') {
      await productStore.getProductBySlug(slug)
    } else {
      console.error('Invalid slug:', slug)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})
</script>
