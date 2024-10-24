import { defineStore } from 'pinia'

import { convertProductToEnhanced } from '@/helpers'
import {
  addNewProduct,
  bulkImportProduct as apiBulkImportProduct,
  deleteProduct as apiDeleteProduct,
  getAllProducts as apiFetchProducts,
  getProductById as apiGetProductById,
  getProductBySlug as apiGetProductBySlug,
  getSimilarProducts as apiGetSimilarProducts,
  productSearch as apiSearchProducts,
  updateProduct as apiUpdateProduct
} from '@/services/product.service'

import type { Product } from '@/services/api'
import type { EnhancedProduct } from '@/services/product.service'
import type { ProductListState } from '@/stores/types'
export const useProductStore = defineStore('product', {
  state: (): ProductListState => ({
    products: [],
    count: 0,
    next: null,
    previous: null,
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchProducts(limit = 10, offset = 0, category = '') {
      this.loading = true
      this.error = null

      try {
        const response = await apiFetchProducts({ limit, offset, category })

        this.products = response.results
        this.count = response.count
        this.next = response.next
        this.previous = response.previous
      } catch (error) {
        this.error = 'Failed to load products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchProductsByCategory(category: number) {
      await this.fetchProducts(10, 0, String(category))
    },

    async searchProducts(query: { q: string; limit?: number; offset?: number }) {
      this.loading = true
      this.error = null

      try {
        const response = await apiSearchProducts(query)
        this.products = response.results.map((product: Product) =>
          convertProductToEnhanced(product)
        )
        this.count = response.count
        this.next = response.next
        this.previous = response.previous
      } catch (error) {
        this.error = 'Failed to search products'
        console.error('Error searching products:', error)
      } finally {
        this.loading = false
      }
    },
    async loadNextPage() {
      if (this.next) {
        const offset = new URL(this.next).searchParams.get('offset') || '0'
        const limit = new URL(this.next).searchParams.get('limit') || '10'
        await this.fetchProducts(parseInt(limit, 10), parseInt(offset, 10))
      }
    },

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
        const temptProduct: EnhancedProduct = {
          id: response.id || 0,
          slug: response.slug || '',
          ...product
        }
        this.products.push(temptProduct)
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
        const tempt = this.products.find((product) => product.id === productId)
        if (tempt) {
          this.selectedProduct = tempt
        } else {
          const response = await apiGetProductById(productId)
          this.selectedProduct = {
            id: response.id || 0,
            slug: response.slug || '',
            ...response
          }
        }
        return this.selectedProduct
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
        const tempt = this.products.find((product) => product.slug === slug)
        this.selectedProduct = convertProductToEnhanced(tempt || (await apiGetProductBySlug(slug)))

        const similarProducts = await apiGetSimilarProducts(this.selectedProduct.id)
        console.log('🚀 ~ getProductBySlug ~ similarProducts:', similarProducts)
        this.similarProducts = similarProducts.results.map((product) =>
          convertProductToEnhanced(product)
        )

        return this.selectedProduct
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
        this.selectedProduct = this.products[index]
        return this.selectedProduct
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

    resetState() {
      this.products = []
      this.selectedProduct = null
      this.loading = false
      this.error = null
    }
  }
})
