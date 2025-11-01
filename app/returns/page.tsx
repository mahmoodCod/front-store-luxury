import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-balance mb-6">
                بازگشت کالا
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                رضایت شما برای ما مهم است. اگر از خرید خود راضی نیستید، می‌توانید کالا را بازگردانید
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
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">مهلت بازگشت</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      شما می‌توانید تا ۳۰ روز پس از دریافت محصول، درخواست بازگشت کالا را ثبت کنید. کالا باید در شرایط
                      اولیه و با بسته‌بندی سالم باشد.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">شرایط بازگشت</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      برای بازگشت کالا، شرایط زیر باید رعایت شود:
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 mr-16">
                  <li className="text-muted-foreground">• محصول استفاده نشده و در شرایط اولیه باشد</li>
                  <li className="text-muted-foreground">• بسته‌بندی اصلی محصول سالم باشد</li>
                  <li className="text-muted-foreground">• برچسب‌ها و لیبل‌های محصول دست نخورده باشد</li>
                  <li className="text-muted-foreground">• فاکتور خرید همراه محصول ارسال شود</li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">محصولات غیرقابل بازگشت</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">محصولات زیر قابل بازگشت نیستند:</p>
                  </div>
                </div>
                <ul className="space-y-3 mr-16">
                  <li className="text-muted-foreground">• محصولات سفارشی و شخصی‌سازی شده</li>
                  <li className="text-muted-foreground">• محصولات با تخفیف بالای ۵۰٪</li>
                  <li className="text-muted-foreground">• محصولات آسیب دیده توسط مشتری</li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2">فرآیند بازگشت</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      برای بازگشت کالا، مراحل زیر را دنبال کنید:
                    </p>
                  </div>
                </div>
                <ol className="space-y-3 mr-16 list-decimal list-inside">
                  <li className="text-muted-foreground">از طریق پروفایل کاربری، درخواست بازگشت ثبت کنید</li>
                  <li className="text-muted-foreground">منتظر تایید درخواست توسط تیم پشتیبانی باشید</li>
                  <li className="text-muted-foreground">محصول را با بسته‌بندی مناسب ارسال کنید</li>
                  <li className="text-muted-foreground">پس از بررسی، مبلغ به حساب شما بازگردانده می‌شود</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
