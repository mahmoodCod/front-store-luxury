"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Award, Heart, Truck, Shield } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Breadcrumb } from "@/components/breadcrumb"
 

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [creatorSrc, setCreatorSrc] = useState<string>("/avatar.jpg")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Breadcrumb items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />

        {/* Story Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                  سفری که از عشق به زیبایی آغاز شد
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  لوکس در سال 1405 با هدف ارائه محصولات با کیفیت و طراحی منحصر به فرد تاسیس شد. ما معتقدیم که هر خانه
                  داستانی منحصر به فرد دارد و محصولات ما باید بخشی از این داستان باشند.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  تیم ما با دقت و علاقه، هر محصول را از بهترین تولیدکنندگان و طراحان انتخاب می‌کند تا اطمینان حاصل کنیم
                  که شما بهترین کیفیت و طراحی را دریافت می‌کنید.
                </p>
              </div>
              <div className="relative h-[360px] lg:h-[460px] rounded-2xl overflow-hidden ring-1 ring-border shadow-lg">
                <Image src="/modern-furniture-showroom.png" alt="فروشگاه لوکس" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">ارزش‌های ما</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                اصولی که ما را در مسیر ارائه بهترین خدمات به شما راهنمایی می‌کند
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center space-y-3 rounded-xl bg-card/60 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">کیفیت برتر</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تنها بهترین محصولات با بالاترین استانداردهای کیفی
                </p>
              </div>

              <div className="text-center space-y-3 rounded-xl bg-card/60 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Heart className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">طراحی با عشق</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  هر محصول با دقت و علاقه انتخاب و طراحی شده است
                </p>
              </div>

              <div className="text-center space-y-3 rounded-xl bg-card/60 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Truck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">ارسال سریع</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  تحویل سریع و ایمن محصولات به درب منزل شما
                </p>
              </div>

              <div className="text-center space-y-3 rounded-xl bg-card/60 backdrop-blur-sm p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">ضمانت اصالت</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">تضمین اصالت و کیفیت تمامی محصولات</p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">سازنده</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                این وب‌سایت با عشق و دقت توسط سازنده آن ساخته شده است
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="text-center space-y-4 rounded-2xl p-6 border">
                <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden shadow ring-1 ring-border">
                  <Image
                    src={creatorSrc}
                    alt={"سید محمود زرگری"}
                    fill
                    className="object-cover"
                    onError={() => setCreatorSrc((prev) => (prev === "/avatar.jpg" ? "/avatar.png" : "/placeholder-user.jpg"))}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground">سید محمود زرگری</h3>
                  <p className="text-muted-foreground">سازنده</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
