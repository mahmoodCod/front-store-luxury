"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { collectionApi } from "@/lib/api"

interface CollectionDialogProps {
  onCollectionAdded?: () => void
  trigger?: React.ReactNode
}

export function CollectionDialog({ onCollectionAdded, trigger }: CollectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    sortOrder: 0,
    sections: [] as Array<{
      name: string;
      description: string;
      image: string;
      isActive: boolean;
      sortOrder: number;
    }>
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, {
        name: "",
        description: "",
        image: "",
        isActive: true,
        sortOrder: prev.sections.length
      }]
    }))
  }

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const updateSection = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
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
      toast.error("نام مجموعه الزامی است")
      return
    }
    
    if (!formData.description.trim()) {
      toast.error("توضیحات مجموعه الزامی است")
      return
    }

    if (formData.name.length < 2) {
      toast.error("نام مجموعه باید حداقل 2 کاراکتر باشد")
      return
    }

    if (formData.description.length < 1) {
      toast.error("توضیحات مجموعه الزامی است")
      return
    }

    // XSS Protection
    const sanitizedData = {
      name: formData.name.replace(/<[^>]*>/g, '').trim(),
      description: formData.description.replace(/<[^>]*>/g, '').trim(),
      image: formData.image.replace(/<[^>]*>/g, '').trim(),
      isActive: formData.isActive,
      sortOrder: parseInt(formData.sortOrder.toString()) || 0,
      sections: formData.sections
    }

    setIsLoading(true)

    try {
      const response = await collectionApi.createCollection(sanitizedData)
      
      if (response.success) {
        toast.success("مجموعه با موفقیت اضافه شد")
        setFormData({
          name: "",
          description: "",
          image: "",
          isActive: true,
          sortOrder: 0,
          sections: []
        })
        setOpen(false)
        
        if (onCollectionAdded) {
          onCollectionAdded()
        }
      } else {
        toast.error(response.message || "خطا در ایجاد مجموعه")
      }
    } catch (error: any) {
      console.error('Create collection error:', error)
      toast.error(error.message || "خطا در ایجاد مجموعه")
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
            افزودن مجموعه جدید
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>افزودن مجموعه جدید</DialogTitle>
          <DialogDescription>
            مجموعه جدیدی برای دسته‌بندی محصولات ایجاد کنید
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام مجموعه *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="مثال: دکوراسیون خانه"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">توضیحات *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="توضیحات کامل مجموعه..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">آدرس تصویر (اختیاری)</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">ترتیب نمایش</Label>
            <Input
              id="sortOrder"
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">فعال</Label>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">بخش‌های مجموعه</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSection}
              >
                <Plus className="w-4 h-4 ml-1" />
                افزودن بخش
              </Button>
            </div>
            
            {formData.sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">بخش {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`section-name-${index}`} className="text-xs">نام بخش *</Label>
                    <Input
                      id={`section-name-${index}`}
                      value={section.name}
                      onChange={(e) => updateSection(index, 'name', e.target.value)}
                      placeholder="مثال: صندلی"
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`section-image-${index}`} className="text-xs">تصویر (اختیاری)</Label>
                    <Input
                      id={`section-image-${index}`}
                      type="url"
                      value={section.image}
                      onChange={(e) => updateSection(index, 'image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`section-description-${index}`} className="text-xs">توضیحات</Label>
                  <Textarea
                    id={`section-description-${index}`}
                    value={section.description}
                    onChange={(e) => updateSection(index, 'description', e.target.value)}
                    placeholder="توضیحات بخش..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "در حال ایجاد..." : "ایجاد مجموعه"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
