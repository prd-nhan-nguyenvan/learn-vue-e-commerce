<template>
  <div class="container my-5">
    <!-- Display warning message -->
    <div v-if="message" class="alert alert-warning text-center" role="alert">
      {{ message }}
    </div>
    <ProductListView></ProductListView>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductListView from './products/ListView.vue'
import { useSystemMessageStore } from '@/stores'

const systemMessageStore = useSystemMessageStore()
const message = computed(() => systemMessageStore.message)
</script>
