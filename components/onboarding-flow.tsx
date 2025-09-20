"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, Star, Trophy, Zap, Bell, Sun, Moon } from "lucide-react"

interface OnboardingProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [cardAnimation, setCardAnimation] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [dailyFactsEnabled, setDailyFactsEnabled] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleGetStarted = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === "granted")
    }
    setCurrentStep(4)
  }

  const handleComplete = () => {
    localStorage.setItem("facta-onboarding-complete", "true")
    localStorage.setItem("facta-daily-facts-enabled", dailyFactsEnabled.toString())
    localStorage.setItem("facta-notifications-enabled", notificationsEnabled.toString())
    onComplete()
  }

  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        setCardAnimation(true)
        setTimeout(() => setCardAnimation(false), 1000)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [currentStep])

  const steps = [
    {
      title: "Onödig fakta.\nOändligt kul.",
      subtitle: "Skrolla när du har 10 sek över.",
      content: (
        <div className="relative flex justify-center items-center h-64">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="absolute top-0 right-0 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Växla mellan ljust och mörkt tema"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <div className="relative">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`absolute w-72 h-44 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg transform transition-all duration-1000 ${
                  index === 0
                    ? "rotate-0 z-30"
                    : index === 1
                      ? "rotate-3 z-20 translate-x-2 translate-y-2"
                      : "rotate-6 z-10 translate-x-4 translate-y-4"
                }`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  opacity: 1 - index * 0.2,
                }}
              >
                <div className="p-6 h-full flex flex-col justify-between text-white">
                  <div className="text-sm font-medium opacity-80">Fakta #{123 + index}</div>
                  <div className="text-lg font-bold leading-tight">
                    {index === 0
                      ? "Bläckfiskar har tre hjärtan och blått blod"
                      : index === 1
                        ? "En grupp flamingor kallas för en 'flamboyance'"
                        : "Honung blir aldrig dåligt - arkeologer har hittat ätbar honung i egyptiska gravar"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Svep för mer",
      subtitle: "Upptäck nya fakta med enkla gester",
      content: (
        <div className="relative flex justify-center items-center h-64">
          <div className="relative">
            <div
              className={`w-72 h-44 bg-gradient-to-br from-secondary to-accent rounded-2xl shadow-lg transform transition-all duration-1000 ${
                cardAnimation ? "translate-x-96 rotate-12 opacity-0" : "translate-x-0 rotate-0 opacity-100"
              }`}
            >
              <div className="p-6 h-full flex flex-col justify-between text-white">
                <div className="text-sm font-medium opacity-80">Fakta #124</div>
                <div className="text-lg font-bold leading-tight">
                  Katter kan inte smaka sött - de saknar receptorer för det
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-72 h-44 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg -z-10 rotate-2 translate-x-1 translate-y-1">
              <div className="p-6 h-full flex flex-col justify-between text-white">
                <div className="text-sm font-medium opacity-80">Fakta #125</div>
                <div className="text-lg font-bold leading-tight">
                  Bananer är tekniskt sett bär, men jordgubbar är det inte
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center text-muted-foreground">
              <ChevronRight className="w-5 h-5 animate-pulse" />
              <span className="text-sm ml-1">Svep höger</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Dagens fakta & quiz",
      subtitle: "Bygg streaks och samla badges",
      content: (
        <div className="flex flex-col items-center space-y-8">
          <div className="w-72 h-32 bg-gradient-to-br from-accent to-primary rounded-2xl shadow-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium opacity-80">Dagens fakta</span>
              <Star className="w-5 h-5" />
            </div>
            <p className="text-sm leading-relaxed">Varje dag en ny fascinerande fakta direkt till din telefon</p>
          </div>

          <div className="flex space-x-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Streak: 7 dagar</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Quiz-mästare</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium">Faktasamlare</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Redo att börja?",
      subtitle: "Gå med i miljontals nyfikna användare",
      content: (
        <div className="flex flex-col items-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-white dark:bg-background rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                F
              </span>
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleGetStarted}
                className="w-72 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-2xl"
                aria-label="Kom igång med Facta-appen"
              >
                Kom igång
              </Button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors underline text-sm"
                aria-label="Läs mer om vår integritetspolicy"
              >
                Läs mer om integritet
              </button>
              <p className="text-xs text-muted-foreground mt-2">Tryck på knappen för att aktivera notiser</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Anpassa dina notiser",
      subtitle: "Få det bästa ur din Facta-upplevelse",
      content: (
        <div className="flex flex-col space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Notiser aktiverade</h3>
                <p className="text-sm text-muted-foreground">
                  {notificationsEnabled ? "Du får notiser från Facta" : "Aktivera för bästa upplevelse"}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${notificationsEnabled ? "bg-green-500" : "bg-red-500"}`} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="font-semibold">Dagens fakta</h3>
                  <p className="text-sm text-muted-foreground">Skicka daglig 'Dagens fakta' kl 09:00</p>
                </div>
              </div>
              <Switch
                checked={dailyFactsEnabled}
                onCheckedChange={setDailyFactsEnabled}
                aria-label="Aktivera eller inaktivera dagliga faktanotiser"
              />
            </div>
          </div>

          <Button
            onClick={handleComplete}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-2xl"
            aria-label="Slutför onboarding och börja använda appen"
          >
            Börja utforska fakta
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Du kan ändra dessa inställningar när som helst i profilen
          </p>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-center pt-12 pb-8">
        <div className="flex space-x-2">
          {steps.slice(0, 4).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-12">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-balance">{currentStepData.title}</h1>
            <p className="text-lg text-muted-foreground text-pretty">{currentStepData.subtitle}</p>
          </div>

          {currentStepData.content}

          {currentStep < 3 && (
            <div className="pt-8">
              <Button
                onClick={handleNext}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl"
                aria-label={`Gå till steg ${currentStep + 2} av onboarding`}
              >
                Nästa
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
