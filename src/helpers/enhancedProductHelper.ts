import type { Product } from '@/services'
import type { EnhancedProduct } from '@/services/product.service'

export const convertProductToEnhanced = (product: Product): EnhancedProduct => {
  if (typeof product.id === 'number' && typeof product.slug === 'string') {
    return {
      id: product.id as number,
      slug: product.slug as string,
      ...product
    }
  } else {
    throw new Error('Invalid product')
  }
}
