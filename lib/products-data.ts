export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  material: string
  description: string
  details: {
    material: string
    dimensions: string
    weight: string
    craftedBy: string
    unique: string
  }
  images: string[]
  shipping: string
  returns: string
  care: string
}

export const products: Product[] = []

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const currentProduct = getProductById(productId)
  if (!currentProduct) return []

  // Get products from the same category, excluding the current product
  const relatedByCategory = products.filter(
    (product) => product.category === currentProduct.category && product.id !== productId,
  )

  // If we have enough products from the same category, return them
  if (relatedByCategory.length >= limit) {
    return relatedByCategory.slice(0, limit)
  }

  // Otherwise, fill with other products
  const otherProducts = products.filter(
    (product) => product.category !== currentProduct.category && product.id !== productId,
  )

  return [...relatedByCategory, ...otherProducts].slice(0, limit)
}
