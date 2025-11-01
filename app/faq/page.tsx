import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
    answer:
      "پس از ثبت سفارش، کد رهگیری از طریق پیامک و ایمیل برای شما ارسال می‌شود. همچنین می‌توانید از طریق پروفایل کاربری خود، وضعیت سفارش را مشاهده کنید.",
  },
  {
    question: "آیا امکان پرداخت در محل وجود دارد؟",
    answer:
      "بله، برای سفارش‌های زیر ۲ میلیون تومان در شهر تهران، امکان پرداخت در محل وجود دارد. برای سایر شهرها، باید از طریق درگاه پرداخت آنلاین پرداخت کنید.",
  },
  {
    question: "چند روز طول می‌کشد تا سفارش من ارسال شود؟",
    answer:
      "سفارشات معمولاً ظرف ۲۴ ساعت پردازش می‌شوند. زمان ارسال بسته به روش ارسال انتخابی شما متفاوت است: ارسال عادی ۵-۷ روز، ارسال سریع ۲-۳ روز و ارسال فوری ۱ روز کاری.",
  },
  {
    question: "آیا می‌توانم سفارش خود را لغو کنم؟",
    answer:
      "بله، تا زمانی که سفارش شما پردازش نشده است، می‌توانید آن را لغو کنید. پس از پردازش و ارسال، باید از طریق فرآیند بازگشت کالا اقدام کنید.",
  },
  {
    question: "هزینه ارسال چقدر است؟",
    answer:
      "هزینه ارسال بر اساس وزن، حجم و مقصد محصول محاسبه می‌شود. برای سفارش‌های بالای ۵۰۰ هزار تومان، ارسال رایگان است. هزینه ارسال عادی از ۳۰ هزار تومان شروع می‌شود.",
  },
  {
    question: "آیا محصولات گارانتی دارند؟",
    answer:
      "بله، تمام محصولات ما دارای گارانتی اصالت و سلامت فیزیکی هستند. برخی محصولات نیز دارای گارانتی تعویض یا بازگشت وجه تا ۳۰ روز هستند.",
  },
  {
    question: "چگونه می‌توانم با پشتیبانی تماس بگیرم؟",
    answer:
      "می‌توانید از طریق صفحه تماس با ما، شماره تلفن ۰۲۱-۱۲۳۴۵۶۷۸ یا ایمیل support@luxe.com با تیم پشتیبانی ما در ارتباط باشید. ساعات کاری ما شنبه تا پنجشنبه از ۹ صبح تا ۸ شب است.",
  },
  {
    question: "آیا امکان تعویض محصول وجود دارد؟",
    answer:
      "بله، در صورتی که محصول دریافتی با سفارش شما مطابقت نداشته باشد یا دارای نقص فنی باشد، می‌توانید تا ۳۰ روز درخواست تعویض کنید.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground text-balance mb-6">
                سوالات متداول
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                پاسخ سوالات رایج شما درباره خرید، ارسال و بازگشت کالا
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-right hover:no-underline">
                    <span className="font-semibold text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center bg-card p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">سوال دیگری دارید؟</h3>
              <p className="text-muted-foreground mb-6">
                اگر پاسخ سوال خود را پیدا نکردید، می‌توانید با تیم پشتیبانی ما تماس بگیرید
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                تماس با پشتیبانی
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
