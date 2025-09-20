"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Flame,
  Trophy,
  Target,
  Settings,
  Moon,
  Bell,
  Sun,
  Monitor,
  Globe,
  Shield,
  Info,
  Mail,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserStats {
  streak: number
  totalFacts: number
  quizScore: number
  badges: number
  joinDate: string
  lastActive: string
  favoriteCategory: string
  totalQuizzes: number
  perfectScores: number
}

interface Badge {
  id: string
  name: string
  description: string
  earned: boolean
  earnedAt?: string
  icon: string
  color: string
}

export function ProfileSection() {
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    totalFacts: 0,
    quizScore: 0,
    badges: 0,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    favoriteCategory: "Animals",
    totalQuizzes: 0,
    perfectScores: 0,
  })

  const [badges, setBadges] = useState<Badge[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [userName, setUserName] = useState("")
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("sv")
  const [dailyFactNotifications, setDailyFactNotifications] = useState(true)
  const [quizReminders, setQuizReminders] = useState(true)

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const readFacts = JSON.parse(localStorage.getItem("readFacts") || "[]")
    const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]")

    const categoryCount: Record<string, number> = {}
    favorites.forEach((fact: any) => {
      categoryCount[fact.category] = (categoryCount[fact.category] || 0) + 1
    })
    const favoriteCategory = Object.keys(categoryCount).reduce(
      (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
      "Animals",
    )

    const totalQuizzes = quizHistory.length
    const perfectScores = quizHistory.filter((quiz: any) => quiz.score === quiz.total).length
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            quizHistory.reduce((acc: number, quiz: any) => acc + (quiz.score / quiz.total) * 100, 0) / totalQuizzes,
          )
        : 0

    const streak = Math.min(readFacts.length, 30)

    const quickResponses = quizHistory.filter((quiz: any) => quiz.averageTime && quiz.averageTime < 3).length

    const stats: UserStats = {
      streak,
      totalFacts: readFacts.length,
      quizScore: averageScore,
      badges: 0,
      joinDate: localStorage.getItem("joinDate") || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      favoriteCategory,
      totalQuizzes,
      perfectScores,
    }

    const allBadges: Badge[] = [
      {
        id: "faktakung",
        name: "Faktakung",
        description: "Läs 100 fakta",
        earned: readFacts.length >= 100,
        icon: "👑",
        color: "text-yellow-500",
        earnedAt: readFacts.length >= 100 ? new Date().toISOString() : undefined,
      },
      {
        id: "djurmastare",
        name: "Djurmästare",
        description: "Läs 25 djurfakta",
        earned: (categoryCount["Animals"] || 0) >= 25,
        icon: "🦁",
        color: "text-orange-500",
        earnedAt: (categoryCount["Animals"] || 0) >= 25 ? new Date().toISOString() : undefined,
      },
      {
        id: "rymdspanare",
        name: "Rymdspanare",
        description: "Läs 20 rymdfakta",
        earned: (categoryCount["Space"] || 0) >= 20,
        icon: "🚀",
        color: "text-blue-500",
        earnedAt: (categoryCount["Space"] || 0) >= 20 ? new Date().toISOString() : undefined,
      },
      {
        id: "matnord",
        name: "Matnörd",
        description: "Läs 15 matfakta",
        earned: (categoryCount["Food"] || 0) >= 15,
        icon: "🍜",
        color: "text-red-500",
        earnedAt: (categoryCount["Food"] || 0) >= 15 ? new Date().toISOString() : undefined,
      },
      {
        id: "historiejagare",
        name: "Historiejägare",
        description: "Läs 30 historiefakta",
        earned: (categoryCount["History"] || 0) >= 30,
        icon: "🏺",
        color: "text-amber-600",
        earnedAt: (categoryCount["History"] || 0) >= 30 ? new Date().toISOString() : undefined,
      },
      {
        id: "snabbsvarare",
        name: "Snabbsvarare",
        description: "Svara på 10 quiz under 3 sek/fråga",
        earned: quickResponses >= 10,
        icon: "⚡️",
        color: "text-purple-500",
        earnedAt: quickResponses >= 10 ? new Date().toISOString() : undefined,
      },
      {
        id: "streak-5",
        name: "Streak-5",
        description: "Håll 5 dagars streak",
        earned: streak >= 5,
        icon: "🔥",
        color: "text-orange-500",
        earnedAt: streak >= 5 ? new Date().toISOString() : undefined,
      },
      {
        id: "streak-30",
        name: "Streak-30",
        description: "Håll 30 dagars streak",
        earned: streak >= 30,
        icon: "🔥🔥",
        color: "text-red-500",
        earnedAt: streak >= 30 ? new Date().toISOString() : undefined,
      },
    ]

    stats.badges = allBadges.filter((badge) => badge.earned).length
    setUserStats(stats)
    setBadges(allBadges)

    setDarkMode(localStorage.getItem("darkMode") === "true")
    setNotifications(localStorage.getItem("notifications") !== "false")
    setUserName(localStorage.getItem("userName") || "")
    setTheme(localStorage.getItem("theme") || "system")
    setLanguage(localStorage.getItem("language") || "sv")
    setDailyFactNotifications(localStorage.getItem("dailyFactNotifications") !== "false")
    setQuizReminders(localStorage.getItem("quizReminders") !== "false")
  }, [])

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled)
    localStorage.setItem("darkMode", enabled.toString())
    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled)
    localStorage.setItem("notifications", enabled.toString())
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  const handleDailyFactToggle = (enabled: boolean) => {
    setDailyFactNotifications(enabled)
    localStorage.setItem("dailyFactNotifications", enabled.toString())
  }

  const handleQuizRemindersToggle = (enabled: boolean) => {
    setQuizReminders(enabled)
    localStorage.setItem("quizReminders", enabled.toString())
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const getUserInitials = () => {
    if (!userName) return "G"
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const calculateXP = () => {
    const factXP = userStats.totalFacts * 10
    const quizXP = userStats.totalQuizzes * 25
    const streakXP = userStats.streak * 5
    const badgeXP = userStats.badges * 50
    return factXP + quizXP + streakXP + badgeXP
  }

  const currentXP = calculateXP()
  const nextLevelXP = Math.ceil(currentXP / 1000) * 1000 + 1000
  const xpProgress = ((currentXP % 1000) / 1000) * 100

  const earnedBadges = badges.filter((badge) => badge.earned)
  const nextBadge = badges.find((badge) => !badge.earned)

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
          {getUserInitials()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{userName || "Gäst"}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Flame className="text-orange-500" size={16} />
            <span>{userStats.streak} dagars streak</span>
          </div>
        </div>
      </div>

      <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">XP Progress</span>
          <span className="text-sm text-muted-foreground">
            {currentXP} / {nextLevelXP}
          </span>
        </div>
        <Progress value={xpProgress} className="h-3 mb-2" />
        <div className="text-xs text-muted-foreground">{nextLevelXP - currentXP} XP till nästa nivå</div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <Flame className="mx-auto text-orange-500 mb-2" size={24} />
          <div className="text-2xl font-bold">{userStats.streak}</div>
          <div className="text-xs text-muted-foreground">Dagars streak</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-secondary/5 to-accent/5">
          <Target className="mx-auto text-secondary mb-2" size={24} />
          <div className="text-2xl font-bold">{userStats.totalFacts}</div>
          <div className="text-xs text-muted-foreground">Fakta lästa</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-accent/5 to-primary/5">
          <Trophy className="mx-auto text-accent mb-2" size={24} />
          <div className="text-2xl font-bold">{userStats.quizScore}%</div>
          <div className="text-xs text-muted-foreground">Quiz-snitt</div>
        </Card>

        <Card className="p-4 text-center bg-gradient-to-br from-green-500/5 to-blue-500/5">
          <Trophy className="mx-auto text-green-500 mb-2" size={24} />
          <div className="text-2xl font-bold">{userStats.badges}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Trophy className="text-accent" size={20} />
          Badges ({earnedBadges.length}/{badges.length})
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 relative group cursor-pointer",
                badge.earned
                  ? "bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/30 hover:border-accent/50 hover:scale-105 shadow-sm hover:shadow-md"
                  : "bg-muted/30 border-muted/50 opacity-60 hover:opacity-80",
              )}
            >
              <div
                className={cn(
                  "text-3xl mb-2 transition-transform duration-200",
                  badge.earned ? "scale-100" : "scale-90 grayscale",
                )}
              >
                {badge.icon}
              </div>
              <div
                className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  badge.earned ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {badge.name}
              </div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-popover border border-border text-popover-foreground text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                <div className="font-medium">{badge.name}</div>
                <div className="text-muted-foreground mt-1">{badge.description}</div>
                {badge.earned && badge.earnedAt && (
                  <div className="text-accent text-xs mt-1">
                    ✓ Upplåst {new Date(badge.earnedAt).toLocaleDateString("sv-SE")}
                  </div>
                )}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
              </div>

              {!badge.earned && (
                <div className="absolute top-1 right-1 text-muted-foreground/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H9V6z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {nextBadge && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-1">Nästa badge:</div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{nextBadge.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{nextBadge.name}</div>
                <div className="text-xs text-muted-foreground">{nextBadge.description}</div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Settings className="text-primary" size={20} />
          Inställningar
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Bell size={16} className="text-muted-foreground" />
              Notiser
            </h4>
            <div className="space-y-3 ml-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Dagens fakta</div>
                  <div className="text-xs text-muted-foreground">Daglig påminnelse kl 09:00</div>
                </div>
                <Switch checked={dailyFactNotifications} onCheckedChange={handleDailyFactToggle} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Quiz-påminnelse</div>
                  <div className="text-xs text-muted-foreground">Påminnelse om quiz</div>
                </div>
                <Switch checked={quizReminders} onCheckedChange={handleQuizRemindersToggle} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Monitor size={16} className="text-muted-foreground" />
              Tema
            </h4>
            <div className="ml-6">
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun size={16} />
                      Ljust
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon size={16} />
                      Mörkt
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor size={16} />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Globe size={16} className="text-muted-foreground" />
              Språk
            </h4>
            <div className="ml-6">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sv">Svenska</SelectItem>
                  <SelectItem value="en" disabled>
                    English (kommer snart)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield size={16} className="text-muted-foreground" />
              Integritet & Om appen
            </h4>
            <div className="space-y-2 ml-6">
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span className="text-sm">Integritetspolicy</span>
                </div>
                <ChevronRight size={16} />
              </Button>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <div className="flex items-center gap-2">
                  <Info size={16} />
                  <span className="text-sm">Om Facta</span>
                </div>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-6">
        <div className="text-center space-y-3">
          <div className="text-xs text-muted-foreground">Version 1.0.0</div>
          <Button variant="ghost" size="sm" className="text-primary">
            <Mail size={16} className="mr-2" />
            Kontakta oss
          </Button>
        </div>
      </Card>
    </div>
  )
}
