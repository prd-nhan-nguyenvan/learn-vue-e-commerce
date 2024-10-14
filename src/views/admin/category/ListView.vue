<template>
  <main class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Categories</h1>
      <button @click="toggleForm" class="btn btn-primary">
        {{ showForm ? 'Cancel' : 'Add Category' }}
      </button>
    </div>

    <div v-if="showForm" class="card mb-4 shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="card-title mb-0">Add New Category</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveCategory">
          <div class="mb-3">
            <label for="categoryName" class="form-label">Category Name</label>
            <input
              type="text"
              id="categoryName"
              v-model="newCategory.name"
              class="form-control"
              placeholder="Enter category name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="categoryDescription" class="form-label">Category Description</label>
            <textarea
              id="categoryDescription"
              v-model="newCategory.description"
              class="form-control"
              placeholder="Enter category description"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" @click="showForm = false" class="btn btn-secondary me-2">
              Cancel
            </button>
            <button type="submit" class="btn btn-success">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="d-flex justify-content-center my-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-show="error" class="alert alert-danger text-center" role="alert">
      {{ error }}
    </div>

    <!-- Categories Table -->
    <div v-if="!loading && categories.length" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col" class="text-nowrap">Category Name</th>
            <th scope="col" class="text-nowrap">Description</th>
            <th scope="col" class="text-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in categories" :key="category.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <div v-if="!category.isEditing">
                {{ category.name }}
              </div>
              <div v-else>
                <input
                  type="text"
                  v-model="category.name"
                  class="form-control"
                  @keyup.enter="updateCategory(category)"
                />
              </div>
            </td>
            <td>
              <div v-if="!category.isEditing">
                {{ category.description }}
              </div>

              <div v-else>
                <input
                  type="text"
                  v-model="category.description"
                  class="form-control"
                  @keyup.enter="updateCategory(category)"
                />
              </div>
            </td>
            <td>
              <div v-if="!category.isEditing" class="d-flex">
                <button @click="editFieldCategory(category)" class="btn btn-sm btn-warning me-2">
                  <i class="material-icons">edit</i>
                </button>

                <button @click="deleteCategory(category.id)" class="btn btn-sm btn-danger">
                  <i class="material-icons">delete</i>
                </button>
              </div>
              <div v-else class="d-flex justify-content-start mt-2">
                <button @click="updateCategory(category)" class="btn btn-success btn-sm me-2">
                  <i class="material-icons">save</i>
                </button>
                <button @click="finishEditing(category)" class="btn btn-secondary btn-sm">
                  <i class="material-icons">cancel</i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'
import { onMounted, computed, ref } from 'vue'
import type { Category } from '@/services/api'
import Swal from 'sweetalert2'

const categoryStore = useCategoryStore()
const { fetchCategories } = categoryStore

const categories = computed(() => categoryStore.categories)
const loading = computed(() => categoryStore.loading)
const error = computed(() => categoryStore.error)

const showForm = ref(false)
const newCategory = ref<Category>({ name: '', slug: '' })

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm() // Reset form data when hiding the form
  }
}

const resetForm = () => {
  newCategory.value = { name: '', description: '' }
}

const saveCategory = async () => {
  if (!newCategory.value.name || !newCategory.value.description) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill out all fields!'
    })
    return
  }

  await categoryStore.addCategory(newCategory.value)

  Swal.fire({
    icon: 'success',
    title: 'Category Added',
    text: 'The new category has been added successfully!',
    timer: 2000
  })

  resetForm()
  showForm.value = false
}

const editFieldCategory = (category) => {
  category.isEditing = true // Set the category to editing mode
}
const finishEditing = (category) => {
  category.isEditing = false // Exit editing mode without saving
}
const updateCategory = async (category) => {
  if (!category.name) {
    alert('Please provide a name for the category')
    return
  }

  await categoryStore.updateCategory(category) // Assuming you have an updateCategory method
  category.isEditing = false // Exit editing mode after saving
}

const deleteCategory = async (categoryId: number) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Perform the delete action
      await categoryStore.deleteCategory(categoryId)
      Swal.fire({
        title: 'Deleted!',
        text: 'The category has been deleted.',
        icon: 'success',
        timer: 2000
      })
    }
  })
}

onMounted(() => {
  fetchCategories()
})
</script>
