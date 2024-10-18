<template>
  <div class="container my-4">
    <nav aria-label="Page navigation" v-if="!loading && totalPages && totalPages > 1">
      <ul class="pagination justify-content-center">
        <!-- Previous Button -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }" @click="handlePrevious">
          <span class="page-link" aria-hidden="true">&laquo;</span>
        </li>

        <!-- Page Numbers -->
        <li
          v-for="page in totalPages"
          :key="page"
          :class="['page-item', { active: currentPage === page }]"
          @click="() => emitGoToPage(page)"
        >
          <span class="page-link" v-if="Math.abs(page - currentPage) < 5">{{ page }}</span>
        </li>

        <!-- Next Button -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }" @click="handleNext">
          <span class="page-link" aria-hidden="true">&raquo;</span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, onMounted } from 'vue'

// Define props
const props = defineProps<{
  currentPage: number
  totalPages: number
  loading: boolean
}>()

// Define emit
const emit = defineEmits(['previous', 'next', 'goToPage'])

// Event handlers
const handlePrevious = (event: MouseEvent) => {
  if (!props.loading && props.currentPage > 1) {
    emit('previous')
  }
}

const handleNext = (event: MouseEvent) => {
  if (!props.loading && props.currentPage < props.totalPages) {
    emit('next')
  }
}

const emitGoToPage = (page: number) => {
  if (!props.loading && props.currentPage !== page) {
    emit('goToPage', page)
  }
}

onMounted(() => {
  console.log(props.totalPages)
})
</script>
