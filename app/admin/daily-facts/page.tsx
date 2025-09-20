"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Search, Save, AlertCircle } from "lucide-react"
import { format, addDays, startOfToday } from "date-fns"
import { sv } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface DailyFact {
  date: string
  factId: string | null
  factTitle: string | null
  factContent: string | null
  factCategory: string | null
}

interface Fact {
  id: string
  title: string
  content: string
  category: string
  status: "draft" | "published"
}

// Mock data for available facts
const mockFacts: Fact[] = [
  {
    id: "1",
    title: "Hajar kan inte få cancer",
    content:
      "Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer. Deras brosk innehåller proteiner som hämmar blodkärlstillväxt.",
    category: "Djur",
    status: "published",
  },
  {
    id: "2",
    title: "Myror kan lyfta 50 gånger sin egen vikt",
    content:
      "Tack vare sin kroppsstruktur och muskelfibrer kan myror lyfta objekt som väger upp till 50 gånger deras egen kroppsvikt.",
    category: "Djur",
    status: "published",
  },
  {
    id: "3",
    title: "Rymden är helt tyst",
    content:
      "I rymden finns inget medium för ljudvågor att färdas genom, vilket gör att det är helt tyst. Ljud behöver luft eller annat material för att spridas.",
    category: "Rymden",
    status: "published",
  },
  {
    id: "4",
    title: "Honung blir aldrig dåligt",
    content:
      "Honung har naturliga konserverande egenskaper på grund av sitt låga vatteninnehåll och sura pH-värde. Arkeologer har hittat ätbar honung i egyptiska gravar.",
    category: "Mat",
    status: "published",
  },
]

// Generate next 30 days
const generateNext30Days = (): DailyFact[] => {
  const today = startOfToday()
  const days: DailyFact[] = []

  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i)
    days.push({
      date: format(date, "yyyy-MM-dd"),
      factId: i === 0 ? "1" : i === 2 ? "3" : null, // Mock some scheduled facts
      factTitle: i === 0 ? "Hajar kan inte få cancer" : i === 2 ? "Rymden är helt tyst" : null,
      factContent: i === 0 ? "Hajar har ett unikt immunsystem..." : i === 2 ? "I rymden finns inget medium..." : null,
      factCategory: i === 0 ? "Djur" : i === 2 ? "Rymden" : null,
    })
  }

  return days
}

export default function DailyFactsScheduler() {
  const [dailyFacts, setDailyFacts] = useState<DailyFact[]>(generateNext30Days())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isFactSelectionOpen, setIsFactSelectionOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const filteredFacts = mockFacts.filter(
    (fact) =>
      fact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    setIsFactSelectionOpen(true)
    setSearchTerm("")
    setSelectedFact(null)
  }

  const handleSelectFact = (fact: Fact) => {
    setSelectedFact(fact)
  }

  const handleSaveSchedule = () => {
    if (!selectedDate || !selectedFact) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setDailyFacts((prev) =>
        prev.map((day) =>
          day.date === selectedDate
            ? {
                ...day,
                factId: selectedFact.id,
                factTitle: selectedFact.title,
                factContent: selectedFact.content,
                factCategory: selectedFact.category,
              }
            : day,
        ),
      )

      setIsLoading(false)
      setIsFactSelectionOpen(false)
      setSelectedDate(null)
      setSelectedFact(null)

      toast({
        title: "Schema sparat",
        description: `Fakta schemalagd för ${format(new Date(selectedDate), "d MMMM", { locale: sv })}`,
      })
    }, 1000)
  }

  const handleQuickSelectToday = () => {
    const today = format(startOfToday(), "yyyy-MM-dd")
    handleSelectDate(today)
  }

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)

    // Simulate retry
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dagens Fakta Schema</h1>
            <p className="text-muted-foreground">Välj vilken fakta som ska vara Dagens fakta för vald dag.</p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kunde inte ladda schema</h3>
            <p className="text-muted-foreground mb-4">Ett fel uppstod när schemat skulle laddas.</p>
            <Button onClick={handleRetry}>Försök igen</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dagens Fakta Schema</h1>
          <p className="text-muted-foreground">Välj vilken fakta som ska vara Dagens fakta för vald dag.</p>
        </div>
        <Button onClick={handleQuickSelectToday}>
          <CalendarIcon className="w-4 h-4 mr-2" />
          Idag
        </Button>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Kommande 30 dagar</CardTitle>
          <CardDescription>Klicka på en dag för att välja fakta</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyFacts.map((day) => {
                const date = new Date(day.date)
                const isToday = format(date, "yyyy-MM-dd") === format(startOfToday(), "yyyy-MM-dd")

                return (
                  <Card
                    key={day.date}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      isToday && "ring-2 ring-primary",
                    )}
                    onClick={() => handleSelectDate(day.date)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{format(date, "d MMM", { locale: sv })}</h3>
                          {isToday && (
                            <Badge variant="default" className="text-xs">
                              Idag
                            </Badge>
                          )}
                        </div>

                        {day.factTitle ? (
                          <div className="space-y-2">
                            <Badge variant="outline" className="text-xs">
                              {day.factCategory}
                            </Badge>
                            <p className="text-sm font-medium line-clamp-2">{day.factTitle}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">{day.factContent}</p>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground">Inte vald</p>
                            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                              Välj fakta
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fact Selection Dialog */}
      <Dialog open={isFactSelectionOpen} onOpenChange={setIsFactSelectionOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Välj fakta för {selectedDate && format(new Date(selectedDate), "d MMMM yyyy", { locale: sv })}
            </DialogTitle>
            <DialogDescription>Sök och välj vilken fakta som ska visas som Dagens fakta</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left: Fact List */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Sök fakta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Fact List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredFacts.map((fact) => (
                  <Card
                    key={fact.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      selectedFact?.id === fact.id && "ring-2 ring-primary",
                    )}
                    onClick={() => handleSelectFact(fact)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {fact.category}
                          </Badge>
                          <Badge variant={fact.status === "published" ? "default" : "secondary"} className="text-xs">
                            {fact.status === "published" ? "Publicerad" : "Utkast"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2">{fact.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">{fact.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredFacts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Inga fakta hittades</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold">Förhandsgranskning</h3>

              {selectedFact ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{selectedFact.category}</Badge>
                        <Badge className="bg-primary/10 text-primary">Dagens fakta</Badge>
                      </div>

                      <h2 className="text-xl font-bold leading-tight">{selectedFact.title}</h2>

                      <p className="text-muted-foreground leading-relaxed">{selectedFact.content}</p>

                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Visas {selectedDate && format(new Date(selectedDate), "d MMMM yyyy", { locale: sv })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Välj en fakta för att se förhandsgranskning</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsFactSelectionOpen(false)} disabled={isLoading}>
              Avbryt
            </Button>
            <Button onClick={handleSaveSchedule} disabled={!selectedFact || isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Sparar...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Spara schema
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
