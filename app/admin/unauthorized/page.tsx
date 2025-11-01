"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminUnauthorized() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <h1 className="font-serif text-4xl font-bold">عدم دسترسی</h1>
            <p className="text-muted-foreground">شما اجازه دسترسی به این بخش را ندارید. برای ادامه به صفحه اصلی بروید یا با ادمین تماس بگیرید.</p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild><Link href="/">صفحه اصلی</Link></Button>
              <Button asChild variant="outline"><Link href="/profile">پروفایل</Link></Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


