import { Sparkles } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Sparkles className="h-8 w-8 text-primary" fill="currentColor" />
      </div>
      <span className="text-2xl font-serif font-bold text-foreground">لوکس</span>
    </div>
  )
}
