"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
// import { authApi, ApiError } from "@/lib/api" // حذف شد - حالا از fetch استفاده می‌کنیم

export default function RegisterPage() {
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"phone" | "verify">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const { user, login } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/profile")
    }
  }, [user, router])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-store-luxury-4.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
        mode: 'cors',
        credentials: 'include',
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      // ابتدا response رو به text تبدیل کن
      const responseText = await response.text()
      console.log('Response text:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed data:', data)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('سرور پاسخ نامعتبری ارسال کرده است')
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'خطا در ارسال کد تایید')
      }
      
      setStep("verify")
      toast.success("کد تایید به شماره موبایل شما ارسال شد")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در ارسال کد تایید")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-store-luxury-4.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp: code }),
        mode: 'cors',
        credentials: 'include',
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      // ابتدا response رو به text تبدیل کن
      const responseText = await response.text()
      console.log('Response text:', responseText)
      
      let data
      try {
        data = JSON.parse(responseText)
        console.log('Parsed data:', data)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        throw new Error('سرور پاسخ نامعتبری ارسال کرده است')
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'خطا در تایید کد')
      }
      
      if (data.success && data.data) {
        const { token, user } = data.data
        
        if (token) {
          // ذخیره token در localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('auth-token', token)
          
          // ذخیره user کامل در localStorage و state
          if (user) {
            login(user.phone || phone, user.roles, user)
          } else {
            login(phone)
          }
          
          // استفاده از roles از response API
          const userRoles = user?.roles || []
          const isAdmin = userRoles.includes('ADMIN')
          
          if (isAdmin) {
            toast.success("ثبت نام با موفقیت انجام شد! شما ادمین هستید.")
            router.push("/admin")
          } else {
            toast.success("ثبت نام با موفقیت انجام شد!")
            router.push("/profile")
          }
        }
      } else {
        toast.error("خطا در تایید کد")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در تایید کد")
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 lg:py-24 bg-secondary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-background rounded-2xl shadow-lg p-8 lg:p-10">
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {step === "phone" ? "ثبت نام / ورود" : "تایید شماره موبایل"}
                </h1>
                <p className="text-muted-foreground">
                  {step === "phone"
                    ? "برای ادامه، شماره موبایل خود را وارد کنید"
                    : "کد تایید ارسال شده به شماره موبایل خود را وارد کنید"}
                </p>
              </div>

              {step === "phone" ? (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="09123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      pattern="[0-9]{11}"
                      maxLength={11}
                      className="text-center text-lg tracking-wider"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      شماره موبایل خود را بدون صفر و خط تیره وارد کنید
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "در حال ارسال..." : "ارسال کد تایید"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    با ثبت نام، شما{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      قوانین و مقررات
                    </Link>{" "}
                    را می‌پذیرید
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="code">کد تایید</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="- - - - - -"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      کد ۶ رقمی ارسال شده به {phone} را وارد کنید
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "در حال تایید..." : "تایید و ادامه"}
                  </Button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      تغییر شماره موبایل
                    </button>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="text-primary hover:underline"
                      disabled={isLoading}
                    >
                      ارسال مجدد کد
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                با ثبت نام در لوکس، از تخفیف‌های ویژه و جدیدترین محصولات باخبر شوید
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
