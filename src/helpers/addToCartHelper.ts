import type { EnhancedProduct } from '@/services/product.service'
import Swal from 'sweetalert2'

import { useAuthStore, useCartStore } from '@/stores'

import type { Router } from 'vue-router'

export const addToCartHelper = async (product: EnhancedProduct, router: Router) => {
  const cartStore = useCartStore()
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
  } else {
    try {
      await cartStore.addToCart(product)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product added to cart',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Oops! Something went wrong. Please try again later.'
      })
    }
  }
}
