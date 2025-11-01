"use client"

import { ReactNode, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isInitialized } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!isInitialized) return
    const firstAdminPhone = typeof window !== 'undefined' ? localStorage.getItem('first-admin-phone') : null
    const isAdminRole = !!user?.roles?.includes("ADMIN")
    const isFirstAdminByPhone = firstAdminPhone && user?.phone && firstAdminPhone === user.phone
    const isAdmin = isAdminRole || !!isFirstAdminByPhone
    if (!isAdmin) {
      router.replace("/admin/unauthorized")
    }
  }, [user, router, isInitialized])

  if (!isInitialized) return null
  const firstAdminPhone = typeof window !== 'undefined' ? localStorage.getItem('first-admin-phone') : null
  const isAdminRole = !!user?.roles?.includes("ADMIN")
  const isFirstAdminByPhone = firstAdminPhone && user?.phone && firstAdminPhone === user.phone
  const canView = isAdminRole || !!isFirstAdminByPhone
  if (!canView) return null
  return <>{children}</>
}


