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
            <router-link :to="{ name: 'category', params: { slug: category?.slug } }">
              <span class="badge bg-warning me-1">{{ category?.name }}</span>
            </router-link>
            <span class="badge bg-info me-1">New</span>
            <span class="badge bg-danger me-1" v-if="product?.on_sell">On Sell</span>
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

    <!-- Similar products -->
    <div class="row d-flex justify-content-center">
      <div class="col-md-6 text-center">
        <h4 class="my-4 h4">Similar products</h4>
      </div>
    </div>
    <div class="row flex-nowrap overflow-auto">
      <div
        v-for="product in similarProducts"
        :key="product.id"
        class="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex align-items-stretch"
        style="flex: 0 0 auto"
      >
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '@/views/products/components/ProductCard.vue'

import { useCartStore, useCategoryStore, useProductStore } from '@/stores'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { addToCartHelper, formatCurrency, getCategoryName } from '@/helpers'
import type { EnhancedProduct } from '@/services/product.service'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const cartStore = useCartStore()

const route = useRoute()
const router = useRouter()

const product = computed(() => productStore.selectedProduct)
const similarProducts = computed(() => productStore.similarProducts)

const category = computed(() => categoryStore.getCategoryById(product.value?.category || 0))
const loading = ref(false)
const itemQuantity = computed(() => cartStore.itemQuantity(product.value?.id || 0))

const handleAddToCard = (product: EnhancedProduct) => {
  addToCartHelper(product, router)
}

const fetchProduct = async (slug: string) => {
  loading.value = true

  try {
    if (typeof slug === 'string') {
      await productStore.getProductBySlug(slug)
    } else {
      console.error('Invalid slug:', slug)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loading.value = false
}

onMounted(async () => {
  await fetchProduct(route.params.slug as string)
  if (!categoryStore.isInitialFetch) {
    await categoryStore.fetchCategories()
  }
})

watch(
  () => route.params.slug,
  (newSlug) => {
    fetchProduct(newSlug as string)
  }
)
</script>
