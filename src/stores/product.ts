import type { Product } from '@/services/api'
import {
  addNewProduct,
  getAllProducts,
  getProductById as apiGetProductById,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  getProductBySlug as apiGetProductBySlug,
  bulkImportProduct as apiBulkImportProduct
} from '@/services/product.service'
import { defineStore } from 'pinia'

interface ProductPagingList {
  products: Product[]
  count: number
  next: string | null | undefined
  previous: string | null | undefined
  selectedProduct: Product | null
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('product', {
  state: (): ProductPagingList => ({
    products: [],
    count: 0,
    next: null,
    previous: null,
    selectedProduct: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchProducts(limit = 10, offset = 0) {
      this.loading = true
      this.error = null

      try {
        const response = await getAllProducts({ limit, offset })
        console.log('🚀 ~ fetchProducts ~ response:', response)

        this.products = response.results
        this.count = response.count
        this.next = response.next
        this.previous = response.previous
      } catch (error) {
        this.error = 'Failed to load products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
        console.log('Loading state:', this.loading) // Log the loading state
      }
    },

    // Add a function to load the next page of products
    async loadNextPage() {
      if (this.next) {
        const offset = new URL(this.next).searchParams.get('offset') || '0'
        const limit = new URL(this.next).searchParams.get('limit') || '10'
        await this.fetchProducts(parseInt(limit, 10), parseInt(offset, 10))
      }
    },

    // Add a function to load the previous page of products
    async loadPreviousPage() {
      if (this.previous) {
        const offset = new URL(this.previous).searchParams.get('offset') || '0'
        const limit = new URL(this.previous).searchParams.get('limit') || '10'
        await this.fetchProducts(parseInt(limit, 10), parseInt(offset, 10))
      }
    },

    async createProduct(product: any) {
      this.loading = true
      this.error = null

      try {
        const response = await addNewProduct(product)
        this.products.push(response)
      } catch (error) {
        this.error = 'Failed to add product'
        console.error('Failed to add product', { error })
      } finally {
        this.loading = false
      }
    },

    async bulkImportProduct(productFile: any) {
      this.loading = true
      this.error = null

      try {
        const response = await apiBulkImportProduct(productFile)
        return response
      } catch (error) {
        this.error = 'Failed to import products'
        console.error('Error importing products:', error)
      } finally {
        this.loading = false
      }
    },
    async getProductById(productId: number) {
      this.loading = true
      this.error = null

      try {
        const response = await apiGetProductById(productId) // Assuming this API call exists
        this.selectedProduct = response
        return response
      } catch (error) {
        this.error = 'Failed to load product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },
    async getProductBySlug(slug: string) {
      this.loading = true
      this.error = null

      try {
        const response = await apiGetProductBySlug(slug) // Assuming this API call exists
        this.selectedProduct = response
        return response
      } catch (error) {
        this.error = 'Failed to load product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },
    async updateProduct(product: any) {
      this.loading = true
      this.error = null

      try {
        const response = await apiUpdateProduct(product)
        const index = this.products.findIndex((p) => p.id === response.id)
        if (index !== -1) {
          this.products[index] = response
        }
        this.selectedProduct = response // Update the selected product
      } catch (error) {
        this.error = 'Failed to update product'
        console.error('Error updating product:', error)
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(productId: number) {
      this.loading = true
      this.error = null

      try {
        await apiDeleteProduct(productId)
        this.products = this.products.filter((product) => product.id !== productId)
      } catch (error) {
        this.error = 'Failed to delete product'
        console.error('Error deleting product:', error)
      } finally {
        this.loading = false
      }
    },

    // Reset the state
    resetState() {
      this.products = []
      this.selectedProduct = null
      this.loading = false
      this.error = null
    }
  }
})
