"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  stock?: number
}

interface User {
  _id: string
  phone: string
  username: string
  firstName?: string
  lastName?: string
  email?: string
  roles?: string[]
  addresses?: any[]
}

interface CartContextType {
  cartItems: CartItem[]
  items: CartItem[]
  user: User | null
  isInitialized: boolean
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  login: (phone: string, roles?: string[], userDataFromAPI?: any) => void
  logout: () => void
  addAddress: (address: any) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }

        const savedUser = localStorage.getItem("user")
        const savedToken = localStorage.getItem("token") || localStorage.getItem("auth-token")
        
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } else if (savedToken) {
          // اگر user نداریم ولی token داریم، از API بگیریم
          // این در useEffect جداگانه بعد از initialize انجام می‌شود
        }
      } catch (error) {
        console.error("Error loading cart/user from localStorage:", error)
      }
      setIsInitialized(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isInitialized])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && isInitialized) {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user, isInitialized])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const login = (phone: string, roles?: string[], userDataFromAPI?: any) => {
    // Extract phone number if it's in format shop_2XXXXXXXXXX
    const cleanPhone = phone.replace(/^shop_2/, '')
    
    // Use API data if available, otherwise create basic user
    const userData: User = userDataFromAPI ? {
      _id: userDataFromAPI._id || '',
      phone: userDataFromAPI.phone || cleanPhone,
      username: userDataFromAPI.username || userDataFromAPI.phone || cleanPhone,
      firstName: userDataFromAPI.firstName,
      lastName: userDataFromAPI.lastName,
      email: userDataFromAPI.email,
      roles: userDataFromAPI.roles || roles || ['USER'],
      addresses: userDataFromAPI.addresses || [],
    } : {
      _id: '',
      phone: cleanPhone,
      username: cleanPhone,
      roles: roles || ['USER'],
    }
    
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Save token if exists
    const token = localStorage.getItem('token') || localStorage.getItem('auth-token')
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('auth-token', token)
    }
  }

  const logout = () => {
    setUser(null)
    setCartItems([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("auth-token")
      localStorage.removeItem("cart")
    }
  }

  const addAddress = (address: any) => {
    if (user) {
      const updatedUser = {
        ...user,
        addresses: [...(user.addresses || []), address],
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        items: cartItems,
        user,
        isInitialized,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        logout,
        addAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

