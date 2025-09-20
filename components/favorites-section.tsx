"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, Share2, Grid3X3, List, Trash2, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SavedFact {
  id: string
  content: string
  category: string
  savedAt: string
  color?: string
  tags?: string[]
}

type ViewMode = "grid" | "list"

export function FavoritesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<SavedFact[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeFilter, setActiveFilter] = useState("Alla")
  const [longPressedCard, setLongPressedCard] = useState<string | null>(null)

  const filterCategories = ["Alla", "Djur", "Rymden", "Mat", "Historia", "Vetenskap", "Natur"]

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(savedFavorites)
  }, [])

  const handleRemoveFavorite = (factId: string) => {
    const updatedFavorites = favorites.filter((fact) => fact.id !== factId)
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  const handleShare = async (fact: SavedFact) => {
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

  const filteredFavorites = favorites.filter((fact) => {
    const matchesSearch = fact.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "Alla" || fact.category === activeFilter
    return matchesSearch && matchesFilter
  })

  const handleTouchStart = (factId: string) => {
    const timer = setTimeout(() => {
      setLongPressedCard(factId)
    }, 500)

    const cleanup = () => {
      clearTimeout(timer)
      document.removeEventListener("touchend", cleanup)
      document.removeEventListener("touchmove", cleanup)
    }

    document.addEventListener("touchend", cleanup)
    document.addEventListener("touchmove", cleanup)
  }

  if (favorites.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            Favoriter
          </h1>
        </div>

        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
              <Heart className="text-purple-400 dark:text-purple-300" size={32} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
              <span className="text-lg">🧠</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Ännu inga favoriter</h3>
          <p className="text-muted-foreground text-pretty mb-6 max-w-sm mx-auto">
            Spara det som kittlar hjärnan! Tryck på hjärtat på vilken fakta som helst för att lägga till den här.
          </p>
          <div className="bg-muted/50 p-4 rounded-lg max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground">
              💡 Tips: Sparade fakta fungerar offline och kan delas när som helst!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Heart className="text-red-500" size={24} />
          Favoriter
          <Badge variant="secondary" className="ml-2">
            {favorites.length}
          </Badge>
        </h1>

        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="p-2"
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="p-2"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Sök bland dina sparade fakta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterCategories.map((category) => (
          <Button
            key={category}
            variant={activeFilter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(category)}
            className="shrink-0 rounded-full"
          >
            {category === "Djur" && "🦁 "}
            {category === "Rymden" && "🚀 "}
            {category === "Mat" && "🍕 "}
            {category === "Historia" && "🏛️ "}
            {category === "Vetenskap" && "🔬 "}
            {category === "Natur" && "🌿 "}
            {category}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredFavorites.length} resultat för "{searchQuery}"
          </p>
        </div>
      )}

      <div className={cn("gap-4", viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2" : "space-y-4")}>
        {filteredFavorites.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Search className="mx-auto text-muted-foreground mb-2" size={32} />
            <p className="text-muted-foreground">Inga fakta matchar din sökning</p>
          </div>
        ) : (
          filteredFavorites.map((fact) => (
            <Card
              key={fact.id}
              className={cn(
                "p-4 transition-all duration-200 hover:shadow-md relative",
                viewMode === "list" && "flex items-start gap-4",
                fact.color,
              )}
              onTouchStart={() => handleTouchStart(fact.id)}
            >
              <div className={cn("flex-1", viewMode === "list" && "min-w-0")}>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {fact.category === "Djur" && "🦁 "}
                    {fact.category === "Rymden" && "🚀 "}
                    {fact.category === "Mat" && "🍕 "}
                    {fact.category}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground p-1">
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShare(fact)}>
                        <Share2 size={14} className="mr-2" />
                        Dela
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveFavorite(fact.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Ta bort från favoriter
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className={cn("text-sm leading-relaxed mb-4 text-pretty", viewMode === "list" && "line-clamp-2")}>
                  {fact.content}
                </p>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Heart size={16} className="fill-current mr-2" />
                    Sparad
                  </Button>

                  {viewMode === "grid" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(fact)}
                      className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
                    >
                      <Share2 size={16} />
                      Dela
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats Footer */}
      {favorites.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{favorites.length}</div>
              <div className="text-xs text-muted-foreground">Totalt sparade</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">{new Set(favorites.map((f) => f.category)).size}</div>
              <div className="text-xs text-muted-foreground">Kategorier</div>
            </div>
            <div>
              <div className="text-lg font-bold text-accent">
                {Math.round(
                  favorites.reduce((acc, fact) => acc + fact.content.split(" ").length, 0) / favorites.length,
                )}
              </div>
              <div className="text-xs text-muted-foreground">Snitt ord</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
