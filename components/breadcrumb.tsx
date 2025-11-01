import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface BreadcrumbProps {
  items: { label: string; href?: string }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="py-4 border-b border-border bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
              {index < items.length - 1 && <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
