"use client"

import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  showToast?: boolean
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = "/register", 
  showToast = true 
}: AuthGuardProps) {
  const { user, isInitialized } = useCart()
  const router = useRouter()

  const handleAuthRequired = () => {
    if (showToast) {
      toast.error("برای ادامه، ابتدا وارد حساب کاربری خود شوید")
    }
    if (redirectTo) {
      router.push(redirectTo)
    }
  }

  // صبر کن تا localStorage لود شود تا اعلان اشتباه نمایش داده نشود
  if (!isInitialized) {
    return null
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }
    handleAuthRequired()
    return null
  }

  return <>{children}</>
}

interface AuthButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

export function AuthButton({ 
  children, 
  href, 
  onClick, 
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props 
}: AuthButtonProps) {
  const { user } = useCart()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      toast.error("برای ادامه، ابتدا وارد حساب کاربری خود شوید")
      router.push("/register")
      return
    }
    
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    }
  }

  if (asChild) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}
