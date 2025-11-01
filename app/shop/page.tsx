"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Package, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { LoadingSpinner } from "@/components/loading-spinner"
import { productApi, collectionApi, commentApi } from "@/lib/api"
import { Breadcrumb } from "@/components/breadcrumb"
import { toast } from "sonner"
import { getImageUrl } from "@/lib/image-utils"

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [formattedRange, setFormattedRange] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [selectedSection, setSelectedSection] = useState<string>("")
  const [sortBy, setSortBy] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingsMap, setRatingsMap] = useState<Record<string, { avg: number, count: number }>>({})

  useEffect(() => {
    fetchProducts()
    fetchCollections()
    
    // Check for section parameter in URL
    const urlParams = new URLSearchParams(window.location.search)
    const sectionParam = urlParams.get('section')
    if (sectionParam) {
      setSelectedSection(sectionParam)
    }
  }, [])

  // Format price range on client to avoid SSR/CSR mismatch
  useEffect(() => {
    try {
      const [min, max] = priceRange
      const f = new Intl.NumberFormat('fa-IR')
      setFormattedRange(`${f.format(min)} - ${f.format(max)} تومان`)
    } catch {
      setFormattedRange(`${priceRange[0]} - ${priceRange[1]} تومان`)
    }
  }, [priceRange])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching products...')
      const response = await productApi.getAllProducts({ 
        search: searchTerm || undefined,
        limit: 100,  // Get more products
        // Don't filter by isActive - we'll filter in frontend
      })
      console.log('Products response:', response)
      
      if (response.success) {
        // Handle different response structures
        let prods: any[] = []
        if (Array.isArray(response.data?.products)) {
          prods = response.data.products
        } else if (Array.isArray(response.data)) {
          prods = response.data
        } else if (Array.isArray(response)) {
          prods = response
        }
        
        // Don't filter by isActive - show all products like homepage and collections
        // Products with isActive: false will still be shown (same as homepage behavior)
        
        console.log('Processed products:', prods.length, prods)
        if (prods.length === 0) {
          console.warn('No products found. Response structure:', response.data)
        }
        setProducts(prods)
        // prefer backend attached summary if available
        const map: Record<string, { avg: number, count: number }> = {}
        prods.forEach((p: any) => {
          if (p.ratingSummary) {
            map[p._id] = { avg: p.ratingSummary.average || 0, count: p.ratingSummary.count || 0 }
          }
        })
        // fallback: fetch individually for items with no summary (best-effort)
        const missing = prods.filter((p: any) => !p.ratingSummary)
        if (missing.length > 0) {
          const fetched = await Promise.all(missing.map(async (p: any) => {
            try {
              const s = await commentApi.getProductCommentsSummary(p._id)
              if (s.success) {
                const sum = s.data?.summary || { average: 0, count: 0 }
                return [p._id, { avg: sum.average || 0, count: sum.count || 0 }]
              }
            } catch {}
            return [p._id, { avg: 0, count: 0 }]
          }))
          fetched.forEach(([id, val]: any) => { map[id] = val })
        }
        setRatingsMap(map)
      } else {
        console.error('Products fetch failed:', response)
        setProducts([])
        if (response.message) {
          toast.error(response.message)
        }
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
      setProducts([])
      // Handle rate limit errors specifically
      if (error.status === 429 || error.message?.includes('حد مجاز')) {
        toast.error('تعداد درخواست‌های شما زیاد است. لطفاً چند لحظه صبر کنید و دوباره تلاش کنید.')
      } else {
        toast.error(error.message || 'خطا در دریافت محصولات')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await collectionApi.getAllCollections({ isActive: true })
      if (response.success) {
        setCollections(response.data.collections || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const filteredProducts = products
    .filter((product) => {
      // Don't filter by isActive - show all products like homepage and collections
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
      const inCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const inCollection = selectedCollections.length === 0 || selectedCollections.includes(product.collection?._id || product.collectionId)
      const inSection = !selectedSection || product.section === selectedSection
      return inPriceRange && inCategory && inCollection && inSection
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "featured") return b.featured - a.featured
      return 0
    })

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId) ? prev.filter((c) => c !== collectionId) : [...prev, collectionId],
    )
  }

  const clearFilters = () => {
    setPriceRange([0, 10000000])
    setSelectedCategories([])
    setSelectedCollections([])
    setSelectedSection("")
    setSortBy("featured")
    setSearchTerm("")
  }

  const uniqueCategories = [...new Set(products.map(product => product.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "خانه", href: "/" },
            { label: "فروشگاه", href: "/shop" }
          ]} 
        />


        <section className="py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">فیلترها</h2>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    پاک کردن
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    جستجو
                  </Label>
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجو در محصولات..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={fetchProducts}
                  >
                    جستجو
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block" suppressHydrationWarning>
                    محدوده قیمت: {formattedRange ?? `${priceRange[0]} - ${priceRange[1]} تومان`}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    min={0}
                    step={100000}
                    className="w-full"
                  />
                </div>

                {/* Collections */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">مجموعه‌ها</Label>
                  <div className="space-y-2">
                    {collections.map((collection) => (
                      <div key={collection._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Checkbox
                            id={`collection-${collection._id}`}
                            checked={selectedCollections.includes(collection._id)}
                            onCheckedChange={() => toggleCollection(collection._id)}
                          />
                          <Label
                            htmlFor={`collection-${collection._id}`}
                            className="text-sm cursor-pointer"
                          >
                            {collection.name}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="text-xs text-gray-500">
                            {collection.sections?.length || 0} بخش
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs p-1 h-auto"
                            onClick={() => window.open(`/collection/${collection.slug}`, '_blank')}
                          >
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Filter */}
                {selectedSection && (
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-3 block">بخش انتخاب شده</Label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-blue-800">{selectedSection}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSection("")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">دسته‌بندی</Label>
                  <div className="space-y-2">
                    {uniqueCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
                  فروشگاه ({filteredProducts.length} محصول)
                </h1>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Label htmlFor="sort" className="text-sm font-medium">
                    مرتب‌سازی:
                  </Label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="مرتب‌سازی محصولات"
                  >
                    <option value="featured">ویژه</option>
                    <option value="price-asc">قیمت: کم به زیاد</option>
                    <option value="price-desc">قیمت: زیاد به کم</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">محصولی یافت نشد</h3>
                  <p className="text-gray-600 mb-6">
                    {products.length === 0 
                      ? 'در حال حاضر محصولی در فروشگاه موجود نیست' 
                      : `هیچ محصولی با فیلترهای انتخاب شده همخوانی ندارد (${products.length} محصول در کل)`}
                  </p>
                  {products.length === 0 && (
                    <p className="text-sm text-gray-500 mb-4">محصولات توسط مدیر در پنل مدیریت اضافه می‌شوند</p>
                  )}
                  {products.length > 0 && (
                    <Button variant="outline" onClick={clearFilters}>
                      پاک کردن فیلترها
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      image={getImageUrl(product.images?.[0])}
                      category={product.category}
                      avgRating={ratingsMap[product._id]?.avg}
                      reviewsCount={ratingsMap[product._id]?.count}
                      stock={product.stock}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}