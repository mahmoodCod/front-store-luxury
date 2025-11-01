export interface Comment {
  id: string
  productId: string
  author: string
  avatar?: string
  rating: number
  date: string
  text: string
  replies?: Reply[]
}

export interface Reply {
  id: string
  author: string
  avatar?: string
  date: string
  text: string
  isStore?: boolean
}

export const commentsData: Comment[] = [
  // Comments for product 1 (گلدان سرامیکی مینیمال)
  {
    id: "c1-1",
    productId: "1",
    author: "سارا محمدی",
    rating: 5,
    date: "۱۵ اسفند ۱۴۰۲",
    text: "این گلدان واقعا زیباست! کیفیت ساخت عالی و طراحی مینیمال آن دقیقا همان چیزی بود که دنبالش بودم. در دکوراسیون خانه‌ام فوق‌العاده جلوه می‌کند.",
    replies: [
      {
        id: "r1-1",
        author: "فروشگاه لوکس",
        date: "۱۶ اسفند ۱۴۰۲",
        text: "از اینکه از خرید خود راضی هستید بسیار خوشحالیم! امیدواریم همیشه از محصولات ما لذت ببرید.",
        isStore: true,
      },
    ],
  },
  {
    id: "c1-2",
    productId: "1",
    author: "محمد رضایی",
    rating: 4,
    date: "۱۰ اسفند ۱۴۰۲",
    text: "گلدان خوبی است اما فکر می‌کردم کمی بزرگتر باشد. با این حال کیفیت عالی است و ارزش خرید دارد.",
    replies: [
      {
        id: "r1-2",
        author: "فروشگاه لوکس",
        date: "۱۱ اسفند ۱۴۰۲",
        text: "متشکریم از نظر شما. ابعاد دقیق محصول در بخش جزئیات محصول ذکر شده است. برای محصولات بزرگتر می‌توانید مجموعه دیگر ما را بررسی کنید.",
        isStore: true,
      },
      {
        id: "r1-3",
        author: "الهام کریمی",
        date: "۱۲ اسفند ۱۴۰۲",
        text: "من هم همین گلدان را خریدم و سایزش برای میز کنسول من عالی بود. شاید برای فضاهای بزرگتر کوچک باشد.",
      },
    ],
  },
  {
    id: "c1-3",
    productId: "1",
    author: "مینا احمدی",
    rating: 5,
    date: "۵ اسفند ۱۴۰۲",
    text: "عاشق این گلدان شدم! رنگ و طراحی آن بی‌نظیر است. بسته‌بندی هم عالی بود و محصول سالم رسید.",
  },

  // Comments for product 2 (پتوی پشمی)
  {
    id: "c2-1",
    productId: "2",
    author: "رضا حسینی",
    rating: 5,
    date: "۲۰ اسفند ۱۴۰۲",
    text: "این پتو فوق‌العاده نرم و گرم است. کیفیت پشم عالی و بافت آن بسیار زیباست. برای شب‌های سرد زمستان عالی است.",
    replies: [
      {
        id: "r2-1",
        author: "فروشگاه لوکس",
        date: "۲۱ اسفند ۱۴۰۲",
        text: "خوشحالیم که از پتوی ما راضی هستید! از بهترین پشم طبیعی استفاده شده است.",
        isStore: true,
      },
    ],
  },
  {
    id: "c2-2",
    productId: "2",
    author: "نگار صادقی",
    rating: 4,
    date: "۱۸ اسفند ۱۴۰۲",
    text: "پتوی خوبی است اما قیمت کمی بالاست. با این حال کیفیت آن ارزش خرید را دارد.",
  },

  // Comments for product 3
  {
    id: "c3-1",
    productId: "3",
    author: "علی اکبری",
    rating: 5,
    date: "۲۵ اسفند ۱۴۰۲",
    text: "محصول عالی با کیفیت بسیار خوب. دقیقا همان چیزی بود که می‌خواستم.",
  },

  // Comments for product 4 (چراغ رومیزی)
  {
    id: "c4-1",
    productId: "4",
    author: "فاطمه نوری",
    rating: 5,
    date: "۲۲ اسفند ۱۴۰۲",
    text: "این چراغ واقعا زیباست! نور آن نرم و دلنشین است و طراحی مدرن آن به دکوراسیون اتاقم جلوه خاصی داده.",
    replies: [
      {
        id: "r4-1",
        author: "فروشگاه لوکس",
        date: "۲۳ اسفند ۱۴۰۲",
        text: "از انتخاب شما سپاسگزاریم! امیدواریم همیشه از نور دلنشین این چراغ لذت ببرید.",
        isStore: true,
      },
    ],
  },
  {
    id: "c4-2",
    productId: "4",
    author: "حسین مرادی",
    rating: 4,
    date: "۲۰ اسفند ۱۴۰۲",
    text: "چراغ خوبی است. کیفیت ساخت عالی اما کابل برق کمی کوتاه است.",
  },

  // Comments for product 5 (هنر دیواری)
  {
    id: "c5-1",
    productId: "5",
    author: "مریم کاظمی",
    rating: 5,
    date: "۱۸ اسفند ۱۴۰۲",
    text: "این اثر هنری فوق‌العاده است! به دیوار خانه‌ام شخصیت خاصی بخشیده. همه مهمان‌ها از آن تعریف می‌کنند.",
    replies: [
      {
        id: "r5-1",
        author: "سارا محمدی",
        date: "۱۹ اسفند ۱۴۰۲",
        text: "من هم همین محصول را خریدم و عاشقش شدم! واقعا ارزش خرید دارد.",
      },
    ],
  },

  // Comments for product 6
  {
    id: "c6-1",
    productId: "6",
    author: "امیر رستمی",
    rating: 5,
    date: "۱۵ اسفند ۱۴۰۲",
    text: "کیفیت عالی و ارسال سریع. کاملا راضی هستم.",
  },

  // Comments for product 7
  {
    id: "c7-1",
    productId: "7",
    author: "زهرا موسوی",
    rating: 4,
    date: "۱۲ اسفند ۱۴۰۲",
    text: "محصول خوبی است اما رنگ آن در عکس کمی متفاوت به نظر می‌رسید.",
  },

  // Comments for product 8 (ست کوسن)
  {
    id: "c8-1",
    productId: "8",
    author: "پریسا احمدی",
    rating: 5,
    date: "۱۰ اسفند ۱۴۰۲",
    text: "این کوسن‌ها فوق‌العاده راحت و زیبا هستند! پارچه کتان با کیفیت بالا و دوخت آن‌ها بسیار تمیز است.",
    replies: [
      {
        id: "r8-1",
        author: "فروشگاه لوکس",
        date: "۱۱ اسفند ۱۴۰۲",
        text: "خوشحالیم که از کوسن‌های ما راضی هستید! از بهترین پارچه کتان استفاده کرده‌ایم.",
        isStore: true,
      },
    ],
  },
]

export function getCommentsByProductId(productId: string): Comment[] {
  return commentsData.filter((comment) => comment.productId === productId)
}
