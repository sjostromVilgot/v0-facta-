"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FactData {
  id: string
  title: string
  content: string
  tags: Array<{ emoji: string; label: string }>
  category: string
  readTime?: string
  isPremium?: boolean
}

export type CardSize = "S" | "M" | "L"
export type CardVariant = "standard" | "saved" | "shareable" | "daily-fact"
export type SwipeState = "idle" | "swipe-left" | "swipe-right"

interface FactCardProps {
  fact: FactData
  size?: CardSize
  variant?: CardVariant
  onSave?: (fact: FactData) => void
  onShare?: (fact: FactData) => void
  onNext?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  disabled?: boolean
  isSaved?: boolean
}

const sizeClasses = {
  S: {
    card: "p-4 min-h-[200px]",
    title: "text-sm font-semibold line-clamp-2",
    content: "text-xs line-clamp-2",
    button: "text-xs px-2 py-1",
    icon: 14,
  },
  M: {
    card: "p-5 min-h-[280px]",
    title: "text-base font-semibold line-clamp-2",
    content: "text-sm line-clamp-3",
    button: "text-sm px-3 py-1.5",
    icon: 16,
  },
  L: {
    card: "p-6 min-h-[360px]",
    title: "text-lg font-bold line-clamp-2",
    content: "text-base line-clamp-3",
    button: "text-sm px-4 py-2",
    icon: 18,
  },
}

const variantClasses = {
  standard: "bg-card border border-border card-shadow-m",
  saved:
    "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 card-shadow-m",
  shareable: "bg-gradient-to-br from-secondary/20 via-accent/10 to-primary/20 border border-primary/30 card-shadow-l",
  "daily-fact":
    "bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/30 card-shadow-l",
}

export function FactCard({
  fact,
  size = "M",
  variant = "standard",
  onSave,
  onShare,
  onNext,
  onSwipeLeft,
  onSwipeRight,
  className,
  disabled = false,
  isSaved = false,
}: FactCardProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [swipeState, setSwipeState] = useState<SwipeState>("idle")
  const [isShining, setIsShining] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const sizeConfig = sizeClasses[size]

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return

    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !touchStart) return

    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    }

    const deltaX = currentTouch.x - touchStart.x
    const deltaY = Math.abs(currentTouch.y - touchStart.y)

    // Only allow horizontal swipes
    if (deltaY < 50) {
      setDragOffset(deltaX)
      setTouchEnd(currentTouch)

      // Update swipe state for visual indication
      if (Math.abs(deltaX) > 50) {
        setSwipeState(deltaX > 0 ? "swipe-right" : "swipe-left")
      } else {
        setSwipeState("idle")
      }
    }
  }

  const handleTouchEnd = () => {
    if (disabled || !touchStart || !touchEnd) {
      setDragOffset(0)
      setIsDragging(false)
      setSwipeState("idle")
      return
    }

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = Math.abs(touchEnd.y - touchStart.y)
    const minSwipeDistance = 100

    if (deltaY < 100 && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setDragOffset(0)
    setIsDragging(false)
    setSwipeState("idle")
    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleSave = () => {
    if (onSave) {
      onSave(fact)
      setIsShining(true)
      setTimeout(() => setIsShining(false), 1000)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(fact)
    }
  }

  const getSwipeIndicator = () => {
    if (swipeState === "swipe-right") {
      return (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-80">
          Spara
        </div>
      )
    }
    if (swipeState === "swipe-left") {
      return (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-80">
          Nästa
        </div>
      )
    }
    return null
  }

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "touch-none select-none transition-all duration-300 ease-out",
        !disabled && "cursor-grab active:cursor-grabbing",
        isDragging && "transition-none",
        className,
      )}
      style={{
        transform: isDragging
          ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg) scale(${1 - Math.abs(dragOffset) * 0.0002})`
          : undefined,
        opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) / 500) : undefined,
      }}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 rounded-2xl",
          sizeConfig.card,
          variantClasses[variant],
          isShining && "animate-pulse",
          variant === "daily-fact" && "glow-effect",
          swipeState === "swipe-right" && "ring-2 ring-green-400",
          swipeState === "swipe-left" && "ring-2 ring-red-400",
        )}
      >
        {variant === "daily-fact" && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 animate-pulse" />
        )}

        {getSwipeIndicator()}

        {variant === "daily-fact" && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            <Sparkles size={12} />
            Dagens fakta
          </div>
        )}

        <div className="relative z-10 h-full flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {fact.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium"
              >
                <span>{tag.emoji}</span>
                {tag.label}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className={cn("text-balance leading-tight mb-3", sizeConfig.title)}>{fact.title}</h3>

          {/* Content */}
          <p className={cn("text-muted-foreground leading-relaxed flex-1 text-pretty", sizeConfig.content)}>
            {fact.content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className={cn(
                  "flex items-center gap-1.5 transition-all duration-200 hover:scale-105",
                  sizeConfig.button,
                  (isSaved || variant === "saved") && "text-red-500 bg-red-50 dark:bg-red-950/20",
                )}
              >
                <Heart
                  size={sizeConfig.icon}
                  className={cn(
                    "transition-all duration-200",
                    (isSaved || variant === "saved") && "fill-current scale-110",
                  )}
                />
                {isSaved || variant === "saved" ? "Sparad" : "Spara"}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className={cn(
                  "flex items-center gap-1.5 hover:scale-105 transition-all duration-200",
                  sizeConfig.button,
                )}
              >
                <Share2 size={sizeConfig.icon} />
                Dela
              </Button>
            </div>

            {onNext && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className={cn("flex items-center gap-1 text-muted-foreground hover:text-foreground", sizeConfig.button)}
              >
                Nästa
                <ChevronRight size={sizeConfig.icon} />
              </Button>
            )}
          </div>

          {/* Read time indicator */}
          {fact.readTime && <div className="text-xs text-muted-foreground mt-2 text-center">{fact.readTime}</div>}
        </div>
      </Card>
    </div>
  )
}
