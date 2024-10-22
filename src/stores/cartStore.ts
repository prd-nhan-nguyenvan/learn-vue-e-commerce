import { defineStore } from 'pinia'

import {
  addToCart as addToCartService,
  fetchCart as fetchCartService,
  removeFromCart as removeFromCartService,
  updateQuantity as updateQuantityService
} from '@/services/cart.service'
import { getProductById } from '@/services/product.service'

import type { EnhancedProduct } from '@/services/product.service'
import type { CartItem } from '@/stores/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as Array<CartItem>
  }),
  actions: {
    async fetchCart() {
      try {
        const response = await fetchCartService()
        const items = response.items ?? []

        // get product details for each item
        const productPromises = items.map((item) => getProductById(item.product as number))

        const products = await Promise.all(productPromises)
        this.items = products.map((product, index) => {
          return {
            ...product,
            id: product.id as number,
            slug: product.slug as string,
            quantity: items[index].quantity ?? 0
          }
        })
      } catch (error) {
        console.error('Failed to fetch cart:', error)
        throw new Error('Failed to fetch cart')
      }
    },
    async addToCart(item: EnhancedProduct) {
      try {
        const addToCartData = {
          product_id: item.id,
          quantity: 1
        }
        await addToCartService(addToCartData)

        const existingItem = this.items.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
          existingItem.quantity++
        } else {
          this.items.push({ ...item, quantity: 1 })
        }
      } catch (error) {
        console.error('Failed to add to cart:', error)
        throw new Error('Failed to add to cart')
      }
    },
    async removeFromCart(itemId: number) {
      try {
        await removeFromCartService(String(itemId))
        this.items = this.items.filter((item) => item.id !== itemId)
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        throw new Error('Failed to remove from cart')
      }
    },
    clearCart() {
      this.items = []
    },
    async updateQuantity(id: number, quantity: number) {
      try {
        await updateQuantityService(String(id), quantity)
        const item = this.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      } catch (error) {
        console.error('Failed to update quantity:', error)
        throw new Error('Failed to update quantity')
      }
    }
  },
  getters: {
    cartTotal: (state) =>
      state.items.reduce((total, item) => {
        const price = Number(item.on_sell ? item.sell_price : item.price)
        return total + item.quantity * price
      }, 0),
    countItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartItems: (state) => state.items,
    itemQuantity: (state) => (id: number) => {
      const item = state.items.find((item) => item.id === id)
      return item?.quantity ?? 0
    }
  }
})
