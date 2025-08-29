export function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded mx-auto animate-pulse"></div>
          <div className="h-3 w-24 bg-muted/60 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
      <div className="h-3 w-1/2 bg-muted/60 rounded animate-pulse"></div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-muted/60 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-muted/60 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-muted/60 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}


