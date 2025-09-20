"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Brain, Heart, User, Search, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HomeScreen } from "@/components/home-screen"
import { QuizSection } from "@/components/quiz-section"
import { FavoritesSection } from "@/components/favorites-section"
import { ProfileSection } from "@/components/profile-section"
import { FactNotificationService } from "@/components/fact-notification-service"

type TabType = "home" | "quiz" | "favorites" | "profile"

export default function FactaApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("facta-onboarding-complete")
    if (!onboardingComplete) {
      router.push("/onboarding")
    } else {
      setIsOnboardingComplete(true)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [router])

  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading Facta...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "home" as TabType, label: "Hem", icon: Home },
    { id: "quiz" as TabType, label: "Quiz", icon: Brain },
    { id: "favorites" as TabType, label: "Favoriter", icon: Heart },
    { id: "profile" as TabType, label: "Profil", icon: User },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />
      case "quiz":
        return <QuizSection />
      case "favorites":
        return <FavoritesSection />
      case "profile":
        return <ProfileSection />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <FactNotificationService />

      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Facta
            </h1>
          </div>

          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Search size={20} />
          </Button>
        </div>
      </header>

      {!isOnline && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <WifiOff size={16} />
            <span className="text-sm font-medium">Du är offline - visar sparade fakta</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20 pt-2">{renderContent()}</main>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-t border-border">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
