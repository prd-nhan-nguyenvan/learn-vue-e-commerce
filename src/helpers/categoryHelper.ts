import { getCategoryById } from '@/services/product.service'

export const getCategoryName = (categoryId: number | undefined): Promise<string> => {
  if (!categoryId) return Promise.resolve('Unknown')

  return getCategoryById(categoryId)
    .then((category) => {
      return category ? category.name : 'Unknown'
    })
    .catch(() => 'Unknown')
}
