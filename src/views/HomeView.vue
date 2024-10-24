<template>
  <div class="container my-5">
    <HeroSection @search="searchProduct"></HeroSection>

    <!-- Product -->
    <div class="featured-products my-5">
      <ProductListView></ProductListView>
    </div>

    <!-- Testimonials -->
    <div class="testimonials my-5">
      <h2 class="text-center">What Our Customers Say</h2>
      <div class="testimonial-item">
        <p>"Great products and amazing service!" - Jane Doe</p>
      </div>
      <div class="testimonial-item">
        <p>"I love shopping here!" - John Smith</p>
      </div>
    </div>

    <!-- Newsletter Signup -->
    <div class="newsletter-signup text-center my-5">
      <h2>Stay Updated</h2>
      <p>Sign up for our newsletter to get the latest updates and offers.</p>
      <input type="email" placeholder="Enter your email" class="form-control my-2" />
      <button class="btn btn-primary">Subscribe</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import ProductListView from './products/ListView.vue'
import { useProductStore } from '@/stores'

const productStore = useProductStore()

const searchProduct = async (searchText: string) => {
  if (!searchText.trim()) {
    return
  }
  const query: { q: string; limit?: number; offset?: number } = {
    q: searchText.trim()
  }
  await productStore.searchProducts(query)
}
</script>
