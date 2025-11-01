import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center md:text-right">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex justify-center md:justify-start">
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              مجموعه‌های منتخب محصولات ممتاز برای مشتریان ویژه
            </p>
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              <Link href="@mahmood321993" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">اینستاگرام</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">فیسبوک</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">توییتر</span>
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">فروشگاه</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  همه محصولات
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/new"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  جدیدترین‌ها
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sale"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  حراج
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/featured"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ویژه
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">خدمات مشتریان</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  اطلاعات ارسال
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">شرکت</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  فرصت‌های شغلی
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  شرایط استفاده
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} لوکس. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  )
}
