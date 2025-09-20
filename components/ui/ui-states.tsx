"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, WifiOff, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 px-4">
      {/* Header skeleton */}
      <div className="text-center py-2">
        <div className="w-32 h-4 bg-muted rounded animate-pulse mx-auto" />
      </div>

      {/* Daily Fact Skeleton */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-muted rounded animate-pulse" />
          <div className="w-32 h-6 bg-muted rounded animate-pulse" />
          <div className="ml-auto w-16 h-5 bg-muted rounded-full animate-pulse" />
        </div>

        <div className="bg-card rounded-2xl p-6 card-shadow-l">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded animate-pulse" />
              <div className="w-20 h-5 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          </div>

          <div className="w-3/4 h-6 bg-muted rounded animate-pulse mb-2" />
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-muted rounded animate-pulse" />
            <div className="w-5/6 h-4 bg-muted rounded animate-pulse" />
            <div className="w-4/5 h-4 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-16 h-6 bg-muted rounded-full animate-pulse" />
            <div className="w-20 h-6 bg-muted rounded-full animate-pulse" />
          </div>

          <div className="flex justify-between">
            <div className="w-16 h-8 bg-muted rounded animate-pulse" />
            <div className="w-16 h-8 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Discovery Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="w-28 h-6 bg-muted rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="w-48 h-4 bg-muted rounded animate-pulse mx-auto mb-4" />

        <div className="bg-card rounded-2xl p-6 card-shadow-m">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-muted rounded animate-pulse" />
              <div className="w-16 h-5 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          <div className="w-2/3 h-5 bg-muted rounded animate-pulse mb-2" />
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-muted rounded animate-pulse" />
            <div className="w-4/5 h-4 bg-muted rounded animate-pulse" />
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-12 h-5 bg-muted rounded-full animate-pulse" />
            <div className="w-16 h-5 bg-muted rounded-full animate-pulse" />
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="w-14 h-7 bg-muted rounded animate-pulse" />
              <div className="w-12 h-7 bg-muted rounded animate-pulse" />
            </div>
            <div className="w-16 h-7 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Progress dots skeleton */}
        <div className="mt-4 flex justify-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-1 bg-muted rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function OfflineBanner({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsVisible(false)
    const handleOffline = () => setIsVisible(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial state
    setIsVisible(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "bg-orange-100 dark:bg-orange-900/20 border-l-4 border-orange-500 px-4 py-3 mx-4 rounded-r-lg",
        "flex items-center gap-3 text-orange-800 dark:text-orange-200",
        className,
      )}
    >
      <WifiOff size={20} className="text-orange-600 dark:text-orange-400" />
      <div className="flex-1">
        <p className="font-medium text-sm">Offline – visar sparade kort</p>
        <p className="text-xs opacity-75">Anslut till internet för att se nya fakta</p>
      </div>
    </div>
  )
}

export function ErrorState({
  onRetry,
  title = "Något gick snett",
  message = "Vi kunde inte ladda innehållet. Kontrollera din internetanslutning och försök igen.",
  className,
}: {
  onRetry?: () => void
  title?: string
  message?: string
  className?: string
}) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return

    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <div
      className={cn("bg-card rounded-2xl p-6 mx-4 card-shadow-m", "flex flex-col items-center text-center", className)}
    >
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-lg font-bold mb-2 text-balance">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-pretty">{message}</p>

      {onRetry && (
        <Button onClick={handleRetry} disabled={isRetrying} className="min-w-[120px]">
          {isRetrying ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Försöker...
            </>
          ) : (
            "Försök igen"
          )}
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  title = "Inga fakta att visa",
  message = "Det verkar som att vi inte kan ladda några fakta just nu. Kontrollera din internetanslutning och försök igen.",
  onRetry,
  className,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[60vh] px-4 text-center", className)}>
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <Sparkles size={32} className="text-primary" />
      </div>

      <h3 className="text-xl font-bold mb-2 text-balance">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-pretty">{message}</p>

      {onRetry && <Button onClick={onRetry}>Försök igen</Button>}
    </div>
  )
}

export function ContentLoadingState({ message = "Innehåll laddas..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>

      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
