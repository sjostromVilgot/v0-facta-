"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Sparkles, Bell, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyFact {
  id: string
  title: string
  content: string
  category: string
  date: string
  isNew: boolean
  readTime: string
}

export function DailyFactCard() {
  const [isLiked, setIsLiked] = useState(false)
  const [isShining, setIsShining] = useState(false)
  const [hasBeenRead, setHasBeenRead] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const dailyFact: DailyFact = {
    id: "daily-fact-" + new Date().toISOString().split("T")[0],
    title: "Today's Mind-Blowing Fact",
    content:
      "Octopuses have three hearts and blue blood! Two hearts pump blood to the gills, while the third pumps blood to the rest of the body. When they swim, the main heart stops beating, which is why they prefer crawling.",
    category: "Marine Biology",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    isNew: !hasBeenRead,
    readTime: "30 sec read",
  }

  useEffect(() => {
    const factId = dailyFact.id
    const readFacts = JSON.parse(localStorage.getItem("readFacts") || "[]")

    if (!readFacts.includes(factId)) {
      setIsShining(true)
      setTimeout(() => setIsShining(false), 3000)
    } else {
      setHasBeenRead(true)
    }

    // Mark as read after 3 seconds of viewing
    const timer = setTimeout(() => {
      if (!readFacts.includes(factId)) {
        readFacts.push(factId)
        localStorage.setItem("readFacts", JSON.stringify(readFacts))
        setHasBeenRead(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [dailyFact.id])

  const handleShare = async () => {
    const shareData = {
      title: "Amazing Fact from Facta",
      text: `${dailyFact.content}\n\nDiscover more amazing facts with Facta!`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${dailyFact.content}\n\nDiscover more amazing facts with Facta!`)
        // Could show a toast here
      }
    } else {
      // Fallback for browsers without Web Share API
      await navigator.clipboard.writeText(`${dailyFact.content}\n\nDiscover more amazing facts with Facta!`)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      setIsShining(true)
      setShowConfetti(true)

      // Save to favorites in localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      favorites.push({
        ...dailyFact,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem("favorites", JSON.stringify(favorites))

      setTimeout(() => {
        setIsShining(false)
        setShowConfetti(false)
      }, 2000)
    } else {
      // Remove from favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      const updatedFavorites = favorites.filter((fav: any) => fav.id !== dailyFact.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        // Could show success message
        new Notification("Facta Notifications Enabled!", {
          body: "You'll get your daily dose of amazing facts!",
          icon: "/favicon.ico",
        })
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-accent" size={20} />
          <h1 className="text-xl font-bold text-balance">Today's Fact</h1>
          {dailyFact.isNew && !hasBeenRead && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">NEW</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={requestNotificationPermission}
          className="text-muted-foreground hover:text-primary"
        >
          <Bell size={18} />
        </Button>
      </div>

      <Card
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 transition-all duration-500",
          isShining && "shine",
          showConfetti && "animate-pulse",
        )}
      >
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                {dailyFact.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} />
                {dailyFact.readTime}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{dailyFact.date}</span>
          </div>

          <p className="text-lg leading-relaxed text-pretty mb-6 font-medium">{dailyFact.content}</p>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 transition-all duration-200 hover:scale-105",
                isLiked && "text-red-500 bg-red-50 dark:bg-red-950/20",
              )}
            >
              <Heart
                size={18}
                className={cn("transition-all duration-200", isLiked && "fill-current scale-110 animate-bounce")}
              />
              {isLiked ? "Saved!" : "Save"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <Share2 size={18} />
              Share
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Daily Streak: 7 days 🔥</span>
              <span>{hasBeenRead ? "✓ Read" : "Reading..."}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
