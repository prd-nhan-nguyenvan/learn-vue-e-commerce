<template>
  <div class="container mt-5">
    <div class="row mb-4 justify-content-between">
      <div class="col-md-4">
        <h1 class="h3">Products</h1>
      </div>
      <div class="col-md-8">
        <div class="d-flex justify-content-end">
          <div class="d-flex justify-content-end me-1">
            <label for="product-search" class="visually-hidden">Search Products</label>
            <input
              id="product-search"
              class="form-control"
              type="search"
              placeholder="Search Products"
              aria-label="Search Products"
              v-model="searchTerm"
            /><button class="btn btn-outline-success" type="submit" @click="handleSearch">
              <i class="material-icons">search</i>
            </button>
          </div>
          <div class="btn-group" role="group" aria-label="Product actions">
            <router-link
              :to="{ name: 'addProduct' }"
              class="btn btn-primary d-flex align-items-center"
            >
              <i class="material-icons me-1">add</i> Add Product
            </router-link>
            <button
              @click="handleBulkImportProducts"
              class="btn btn-outline-success d-flex align-items-center"
            >
              <i class="material-icons me-1">file_upload</i> Bulk Import
            </button>
          </div>
        </div>
      </div>
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
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th scope="col" class="text-nowrap">#</th>
            <th scope="col" class="text-nowrap">Actions</th>
            <th scope="col" class="text-nowrap">Image</th>
            <th scope="col" class="text-nowrap">Name</th>
            <th scope="col" class="text-nowrap">Description</th>
            <th scope="col" class="text-nowrap">Category</th>
            <th scope="col" class="text-nowrap">Price</th>
            <th scope="col" class="text-nowrap">Sell Price</th>
            <th scope="col" class="text-nowrap">On Sell</th>
            <th scope="col" class="text-nowrap">Stock</th>
            <th scope="col" class="text-nowrap">Created At</th>
            <th scope="col" class="text-nowrap">Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <div class="d-flex justify-content-center">
                <router-link
                  :to="{ name: 'editProduct', params: { id: product.id } }"
                  class="btn btn-sm btn-outline-warning me-2"
                  title="Edit Product"
                >
                  <i class="material-icons">edit</i>
                </router-link>
                <button
                  @click="product.id !== undefined && deleteProduct(product.id)"
                  class="btn btn-sm btn-outline-danger"
                  title="Delete Product"
                >
                  <i class="material-icons">delete</i>
                </button>
              </div>
            </td>
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
            <td
              class="text-truncate"
              style="
                max-width: 300px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ product.description }}
            </td>
            <td>{{ getCategoryName(product.category) }}</td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td>{{ formatCurrency(product.sell_price) }}</td>
            <td>{{ product.on_sell ? 'Yes' : 'No' }}</td>
            <td>{{ product.stock }}</td>
            <td class="text-nowrap">
              {{ product.created_at ? formatDate(product.created_at) : 'N/A' }}
            </td>
            <td class="text-nowrap">
              {{ product.updated_at ? formatDate(product.updated_at) : 'N/A' }}
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
              <span class="page-link" aria-hidden="true">
                <i class="material-icons">arrow_back</i>
              </span>
            </li>
            <li
              v-if="currentPage > 5"
              :class="['page-item', { active: currentPage === 1 }]"
              @click="goToPage(1)"
            >
              <span class="page-link">{{ 1 }}</span>
            </li>
            <li v-if="currentPage > 5" class="page-item disabled">
              <span class="page-link">...</span>
            </li>
            <!-- Page Numbers -->
            <li
              v-for="page in totalPages"
              :key="page"
              :class="['page-item', { active: currentPage === page }]"
              @click="goToPage(page)"
            >
              <span class="page-link" v-if="Math.abs(page - currentPage) < 5">{{ page }}</span>
            </li>

            <li v-if="currentPage < totalPages - 4" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li
              v-if="currentPage < totalPages - 4"
              :class="['page-item', { active: currentPage === totalPages }]"
              @click="goToPage(totalPages)"
            >
              <span class="page-link">{{ totalPages }}</span>
            </li>

            <li class="page-item" :class="{ disabled: !next }" @click="loadNextPage">
              <span class="page-link" aria-hidden="true">
                <i class="material-icons">arrow_forward</i>
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-if="!loading && !products.length" class="alert alert-info">No products available.</div>
  </div>
</template>
<script setup lang="ts">
import { useCategoryStore, useProductStore } from '@/stores'
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import type { ProductFile } from '@/services/product.service'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const { fetchProducts } = productStore
const { fetchCategories } = categoryStore

const recordsOptions = [5, 10, 20, 50]

const currentPage = ref(1)
const productsPerPage = ref(recordsOptions[2])

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
const formatDate = (date: string | Date) => {
  const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const }
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

const handleBulkImportProducts = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'

  input.onchange = async (event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files && target.files[0]) {
      const file = target.files[0]
      if (file) {
        const productFile: ProductFile = {
          file: file
        }
        try {
          const response = await productStore.bulkImportProduct(productFile) // Adjust according to your API call
          Swal.fire({
            title: 'Success!',
            text: 'Products imported successfully.',
            icon: 'success',
            timer: 2000
          })
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'There was an error importing the products.',
            icon: 'error',
            timer: 2000
          })
        }
      }
    }
  }

  // Trigger file input click
  input.click()
}
const searchTerm = ref('')
const handleSearch = () => {
  const query = {
    q: searchTerm.value,
    limit: productsPerPage.value,
    offset: 0
  }
  productStore.searchProducts(query)
}
onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
