"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { collectionApi, productApi } from "@/lib/api"
import { Breadcrumb } from "@/components/breadcrumb"
import { useParams } from "next/navigation"
import { getImageUrl } from "@/lib/image-utils"

export default function CollectionPage() {
  const params = useParams()
  const [collection, setCollection] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchCollection()
    }
  }, [params.slug])

  const fetchCollection = async () => {
    setIsLoading(true)
    try {
      // First get all collections to find by slug or _id
      const collectionsResponse = await collectionApi.getAllCollections()
      if (collectionsResponse.success) {
        const foundCollection = collectionsResponse.data.collections.find(
          (c: any) => c.slug === params.slug || c._id === params.slug
        )
        if (foundCollection) {
          setCollection(foundCollection)
          fetchProducts(foundCollection._id)
        }
      }
    } catch (error) {
      console.error('Error fetching collection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async (collectionId: string) => {
    setLoadingProducts(true)
    try {
      const response = await productApi.getAllProducts({ 
        collectionId: collectionId
      })
      if (response.success) {
        setProducts(response.data.products || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">مجموعه یافت نشد</h3>
            <p className="text-gray-600 mb-6">مجموعه مورد نظر وجود ندارد</p>
            <Button onClick={() => window.history.back()}>
              بازگشت
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "خانه", href: "/" },
            { label: "فروشگاه", href: "/shop" },
            { label: collection.name, href: `/collection/${collection.slug}` }
          ]} 
        />




        {/* Sections with Products */}
        <section className="py-8">
          {collection.sections && collection.sections.length > 0 ? (
            <>
              <div className="flex items-center justify-end mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="flex items-center"
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  بازگشت به فروشگاه
                </Button>
              </div>

              <div className="space-y-12">
                {collection.sections.map((section: any) => {
                  const sectionProducts = products.filter(p => p.section === section.name)
                  return (
                    <div key={section.slug} className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.name}</h3>
                        <p className="text-gray-600 mb-4">{section.description}</p>
                        <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-gray-500">
                          <Package className="w-4 h-4" />
                          <span>{sectionProducts.length} محصول</span>
                        </div>
                      </div>

                      {sectionProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {sectionProducts.map((product) => (
                            <ProductCard 
                              key={product._id}
                              id={product._id}
                              name={product.name}
                              price={product.price}
                              image={getImageUrl(product.images?.[0])}
                              category={product.category}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600">هیچ محصولی در این بخش موجود نیست</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">هیچ بخشی در این مجموعه یافت نشد</h3>
              <p className="text-gray-600 mb-6">در حال حاضر هیچ بخشی در این مجموعه موجود نیست</p>
              <Button onClick={() => window.history.back()}>
                بازگشت به فروشگاه
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
