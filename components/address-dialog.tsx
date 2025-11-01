"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/lib/cart-context"
import { addressApi } from "@/lib/api"
import { toast } from "sonner"
import { X } from "lucide-react"

interface AddressDialogProps {
  trigger?: React.ReactNode
  onAddressAdded?: () => void
}

export function AddressDialog({ trigger, onAddressAdded }: AddressDialogProps) {
  const { addAddress } = useCart()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    location: {
      lat: 0,
      lng: 0
    },
    postalCode: "",
    cityId: 0,
    address: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await addressApi.createAddress(formData)
      setOpen(false)
      setFormData({
        name: "",
        location: {
          lat: 0,
          lng: 0
        },
        postalCode: "",
        cityId: 0,
        address: "",
      })
      toast.success("آدرس با موفقیت اضافه شد")
      // Add address to local state with the response from backend
      if (response && response.data && response.data.user && response.data.user.addresses) {
        const newAddress = response.data.user.addresses[response.data.user.addresses.length - 1]
        addAddress(newAddress)
      }
    } catch (error: any) {
      console.error('Error:', error)
      toast.error(error.message || "خطا در ایجاد آدرس")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>افزودن آدرس جدید</Button>}</DialogTrigger>
      <DialogContent className="max-w-[32rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">افزودن آدرس جدید</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">عنوان آدرس *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/<[^>]*>/g, '') })}
              placeholder="مثال: خانه، محل کار"
              required
              maxLength={255}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">عرض جغرافیایی *</Label>
              <Input
                id="lat"
                type="number"
                step="0.000001"
                value={formData.location.lat}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, lat: parseFloat(e.target.value) || 0 }
                })}
                placeholder="35.6892"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">طول جغرافیایی *</Label>
              <Input
                id="lng"
                type="number"
                step="0.000001"
                value={formData.location.lng}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, lng: parseFloat(e.target.value) || 0 }
                })}
                placeholder="51.3890"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">کد پستی *</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              placeholder="1234567890"
              required
              dir="ltr"
              maxLength={10}
            />
            <p className="text-xs text-muted-foreground">کد پستی باید 10 رقم باشد</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cityId">شناسه شهر *</Label>
            <Input
              id="cityId"
              type="number"
              value={formData.cityId}
              onChange={(e) => setFormData({ ...formData, cityId: parseInt(e.target.value) || 0 })}
              placeholder="1"
              required
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">شناسه شهر باید عدد مثبت باشد</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">آدرس کامل *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value.replace(/<[^>]*>/g, '') })}
              placeholder="خیابان، کوچه، پلاک، واحد"
              required
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "در حال ذخیره..." : "ذخیره آدرس"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 sm:flex-none" disabled={isLoading}>
              انصراف
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

