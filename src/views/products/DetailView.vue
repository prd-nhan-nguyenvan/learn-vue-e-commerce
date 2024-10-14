<template>
  <div class="container mt-5">
    <!--Grid row-->
    <div class="row">
      <!--Grid column-->
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
      <!--Grid column-->

      <!--Grid column-->
      <div class="col-md-6 mb-4">
        <!--Content-->
        <div class="p-4 border rounded shadow-sm">
          <div class="mb-3">
            <a href="">
              <span class="badge bg-dark me-1" v-if="!loading">{{ categoryName }}</span>
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

          <form class="d-flex justify-content-left align-items-center">
            <!-- Default input -->
            <div class="form-outline me-1" style="width: 100px">
              <input type="number" value="1" class="form-control" />
            </div>
            <button class="btn btn-primary ms-1">
              Add to cart
              <i class="fas fa-shopping-cart ms-1"></i>
            </button>
          </form>
        </div>
      </div>
    </div>

    <hr />

    <!--Grid row-->
    <div class="row d-flex justify-content-center">
      <!--Grid column-->
      <div class="col-md-6 text-center">
        <h4 class="my-4 h4">Additional information</h4>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus suscipit modi sapiente illo
          soluta odit voluptates, quibusdam officia. Neque quibusdam quas a quis porro? Molestias
          illo neque eum in laborum.
        </p>
      </div>
      <!--Grid column-->
    </div>
    <!--Grid row-->

    <!--Grid row-->
    <div class="row">
      <!--Grid column-->
      <div class="col-lg-4 col-md-12 mb-4">
        <img
          src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/11.jpg"
          class="img-fluid rounded shadow-sm"
          alt=""
        />
      </div>
      <!--Grid column-->

      <!--Grid column-->
      <div class="col-lg-4 col-md-6 mb-4">
        <img
          src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/12.jpg"
          class="img-fluid rounded shadow-sm"
          alt=""
        />
      </div>
      <!--Grid column-->

      <!--Grid column-->
      <div class="col-lg-4 col-md-6 mb-4">
        <img
          src="https://mdbootstrap.com/img/Photos/Horizontal/E-commerce/Products/13.jpg"
          class="img-fluid rounded shadow-sm"
          alt=""
        />
      </div>
      <!--Grid column-->
    </div>
    <!--Grid row-->
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { useProductStore } from '@/stores/product'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { formatCurrency, getCategoryName } from '@/helpers'

const loading = ref(false)

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const route = useRoute()

const product = computed(() => productStore.selectedProduct)
const categoryName = ref('')

const fetchCategoryName = async () => {
  const category = product.value?.category
  if (category) {
    loading.value = true
    categoryName.value = await getCategoryName(category)
    loading.value = false
  }
}

onMounted(async () => {
  await categoryStore.fetchCategories()
  try {
    const slug = route.params.slug
    if (typeof slug === 'string') {
      await productStore.getProductBySlug(slug)
      await fetchCategoryName()
    } else {
      console.error('Invalid slug:', slug)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

console.log('🚀 ~ categoryName ~ categoryName:', categoryName)

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
