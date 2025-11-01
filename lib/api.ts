const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-store-luxury-4.onrender.com'

// Log API base URL for debugging (only in development or when URL is used)
if (typeof window !== 'undefined') {
  console.log('[API] Base URL:', API_BASE_URL)
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || localStorage.getItem('auth-token') || ''
  }
  return ''
}

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  // Log request for debugging
  console.log('[API Request]', options.method || 'GET', url)

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      mode: 'cors', // Enable CORS
      credentials: 'include', // Include credentials for CORS
      cache: 'no-store', // Don't cache API calls
    })

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text }
    }

    if (!response.ok) {
      // Handle rate limiting (429)
      if (response.status === 429) {
        const errorMessage = data.error || data.message || 'تعداد درخواست‌های شما از حد مجاز بیشتر است. لطفاً کمی صبر کنید.'
        const err = new Error(errorMessage)
        ;(err as any).status = 429
        throw err
      }
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error: any) {
    console.error('API call error:', error)
    console.error('API URL:', url)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
    
    // Handle network errors (CORS, connection refused, etc.)
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      const errorMsg = `خطا در اتصال به سرور. لطفاً بررسی کنید:
1. Backend در دسترس است: ${API_BASE_URL}
2. Domain frontend در تنظیمات CORS backend اضافه شده است
3. Network connection فعال است`
      console.error('[API Error]', errorMsg)
      throw new Error(errorMsg)
    }
    
    // Handle CORS errors specifically
    if (error.message && (error.message.includes('CORS') || error.message.includes('cors'))) {
      const corsError = 'خطای CORS: لطفاً domain frontend را در تنظیمات CORS backend اضافه کنید'
      console.error('[CORS Error]', corsError)
      throw new Error(corsError)
    }
    
    // Handle blocked by client
    if (error.message && error.message.includes('blocked')) {
      throw new Error('درخواست توسط مرورگر مسدود شد. احتمالاً مشکل CORS است.')
    }
    
    // Re-throw with original error if it already has a message
    if (error.message) {
      throw error
    }
    throw new Error('خطا در ارتباط با سرور')
  }
}

// Auth API
export const authApi = {
  sendOtp: async (phone: string) => {
    return apiCall('/api/v1/auth/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    })
  },

  verifyOtp: async (phone: string, otp: string) => {
    return apiCall('/api/v1/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    })
  },

  getMe: async () => {
    return apiCall('/api/v1/auth/me', {
      method: 'GET',
    })
  },
}

// Product API
export const productApi = {
  getAllProducts: async (params?: { 
    page?: number
    limit?: number
    search?: string
    category?: string
    isActive?: boolean
    featured?: boolean
    collectionId?: string
    collection?: string // Alias for collectionId
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive))
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured))
    if (params?.collectionId) queryParams.append('collectionId', params.collectionId)
    if (params?.collection) queryParams.append('collectionId', params.collection)

    const query = queryParams.toString()
    return apiCall(`/api/v1/products${query ? `?${query}` : ''}`)
  },

  getProduct: async (id: string) => {
    return apiCall(`/api/v1/products/${id}`)
  },

  createProduct: async (data: FormData) => {
    const token = getAuthToken()
    return fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
      mode: 'cors',
      credentials: 'include',
    }).then(res => res.json())
  },

  updateProduct: async (id: string, data: FormData) => {
    const token = getAuthToken()
    return fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: data,
      mode: 'cors',
      credentials: 'include',
    }).then(res => res.json())
  },

  deleteProduct: async (id: string) => {
    return apiCall(`/api/v1/products/${id}`, {
      method: 'DELETE',
    })
  },
}

