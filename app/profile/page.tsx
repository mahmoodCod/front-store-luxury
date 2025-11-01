"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AuthGuard } from "@/components/auth-guard"
import { Breadcrumb } from "@/components/breadcrumb"
import { toast } from "sonner"
import { userApi } from "@/lib/api"
import { User, Settings, LogOut, Shield, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, logout, isInitialized } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  })

  // Check if user is admin
  const isAdmin = user?.roles?.includes("ADMIN") || false

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user && isInitialized) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
      })
    }
  }, [user, isInitialized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await userApi.updateMe(formData)
      if (response.success) {
        toast.success("پروفایل با موفقیت به‌روزرسانی شد")
        // Reload user data
        if (response.data?.user) {
          logout()
          // After logout, user will be redirected by AuthGuard
          window.location.reload()
        }
      } else {
        toast.error("خطا در به‌روزرسانی پروفایل")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("خطا در به‌روزرسانی پروفایل")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "پروفایل" }]} />

          <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="bg-background rounded-2xl shadow-lg p-8 lg:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                          پروفایل من
                        </h1>
                        {isAdmin && (
                          <Badge variant="default" className="bg-primary">
                            <Shield className="h-3 w-3 ml-1" />
                            ادمین
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {user?.phone || "شماره موبایل"}
                      </p>
                    </div>
                  </div>

                  {/* Admin Panel Access */}
                  {isAdmin && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">پنل مدیریت</h3>
                            <p className="text-sm text-muted-foreground">
                              دسترسی به مدیریت فروشگاه و کاربران
                            </p>
                          </div>
                        </div>
                        <Button asChild variant="default">
                          <Link href="/admin">
                            <Shield className="h-4 w-4 ml-2" />
                            ورود به پنل
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">نام</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="نام خود را وارد کنید"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">نام خانوادگی</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="نام خانوادگی خود را وارد کنید"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">نام کاربری</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="نام کاربری خود را وارد کنید"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">ایمیل (اختیاری)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">شماره موبایل</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user?.phone || "ثبت نشده"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" size="lg" className="flex-1" disabled={isSaving}>
                        {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        خروج
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  )
}

