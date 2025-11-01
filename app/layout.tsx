import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { ToastProvider } from "@/lib/toast-provider"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["monospace"],
})

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["serif"],
})

export const metadata: Metadata = {
  title: "فروشگاه لوکس - تجربه خرید ممتاز",
  description: "کشف مجموعه‌های منتخب محصولات ممتاز",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} ${playfair.variable}`}>
        <CartProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </CartProvider>
        <ToastProvider />
      </body>
    </html>
  )
}
