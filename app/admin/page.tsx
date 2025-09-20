"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Brain, Users, Calendar, Plus, Upload, ExternalLink, AlertCircle, RefreshCw } from "lucide-react"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const stats = {
    totalFacts: { count: 1247, published: 1180, draft: 67 },
    activeQuizzes: { count: 89, recap: 45, trueFalse: 44 },
    dau: { count: 15420, trend: "+8%" },
    todaysFact: { title: "Hajar kan inte simma baklänges", selected: true },
  }

  const recentActivity = {
    facts: [
      {
        id: 1,
        title: "Ny fakta om hajar",
        status: "published",
        updatedAt: "2024-01-15",
        editedBy: "Anna Svensson",
        time: "2 min sedan",
      },
      {
        id: 2,
        title: "Intressant om myror",
        status: "draft",
        updatedAt: "2024-01-15",
        editedBy: "Erik Johansson",
        time: "15 min sedan",
      },
      {
        id: 3,
        title: "Rymdfakta om Mars",
        status: "scheduled",
        updatedAt: "2024-01-15",
        editedBy: "Lisa Berg",
        time: "1 tim sedan",
      },
      {
        id: 4,
        title: "Historisk fakta om vikingar",
        status: "published",
        updatedAt: "2024-01-14",
        editedBy: "Anna Svensson",
        time: "2 tim sedan",
      },
      {
        id: 5,
        title: "Djurfakta om elefanter",
        status: "draft",
        updatedAt: "2024-01-14",
        editedBy: "Erik Johansson",
        time: "3 tim sedan",
      },
    ],
    quizzes: [
      {
        id: 1,
        title: "Sant/Falskt: Rymden",
        status: "published",
        updatedAt: "2024-01-15",
        editedBy: "Lisa Berg",
        time: "5 min sedan",
      },
      {
        id: 2,
        title: "Recap Quiz: Djur",
        status: "draft",
        updatedAt: "2024-01-15",
        editedBy: "Anna Svensson",
        time: "30 min sedan",
      },
      {
        id: 3,
        title: "Sant/Falskt: Historia",
        status: "scheduled",
        updatedAt: "2024-01-15",
        editedBy: "Erik Johansson",
        time: "1 tim sedan",
      },
      {
        id: 4,
        title: "Recap Quiz: Mat",
        status: "published",
        updatedAt: "2024-01-14",
        editedBy: "Lisa Berg",
        time: "4 tim sedan",
      },
      {
        id: 5,
        title: "Sant/Falskt: Vetenskap",
        status: "draft",
        updatedAt: "2024-01-14",
        editedBy: "Anna Svensson",
        time: "5 tim sedan",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "draft":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publicerad"
      case "draft":
        return "Utkast"
      case "scheduled":
        return "Schemalagd"
      default:
        return status
    }
  }

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    // Simulate retry
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Översikt</h1>
          <p className="text-muted-foreground">Dashboard för Facta-innehåll och aktivitet</p>
        </div>

        <Card className="text-center py-8">
          <CardContent>
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kunde inte ladda statistik</h3>
            <p className="text-muted-foreground mb-4">Ett fel uppstod när data skulle hämtas</p>
            <Button onClick={handleRetry} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Försöker igen...
                </>
              ) : (
                "Försök igen"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Översikt</h1>
        <p className="text-muted-foreground">Dashboard för Facta-innehåll och aktivitet</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Fakta</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mb-2" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalFacts.count.toLocaleString()}</div>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.totalFacts.published} Publicerade
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.totalFacts.draft} Utkast
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Quiz</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mb-2" />
            ) : (
              <div className="text-2xl font-bold">{stats.activeQuizzes.count}</div>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {stats.activeQuizzes.recap} Recap
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats.activeQuizzes.trueFalse} Sant/Falskt
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DAU (7 dagar)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mb-2" />
            ) : (
              <div className="text-2xl font-bold">{stats.dau.count.toLocaleString()}</div>
            )}
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stats.dau.trend} från förra veckan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dagens Fakta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-full mb-2" />
            ) : stats.todaysFact.selected ? (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">{stats.todaysFact.title}</p>
                <Badge variant="secondary" className="text-xs">
                  Vald
                </Badge>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Inte vald</p>
                <Button size="sm" variant="outline">
                  Välj
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senaste Aktivitet</CardTitle>
          <CardDescription>Nyligen skapade och uppdaterade innehåll</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="facts">Fakta</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
            </TabsList>

            <TabsContent value="facts" className="mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : recentActivity.facts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inget att visa än – lägg till din första fakta!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.facts.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.editedBy} • {item.time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                          Öppna
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quiz" className="mt-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : recentActivity.quizzes.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Inget att visa än – skapa ditt första quiz!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.quizzes.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.editedBy} • {item.time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                        <Button size="sm" variant="ghost">
                          <ExternalLink className="w-4 h-4" />
                          Öppna
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Snabbåtgärder</CardTitle>
          <CardDescription>Vanliga uppgifter för innehållshantering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Ny Fakta</h3>
                <p className="text-sm text-muted-foreground mt-1">Skapa ny fakta</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Nytt Quiz</h3>
                <p className="text-sm text-muted-foreground mt-1">Skapa nytt quiz</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Importera Innehåll</h3>
                <p className="text-sm text-muted-foreground mt-1">Ladda upp data</p>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium">Öppna Schema</h3>
                <p className="text-sm text-muted-foreground mt-1">Hantera schemaläggning</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
