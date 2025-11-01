"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Star } from "lucide-react"
import { getImageUrl } from "@/lib/image-utils"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  avgRating?: number
  reviewsCount?: number
  stock?: number
}

export function ProductCard({ id, name, price, image, category, avgRating, reviewsCount, stock }: ProductCardProps) {
  const { addToCart, cartItems } = useCart()
  const inCart = cartItems.some((i) => i.id === id)
  const [formattedPrice, setFormattedPrice] = useState<string>(String(Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0))
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({ id, name, price, image, stock })
  }, [addToCart, id, name, price, image, stock])

  // After mount, format with fa-IR to avoid SSR/CSR mismatch
  useEffect(() => {
    try {
      const val = Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0
      setFormattedPrice(new Intl.NumberFormat('fa-IR').format(val))
    } catch {
      // Fallback: keep numeric string
    }
  }, [price])

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
      <Link href={`/product/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50">
          <Image
            src={getImageUrl(image)}
            alt={name}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
              {category}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <div className="absolute bottom-3 left-3 right-3">
              <Button
              size="sm"
              className="w-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white/95 hover:bg-white text-gray-900 border-0 shadow-lg"
              onClick={(e) => {
                handleAddToCart(e)
              }}
              disabled={inCart}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              افزودن به سبد خرید
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base leading-tight line-clamp-2">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900" suppressHydrationWarning>
            {formattedPrice} تومان
            </p>
            {typeof avgRating === 'number' && typeof reviewsCount === 'number' ? (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="text-xs text-gray-500">({reviewsCount})</span>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  )
}
