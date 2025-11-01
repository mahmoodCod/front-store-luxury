"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Home, ArrowRight, Search, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5" />
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/20 rounded-full blur-lg" />
            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-accent/20 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="font-serif text-8xl lg:text-9xl font-bold text-primary/20 mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            </div>

            {/* Main Message */}
            <div className="max-w-2xl mx-auto mb-12">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                صفحه مورد نظر یافت نشد
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است. 
                بیایید شما را به جای بهتری هدایت کنیم.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="text-base">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  بازگشت به خانه
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  مشاهده فروشگاه
                </Link>
              </Button>
            </div>

            {/* Search Suggestion */}
            <div className="max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-4">
                یا از جستجو استفاده کنید:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="جستجو در محصولات..."
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="lg" className="px-6">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                شاید این‌ها را دوست داشته باشید
              </h3>
              <p className="text-muted-foreground text-lg">
                مجموعه‌های محبوب ما را کاوش کنید
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "مبلمان", href: "/collections/furniture", image: "/modern-furniture-collection.png" },
                { name: "روشنایی", href: "/collections/lighting", image: "/designer-lighting-fixtures.jpg" },
                { name: "دکوراسیون", href: "/collections/decor", image: "/home-decor-accessories.png" },
                { name: "جدیدترین‌ها", href: "/collections/new", image: "/modern-furniture-showroom.png" },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative h-[200px] overflow-hidden rounded-xl"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h4 className="font-serif text-xl font-bold text-white">{category.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                نیاز به کمک دارید؟
              </h3>
              <p className="text-muted-foreground text-lg mb-8">
                تیم پشتیبانی ما آماده کمک به شما است
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">
                    <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                    تماس با ما
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/faq">
                    <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                    سوالات متداول
                  </Link>
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
