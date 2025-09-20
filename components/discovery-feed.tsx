"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, ChevronRight, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Fact {
  id: number
  content: string
  category: string
  isLiked: boolean
  color: string
}

const factDatabase: Fact[] = [
  {
    id: 1,
    content:
      "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    category: "Food Science",
    isLiked: false,
    color: "from-amber-500/10 to-yellow-500/10",
  },
  {
    id: 2,
    content:
      "A group of flamingos is called a 'flamboyance'. These pink birds get their color from the shrimp and algae they eat.",
    category: "Animals",
    isLiked: false,
    color: "from-pink-500/10 to-rose-500/10",
  },
  {
    id: 3,
    content: "The shortest war in history lasted only 38-45 minutes! It was between Britain and Zanzibar in 1896.",
    category: "History",
    isLiked: false,
    color: "from-blue-500/10 to-indigo-500/10",
  },
  {
    id: 4,
    content:
      "Bananas are berries, but strawberries aren't! Botanically speaking, berries must have seeds inside their flesh.",
    category: "Botany",
    isLiked: false,
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    id: 5,
    content:
      "Your brain uses about 20% of your body's total energy, despite only weighing about 2% of your body weight.",
    category: "Human Body",
    isLiked: false,
    color: "from-purple-500/10 to-violet-500/10",
  },
  {
    id: 6,
    content: "A single cloud can weigh more than a million pounds! The water droplets are just very spread out.",
    category: "Weather",
    isLiked: false,
    color: "from-sky-500/10 to-cyan-500/10",
  },
  {
    id: 7,
    content:
      "Wombat poop is cube-shaped! Their intestines have varying elasticity that creates the unique cubic shape.",
    category: "Animals",
    isLiked: false,
    color: "from-orange-500/10 to-red-500/10",
  },
  {
    id: 8,
    content:
      "There are more possible games of chess than there are atoms in the observable universe - about 10^120 possibilities!",
    category: "Mathematics",
    isLiked: false,
    color: "from-slate-500/10 to-gray-500/10",
  },
]

export function DiscoveryFeed() {
  const [facts, setFacts] = useState<Fact[]>(() => {
    // Shuffle facts on initial load
    return [...factDatabase].sort(() => Math.random() - 0.5)
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)

  const currentFact = facts[currentIndex]
  const nextFact = facts[(currentIndex + 1) % facts.length]

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

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
    }
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setDragOffset(0)
      setIsDragging(false)
      return
    }

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = Math.abs(touchEnd.y - touchStart.y)

    // Minimum swipe distance
    const minSwipeDistance = 50

    if (deltaY < 100 && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - go to previous (or shuffle)
        handleShuffle()
      } else {
        // Swipe left - go to next
        handleNext()
      }
    }

    setDragOffset(0)
    setIsDragging(false)
    setTouchStart(null)
    setTouchEnd(null)
  }

  const handleNext = () => {
    setSwipeDirection("left")
    setIsFlipping(true)

    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % facts.length
        // If we've seen all facts, shuffle and start over
        if (nextIndex === 0) {
          const shuffled = [...factDatabase].sort(() => Math.random() - 0.5)
          setFacts(shuffled)
        }
        return nextIndex
      })
      setIsFlipping(false)
      setSwipeDirection(null)
    }, 300)
  }

  const handleShuffle = () => {
    setSwipeDirection("right")
    setIsFlipping(true)

    setTimeout(() => {
      // Shuffle facts and pick a random one
      const shuffled = [...factDatabase].sort(() => Math.random() - 0.5)
      setFacts(shuffled)
      setCurrentIndex(0)
      setIsFlipping(false)
      setSwipeDirection(null)
    }, 300)
  }

  const handleLike = () => {
    setFacts((prev) => prev.map((fact) => (fact.id === currentFact.id ? { ...fact, isLiked: !fact.isLiked } : fact)))

    if (!currentFact.isLiked) {
      // Save to favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      favorites.push({
        ...currentFact,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: "Amazing Fact from Facta",
      text: `${currentFact.content}\n\nDiscover more amazing facts with Facta!`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        await navigator.clipboard.writeText(`${currentFact.content}\n\nDiscover more amazing facts with Facta!`)
      }
    } else {
      await navigator.clipboard.writeText(`${currentFact.content}\n\nDiscover more amazing facts with Facta!`)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Discover More</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShuffle} className="text-muted-foreground">
            <Shuffle size={16} />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {facts.length}
          </span>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="text-center mb-4">
        <p className="text-xs text-muted-foreground">
          Swipe left for next • Swipe right to shuffle • Tap buttons to navigate
        </p>
      </div>

      {/* Card Stack Container */}
      <div className="relative h-[400px] overflow-hidden">
        {/* Next Card (Background) */}
        {nextFact && (
          <Card
            className={cn(
              "absolute inset-0 bg-gradient-to-br border-2 opacity-50 scale-95 transition-all duration-300",
              nextFact.color,
              "border-secondary/20",
            )}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                  {nextFact.category}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-pretty opacity-60">{nextFact.content}</p>
            </div>
          </Card>
        )}

        {/* Current Card */}
        <Card
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "absolute inset-0 bg-gradient-to-br border-2 cursor-grab active:cursor-grabbing transition-all duration-300 select-none",
            currentFact.color,
            "border-secondary/20",
            isFlipping && swipeDirection === "left" && "translate-x-full opacity-0",
            isFlipping && swipeDirection === "right" && "-translate-x-full opacity-0",
            isDragging && "transition-none",
          )}
          style={{
            transform: isDragging ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)` : undefined,
            opacity: isDragging ? Math.max(0.3, 1 - Math.abs(dragOffset) / 300) : undefined,
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                {currentFact.category}
              </span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("w-2 h-2 rounded-full", i === currentIndex % 3 ? "bg-secondary" : "bg-muted")}
                  />
                ))}
              </div>
            </div>

            <p className="text-lg leading-relaxed text-pretty mb-6 flex-1 flex items-center font-medium">
              {currentFact.content}
            </p>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200 hover:scale-105",
                  currentFact.isLiked && "text-red-500 bg-red-50 dark:bg-red-950/20",
                )}
              >
                <Heart
                  size={18}
                  className={cn("transition-all duration-200", currentFact.isLiked && "fill-current scale-110")}
                />
                {currentFact.isLiked ? "Saved!" : "Save"}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
                >
                  <Share2 size={18} />
                  Share
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-105 transition-all duration-200"
                >
                  Next
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex justify-center">
        <div className="flex gap-1">
          {facts.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-1 rounded-full transition-all duration-300",
                i === currentIndex % 5 ? "bg-secondary" : "bg-muted",
              )}
            />
          ))}
        </div>
      </div>

      {/* Offline Buffer Indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">{facts.length} facts loaded • Works offline</p>
      </div>
    </div>
  )
}
