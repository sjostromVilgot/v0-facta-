"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Eye, Heart, Share2, Brain, TrendingUp, Trophy, AlertCircle } from "lucide-react"
import { useState } from "react"

const dailyViews = [
  { date: "2024-01-15", views: 1200, saved: 85, shares: 24 },
  { date: "2024-01-16", views: 1350, saved: 95, shares: 28 },
  { date: "2024-01-17", views: 1100, saved: 78, shares: 19 },
  { date: "2024-01-18", views: 1450, saved: 102, shares: 31 },
  { date: "2024-01-19", views: 1600, saved: 115, shares: 35 },
  { date: "2024-01-20", views: 1800, saved: 128, shares: 42 },
  { date: "2024-01-21", views: 1550, saved: 110, shares: 38 },
]

const savedByCategory = [
  { category: "Djur", saved: 450, color: "#6C5CE7" },
  { category: "Rymden", saved: 320, color: "#00D1B2" },
  { category: "Mat", saved: 280, color: "#FFC107" },
  { category: "Historia", saved: 180, color: "#E17055" },
  { category: "Teknik", saved: 120, color: "#74B9FF" },
]

const quizTypes = [
  { name: "Recap", value: 45, color: "#6C5CE7" },
  { name: "Sant/Falskt", value: 35, color: "#00D1B2" },
  { name: "Flerval", value: 20, color: "#FFC107" },
]

const topSavedFacts = [
  { id: "1", title: "Hajar kan inte få cancer", saves: 180, shares: 45, category: "Djur" },
  { id: "2", title: "Myror kan lyfta 50 gånger sin egen vikt", saves: 160, shares: 38, category: "Djur" },
  { id: "3", title: "Rymden är helt tyst", saves: 145, shares: 42, category: "Rymden" },
  { id: "4", title: "Honung blir aldrig dåligt", saves: 135, shares: 35, category: "Mat" },
  { id: "5", title: "Bläckfiskar har tre hjärtan", saves: 120, shares: 28, category: "Djur" },
  { id: "6", title: "En dag på Venus är längre än ett år", saves: 115, shares: 31, category: "Rymden" },
  { id: "7", title: "Bananer är bär, men jordgubbar är inte det", saves: 108, shares: 26, category: "Mat" },
  { id: "8", title: "Katter har fem tår på framtassarna", saves: 95, shares: 22, category: "Djur" },
  { id: "9", title: "Det finns mer träd på jorden än stjärnor i galaxen", saves: 88, shares: 19, category: "Rymden" },
  { id: "10", title: "Choklad var en gång använd som valuta", saves: 82, shares: 17, category: "Historia" },
]

const topSharedFacts = [
  { id: "3", title: "Rymden är helt tyst", shares: 42, saves: 145, category: "Rymden" },
  { id: "1", title: "Hajar kan inte få cancer", shares: 45, saves: 180, category: "Djur" },
  { id: "2", title: "Myror kan lyfta 50 gånger sin egen vikt", shares: 38, saves: 160, category: "Djur" },
  { id: "4", title: "Honung blir aldrig dåligt", shares: 35, saves: 135, category: "Mat" },
  { id: "6", title: "En dag på Venus är längre än ett år", shares: 31, saves: 115, category: "Rymden" },
]

const hardestQuiz = [
  {
    id: "1",
    question: "Vilken planet har den kortaste dagen i solsystemet?",
    avgScore: 23,
    attempts: 156,
    category: "Rymden",
  },
  { id: "2", question: "Hur många hjärtan har en bläckfisk?", avgScore: 34, attempts: 203, category: "Djur" },
  { id: "3", question: "Vilket år upptäcktes penicillin?", avgScore: 41, attempts: 89, category: "Historia" },
  {
    id: "4",
    question: "Vad kallas den minsta partikeln av ett grundämne?",
    avgScore: 45,
    attempts: 134,
    category: "Teknik",
  },
  { id: "5", question: "Vilken frukt innehåller mest C-vitamin?", avgScore: 52, attempts: 178, category: "Mat" },
]

