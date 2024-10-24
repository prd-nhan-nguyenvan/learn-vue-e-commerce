import { defineStore } from 'pinia'

import {
  addNewCategory,
  deleteCategory,
  getAllCategories,
  updateCategory
} from '@/services/product.service'

import type { Category } from '@/services/api'
import type { CategoryState } from '@/stores/types'

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    loading: false,
    error: null,
    isInitialFetch: false
  }),
  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      this.isInitialFetch = true

      try {
        const response = await getAllCategories()
        this.categories = response
      } catch (error) {
        this.error = 'Failed to load categories'
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },
    async getCategoryIdBySlug(slug: string) {
      if (!this.isInitialFetch) {
        await this.fetchCategories()
      }
      const category = this.categories.find((category) => category.slug === slug)
      return category ? category.id : null
    },

    async addCategory(newCategory: Category) {
      this.loading = true
      this.error = null

      try {
        const response = await addNewCategory(newCategory)
        this.categories.push(response)
      } catch (error) {
        this.error = 'Failed to add category'
        console.error('Error adding category:', error)
      } finally {
        this.loading = false
      }
    },

    async updateCategory(updatedCategory: Category) {
      this.loading = true
      this.error = null
      if (!updatedCategory.id) return
      try {
        const response = await updateCategory(updatedCategory.id, updatedCategory)
        const index = this.categories.findIndex((category) => category.id === updatedCategory.id)
        if (index !== -1) {
          this.categories.splice(index, 1, response)
        }
      } catch (error) {
        this.error = 'Failed to update category'
        console.error('Error updating category:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(categoryId: number) {
      this.loading = true
      this.error = null

      try {
        await deleteCategory(categoryId)
        this.categories = this.categories.filter((category) => category.id !== categoryId)
      } catch (error) {
        this.error = 'Failed to delete category'
        console.error('Error deleting category:', error)
      } finally {
        this.loading = false
      }
    },

    resetState() {
      this.categories = []
      this.loading = false
      this.error = null
    }
  }
})
