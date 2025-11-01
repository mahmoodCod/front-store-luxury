"use client"

import { AdminGuard } from "@/components/admin-guard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, TrendingUp, Users, ShoppingCart, Package, MessageSquare, Shield, BarChart3, DollarSign, Eye, Settings, Bell, Search, Filter, Download, RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock, Star, Zap, Target, Globe, Lock, Unlock, UserPlus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { productApi, collectionApi, commentApi, notificationApi, userApi } from "@/lib/api"
import { ProductDialog } from "@/components/product-dialog"
import { CollectionDialog } from "@/components/collection-dialog"

export default function AdminPage() {
  const [bannedUsers, setBannedUsers] = useState<any[]>([])
  const [approvedComments, setApprovedComments] = useState<string[]>([])
  const [rejectedComments, setRejectedComments] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [loadingComments, setLoadingComments] = useState(false)
  const commentsErrorShownRef = useRef(false)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [usersPerPage] = useState(10)
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [collections, setCollections] = useState<any[]>([])
  const [loadingCollections, setLoadingCollections] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgOrderValue: 0
  })
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifPollingRef = useRef<NodeJS.Timeout | null>(null)


  const orders = [
    { id: "O-230015", userPhone: "09120000002", total: 1250000, status: "پرداخت‌شده", date: "1403/06/10", items: 3, paymentMethod: "کارت به کارت" },
    { id: "O-230016", userPhone: "09120000003", total: 890000, status: "در حال پردازش", date: "1403/06/11", items: 2, paymentMethod: "آنلاین" },
    { id: "O-230017", userPhone: "09120000001", total: 1990000, status: "تحویل‌شده", date: "1403/06/12", items: 4, paymentMethod: "کارت به کارت" },
    { id: "O-230018", userPhone: "09120000004", total: 1560000, status: "لغو شده", date: "1403/06/13", items: 1, paymentMethod: "آنلاین" },
    { id: "O-230019", userPhone: "09120000005", total: 2340000, status: "ارسال شده", date: "1403/06/14", items: 3, paymentMethod: "کارت به کارت" }
  ]

  const handleBanUser = async (userId: string) => {
    try {
      const response = await userApi.banUser(userId)
      if (response.success) {
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, banned: true } : u
        ))
        fetchBannedUsers()
        toast.success("کاربر با موفقیت بن شد")
      } else {
        toast.error(response.message || "خطا در بن کردن کاربر")
      }
    } catch (error: any) {
      console.error('Error banning user:', error)
      toast.error(error.message || "خطا در بن کردن کاربر")
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await userApi.unbanUser(userId)
      if (response.success) {
        setUsers(prev => prev.map(u => 
          u._id === userId ? { ...u, banned: false } : u
        ))
        fetchBannedUsers()
        fetchUsers() // Refresh users list
        toast.success("بن کاربر با موفقیت رفع شد")
      } else {
        toast.error(response.message || "خطا در رفع بن کاربر")
      }
    } catch (error: any) {
      console.error('Error unbanning user:', error)
      toast.error(error.message || "خطا در رفع بن کاربر")
    }
  }

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoadingUsers(true)
      const response = await userApi.getAllUsers({ page, limit: usersPerPage, search: searchTerm || undefined })
      if (response.success) {
        setUsers(response.data?.users || [])
        const paginationData = response.data?.pagination || {}
        setTotalPages(paginationData.totalPages || Math.ceil((paginationData.total || 0) / usersPerPage) || 1)
        setTotalUsers(paginationData.total || response.data?.total || 0)
        setCurrentPage(page)
      } else {
        toast.error(response.message || 'خطا در دریافت لیست کاربران')
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      toast.error(error.message || 'خطا در دریافت لیست کاربران')
    } finally {
      setLoadingUsers(false)
    }
  }

  const productErrorShownRef = useRef(false)
  const fetchedOnceRef = useRef(false)

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const response = await productApi.getAllProducts()
      console.log('Products response:', response)
      if (response.success && response.data && Array.isArray(response.data.products)) {
        setProducts(response.data.products)
        productErrorShownRef.current = false
      } else {
        // keep previous products on malformed response
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      if (!productErrorShownRef.current) {
        const message = (error as any)?.message || "خطا در دریافت محصولات"
        toast.error(message)
        productErrorShownRef.current = true
      }
      // keep previous products on error
    } finally {
      setLoadingProducts(false)
    }
  }, [])

  const fetchCollections = async () => {
    setLoadingCollections(true)
    try {
      const response = await collectionApi.getAllCollections()
      if (response.success) {
        setCollections(Array.isArray(response.data.collections) ? response.data.collections : [])
      } else {
        // keep previous collections on malformed response
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error("خطا در دریافت مجموعه‌ها")
      // keep previous collections on error
    } finally {
      setLoadingCollections(false)
    }
  }

  const fetchAdminComments = useCallback(async () => {
    setLoadingComments(true)
    try {
      const response = await commentApi.getAllComments({ page: 1, limit: 20 })
      if (response.success) {
        const items = (response.data?.comments || []).map((c: any) => ({
          id: c._id,
          text: c.content,
          rating: c.rating,
          user: c.user?.username || `${c.user?.firstName || ''} ${c.user?.lastName || ''}`.trim() || 'کاربر',
          product: c.product?.name || 'محصول',
          date: new Date(c.createdAt).toLocaleDateString('fa-IR'),
          status: c.status || 'pending',
          replies: Array.isArray(c.replies) ? c.replies.map((r: any) => ({
            id: r._id,
            text: r.content,
            user: r.user?.username || `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || 'کاربر',
            date: new Date(r.createdAt).toLocaleDateString('fa-IR'),
            status: r.status || 'pending',
          })) : [],
        }))
        setComments(items)
        commentsErrorShownRef.current = false
      } else {
        setComments([])
      }
    } catch (error) {
      console.error('Error fetching admin comments:', error)
      if (!commentsErrorShownRef.current) {
        const message = (error as any)?.message || 'خطا در دریافت کامنت‌ها'
        toast.error(message)
        commentsErrorShownRef.current = true
      }
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }, [])

  const fetchBannedUsers = async () => {
    try {
      console.log('Fetching banned users...')
      const response = await userApi.getBannedUsers()
      console.log('Banned users response:', response)
      
      if (response.success) {
        // Backend returns 'bans' not 'bannedUsers'
        const bans = response.data?.bans || response.data?.bannedUsers || []
        console.log('Bans array:', bans)
        
        if (bans.length === 0) {
          setBannedUsers([])
          return
        }
        
        // Fetch user details for each ban
        const bannedUsersWithDetails = await Promise.all(
          bans.map(async (ban: any) => {
            try {
              // Try to find user by phone
              const usersResponse = await userApi.getAllUsers({ search: ban.phone, limit: 100 })
              if (usersResponse.success && usersResponse.data?.users?.length > 0) {
                // Find exact match by phone
                const user = usersResponse.data.users.find((u: any) => u.phone === ban.phone) || usersResponse.data.users[0]
                return {
                  ...ban,
                  user: user,
                  userId: user._id,
                  phone: ban.phone || user.phone,
                  createdAt: ban.createdAt || user.updatedAt || new Date()
                }
              }
              // If user not found, return ban with phone only
              return {
                ...ban,
                phone: ban.phone,
                createdAt: ban.createdAt || ban.createdAt || new Date()
              }
            } catch (err) {
              console.error('Error fetching user for ban:', err)
              return {
                ...ban,
                phone: ban.phone,
                createdAt: ban.createdAt || new Date()
              }
            }
          })
        )
        
        console.log('Banned users with details:', bannedUsersWithDetails)
        setBannedUsers(bannedUsersWithDetails)
      } else {
        console.error('Error fetching banned users:', response.message)
        toast.error(response.message || 'خطا در دریافت لیست کاربران بن شده')
      }
    } catch (error: any) {
      console.error('Error fetching banned users:', error)
      toast.error(error.message || 'خطا در دریافت لیست کاربران بن شده')
    }
  }

  useEffect(() => {
    // جلوگیری از اجرای دوباره در حالت StrictMode توسعه
    if (!fetchedOnceRef.current) {
      fetchUsers(1)
      fetchBannedUsers()
      fetchProducts()
      fetchCollections()
      fetchAdminComments()
      fetchNotifications()
      startNotifPolling()
      fetchedOnceRef.current = true
    }
  }, [fetchProducts, fetchAdminComments])

  useEffect(() => {
    // Fetch users when page or search changes
    if (fetchedOnceRef.current) {
      fetchUsers(currentPage)
    }
  }, [currentPage, searchTerm])

  // سیستم نوتیفیکیشن واقعی
  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.list({ page: 1, limit: 20 })
      if (res.success) {
        const items = (res.data?.notifications || []).map((n: any) => ({
          id: n._id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt,
          read: !!n.read,
          icon: n.type === 'user_registered' ? 'UserPlus' : n.type === 'comment_created' ? 'MessageSquare' : n.type === 'reply_created' ? 'MessageSquare' : n.type === 'order_created' ? 'ShoppingCart' : 'Package',
          color: n.type === 'user_registered' ? 'blue' : n.type === 'comment_created' ? 'green' : n.type === 'reply_created' ? 'green' : n.type === 'order_created' ? 'purple' : 'orange',
        }))
        setNotifications(items)
        setUnreadCount(items.filter((i: any) => !i.read).length)
      }
    } catch (e: any) {
      // بی‌صدا بماند تا پنل پایدار باشد
      console.error('notif fetch error', e?.message)
    }
  }

  const startNotifPolling = () => {
    if (notifPollingRef.current) return
    notifPollingRef.current = setInterval(() => {
      fetchNotifications()
    }, 30000)
  }

  useEffect(() => {
    return () => {
      if (notifPollingRef.current) clearInterval(notifPollingRef.current)
    }
  }, [])

  // حذف شبیه‌سازی؛ از API استفاده می‌شود

  const markAsRead = async (id: string | number) => {
    try {
      await notificationApi.markRead(String(id))
      await fetchNotifications()
    } catch (e) {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllRead()
      await fetchNotifications()
    } catch (e) {
      // ignore
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      const res = await commentApi.updateStatus(commentId, 'approved')
      if (res.success) {
        setApprovedComments(prev => [...prev, commentId])
        setRejectedComments(prev => prev.filter(id => id !== commentId))
        toast.success("کامنت تایید شد")
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در تایید کامنت')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در تایید کامنت')
    }
  }

  const handleRejectComment = async (commentId: string) => {
    try {
      const res = await commentApi.updateStatus(commentId, 'rejected')
      if (res.success) {
        setRejectedComments(prev => [...prev, commentId])
        setApprovedComments(prev => prev.filter(id => id !== commentId))
        toast.success("کامنت رد شد")
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در رد کامنت')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در رد کامنت')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await commentApi.deleteComment(commentId)
      if (res.success) {
        toast.success('کامنت حذف شد')
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در حذف کامنت')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در حذف کامنت')
    }
  }

  const handleApproveReply = async (commentId: string, replyId: string) => {
    try {
      const res = await commentApi.updateReplyStatus(commentId, replyId, 'approved')
      if (res.success) {
        toast.success('پاسخ تایید شد')
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در تایید پاسخ')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در تایید پاسخ')
    }
  }

  const handleRejectReply = async (commentId: string, replyId: string) => {
    try {
      const res = await commentApi.updateReplyStatus(commentId, replyId, 'rejected')
      if (res.success) {
        toast.success('پاسخ رد شد')
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در رد پاسخ')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در رد پاسخ')
    }
  }

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      const res = await commentApi.deleteReply(commentId, replyId)
      if (res.success) {
        toast.success('پاسخ حذف شد')
        fetchAdminComments()
      } else {
        toast.error(res.message || 'خطا در حذف پاسخ')
      }
    } catch (e: any) {
      toast.error(e.message || 'خطا در حذف پاسخ')
    }
  }

  const overviewCards = [
    {
      title: "کاربران کل",
      value: totalUsers || (Array.isArray(users) ? users.length : 0),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: "+12%",
      changeType: "positive",
      trend: "up"
    },
    {
      title: "کاربران فعال",
      value: Math.max(0, totalUsers - bannedUsers.length) || (Array.isArray(users) ? users.filter(u => !u.banned).length : 0),
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+12%",
      changeType: "positive",
      trend: "up"
    },
    {
      title: "کاربران بن شده",
      value: bannedUsers.length,
      icon: Shield,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      change: "+5%",
      changeType: "negative",
      trend: "down"
    },
    {
      title: "سفارش‌های امروز",
      value: orders.length,
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+8%",
      changeType: "positive",
      trend: "up"
    },
    {
      title: "محصولات موجود",
      value: products.length,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: "+5%",
      changeType: "positive",
      trend: "up"
    },
    {
      title: "کامنت‌های جدید",
      value: Array.isArray(comments) ? comments.filter(c => c.status === "pending").length : 0,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: "+15%",
      changeType: "positive",
      trend: "up"
    },
    {
      title: "درآمد امروز",
      value: "12.5M",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: "+23%",
      changeType: "positive",
      trend: "up"
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(overviewCards.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(overviewCards.length / 3)) % Math.ceil(overviewCards.length / 3))
  }

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = user.phone?.includes(searchTerm) || user._id?.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "active" && !user.banned) ||
      (filterStatus === "banned" && user.banned);
    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="flex-1 py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <AdminGuard>
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-10 lg:space-y-12">
              {/* Header Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <Settings className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
                        <div>
                      <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        پنل مدیریت پیشرفته
                      </h1>
                      <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-lg">مدیریت کامل فروشگاه و کاربران با ابزارهای حرفه‌ای</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 space-x-reverse">
                    {/* نوتفیکیشن */}
                  <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="relative hover:bg-gray-50 hover:text-gray-900 w-full sm:w-auto h-10 sm:h-auto"
                        onClick={() => {
                          // نمایش/مخفی کردن نوتفیکیشن‌ها
                          const dropdown = document.getElementById('notification-dropdown');
                          if (dropdown) {
                            dropdown.classList.toggle('hidden');
                          }
                        }}
                      >
                        <Bell className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        <span className="text-sm text-gray-700 hover:text-gray-900">اعلان‌ها</span>
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                      
                      {/* Dropdown نوتفیکیشن */}
                      <div id="notification-dropdown" className="hidden absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">اعلان‌ها</h3>
                            {unreadCount > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs"
                              >
                                همه را خوانده شده
                              </Button>
                            )}
                                        </div>
                                      </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p>اعلان جدیدی وجود ندارد</p>
                                        </div>
                          ) : (
                            notifications.slice(0, 10).map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    notification.color === 'blue' ? 'bg-blue-100' :
                                    notification.color === 'green' ? 'bg-green-100' :
                                    notification.color === 'red' ? 'bg-red-100' :
                                    notification.color === 'purple' ? 'bg-purple-100' :
                                    'bg-orange-100'
                                  }`}>
                                    {notification.icon === 'UserPlus' && <UserPlus className="w-4 h-4 text-blue-600" />}
                                    {notification.icon === 'MessageSquare' && <MessageSquare className="w-4 h-4 text-green-600" />}
                                    {notification.icon === 'ShoppingCart' && <ShoppingCart className="w-4 h-4 text-purple-600" />}
                                    {notification.icon === 'Shield' && <Shield className="w-4 h-4 text-red-600" />}
                                    {notification.icon === 'Package' && <Package className="w-4 h-4 text-orange-600" />}
                                        </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(notification.time).toLocaleTimeString('fa-IR')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                            </div>
                        {notifications.length > 10 && (
                          <div className="p-3 border-t bg-gray-50 text-center">
                            <Button variant="outline" size="sm" className="text-xs">
                              مشاهده همه اعلان‌ها
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-blue-50 hover:text-blue-700 w-full sm:w-auto h-10 sm:h-auto"
                      onClick={() => {
                        // باز کردن پیش‌نمایش فروشگاه در تب جدید
                        window.open('/', '_blank');
                        toast.success("پیش‌نمایش فروشگاه در تب جدید باز شد");
                      }}
                    >
                      <Eye className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      <span className="text-sm text-gray-700 hover:text-blue-700">پیش‌نمایش فروشگاه</span>
                    </Button>
                    
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-green-50 hover:text-green-700 w-full sm:w-auto h-10 sm:h-auto"
                      onClick={() => {
                        // شبیه‌سازی خروجی Excel
                        toast.success("گزارش Excel در حال تولید...");
                        setTimeout(() => {
                          // ایجاد فایل CSV ساده
                          const csvData = `نام,ایمیل,تاریخ عضویت,وضعیت\n${users.map(user => `${user.username},${user.phone},${new Date(user.createdAt).toLocaleDateString('fa-IR')},${user.banned ? 'بن شده' : 'فعال'}`).join('\n')}`;
                          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `users-report-${new Date().toISOString().split('T')[0]}.csv`;
                          link.click();
                          toast.success("فایل Excel دانلود شد!");
                        }, 1500);
                      }}
                    >
                      <Download className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                      <span className="text-sm text-gray-700 hover:text-green-700">خروجی Excel</span>
                    </Button>

                  </div>
                </div>
                        </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {overviewCards.slice(0, 4).map((card, index) => (
                  <div key={index} className={`${card.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] flex items-center justify-center overflow-hidden`}>
                      <div className="flex flex-col items-center justify-center text-center w-full px-2">
                        <div className={`p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl bg-gradient-to-r ${card.color} shadow-lg mb-3 sm:mb-4`}>
                          <card.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                        </div>
                        <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-2 sm:mb-3 truncate w-full">{card.title}</p>
                        <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold ${card.textColor} mb-2 sm:mb-3 md:mb-4`}>{card.value}</p>
                        <div className="flex items-center justify-center flex-wrap">
                          <span className={`text-xs sm:text-sm md:text-base font-medium ${
                            card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {card.change}
                          </span>
                          <span className="text-xs sm:text-sm md:text-base text-gray-500 mr-1 sm:mr-2 hidden sm:inline">نسبت به ماه قبل</span>
                          <span className="text-xs text-gray-500 mr-1 sm:mr-2 sm:hidden">ماه قبل</span>
                        </div>
                      </div>
                    </div>
                ))}
                  </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 overflow-hidden">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">عملیات سریع</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-blue-50 hover:text-blue-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // اسکرول به تب کاربران
                      const usersTab = document.querySelector('[data-value="users"]') as HTMLElement;
                      if (usersTab) {
                        usersTab.click();
                        usersTab.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-blue-600 hover:text-blue-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-blue-700 leading-tight">کاربران</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-green-50 hover:text-green-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // اسکرول به تب سفارش‌ها
                      const ordersTab = document.querySelector('[data-value="orders"]') as HTMLElement;
                      if (ordersTab) {
                        ordersTab.click();
                        ordersTab.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-green-600 hover:text-green-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-green-700 leading-tight">سفارش‌ها</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-purple-50 hover:text-purple-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // باز کردن صفحه محصولات
                      window.open('/shop', '_blank');
                    }}
                  >
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-purple-600 hover:text-purple-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-purple-700 leading-tight">محصولات</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-orange-50 hover:text-orange-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // اسکرول به تب کامنت‌ها
                      const commentsTab = document.querySelector('[data-value="comments"]') as HTMLElement;
                      if (commentsTab) {
                        commentsTab.click();
                        commentsTab.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-orange-600 hover:text-orange-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-orange-700 leading-tight">کامنت‌ها</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-red-50 hover:text-red-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // اسکرول به تب کاربران بن شده
                      const usersTab = document.querySelector('[data-value="users"]') as HTMLElement;
                      if (usersTab) {
                        usersTab.click();
                        // کمی تاخیر برای لود شدن تب
                        setTimeout(() => {
                          const bannedSection = document.querySelector('[data-tab="banned"]') as HTMLElement;
                          if (bannedSection) {
                            bannedSection.click();
                            bannedSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-red-600 hover:text-red-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-red-700 leading-tight">امنیت</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-14 sm:h-16 md:h-18 lg:h-20 flex flex-col items-center justify-center space-y-1 hover:bg-indigo-50 hover:text-indigo-700 transition-colors p-2 min-h-[56px] sm:min-h-[64px] md:min-h-[72px] overflow-hidden"
                    onClick={() => {
                      // باز کردن صفحه گزارش‌های تحلیلی
                      window.open('/admin/reports', '_blank');
                      toast.success("گزارش‌های تحلیلی در تب جدید باز شد");
                    }}
                  >
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-indigo-600 hover:text-indigo-700" />
                    <span className="text-xs sm:text-sm md:text-base font-medium text-center text-gray-700 hover:text-indigo-700 leading-tight">گزارش‌ها</span>
                  </Button>
                      </div>
                    </div>
                    
              {/* Management Tabs */}
              <Tabs defaultValue="users" className="space-y-6 md:space-y-8">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg sm:rounded-xl p-4 gap-2 h-16 md:h-20">
                    <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base flex items-center justify-center py-1.5 px-2 min-h-[36px] rounded-md transition-all duration-200 hover:bg-gray-50">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
                      <span className="text-xs sm:text-sm md:text-base">کاربران</span>
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base flex items-center justify-center py-1.5 px-2 min-h-[36px] rounded-md transition-all duration-200 hover:bg-gray-50">
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
                      <span className="text-xs sm:text-sm md:text-base">سفارش‌ها</span>
                    </TabsTrigger>
                    <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base flex items-center justify-center py-1.5 px-2 min-h-[36px] rounded-md transition-all duration-200 hover:bg-gray-50">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
                      <span className="text-xs sm:text-sm md:text-base">محصولات</span>
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base flex items-center justify-center py-1.5 px-2 min-h-[36px] rounded-md transition-all duration-200 hover:bg-gray-50">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
                      <span className="text-xs sm:text-sm md:text-base">مجموعه‌ها</span>
                    </TabsTrigger>
                    <TabsTrigger value="comments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm md:text-base flex items-center justify-center py-1.5 px-2 min-h-[36px] rounded-md transition-all duration-200 hover:bg-gray-50">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
                      <span className="text-xs sm:text-sm md:text-base">کامنت‌ها</span>
                    </TabsTrigger>
                  </TabsList>
                                    </div>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4 md:space-y-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex flex-col justify-center">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 md:mb-10 space-y-4 lg:space-y-0">
                      <div className="text-center lg:text-right">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">مدیریت کاربران</h2>
                        <p className="text-gray-600 mt-2 md:mt-3 text-base md:text-lg">کنترل کامل کاربران و دسترسی‌ها</p>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-blue-600">{totalUsers || 0}</div>
                          <div className="text-xs md:text-sm text-gray-600">کاربر کل</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-green-600">{Math.max(0, totalUsers - bannedUsers.length) || (Array.isArray(users) ? users.filter(u => !u.banned).length : 0)}</div>
                          <div className="text-xs md:text-sm text-gray-600">کاربر فعال</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-red-600">{bannedUsers.length}</div>
                          <div className="text-xs md:text-sm text-gray-600">کاربر بن شده</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 space-x-reverse mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                        <input
                          type="text"
                          placeholder="جستجو در کاربران..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pr-10 pl-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        title="فیلتر کاربران"
                      >
                        <option value="all">همه کاربران</option>
                        <option value="active">کاربران فعال</option>
                        <option value="banned">کاربران بن شده</option>
                      </select>
                      <Button variant="outline" onClick={() => fetchUsers(currentPage)} className="w-full sm:w-auto">
                        <RefreshCw className="w-4 h-4 ml-2" />
                        <span className="hidden sm:inline">بروزرسانی</span>
                        <span className="sm:hidden">بروزرسانی</span>
                      </Button>
                    </div>
                    
                    {loadingUsers ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center space-x-2 space-x-reverse">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="text-gray-600">در حال بارگذاری...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Active Users */}
                        <div>
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 ml-2" />
                            کاربران فعال
                          </h3>
                          <div className="bg-gray-50 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[600px]">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="text-right py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold text-gray-700">شماره تلفن</th>
                                    <th className="text-right py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold text-gray-700">تاریخ ثبت‌نام</th>
                                    <th className="text-right py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold text-gray-700">وضعیت</th>
                                    <th className="text-right py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold text-gray-700">عملیات</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {filteredUsers.filter(u => !u.banned).map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                      <td className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-medium text-gray-900">{user.phone}</td>
                                      <td className="py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                                      </td>
                                      <td className="py-3 md:py-4 px-3 md:px-6">
                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                          <CheckCircle className="w-3 h-3 ml-1" />
                                          فعال
                                        </Badge>
                                      </td>
                                      <td className="py-3 md:py-4 px-3 md:px-6">
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleBanUser(user._id)}
                                          disabled={user.banned}
                                          className="hover:bg-red-700 text-xs"
                                        >
                                          <Shield className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                                          <span className="hidden sm:inline">{user.banned ? 'بن شده' : 'بن کردن'}</span>
                                          <span className="sm:hidden">{user.banned ? 'بن' : 'بن'}</span>
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                        </div>
                      </div>
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loadingUsers}
                          >
                            <ChevronRight className="h-4 w-4" />
                            قبلی
                          </Button>
                          <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum
                              if (totalPages <= 5) {
                                pageNum = i + 1
                              } else if (currentPage <= 3) {
                                pageNum = i + 1
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                              } else {
                                pageNum = currentPage - 2 + i
                              }
                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  disabled={loadingUsers}
                                >
                                  {pageNum}
                                </Button>
                              )
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || loadingUsers}
                          >
                            بعدی
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-600">
                            صفحه {currentPage} از {totalPages}
                          </span>
                        </div>
                      )}
                    </div>
                    
                        {/* Banned Users */}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <XCircle className="w-5 h-5 text-red-600 ml-2" />
                            کاربران بن شده
                          </h3>
                          <div className="bg-red-50 rounded-xl overflow-hidden border border-red-200">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-red-100">
                                  <tr>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">شماره تلفن</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">تاریخ بن</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">عملیات</th>
                        </tr>
                      </thead>
                                <tbody className="divide-y divide-red-200">
                                  {bannedUsers.length === 0 ? (
                                    <tr>
                                      <td colSpan={3} className="py-8 px-6 text-center text-gray-500">
                                        هیچ کاربر بن شده‌ای وجود ندارد
                                      </td>
                                    </tr>
                                  ) : (
                                    bannedUsers.map((ban) => {
                                      const userId = ban.userId || ban.user?._id || ban._id
                                      const userPhone = ban.phone || ban.user?.phone || 'نامشخص'
                                      const banDate = ban.createdAt || ban.user?.updatedAt || new Date()
                                      return (
                                        <tr key={ban._id || userId || ban.phone} className="hover:bg-red-50 transition-colors">
                                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{userPhone}</td>
                                          <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(banDate).toLocaleDateString('fa-IR')}
                                          </td>
                                          <td className="py-4 px-6">
                                            <Button 
                                              variant="outline"
                                              size="sm" 
                                              onClick={() => {
                                                if (userId) {
                                                  handleUnbanUser(userId)
                                                } else {
                                                  toast.error('شناسه کاربر یافت نشد')
                                                }
                                              }}
                                              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                                              disabled={!userId}
                                            >
                                              <Unlock className="w-4 h-4 ml-1" />
                                              رفع بن
                                            </Button>
                                          </td>
                                        </tr>
                                      )
                                    })
                                  )}
                      </tbody>
                    </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4 md:space-y-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">سفارش‌های اخیر</h2>
                    <div className="bg-gray-50 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">شماره سفارش</th>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">شماره تلفن</th>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">مبلغ</th>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">وضعیت</th>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">تاریخ</th>
                              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">عملیات</th>
                        </tr>
                      </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">{order.userPhone}</td>
                                <td className="py-4 px-6 text-sm font-semibold text-gray-900">{order.total.toLocaleString()} تومان</td>
                                <td className="py-4 px-6">
                                  <Badge 
                                    variant={order.status === 'پرداخت‌شده' ? 'default' : 'secondary'}
                                    className={
                                      order.status === 'پرداخت‌شده' ? 'bg-green-100 text-green-800 border-green-200' :
                                      order.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                      order.status === 'تحویل‌شده' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                      'bg-red-100 text-red-800 border-red-200'
                                    }
                                  >
                                    {order.status}
                                  </Badge>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">{order.date}</td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-2 space-x-reverse">
                                    <Button variant="outline" size="sm">جزئیات</Button>
                                    <Button variant="outline" size="sm">پیگیری</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-4 md:space-y-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10 space-y-4 sm:space-y-0">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center sm:text-right">محصولات</h2>
                      <ProductDialog onProductAdded={fetchProducts} />
                    </div>
                    
                    {loadingProducts ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ محصولی یافت نشد</h3>
                        <p className="text-gray-500 mb-4">برای شروع، محصول جدیدی اضافه کنید</p>
                        <ProductDialog onProductAdded={fetchProducts} />
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">نام محصول</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">دسته</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">قیمت</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">موجودی</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">تاریخ ایجاد</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-700">عملیات</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {products && products.length > 0 ? products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{product.name}</td>
                                  <td className="py-4 px-6 text-sm text-gray-600">{product.category}</td>
                                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                                    {product.price?.toLocaleString()} تومان
                                  </td>
                                  <td className="py-4 px-6">
                                    <Badge 
                                      variant={product.stock > 0 ? 'default' : 'destructive'}
                                      className={product.stock > 0 ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                                    >
                                      {product.stock > 0 ? `${product.stock} عدد` : 'ناموجود'}
                                    </Badge>
                                  </td>
                                  <td className="py-4 px-6 text-sm text-gray-600">
                                    {new Date(product.createdAt).toLocaleDateString('fa-IR')}
                                  </td>
                                  <td className="py-4 px-6">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      <Button variant="outline" size="sm">
                                        <Edit className="w-4 h-4 ml-1" />
                                        ویرایش
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={async () => {
                                          if (confirm("آیا از حذف این محصول مطمئن هستید؟")) {
                                            try {
                                              await productApi.deleteProduct(product._id)
                                              toast.success("محصول با موفقیت حذف شد")
                                              fetchProducts()
                                            } catch (error: any) {
                                              toast.error(error.message || "خطا در حذف محصول")
                                            }
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 ml-1" />
                                        حذف
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-gray-500">
                                    محصولی یافت نشد
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Collections Tab */}
                <TabsContent value="collections" className="space-y-4 md:space-y-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-10 space-y-4 sm:space-y-0">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center sm:text-right">مجموعه‌ها</h2>
                      <CollectionDialog onCollectionAdded={fetchCollections} />
                    </div>
                    
                    {loadingCollections ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
                      </div>
                    ) : collections.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">هیچ مجموعه‌ای یافت نشد</h3>
                        <p className="text-gray-600 mb-6">برای شروع، مجموعه جدیدی اضافه کنید</p>
                        <CollectionDialog onCollectionAdded={fetchCollections} />
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="min-w-full">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام مجموعه</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">توضیحات</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ترتیب</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {collections && collections.length > 0 ? collections.map((collection) => (
                                <tr key={collection._id} className="hover:bg-gray-50 transition-colors">
                                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{collection.name}</td>
                                  <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">{collection.description}</td>
                                  <td className="py-4 px-6 text-sm">
                                    <Badge variant={collection.isActive ? "default" : "secondary"}>
                                      {collection.isActive ? "فعال" : "غیرفعال"}
                                    </Badge>
                                  </td>
                                  <td className="py-4 px-6 text-sm text-gray-600">{collection.sortOrder}</td>
                                  <td className="py-4 px-6 text-sm text-gray-600">
                                    {new Date(collection.createdAt).toLocaleDateString('fa-IR')}
                                  </td>
                                  <td className="py-4 px-6 text-sm">
                                    <div className="flex space-x-2 space-x-reverse">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          // TODO: Implement edit collection
                                          toast.info("ویرایش مجموعه به زودی اضافه می‌شود")
                                        }}
                                      >
                                        <Edit className="w-4 h-4 ml-1" />
                                        ویرایش
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={async () => {
                                          if (confirm("آیا از حذف این مجموعه مطمئن هستید؟")) {
                                            try {
                                              await collectionApi.deleteCollection(collection._id)
                                              toast.success("مجموعه با موفقیت حذف شد")
                                              fetchCollections()
                                            } catch (error: any) {
                                              toast.error(error.message || "خطا در حذف مجموعه")
                                            }
                                          }
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 ml-1" />
                                        حذف
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={5} className="py-8 text-center text-gray-500">
                                    مجموعه‌ای یافت نشد
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Comments Tab */}
                <TabsContent value="comments" className="space-y-4 md:space-y-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden w-full min-h-[300px] md:min-h-[350px] lg:min-h-[400px] flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 text-center">کامنت‌های جدید</h2>
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 space-x-reverse mb-3">
                                <span className="text-sm font-semibold text-gray-900">{comment.user}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-600">{comment.product}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                          </div>
                              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{comment.text}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500">{comment.date}</span>
                          <Badge 
                                  variant={comment.status === 'approved' ? 'default' : comment.status === 'rejected' ? 'destructive' : 'secondary'}
                                  className={
                                    comment.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                                    comment.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 
                                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                                  }
                                >
                                  {comment.status === 'approved' ? 'تایید شده' : 
                                   comment.status === 'rejected' ? 'رد شده' : 'در انتظار تایید'}
                          </Badge>
                        </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {comment.status === 'pending' && (
                                <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveComment(comment.id)}
                                    className="bg-green-600 hover:bg-green-700"
                            >
                                    <CheckCircle className="w-4 h-4 ml-1" />
                              تایید
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleRejectComment(comment.id)}
                            >
                                    <XCircle className="w-4 h-4 ml-1" />
                              رد
                            </Button>
                                </>
                              )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              حذف
                            </Button>
                          </div>
                          </div>
                          {/* Replies moderation */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-4 space-y-3 border-t pt-4">
                              {comment.replies.map((reply: any) => (
                                <div key={reply.id} className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium text-sm text-gray-900">{reply.user}</span>
                                      <span className="text-xs text-gray-500">{reply.date}</span>
                                      <Badge 
                                        variant={reply.status === 'approved' ? 'default' : reply.status === 'rejected' ? 'destructive' : 'secondary'}
                                        className={
                                          reply.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                                          reply.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : 
                                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                                        }
                                      >
                                        {reply.status === 'approved' ? 'تایید شده' : 
                                         reply.status === 'rejected' ? 'رد شده' : 'در انتظار تایید'}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700">{reply.text}</p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 ml-4">
                                    {reply.status === 'pending' && (
                                      <>
                                        <Button size="sm" onClick={() => handleApproveReply(comment.id, reply.id)} className="bg-green-600 hover:bg-green-700">تایید</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRejectReply(comment.id, reply.id)}>رد</Button>
                                      </>
                                    )}
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteReply(comment.id, reply.id)}>حذف</Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AdminGuard>
        </div>
      </main>
      <Footer />
    </div>
  )
}