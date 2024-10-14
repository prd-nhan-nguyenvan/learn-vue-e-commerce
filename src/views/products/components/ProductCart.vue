<template>
  <div class="card w-100 my-2 shadow-2-strong">
    <router-link :to="{ name: 'productDetail', params: { slug: product.slug } }"
      ><div class="image-container">
        <img v-if="product.image" :src="product.image" class="card-img-top" />
        <img
          v-else
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdD7G7FFg1UKZFXhyP45b4AvY-qKEFvfjj3w&s"
          class="card-img-top"
        /></div
    ></router-link>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ product.name }}</h5>
      <div class="d-flex flex-row" v-if="product.on_sell">
        <h5 class="mb-1 me-1">{{ formatCurrency(product.sell_price) }}</h5>
        <span class="text-danger"
          ><s>{{ formatCurrency(product.price) }}</s></span
        >
      </div>
      <div class="d-flex flex-row" v-else>
        <h5 class="card-title">{{ formatCurrency(product.price) }}</h5>
      </div>
      <p class="card-text">{{ product.description }}</p>
      <div class="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
        <a href="#!" class="btn btn-primary shadow-0 me-1">Add to cart</a>
        <a href="#!" class="btn btn-light border icon-hover px-2 pt-2"
          ><i class="fas fa-heart fa-lg text-secondary px-1"></i
        ></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}
</script>

<style scoped>
.image-container {
  height: 250px; /* Set your desired fixed height */
  overflow: hidden;
}

.card-img-top {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
