import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Briefcase, Heart, Users, TrendingUp } from "lucide-react"

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12 lg:py-16 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-center text-balance">
              فرصت‌های شغلی
            </h1>
            <p className="text-muted-foreground text-lg text-center mt-4 leading-relaxed max-w-2xl mx-auto">
              به تیم ما بپیوندید و در ایجاد تجربیات استثنایی برای مشتریان سهیم باشید
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { icon: Heart, title: "محیط دوستانه", desc: "فرهنگ کاری مثبت و حمایتی" },
                { icon: TrendingUp, title: "رشد حرفه‌ای", desc: "فرصت‌های یادگیری و پیشرفت" },
                { icon: Users, title: "تیم متخصص", desc: "همکاری با بهترین‌ها" },
                { icon: Briefcase, title: "مزایای عالی", desc: "بسته جامع مزایا" },
              ].map((item, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-center mb-8">موقعیت‌های شغلی باز</h2>

              {[
                { title: "طراح محصول ارشد", dept: "طراحی", type: "تمام وقت" },
                { title: "مدیر فروشگاه", dept: "فروش", type: "تمام وقت" },
                { title: "متخصص خدمات مشتری", dept: "پشتیبانی", type: "پاره وقت" },
              ].map((job, index) => (
                <div key={index} className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{job.dept}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <Button>مشاهده جزئیات</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
