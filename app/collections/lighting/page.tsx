import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Breadcrumb } from "@/components/breadcrumb"
import { useEffect, useState } from "react"
import { productApi } from "@/lib/api"

export default function LightingCollectionPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await productApi.getAllProducts({ category: 'روشنایی', limit: 12 })
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
          items={[{ label: "خانه", href: "/" }, { label: "مجموعه‌ها", href: "/collections" }, { label: "روشنایی" }]}
        />

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {loading ? null : products.map((p) => (
                <ProductCard 
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={p.price}
                  image={p.images?.[0] || "/modern-furniture-collection.png"}
                  category={p.category}
                  avgRating={p.ratingSummary?.average}
                  reviewsCount={p.ratingSummary?.count}
                  stock={p.stock}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
