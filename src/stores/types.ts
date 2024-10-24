import type { UserList, UserDetail } from '@/services'
import type { Category } from '@/services'
import type { EnhancedProduct } from '@/services/product.service'
import type { UserProfile } from '@/services'

export interface ProductListState {
  products: EnhancedProduct[]
  count: number
  next: string | null | undefined
  previous: string | null | undefined
  selectedProduct: EnhancedProduct | null
  similarProducts: EnhancedProduct[]
  loading: boolean
  error: string | null
}

export interface CartItem extends EnhancedProduct {
  quantity: number
}

export interface UserPagingList {
  users: UserList[]
  selectedUser: UserDetail | null
  count: number
  next: string | null | undefined
  previous: string | null | undefined
  loading: boolean
  error: string | null
}

export interface authState {
  user: UserProfile | null
  token: string | null
  loading: boolean
  error: string | null
}

export interface CategoryState {
  categories: Category[]
  error: string | null
  isInitialFetch: boolean
  loading: boolean
}
