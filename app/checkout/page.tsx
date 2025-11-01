"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User } from "lucide-react"

export default function CheckoutPage() {
  const { user, cartItems } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/register")
    }
  }, [user, isLoading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle checkout logic
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  // Show login required message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 bg-destructive/10 rounded-full">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  </div>
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                  ورود الزامی است
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  برای تکمیل سفارش خود، ابتدا باید وارد حساب کاربری خود شوید یا ثبت نام کنید.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      <User className="mr-2 h-5 w-5" />
                      ثبت نام / ورود
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/shop">بازگشت به فروشگاه</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-8">پرداخت</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">اطلاعات تماس</h2>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card p-6 rounded-lg border border-border space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">آدرس ارسال</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">آدرس</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">شهر</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">کشور</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* حذف اطلاعات پرداخت طبق درخواست کاربر */}

              {/* Order Summary با تصویر محصولات */}
              <div className="bg-muted p-6 rounded-lg space-y-4">
                <h2 className="font-serif text-2xl font-bold text-foreground">خلاصه سفارش</h2>
                <div className="space-y-4">
                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-3 border">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover border"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">تعداد: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-semibold text-foreground whitespace-nowrap">
                          {Number(item.price * item.quantity).toFixed(0).toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">سبد خرید خالی است</p>
                  )}

                  {/* جمع‌ها */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>جمع جزء</span>
                      <span>{(() => {
                        const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
                        return Number(subtotal).toFixed(0).toLocaleString('fa-IR')
                      })()} تومان</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>هزینه ارسال</span>
                      <span>رایگان</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between text-foreground font-semibold text-xl">
                        <span>جمع کل</span>
                        <span>{(() => {
                          const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
                          return Number(total).toFixed(0).toLocaleString('fa-IR')
                        })()} تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                تکمیل سفارش
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
