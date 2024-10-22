import { defineStore } from 'pinia'

import { ROLE_ADMIN } from '@/helpers'
import {
  blockUser as apiBlockUser,
  getUserById as apiGetUserByID,
  getUserList as apiGetAllUser
} from '@/services/user.service'

import type { UserList } from '@/services'
import type { userListQuery } from '@/services/user.service'
import type { UserPagingList as userStoreState } from './types'

export const useUserStore = defineStore('user', {
  state: (): userStoreState => ({
    users: [],
    selectedUser: null,
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchUsers(query?: userListQuery) {
      this.loading = true
      this.error = null

      try {
        const response = await apiGetAllUser(query)
        this.users = response.results
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

    // Add a function to load the next page of products
    async loadNextPage() {
      if (this.next) {
        const query: userListQuery = {
          limit: parseInt(new URL(this.next).searchParams.get('limit') || '10'),
          offset: parseInt(new URL(this.next).searchParams.get('offset') || '0'),
          ordering: new URL(this.next).searchParams.get('ordering') || '',
          search: new URL(this.next).searchParams.get('search') || '',
          email: new URL(this.next).searchParams.get('email') || '',
          is_active: new URL(this.next).searchParams.get('is_active') || ''
        }
        await this.fetchUsers(query)
      }
    },

    // Add a function to load the previous page of products
    async loadPreviousPage() {
      if (this.previous) {
        const query: userListQuery = {
          limit: parseInt(new URL(this.previous).searchParams.get('limit') || '10'),
          offset: parseInt(new URL(this.previous).searchParams.get('offset') || '0'),
          ordering: new URL(this.previous).searchParams.get('ordering') || '',
          search: new URL(this.previous).searchParams.get('search') || '',
          email: new URL(this.previous).searchParams.get('email') || '',
          is_active: new URL(this.previous).searchParams.get('is_active') || ''
        }
        await this.fetchUsers(query)
      }
    },

    async getUserById(userId: number) {
      this.loading = true
      this.error = null

      try {
        const response = await apiGetUserByID(userId)
        this.selectedUser = response
        return response
      } catch (error) {
        this.error = 'Failed to load product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },
    async blockUser(user: UserList) {
      if (user.role === ROLE_ADMIN) {
        throw new Error('Cannot block admin') // Throw an error if trying to block an admin
      }

      try {
        await apiBlockUser(user.id)

        const index = this.users.findIndex((p) => p.id === user.id)
        if (index !== -1) {
          this.users[index].is_active = false
        }
      } catch (error) {
        console.error('Error blocking user:', error)
        throw new Error('Failed to block user. Please try again later.') // Throw a user-friendly error message
      }
    },
    resetState() {
      this.users = []
      this.selectedUser = null
      this.loading = false
      this.error = null
    }
  }
})
