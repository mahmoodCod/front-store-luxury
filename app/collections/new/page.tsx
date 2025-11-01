"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { useEffect, useState } from "react"
import { productApi } from "@/lib/api"

export default function NewCollectionPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await productApi.getAllProducts({ limit: 12 })
        if (res.success) setProducts(res.data.products || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Breadcrumb
          items={[{ label: "خانه", href: "/" }, { label: "مجموعه‌ها", href: "/collections" }, { label: "جدیدترین‌ها" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {loading ? null : products.map((p) => (
                <div key={p._id} className="min-w-[160px] md:min-w-0 snap-start flex-shrink-0">
                  <ProductCard 
                    id={p._id}
                    name={p.name}
                    price={p.price}
                    image={p.images?.[0] || "/modern-furniture-collection.png"}
                    category={p.category}
                    avgRating={p.ratingSummary?.average}
                    reviewsCount={p.ratingSummary?.count}
                    stock={p.stock}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
