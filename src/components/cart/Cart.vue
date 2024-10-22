<template>
  <div class="container mt-4">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0" class="alert alert-info">Your cart is empty.</div>

    <table v-else class="table mb-3">
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td>
            <router-link
              :to="{ name: 'productDetail', params: { slug: item.slug } }"
              class="text-decoration-none text-dark"
            >
              <span class="fw-bold">{{ item.name }}</span> <br />
              <!-- Product thumbnail -->
              <img
                :src="item.image ?? ''"
                :alt="item.name"
                class="img-fluid"
                style="max-width: 100px"
              />
            </router-link>
          </td>
          <td>{{ formatCurrency(item.price) }}</td>
          <td>
            <div class="input-group input-group-sm" style="width: 120px">
              <button class="btn btn-outline-secondary" @click="decreaseQuantity(item)">-</button>
              <input type="text" class="form-control text-center" :value="item.quantity" disabled />
              <button class="btn btn-outline-secondary" @click="increaseQuantity(item)">+</button>
            </div>
          </td>
          <td>
            <button class="btn btn-sm btn-danger" @click="removeFromCart(item.id)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="cartItems.length > 0" class="d-flex justify-content-end align-items-center mt-3">
      <span class="me-3 fw-bold">Subtotal ({{ countItems }} items):</span>
      <span class="h4 text-primary">{{ formatCurrency(String(cartTotal)) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores'
import type { CartItem } from '@/stores/types'
import { computed } from 'vue'

import { formatCurrency } from '@/helpers'
import Swal from 'sweetalert2'

const cartStore = useCartStore()
const cartItems = computed(() => cartStore.cartItems)
const cartTotal = computed(() => cartStore.cartTotal)
const countItems = computed(() => cartStore.countItems)

const removeFromCart = (itemId: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to remove this item from your cart?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      cartStore.removeFromCart(itemId)
      Swal.fire({
        title: 'Removed!',
        text: 'The item has been removed from your cart.',
        icon: 'success',
        timer: 1000
      })
    }
  })
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity === 1) {
    return removeFromCart(item.id)
  }
  cartStore.updateQuantity(item.id, item.quantity - 1)
}

const increaseQuantity = (item: CartItem) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
}
</script>
