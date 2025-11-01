"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { productApi, collectionApi } from "@/lib/api"
import { getImageUrl } from "@/lib/image-utils"

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
    fetchCollections()
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    const elements = [heroRef.current, featuredRef.current, categoriesRef.current, aboutRef.current]
    elements.forEach((el) => el && observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const fetchFeaturedProducts = async () => {
    setIsLoadingProducts(true)
    try {
      const response = await productApi.getAllProducts({ 
        featured: true,
        limit: 4
      })
      if (response.success) {
        setFeaturedProducts(response.data.products || [])
      }
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const fetchCollections = async () => {
    setIsLoadingCollections(true)
    try {
      const response = await collectionApi.getAllCollections({ 
        limit: 3
      })
      if (response.success) {
        setCollections(response.data.collections || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setIsLoadingCollections(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden opacity-0 translate-y-8 transition-all duration-1000"
        >
          <Image
            src="/luxury-interior-design-modern-living-room.jpg"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/20" />
          <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-serif text-5xl lg:text-7xl font-bold text-white mb-6 text-balance animate-fade-in-up">
              فضای خود را ارتقا دهید
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed text-balance animate-fade-in-up animation-delay-200">
              مجموعه‌های منتخب مبلمان و دکوراسیون ممتاز را کشف کنید که برای تبدیل خانه شما به یک پناهگاه طراحی شده‌اند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button size="lg" asChild className="text-base">
                <Link href="/shop">
                  خرید کنید
                  <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/collections">مشاهده مجموعه‌ها</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section ref={featuredRef} className="py-16 lg:py-24 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                محصولات ویژه
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                انتخاب‌های دست‌چین شده از جدیدترین مجموعه ما
              </p>
            </div>
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {isLoadingProducts ? (
                // Loading skeleton
                [...Array(4)].map((_, i) => (
                  <div key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
                    <div className="aspect-[3/4] md:aspect-[4/3] lg:aspect-square relative overflow-hidden bg-gray-100">
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                    </div>
                    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                      <div className="h-3 md:h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                      <div className="flex items-center justify-between">
                        <div className="h-5 md:h-6 bg-gray-200 animate-pulse rounded w-16 md:w-20" />
                        <div className="h-3 md:h-4 bg-gray-200 animate-pulse rounded w-10 md:w-12" />
                      </div>
                    </div>
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product._id} className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
                    <ProductCard 
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={getImageUrl(product.images?.[0])}
                      category={product.category}
                      avgRating={product.ratingSummary?.average}
                      reviewsCount={product.ratingSummary?.count}
                      stock={product.stock}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 min-w-full">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">محصول ویژه‌ای موجود نیست</p>
                </div>
              )}
            </div>
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop">
                  مشاهده همه محصولات
                  <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section
          ref={categoriesRef}
          className="py-16 lg:py-24 bg-secondary opacity-0 translate-y-8 transition-all duration-1000"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                خرید بر اساس دسته‌بندی
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                مجموعه‌های با دقت انتخاب شده ما را کاوش کنید
              </p>
            </div>
            <div className="md:grid md:grid-cols-3 md:gap-6 lg:gap-8 flex md:flex-none overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {isLoadingCollections ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className="relative h-[400px] min-w-[280px] md:min-w-0 overflow-hidden rounded-lg snap-start flex-shrink-0 bg-gray-200 animate-pulse" />
                ))
              ) : collections.length > 0 ? (
                collections.map((collection) => (
                  <Link
                    key={collection._id}
                    href={`/collection/${collection.slug}`}
                    className="group relative h-[400px] min-w-[280px] md:min-w-0 overflow-hidden rounded-lg snap-start flex-shrink-0"
                  >
                    <Image
                      src={collection.image || "/modern-furniture-collection.png"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="font-serif text-3xl lg:text-4xl font-bold text-white">{collection.name}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">مجموعه‌ای موجود نیست</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-16 lg:py-24 opacity-0 translate-y-8 transition-all duration-1000">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
                <Image src="/artisan-crafting-furniture-workshop.jpg" alt="داستان ما" fill className="object-cover" />
              </div>
              <div className="space-y-6">
                <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground text-balance">
                  ساخته شده با هدف
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  هر قطعه در مجموعه ما با دقت از صنعتگران و طراحانی انتخاب شده که تعهد ما به کیفیت، پایداری و طراحی
                  بی‌زمان را به اشتراک می‌گذارند.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  ما معتقدیم که خانه شما باید بازتابی از ارزش‌ها و زیبایی‌شناسی شما باشد. به همین دلیل ما با سازندگانی
                  همکاری می‌کنیم که صنعتگری و تولید اخلاقی را در اولویت قرار می‌دهند.
                </p>
                <Button size="lg" asChild>
                  <Link href="/about">
                    بیشتر درباره ما بدانید
                    <ArrowRight className="mr-2 h-5 w-5 rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground text-balance">ارتباط با ما</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                برای دریافت نکات طراحی، محصولات جدید و پیشنهادات ویژه در خبرنامه ما عضو شوید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="lg">عضویت</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
