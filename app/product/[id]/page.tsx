"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { productApi, commentApi } from "@/lib/api"
import { ProductComments } from "@/components/product-comments"
import { Breadcrumb } from "@/components/breadcrumb"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ShoppingCart, Star, Package, Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  const { addToCart, cartItems } = useCart()
  
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [ratingSummary, setRatingSummary] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 })

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchRatingSummary()
    }
  }, [id])

  const fetchProduct = async () => {
    setIsLoading(true)
    try {
      const response = await productApi.getProduct(id as string)
      if (response.success && response.data) {
        setProduct(response.data)
      } else {
        toast.error("محصول یافت نشد")
        router.push("/shop")
      }
    } catch (error: any) {
      console.error("Error fetching product:", error)
      toast.error("خطا در دریافت اطلاعات محصول")
      router.push("/shop")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRatingSummary = async () => {
    try {
      const response = await commentApi.getProductCommentsSummary(id as string)
      if (response.success && response.data?.summary) {
        setRatingSummary(response.data.summary)
      }
    } catch (error) {
      console.error("Error fetching rating summary:", error)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "/modern-furniture-collection.png",
      stock: product.stock,
    })
    
    toast.success("محصول به سبد خرید اضافه شد")
  }

  const formatPrice = (price: number) => {
    try {
      return new Intl.NumberFormat('fa-IR').format(Math.round(price))
    } catch {
      return String(Math.round(price))
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
            <Button onClick={() => router.push("/shop")}>بازگشت به فروشگاه</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const productImages = product.images || (product.image ? [product.image] : ["/modern-furniture-collection.png"])
  const inCart = cartItems.some((item) => item.id === (product._id || product.id))
  const mainImage = productImages[selectedImageIndex] || productImages[0]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "خانه", href: "/" },
            { label: "فروشگاه", href: "/shop" },
            { label: product.name },
          ]}
        />

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 border">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {productImages.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-primary"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - تصویر ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 12vw"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                  
                  {ratingSummary.count > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.round(ratingSummary.avg)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({ratingSummary.count} نظر)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <p className="text-3xl font-bold text-foreground" suppressHydrationWarning>
                      {formatPrice(product.price)} تومان
                    </p>
                    {product.stock !== undefined && (
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          product.stock > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.stock > 0 ? "موجود" : "ناموجود"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Product Info */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-border">
                  {product.category && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">دسته‌بندی</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                  )}
                  {product.subCategory && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">زیردسته</p>
                      <p className="font-medium">{product.subCategory}</p>
                    </div>
                  )}
                </div>

                {/* Add to Cart */}
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={inCart || (product.stock !== undefined && product.stock === 0)}
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    {inCart ? "در سبد خرید است" : "افزودن به سبد خرید"}
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ارسال سریع</p>
                      <p className="text-xs text-muted-foreground">ارسال در کمتر از 24 ساعت</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ضمانت کیفیت</p>
                      <p className="text-xs text-muted-foreground">ضمانت اصل بودن کالا</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <RotateCcw className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">بازگشت آسان</p>
                      <p className="text-xs text-muted-foreground">7 روز مهلت بازگشت</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Comments Section */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <ProductComments productId={id as string} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

