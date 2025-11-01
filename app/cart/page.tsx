"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthGuard } from "@/components/auth-guard"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const f = new Intl.NumberFormat('fa-IR')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8">سبد خرید</h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-6">سبد خرید شما خالی است</p>
                <Button asChild>
                  <Link href="/shop">ادامه خرید</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{item.name}</h3>
                          <p className="text-lg font-semibold text-foreground">{f.format(Math.round(item.price))} تومان</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={typeof (item as any).stock === 'number' && item.quantity >= (item as any).stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">حذف محصول</span>
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-card p-6 rounded-lg border border-border sticky top-24 space-y-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground">خلاصه سفارش</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between text-muted-foreground">
                        <span>جمع جزء</span>
                        <span>{f.format(Math.round(subtotal))} تومان</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>هزینه ارسال</span>
                        <span>{shipping === 0 ? "رایگان" : `${f.format(Math.round(shipping))} تومان`}</span>
                      </div>
                      <div className="pt-3 border-t border-border">
                        <div className="flex justify-between text-foreground font-semibold text-lg">
                          <span>جمع کل</span>
                          <span>{f.format(Math.round(total))} تومان</span>
                        </div>
                      </div>
                    </div>

                    <AuthGuard>
                      <Button size="lg" className="w-full" asChild>
                        <Link href="/checkout">ادامه به پرداخت</Link>
                      </Button>
                    </AuthGuard>

                    <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                      <Link href="/shop">ادامه خرید</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
