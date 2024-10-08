<template>
  <main class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Products</h1>
      <router-link :to="{ name: 'addProduct' }" class="btn btn-primary"
        >Add New Product</router-link
      >
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && products.length" class="table-responsive">
      <!-- Dropdown to select records per page -->
      <div class="form-floating w-25 float-end mt-3">
        <select
          v-model="productsPerPage"
          @change="handleRecordsChange"
          id="recordsPerPage"
          class="form-select rounded"
          aria-label="Records per page"
        >
          <option v-for="option in recordsOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <label for="recordsPerPage">Records per page:</label>
      </div>
      <table class="table table-hover">
        <thead class="table-light">
          <tr>
            <th scope="col" class="text-nowrap">#</th>
            <th scope="col" class="text-nowrap">Image</th>
            <th scope="col" class="text-nowrap">Product Name</th>
            <th scope="col" class="text-nowrap">Slug</th>
            <th scope="col" class="text-nowrap">Description</th>
            <th scope="col" class="text-nowrap">Category</th>
            <th scope="col" class="text-nowrap">Price</th>
            <th scope="col" class="text-nowrap">Sell Price</th>
            <th scope="col" class="text-nowrap">On Sale</th>
            <th scope="col" class="text-nowrap">Stock</th>
            <th scope="col" class="text-nowrap">Created At</th>
            <th scope="col" class="text-nowrap">Updated At</th>
            <th scope="col" class="text-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <img
                v-if="product.image"
                :src="product.image"
                alt="Product Image"
                class="img-thumbnail"
                style="max-width: 100px; max-height: 100px"
              />
              <span v-else>No Image</span>
            </td>
            <td class="text-nowrap">{{ product.name }}</td>
            <td class="text-nowrap">{{ product.slug }}</td>
            <td>{{ product.description }}</td>
            <td>{{ getCategoryName(product.category) }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            params:
            <td>{{ formatCurrency(product.sell_price) }}</td>
            <td>{{ product.on_sell ? 'Yes' : 'No' }}</td>
            <td>{{ product.stock }}</td>
            <td class="text-nowrap">{{ formatDate(product.created_at) }}</td>
            <td class="text-nowrap">{{ formatDate(product.updated_at) }}</td>
            <td>
              <div class="d-flex">
                <router-link
                  :to="{ name: 'editProduct', params: { id: product.id } }"
                  class="btn btn-sm btn-warning me-2"
                >
                  <i class="material-icons">edit</i>
                </router-link>
                <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger">
                  <i class="material-icons">delete</i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div class="container my-4">
        <nav aria-label="Page navigation" v-if="!loading && totalPages > 1">
          <ul class="pagination justify-content-center">
            <!-- Previous Button -->
            <li class="page-item" :class="{ disabled: !previous }" @click="loadPreviousPage">
              <span class="page-link" aria-hidden="true">&laquo;</span>
            </li>

            <!-- Page Numbers -->
            <li
              v-for="page in totalPages"
              :key="page"
              :class="['page-item', { active: currentPage === page }]"
              @click="goToPage(page)"
            >
              <span class="page-link">{{ page }}</span>
            </li>

            <!-- Next Button -->
            <li class="page-item" :class="{ disabled: !next }" @click="loadNextPage">
              <span class="page-link" aria-hidden="true">&raquo;</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-if="!loading && !products.length" class="alert alert-info">No products available.</div>
  </main>
</template>
<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const { fetchProducts } = productStore
const { fetchCategories } = categoryStore

const recordsOptions = [5, 10, 20, 50]

const currentPage = ref(1)
const productsPerPage = ref(recordsOptions[1])

const products = computed(() => productStore.products)
const loading = computed(() => productStore.loading)
const previous = computed(() => productStore.previous)
const next = computed(() => productStore.next)
const error = computed(() => productStore.error)
const totalPages = computed(() => Math.ceil(productStore.count / productsPerPage.value))

// Methods

const getCategoryName = (categoryId: number) => {
  const category = categoryStore.categories.find((c) => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

const formatCurrency = (price: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    parseFloat(price)
  )
}
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const deleteProduct = async (productId: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Perform the delete action
      await productStore.deleteProduct(productId)
      Swal.fire({
        title: 'Deleted!',
        text: 'The product has been deleted.',
        icon: 'success',
        timer: 2000
      })
    }
  })
}

const goToPage = async (page: number) => {
  currentPage.value = page
  const offset = (page - 1) * productsPerPage.value
  await productStore.fetchProducts(productsPerPage.value, offset)
}

const loadNextPage = () => {
  if (next.value) {
    productStore.loadNextPage()
    currentPage.value += 1
  }
}

const loadPreviousPage = () => {
  if (previous.value) {
    productStore.loadPreviousPage()
    currentPage.value -= 1
  }
}

const handleRecordsChange = () => {
  currentPage.value = 1 // Reset to the first page on records change
  productStore.fetchProducts(productsPerPage.value, 0)
}

onMounted(() => {
  console.log('Loading Products...')
  fetchProducts()

  console.log('Loading Categories...')
  fetchCategories()
})
</script>
