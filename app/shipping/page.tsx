import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Package, Truck, Clock, MapPin } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-balance mb-6">
                اطلاعات ارسال
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                همه چیز درباره نحوه ارسال و تحویل سفارشات شما
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="grid gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">روش‌های ارسال</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      ما از بهترین شرکت‌های پست و باربری برای ارسال محصولات استفاده می‌کنیم تا سفارش شما با کیفیت و سرعت
                      بالا به دست شما برسد.
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 mr-16">
                  <li className="text-muted-foreground">• ارسال عادی: ۵-۷ روز کاری</li>
                  <li className="text-muted-foreground">• ارسال سریع: ۲-۳ روز کاری</li>
                  <li className="text-muted-foreground">• ارسال فوری: ۱ روز کاری (فقط در تهران)</li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">هزینه ارسال</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      هزینه ارسال بر اساس وزن، حجم و مقصد محصول محاسبه می‌شود.
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 mr-16">
                  <li className="text-muted-foreground">• ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</li>
                  <li className="text-muted-foreground">• هزینه ارسال عادی: از ۳۰ هزار تومان</li>
                  <li className="text-muted-foreground">• هزینه ارسال سریع: از ۵۰ هزار تومان</li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">زمان پردازش</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      سفارشات معمولاً ظرف ۲۴ ساعت پردازش و آماده ارسال می‌شوند. در روزهای تعطیل، زمان پردازش ممکن است
                      طولانی‌تر شود.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">پیگیری سفارش</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      پس از ارسال سفارش، کد رهگیری از طریق پیامک و ایمیل برای شما ارسال می‌شود. می‌توانید وضعیت سفارش خود
                      را از طریق پروفایل کاربری پیگیری کنید.
                    </p>
                  </div>
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
