"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Package, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { collectionApi } from "@/lib/api"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    setIsLoading(true)
    try {
      const response = await collectionApi.getAllCollections()
      if (response.success) {
        setCollections(response.data.collections || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "خانه", href: "/" },
            { label: "مجموعه‌ها", href: "/collections" }
          ]} 
        />


        {/* Collections Grid */}
        <section className="py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="mr-3 text-gray-600">در حال بارگذاری مجموعه‌ها...</span>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">هیچ مجموعه‌ای یافت نشد</h3>
              <p className="text-gray-600 mb-6">در حال حاضر هیچ مجموعه‌ای موجود نیست</p>
            </div>
          ) : (
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {collections.map((collection) => (
                <div 
                  key={collection._id}
                  className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer group min-w-[200px] sm:min-w-0 snap-start flex-shrink-0"
                  onClick={() => window.open(`/collection/${collection._id}`, '_blank')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                      <Package className="w-8 h-8 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 space-x-reverse text-xs text-gray-500 mb-4">
                      <Package className="w-4 h-4" />
                      <span>بخش‌های مختلف</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                      مشاهده مجموعه
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}