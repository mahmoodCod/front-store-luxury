"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { ShoppingCart, Menu, X, User, Search, LogOut, Settings, Package, Layers, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { items, user, logout } = useCart()
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/shop" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart className="h-4 w-4" />
              فروشگاه
            </Link>
            <Link href="/collections" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Layers className="h-4 w-4" />
              مجموعه‌ها
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Info className="h-4 w-4" />
              درباره ما
            </Link>
            <Link href="/contact" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              تماس با ما
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">جستجو</span>
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
                <span className="sr-only">سبد خرید</span>
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">حساب کاربری</span>
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                    <div className="p-2">
                      <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-accent rounded-md">
                        <Settings className="h-4 w-4 inline-block ml-2" />
                        پروفایل
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-3 py-2 text-sm hover:bg-accent rounded-md flex items-center"
                      >
                        <LogOut className="h-4 w-4 inline-block ml-2" />
                        خروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/register">
                <Button variant="ghost" size="sm">
                  ورود / ثبت نام
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">منو</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* User Info Section */}
                  {user && (
                    <div className="border-b border-border pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{user.phone || 'کاربر'}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.roles?.includes('ADMIN') ? 'ادمین' : 'کاربر'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex flex-col gap-2 flex-1">
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      فروشگاه
                    </Link>
                    <Link
                      href="/collections"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      <Layers className="h-5 w-5" />
                      مجموعه‌ها
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      <Info className="h-5 w-5" />
                      درباره ما
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      تماس با ما
                    </Link>
                    
                    {/* Cart Link */}
                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      سبد خرید
                      {cartItemCount > 0 && (
                        <span className="mr-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {cartItemCount > 9 ? '9+' : cartItemCount}
                        </span>
                      )}
                    </Link>

                    {/* User Menu Items */}
                    {user ? (
                      <>
                        <div className="border-t border-border my-2" />
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                        >
                          <User className="h-5 w-5" />
                          پروفایل
                        </Link>
                        {user.roles?.includes('ADMIN') && (
                          <Link
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                          >
                            <Settings className="h-5 w-5" />
                            پنل مدیریت
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-right w-full"
                        >
                          <LogOut className="h-5 w-5" />
                          خروج
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-border my-2" />
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-3 px-4 py-3 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
                        >
                          <User className="h-5 w-5" />
                          ورود / ثبت نام
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

