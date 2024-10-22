export const formatCurrency = (price: string | number | undefined) => {
  if (price) {
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      priceNumber
    )
  } else return ''
}
