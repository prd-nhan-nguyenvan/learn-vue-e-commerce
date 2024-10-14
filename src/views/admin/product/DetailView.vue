<template>
  <div class="container mt-5">
    <h2>{{ isEdit ? 'Edit Product' : 'Add New Product' }}</h2>
    <form @submit.prevent="submitForm">
      <!-- Form fields (Category, Name, Description, Price, Sell Price, On Sale, Stock) -->
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select v-model="product.category" class="form-select" id="category" required>
          <option disabled value="">Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">Product Name</label>
        <input
          type="text"
          v-model="product.name"
          class="form-control"
          id="name"
          placeholder="Enter product name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          v-model="product.description"
          class="form-control"
          id="description"
          rows="3"
          placeholder="Enter product description"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input
          type="text"
          v-model="product.price"
          class="form-control"
          id="price"
          placeholder="Enter product price"
          required
        />
      </div>

      <div class="mb-3">
        <label for="sell_price" class="form-label">Sell Price</label>
        <input
          type="text"
          v-model="product.sell_price"
          class="form-control"
          id="sell_price"
          placeholder="Enter product sell price"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-check-label" for="on_sell">On Sale</label>
        <div class="form-check">
          <input type="checkbox" v-model="product.on_sell" class="form-check-input" id="on_sell" />
          <label class="form-check-label" for="on_sell">Is this product on sale?</label>
        </div>
      </div>

      <div class="mb-3">
        <label for="stock" class="form-label">Stock</label>
        <input
          type="number"
          v-model="product.stock"
          class="form-control"
          id="stock"
          placeholder="Enter product stock"
          required
        />
      </div>

      <div class="mb-3">
        <label for="image" class="form-label">Product Image</label>
        <input
          type="file"
          @change="handleFileUpload"
          class="form-control"
          id="image"
          accept="image/*"
        />
      </div>

      <div v-if="imageError" class="alert alert-danger">
        {{ imageError }}
      </div>

      <button type="submit" class="btn btn-primary">
        {{ isEdit ? 'Update Product' : 'Add Product' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useRouter, useRoute } from 'vue-router'
import type { ProductBody } from '@/services/product.service'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const route = useRoute()

const isEdit = ref(false)
const uploaded = ref(false)

const productInit = ref<ProductBody>({
  category: 0,
  name: '',
  description: '',
  price: '',
  sell_price: '',
  on_sell: false,
  stock: 0,
  image: null
})

const product = computed(() => productInit.value)
const categories = computed(() => categoryStore.categories)
const imageError = ref<string | null>(null)

onMounted(async () => {
  try {
    // Fetch categories from the store or API
    if (categories.value.length === 0) {
      await categoryStore.fetchCategories()
    }

    // Check if we are editing a product
    const productId = route.params.id
    if (productId) {
      isEdit.value = true
      // Fetch product data and populate form
      const existingProduct = await productStore.getProductById(Number(productId))
      Object.assign(productInit.value, existingProduct)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target && target.files) {
    product.value.image = target.files[0]
    uploaded.value = true
    imageError.value = null // Clear the error if an image is uploaded
  }
}

const submitForm = async () => {
  try {
    // Validate image upload for new product
    if (!isEdit.value && !product.value.image) {
      imageError.value = 'An image must be uploaded for a new product.'
      return
    }

    if (isEdit.value) {
      if (!uploaded.value) {
        product.value.image = null
      }
      await productStore.updateProduct(product.value)
    } else {
      await productStore.createProduct(product.value)
    }
    router.push({ name: 'products' })
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}
</script>
