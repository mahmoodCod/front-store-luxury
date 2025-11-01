import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-center text-balance">
              سیاست حریم خصوصی
            </h1>
            <p className="text-muted-foreground text-lg text-center mt-4 leading-relaxed">
              آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">مقدمه</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما به حریم خصوصی شما احترام می‌گذاریم و متعهد به محافظت از اطلاعات شخصی شما هستیم. این سیاست حریم خصوصی
                  نحوه جمع‌آوری، استفاده و محافظت از اطلاعات شما را توضیح می‌دهد.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">اطلاعاتی که جمع‌آوری می‌کنیم</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ما انواع مختلفی از اطلاعات را جمع‌آوری می‌کنیم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>اطلاعات شخصی (نام، ایمیل، شماره تلفن)</li>
                  <li>اطلاعات پرداخت و صورتحساب</li>
                  <li>آدرس‌های ارسال</li>
                  <li>تاریخچه خرید</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">نحوه استفاده از اطلاعات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما از اطلاعات شما برای پردازش سفارشات، بهبود خدمات، ارسال اطلاعات محصولات جدید و ارائه پشتیبانی مشتری
                  استفاده می‌کنیم.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">امنیت اطلاعات</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما از روش‌های امنیتی استاندارد صنعت برای محافظت از اطلاعات شخصی شما استفاده می‌کنیم.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">تماس با ما</h2>
                <p className="text-muted-foreground leading-relaxed">
                  اگر سوالی درباره سیاست حریم خصوصی ما دارید، لطفاً با ما تماس بگیرید.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
