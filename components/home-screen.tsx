"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"
import { FactCard, type FactData } from "@/components/ui/fact-card"
import { LoadingSkeleton, OfflineBanner, ErrorState, EmptyState } from "@/components/ui/ui-states"

const factDatabase: FactData[] = [
  {
    id: "1",
    title: "Honung förstörs aldrig",
    content:
      "Arkeologer har hittat krukor med honung i forntida egyptiska gravar som är över 3 000 år gamla och fortfarande perfekt ätbara.",
    category: "Matvetenskap",
    tags: [
      { emoji: "🍯", label: "Mat" },
      { emoji: "🏺", label: "Historia" },
    ],
    readTime: "30 sek läsning",
    isPremium: true,
  },
  {
    id: "2",
    title: "Flamingos färg kommer från maten",
    content:
      "En grupp flamingos kallas för 'flamboyance'. Dessa rosa fåglar får sin färg från räkor och alger de äter.",
    category: "Djur",
    tags: [
      { emoji: "🦩", label: "Djur" },
      { emoji: "🌊", label: "Natur" },
    ],
    readTime: "25 sek läsning",
  },
  {
    id: "3",
    title: "Kortaste kriget i historien",
    content:
      "Det kortaste kriget i historien varade bara 38-45 minuter! Det var mellan Storbritannien och Zanzibar 1896.",
    category: "Historia",
    tags: [
      { emoji: "⚔️", label: "Historia" },
      { emoji: "🌍", label: "Världen" },
    ],
    readTime: "20 sek läsning",
  },
  {
    id: "4",
    title: "Bananer är bär, jordgubbar är inte det",
    content: "Botaniskt sett måste bär ha frön inuti köttet. Därför är bananer bär men jordgubbar är det inte!",
    category: "Botanik",
    tags: [
      { emoji: "🍌", label: "Mat" },
      { emoji: "🔬", label: "Vetenskap" },
    ],
    readTime: "15 sek läsning",
  },
  {
    id: "5",
    title: "Hjärnan använder 20% av kroppens energi",
    content:
      "Din hjärna använder cirka 20% av kroppens totala energi, trots att den bara väger cirka 2% av kroppsvikten.",
    category: "Människokroppen",
    tags: [
      { emoji: "🧠", label: "Kropp" },
      { emoji: "⚡", label: "Energi" },
    ],
    readTime: "25 sek läsning",
  },
  {
    id: "6",
    title: "Ett moln kan väga över en miljon kilo",
    content: "Ett enda moln kan väga mer än en miljon kilo! Vattendropparnas är bara mycket utspridda.",
    category: "Väder",
    tags: [
      { emoji: "☁️", label: "Väder" },
      { emoji: "💧", label: "Vatten" },
    ],
    readTime: "20 sek läsning",
  },
  {
    id: "7",
    title: "Vombat-bajs är kubformad",
    content: "Vombat-bajs är kubformad! Deras tarmar har varierande elasticitet som skapar den unika kubiska formen.",
    category: "Djur",
    tags: [
      { emoji: "🐨", label: "Djur" },
      { emoji: "🔬", label: "Biologi" },
    ],
    readTime: "18 sek läsning",
  },
  {
    id: "8",
    title: "Schack har fler möjligheter än atomer i universum",
    content:
      "Det finns fler möjliga schackspel än det finns atomer i det observerbara universum - cirka 10^120 möjligheter!",
    category: "Matematik",
    tags: [
      { emoji: "♟️", label: "Spel" },
      { emoji: "🔢", label: "Matematik" },
    ],
    readTime: "30 sek läsning",
  },
]

export function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [dailyFact, setDailyFact] = useState<FactData | null>(null)
  const [discoveryFacts, setDiscoveryFacts] = useState<FactData[]>([])
  const [currentDiscoveryIndex, setCurrentDiscoveryIndex] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [savedFacts, setSavedFacts] = useState<string[]>([])

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setSavedFacts(favorites.map((fav: any) => fav.id))

    const loadData = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const today = new Date().toDateString()
        const savedDailyFact = localStorage.getItem(`daily-fact-${today}`)

        if (savedDailyFact) {
          setDailyFact(JSON.parse(savedDailyFact))
        } else {
          const todaysFact = factDatabase[0]
          setDailyFact(todaysFact)
          localStorage.setItem(`daily-fact-${today}`, JSON.stringify(todaysFact))
        }

        const shuffled = [...factDatabase.slice(1)].sort(() => Math.random() - 0.5)
        setDiscoveryFacts(shuffled)

        setIsLoading(false)
      } catch (error) {
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleShare = async (fact: FactData) => {
    const shareData = {
      title: "Fantastisk fakta från Facta",
      text: `${fact.content}\n\nUpptäck fler fantastiska fakta med Facta!`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        await navigator.clipboard.writeText(`${fact.content}\n\nUpptäck fler fantastiska fakta med Facta!`)
      }
    } else {
      await navigator.clipboard.writeText(`${fact.content}\n\nUpptäck fler fantastiska fakta med Facta!`)
    }
  }

  const handleSave = (fact: FactData) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const isAlreadySaved = favorites.some((fav: any) => fav.id === fact.id)

    if (!isAlreadySaved) {
      favorites.push({
        ...fact,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setSavedFacts((prev) => [...prev, fact.id])
    }
  }

  const handleNext = () => {
    setCurrentDiscoveryIndex((prev) => (prev + 1) % discoveryFacts.length)
  }

  const handleShuffle = () => {
    const shuffled = [...factDatabase.slice(1)].sort(() => Math.random() - 0.5)
    setDiscoveryFacts(shuffled)
    setCurrentDiscoveryIndex(0)
  }

  const handleSwipeLeft = () => {
    handleNext()
  }

  const handleSwipeRight = () => {
    if (discoveryFacts[currentDiscoveryIndex]) {
      handleSave(discoveryFacts[currentDiscoveryIndex])
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (hasError) {
    return <ErrorState onRetry={handleRetry} />
  }

  if (isEmpty) {
    return <EmptyState onRetry={handleRetry} />
  }

  const currentDiscoveryFact = discoveryFacts[currentDiscoveryIndex]

  return (
    <div className="space-y-6">
      <OfflineBanner />

      <section className="px-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-accent" size={20} />
          <h2 className="text-xl font-bold text-balance">Dagens fakta</h2>
          <div className="ml-auto bg-gradient-to-r from-primary to-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
            PREMIUM
          </div>
        </div>

        {dailyFact && (
          <FactCard
            fact={dailyFact}
            size="L"
            variant="daily-fact"
            onSave={handleSave}
            onShare={handleShare}
            isSaved={savedFacts.includes(dailyFact.id)}
            className="card-shadow-l"
          />
        )}
      </section>

      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Upptäck mer</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShuffle}>
              <Shuffle size={16} />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentDiscoveryIndex + 1} av {discoveryFacts.length}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 text-center">
          Svep höger för att spara • Svep vänster för nästa
        </p>

        {currentDiscoveryFact && (
          <FactCard
            fact={currentDiscoveryFact}
            size="M"
            variant={savedFacts.includes(currentDiscoveryFact.id) ? "saved" : "standard"}
            onSave={handleSave}
            onShare={handleShare}
            onNext={handleNext}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isSaved={savedFacts.includes(currentDiscoveryFact.id)}
            className="card-shadow-m"
          />
        )}

        <div className="mt-4 flex justify-center">
          <div className="flex gap-1">
            {discoveryFacts.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-8 h-1 rounded-full transition-all duration-300",
                  i === currentDiscoveryIndex % 5 ? "bg-secondary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