// Collection API
export const collectionApi = {
  getAllCollections: async (params?: { 
    page?: number
    limit?: number
    search?: string
    isActive?: boolean
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.search) queryParams.append('search', params.search)
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive))

    const query = queryParams.toString()
    return apiCall(`/api/v1/collections${query ? `?${query}` : ''}`)
  },

  getCollection: async (id: string) => {
    return apiCall(`/api/v1/collections/${id}`)
  },

  createCollection: async (data: any) => {
    return apiCall('/api/v1/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateCollection: async (id: string, data: any) => {
    return apiCall(`/api/v1/collections/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  deleteCollection: async (id: string) => {
    return apiCall(`/api/v1/collections/${id}`, {
      method: 'DELETE',
    })
  },
}

// Comment API
export const commentApi = {
  getAllComments: async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    const query = queryParams.toString()
    return apiCall(`/api/v1/comments${query ? `?${query}` : ''}`)
  },

  getProductComments: async (productId: string, params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    const query = queryParams.toString()
    return apiCall(`/api/v1/comments/product/${productId}${query ? `?${query}` : ''}`)
  },

  getProductCommentsSummary: async (productId: string) => {
    return apiCall(`/api/v1/comments/product/${productId}/summary`)
  },

  createComment: async (data: { productId: string; content: string; rating: number }) => {
    return apiCall('/api/v1/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateCommentStatus: async (commentId: string, status: string) => {
    return apiCall(`/api/v1/comments/${commentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  updateStatus: async (commentId: string, status: string) => {
    return commentApi.updateCommentStatus(commentId, status)
  },

  deleteComment: async (commentId: string) => {
    return apiCall(`/api/v1/comments/${commentId}`, {
      method: 'DELETE',
    })
  },

  updateReplyStatus: async (commentId: string, replyId: string, status: string) => {
    return apiCall(`/api/v1/comments/${commentId}/replies/${replyId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  deleteReply: async (commentId: string, replyId: string) => {
    return apiCall(`/api/v1/comments/${commentId}/replies/${replyId}`, {
      method: 'DELETE',
    })
  },

  createReply: async (commentId: string, data: { content: string }) => {
    return apiCall(`/api/v1/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// User API
export const userApi = {
  getAllUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.search) queryParams.append('search', params.search)
    const query = queryParams.toString()
    return apiCall(`/api/v1/users${query ? `?${query}` : ''}`)
  },

  getBannedUsers: async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    const query = queryParams.toString()
    return apiCall(`/api/v1/users/banned${query ? `?${query}` : ''}`)
  },

  banUser: async (userId: string) => {
    return apiCall(`/api/v1/users/ban/${userId}`, {
      method: 'POST',
    })
  },

  unbanUser: async (userId: string) => {
    return apiCall(`/api/v1/users/unban/${userId}`, {
      method: 'POST',
    })
  },

  updateMe: async (data: any) => {
    return apiCall('/api/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },
}

// Notification API
export const notificationApi = {
  getAll: async (params?: { page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', String(params.page))
    if (params?.limit) queryParams.append('limit', String(params.limit))
    const query = queryParams.toString()
    return apiCall(`/api/v1/notifications${query ? `?${query}` : ''}`)
  },

  list: async (params?: { page?: number; limit?: number }) => {
    return notificationApi.getAll(params)
  },

  markRead: async (id: string) => {
    return apiCall(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
    })
  },

  markAllRead: async () => {
    return apiCall('/api/v1/notifications/read-all', {
      method: 'PATCH',
    })
  },
}

// Contact API
export const contactApi = {
  send: async (data: { name: string; email?: string; phone?: string; message: string; subject?: string }) => {
    return apiCall('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// Address API
export const addressApi = {
  createAddress: async (data: any) => {
    return apiCall('/api/v1/users/me/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateAddress: async (addressId: string, data: any) => {
    return apiCall(`/api/v1/users/me/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  deleteAddress: async (addressId: string) => {
    return apiCall(`/api/v1/users/me/addresses/${addressId}`, {
      method: 'DELETE',
    })
  },

  getAddresses: async () => {
    return apiCall('/api/v1/users/me/addresses', {
      method: 'GET',
    })
  },
}

