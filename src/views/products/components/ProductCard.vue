<template>
  <div class="card w-100 my-3 shadow-sm border-0 rounded">
    <router-link
      :to="{ name: 'productDetail', params: { slug: product.slug } }"
      class="text-decoration-none text-dark"
    >
      <div class="image-container">
        <img v-if="product.image" :src="product.image" class="card-img-top rounded-top" />
        <img
          v-else
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdD7G7FFg1UKZFXhyP45b4AvY-qKEFvfjj3w&s"
          class="card-img-top rounded-top"
        />
      </div>
    </router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.name }}</h5>
      <div class="d-flex flex-row align-items-center" v-if="product.on_sell">
        <h5 class="mb-1 me-2 text-success">{{ formatCurrency(Number(product.sell_price)) }}</h5>
        <span class="text-muted"
          ><s>{{ formatCurrency(Number(product.price)) }}</s></span
        >
      </div>
      <div class="d-flex flex-row align-items-center" v-else>
        <h5 class="card-title">{{ formatCurrency(Number(product.price)) }}</h5>
      </div>
      <p class="card-text text-truncate">{{ product.description }}</p>
      <div
        class="card-footer d-flex justify-content-between align-items-center pt-3 px-0 pb-0 mt-auto border-0 bg-white"
      >
        <button
          class="btn btn-primary ms-1"
          @click="handleAddToCard(product)"
          v-if="!itemQuantity(product.id)"
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
</template>

<script setup lang="ts">
import { formatCurrency } from '@/helpers'
import type { EnhancedProduct } from '@/services/product.service'
import { addToCartHelper } from '@/helpers'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores'

defineProps<{
  product: EnhancedProduct
}>()

const router = useRouter()
const cartStore = useCartStore()
const itemQuantity = (id: number) => cartStore.itemQuantity(id)
const handleAddToCard = (product: EnhancedProduct) => {
  addToCartHelper(product, router)
}
</script>

<style scoped>
.image-container {
  height: 250px;
  overflow: hidden;
}

.card-img-top {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
