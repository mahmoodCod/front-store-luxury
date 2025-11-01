import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-center text-balance">
              شرایط و قوانین استفاده
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
                <h2 className="font-serif text-2xl font-bold mb-4">پذیرش شرایط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  با دسترسی و استفاده از این وب‌سایت، شما موافقت می‌کنید که به این شرایط و قوانین پایبند باشید.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">استفاده از سایت</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  شما موافقت می‌کنید که از این سایت فقط برای اهداف قانونی استفاده کنید و:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>از هرگونه فعالیت غیرقانونی خودداری کنید</li>
                  <li>حقوق مالکیت معنوی ما را احترام بگذارید</li>
                  <li>اطلاعات نادرست ارائه ندهید</li>
                  <li>به سیستم‌های ما آسیب نرسانید</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">محصولات و قیمت‌ها</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما تلاش می‌کنیم اطلاعات محصولات و قیمت‌ها را دقیق نگه داریم، اما ممکن است خطاهایی رخ دهد. ما حق تغییر
                  قیمت‌ها و موجودی را بدون اطلاع قبلی محفوظ می‌داریم.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">سفارشات و پرداخت</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تمام سفارشات منوط به تایید و موجودی هستند. ما حق رد یا لغو هر سفارشی را داریم.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">محدودیت مسئولیت</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما در قبال هرگونه خسارت مستقیم، غیرمستقیم یا تبعی ناشی از استفاده از سایت مسئولیتی نداریم.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold mb-4">تغییرات در شرایط</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ما حق تغییر این شرایط را در هر زمان محفوظ می‌داریم. استفاده مداوم شما از سایت به معنای پذیرش تغییرات
                  است.
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
