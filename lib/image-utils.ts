// Utility function to get full image URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-store-luxury-4.onrender.com'

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/modern-furniture-collection.png'
  }
  
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it starts with /images/, prepend backend URL
  if (imagePath.startsWith('/images/')) {
    return `${API_BASE_URL}${imagePath}`
  }
  
  // If it starts with /, prepend backend URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`
  }
  
  // Otherwise, assume it's a local path and prepend /images/
  return `${API_BASE_URL}/images/${imagePath}`
}

// Helper to get the first image from an array
export function getProductImage(images: string[] | null | undefined, fallback?: string): string {
  const image = images?.[0]
  return getImageUrl(image || fallback)
}
