import { api, type AddToCart } from '.'

export const addToCart = async (addToCartData: AddToCart) => {
  try {
    const response = await api.carts.cartsItemsCreate(addToCartData)
    return response.data
  } catch (error) {
    console.error('Failed to add to carts:', error)
    throw new Error('Failed to add to carts')
  }
}

export const fetchCart = async () => {
  try {
    const response = await api.carts.cartsList()
    return response.data
  } catch (error) {
    console.error('Failed to get carts:', error)
    throw new Error('Failed to get carts')
  }
}

export const updateQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await api.carts.cartsItemsPartialUpdate(productId, { quantity })
    return response.data
  } catch (error) {
    console.error('Failed to update quantity:', error)
    throw new Error('Failed to update quantity')
  }
}

export const removeFromCart = async (productId: string) => {
  try {
    const response = await api.carts.cartsItemsDelete(productId)
    return response.data
  } catch (error) {
    console.error('Failed to remove from cart:', error)
    throw new Error('Failed to remove from cart')
  }
}