export default function Analytics() {
  const [dateRange, setDateRange] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contentType, setContentType] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [customDateFrom, setCustomDateFrom] = useState("")
  const [customDateTo, setCustomDateTo] = useState("")

  const handleRetry = () => {
    setHasError(false)
    setIsLoading(true)
    // Simulate retry
    setTimeout(() => setIsLoading(false), 1000)
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="font-semibold">Kunde inte ladda statistik</h3>
              <p className="text-sm text-muted-foreground mt-1">Ett fel uppstod när statistiken skulle hämtas</p>
            </div>
            <Button onClick={handleRetry} variant="outline">
              Försök igen
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Statistik</h1>
          <p className="text-muted-foreground">Välj vilken fakta som ska vara Dagens fakta för vald dag.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="dateRange">Datumintervall</Label>
              <div className="flex gap-2 mt-1">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 dagar</SelectItem>
                    <SelectItem value="30d">30 dagar</SelectItem>
                    <SelectItem value="90d">90 dagar</SelectItem>
                    <SelectItem value="custom">Anpassat</SelectItem>
                  </SelectContent>
                </Select>
                {dateRange === "custom" && (
                  <>
                    <Input
                      type="date"
                      value={customDateFrom}
                      onChange={(e) => setCustomDateFrom(e.target.value)}
                      className="w-40"
                    />
                    <Input
                      type="date"
                      value={customDateTo}
                      onChange={(e) => setCustomDateTo(e.target.value)}
                      className="w-40"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex-1">
              <Label htmlFor="category">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla kategorier</SelectItem>
                  <SelectItem value="djur">Djur</SelectItem>
                  <SelectItem value="rymden">Rymden</SelectItem>
                  <SelectItem value="mat">Mat</SelectItem>
                  <SelectItem value="historia">Historia</SelectItem>
                  <SelectItem value="teknik">Teknik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="contentType">Typ</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Fakta & Quiz</SelectItem>
                  <SelectItem value="facts">Fakta</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visningar</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,450</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> från förra perioden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sparade</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,240</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> från förra perioden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delningar</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> från förra perioden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quiz Avslutade</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">950</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+22%</span> från förra perioden
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Snitt Quiz-poäng</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3%</span> från förra perioden
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Views per day */}
        <Card>
          <CardHeader>
            <CardTitle>Visningar per dag</CardTitle>
            <CardDescription>Daglig utveckling av visningar</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("sv-SE", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString("sv-SE")}
                    formatter={(value, name) => [
                      value,
                      name === "views" ? "Visningar" : name === "saved" ? "Sparade" : "Delningar",
                    ]}
                  />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Saved per category */}
        <Card>
          <CardHeader>
            <CardTitle>Sparade per kategori</CardTitle>
            <CardDescription>Fördelning av sparade fakta</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={savedByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, "Sparade"]} />
                  <Bar dataKey="saved" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz-typer</CardTitle>
          <CardDescription>Fördelning av olika quiz-typer</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={quizTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {quizTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Andel"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-3">
                {quizTypes.map((type) => (
                  <div
                    key={type.name}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <Badge variant="secondary">{type.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most saved facts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Mest sparade fakta
            </CardTitle>
            <CardDescription>Top 10 mest sparade innehåll</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : topSavedFacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ingen data i perioden</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topSavedFacts.slice(0, 10).map((fact, index) => (
                  <div key={fact.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-bold text-xs">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{fact.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {fact.category}
                      </Badge>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">{fact.saves}</div>
                      <div className="text-xs text-muted-foreground">{fact.shares} delningar</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most shared facts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Mest delade fakta
            </CardTitle>
            <CardDescription>Top 5 mest delade innehåll</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topSharedFacts.map((fact, index) => (
                  <div key={fact.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-secondary font-bold text-xs">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{fact.title}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {fact.category}
                      </Badge>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">{fact.shares}</div>
                      <div className="text-xs text-muted-foreground">{fact.saves} sparade</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hardest quiz */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Svåraste quiz
            </CardTitle>
            <CardDescription>Lägst snittpoäng</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {hardestQuiz.map((quiz, index) => (
                  <div key={quiz.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-destructive font-bold text-xs">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{quiz.question}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {quiz.category}
                      </Badge>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium text-destructive">{quiz.avgScore}%</div>
                      <div className="text-xs text-muted-foreground">{quiz.attempts} försök</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
