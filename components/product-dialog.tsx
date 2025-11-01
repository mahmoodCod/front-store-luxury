"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { productApi, collectionApi } from "@/lib/api"
import { toast } from "sonner"
import { X, Upload, Plus } from "lucide-react"

interface ProductDialogProps {
  trigger?: React.ReactNode
  onProductAdded?: () => void
}

export function ProductDialog({ trigger, onProductAdded }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [collections, setCollections] = useState<any[]>([])
  const [loadingCollections, setLoadingCollections] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subCategory: "",
    category: "",
    collection: "",
    section: "",
    price: "",
    stock: "",
    isActive: true,
    featured: false,
    tags: ""
  })
  const [images, setImages] = useState<File[]>([])

  // Fetch collections when dialog opens
  useEffect(() => {
    if (open) {
      fetchCollections()
    }
  }, [open])

  const fetchCollections = async () => {
    setLoadingCollections(true)
    try {
      const response = await collectionApi.getAllCollections()
      if (response.success) {
        setCollections(response.data.collections || [])
      } else {
        setCollections([])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      setCollections([])
    } finally {
      setLoadingCollections(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting
    const now = Date.now()
    if (now - lastSubmitTime < 2000) {
      toast.error("لطفاً کمی صبر کنید")
      return
    }
    setLastSubmitTime(now)

    // Validation
    if (!formData.name.trim()) {
      toast.error("نام محصول الزامی است")
      return
    }
    
    if (!formData.description.trim()) {
      toast.error("توضیحات محصول الزامی است")
      return
    }

    if (!formData.category.trim()) {
      toast.error("دسته محصول الزامی است")
      return
    }

    if (!formData.subCategory.trim()) {
      toast.error("زیردسته محصول الزامی است")
      return
    }

    if (!formData.collection || formData.collection === "no-collections") {
      toast.error("ابتدا یک مجموعه ایجاد کنید")
      return
    }

    if (!formData.section.trim()) {
      toast.error("بخش محصول الزامی است")
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("قیمت محصول باید بیشتر از صفر باشد")
      return
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("موجودی محصول نمی‌تواند منفی باشد")
      return
    }

    if (images.length === 0) {
      toast.error("حداقل یک تصویر انتخاب کنید")
      return
    }

    // XSS Protection
    const sanitizedData = {
      name: formData.name.replace(/<[^>]*>/g, '').trim(),
      description: formData.description.replace(/<[^>]*>/g, '').trim(),
      category: formData.category.replace(/<[^>]*>/g, '').trim(),
      subCategory: formData.subCategory.replace(/<[^>]*>/g, '').trim(),
      collection: formData.collection,
      section: formData.section.replace(/<[^>]*>/g, '').trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      isActive: formData.isActive,
      featured: formData.featured,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
    }

    // Create FormData
    const productFormData = new FormData()
    productFormData.append('name', sanitizedData.name)
    productFormData.append('description', sanitizedData.description)
    productFormData.append('subCategory', sanitizedData.subCategory)
    productFormData.append('category', sanitizedData.category)
    productFormData.append('collection', sanitizedData.collection)
    productFormData.append('section', sanitizedData.section)
    productFormData.append('price', sanitizedData.price.toString())
    productFormData.append('stock', sanitizedData.stock.toString())
    productFormData.append('isActive', sanitizedData.isActive.toString())
    productFormData.append('featured', sanitizedData.featured.toString())
    productFormData.append('tags', sanitizedData.tags.join(','))
    
    // Add images
    images.forEach((image, index) => {
      productFormData.append('images', image)
    })

    setIsLoading(true)

    try {
      const response = await productApi.createProduct(productFormData)
      
      if (response.success) {
        toast.success("محصول با موفقیت اضافه شد")
        setFormData({
          name: "",
          description: "",
          subCategory: "",
          category: "",
          collection: "",
          section: "",
          price: "",
          stock: "",
          isActive: true,
          featured: false,
          tags: ""
        })
        setImages([])
        setOpen(false)
        
        if (onProductAdded) {
          onProductAdded()
        }
      } else {
        toast.error(response.message || "خطا در ایجاد محصول")
      }
    } catch (error: any) {
      console.error('Create product error:', error)
      toast.error(error.message || "خطا در ایجاد محصول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            افزودن محصول جدید
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>افزودن محصول جدید</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="نام محصول"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">دسته *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="مثال: مبلمان"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subCategory">زیردسته *</Label>
              <Input
                id="subCategory"
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                placeholder="مثال: میز"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection">مجموعه *</Label>
              <Select value={formData.collection} onValueChange={(value) => {
                handleInputChange('collection', value)
                handleInputChange('section', '') // Reset section when collection changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مجموعه" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCollections ? (
                    <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                  ) : collections.length === 0 ? (
                    <SelectItem value="no-collections" disabled>ابتدا یک مجموعه ایجاد کنید</SelectItem>
                  ) : (
                    collections.map((collection) => (
                      <SelectItem key={collection._id} value={collection._id}>
                        {collection.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section Selection */}
          {formData.collection && (
            <div className="space-y-2">
              <Label htmlFor="section">بخش *</Label>
              <Select value={formData.section} onValueChange={(value) => handleInputChange('section', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب بخش" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const selectedCollection = collections.find(c => c._id === formData.collection)
                    if (!selectedCollection || !selectedCollection.sections) {
                      return <SelectItem value="no-sections" disabled>هیچ بخشی یافت نشد</SelectItem>
                    }
                    return selectedCollection.sections.map((section: any) => (
                      <SelectItem key={section.slug} value={section.name}>
                        {section.name}
                      </SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="1500000"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">موجودی *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="10"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="توضیحات کامل محصول..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">تگ‌ها (اختیاری)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="تگ1, تگ2, تگ3"
            />
            <p className="text-xs text-gray-500">تگ‌ها را با کاما جدا کنید</p>
          </div>

          <div className="space-y-2">
            <Label>تصاویر *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">برای انتخاب تصاویر کلیک کنید</p>
                </div>
              </label>
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 left-1 h-6 w-6 p-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <img
                  src="/modern-furniture-collection.png"
                  alt="تصویر پیش‌فرض"
                  className="w-full h-20 object-cover rounded mx-auto mb-2"
                />
                <p className="text-sm text-gray-500">تصویر پیش‌فرض - برای تغییر تصویر کلیک کنید</p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">فعال</Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">ویژه</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "در حال ایجاد..." : "ایجاد محصول"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}