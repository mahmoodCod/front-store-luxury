"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, Reply, Edit, Trash2, User } from "lucide-react"
import { commentApi } from "@/lib/api"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"

interface Comment {
  _id: string
  content: string
  rating: number
  user: {
    _id: string
    firstName: string
    lastName: string
  }
  replies: Array<{
    _id: string
    content: string
    user: {
      _id: string
      firstName: string
      lastName: string
    }
    createdAt: string
  }>
  createdAt: string
}

interface ProductCommentsProps {
  productId: string
}

export function ProductComments({ productId }: ProductCommentsProps) {
  const { user } = useCart()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [rating, setRating] = useState(5)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    fetchComments()
  }, [productId])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await commentApi.getProductComments(productId)
      if (response.success) {
        setComments(response.data.comments || [])
      } else {
        toast.error(response.message || "خطا در دریافت کامنت‌ها")
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      const message = (error as any)?.message || 'خطا در دریافت کامنت‌ها'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید")
      return
    }

    if (!newComment.trim()) {
      toast.error("لطفاً نظر خود را بنویسید")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await commentApi.createComment({
        content: newComment.trim(),
        rating,
        productId
      })

      if (response.success) {
        toast.success("نظر شما ثبت شد و پس از تایید ادمین نمایش داده می‌شود")
        setNewComment("")
        setRating(5)
        fetchComments()
      } else {
        toast.error(response.message || "خطا در ثبت نظر")
      }
    } catch (error: any) {
      console.error('Error creating comment:', error)
      toast.error(error.message || "خطا در ثبت نظر")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (commentId: string) => {
    if (!user) {
      toast.error("لطفاً ابتدا وارد شوید")
      return
    }

    if (!replyContent.trim()) {
      toast.error("لطفاً پاسخ خود را بنویسید")
      return
    }

    try {
      const response = await commentApi.createReply(commentId, {
        content: replyContent.trim()
      })

      if (response.success) {
        toast.success("پاسخ شما ثبت شد و پس از تایید ادمین نمایش داده می‌شود")
        setReplyContent("")
        setReplyingTo(null)
        fetchComments()
      } else {
        toast.error(response.message || "خطا در ثبت پاسخ")
      }
    } catch (error: any) {
      console.error('Error creating reply:', error)
      toast.error(error.message || "خطا در ثبت پاسخ")
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && setRating(i + 1)}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR')
  }

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            نظرات کاربران
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          نظرات کاربران ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">نظر خود را بنویسید</h4>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">امتیاز:</label>
              {renderStars(rating, true)}
            </div>

            <Textarea
              placeholder="نظر خود را در مورد این محصول بنویسید..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />

            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت نظر"}
            </Button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800">برای ثبت نظر ابتدا وارد شوید</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>هنوز نظری ثبت نشده است</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {(comment.user.firstName && comment.user.lastName) ? `${comment.user.firstName} ${comment.user.lastName}` : (comment as any)?.user?.username || 'کاربر'}
                      </p>
                      <div className="flex items-center gap-2">
                        {renderStars(comment.rating)}
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{comment.content}</p>

                {/* Reply Button */}
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Reply className="w-4 h-4 ml-1" />
                    پاسخ
                  </Button>
                )}

                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3">
                    <Textarea
                      placeholder="پاسخ خود را بنویسید..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment._id)}
                        disabled={!replyContent.trim()}
                      >
                        ثبت پاسخ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent("")
                        }}
                      >
                        لغو
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="bg-gray-50 rounded-lg p-3 mr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                          <span className="font-medium text-sm text-gray-900">
                            {(reply.user.firstName && reply.user.lastName) ? `${reply.user.firstName} ${reply.user.lastName}` : (reply as any)?.user?.username || 'کاربر'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}