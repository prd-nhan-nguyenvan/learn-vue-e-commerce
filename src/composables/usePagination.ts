import { ref, computed } from 'vue'

export function usePagination(fetchItems: (query: any) => Promise<void>, itemsPerPage = 10) {
  const currentPage = ref(1)
  const totalCount = ref(0)
  const loading = ref(false)

  const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage))

  const goToPage = async (page: number, query: any = {}) => {
    // Added query parameter
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    const offset = (page - 1) * itemsPerPage
    loading.value = true
    await fetchItems({ limit: itemsPerPage, offset, ...query }) // Pass query here
    loading.value = false
  }

  const loadPrevious = async (query: any = {}) => {
    // Added query parameter
    if (currentPage.value > 1) {
      await goToPage(currentPage.value - 1, query) // Pass query to goToPage
    }
  }

  const loadNext = async (query: any = {}) => {
    // Added query parameter
    if (currentPage.value < totalPages.value) {
      await goToPage(currentPage.value + 1, query) // Pass query to goToPage
    }
  }

  return {
    currentPage,
    totalPages,
    goToPage,
    loadPrevious,
    loadNext,
    loading,
    setTotalCount: (count: number) => {
      totalCount.value = count
    }
  }
}
