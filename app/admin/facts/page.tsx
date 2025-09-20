"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff, Upload, FileText, ArrowUpDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface Fact {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  read_time: number
  is_premium: boolean
  source?: string
  lang: string
  status: "draft" | "published" | "scheduled"
  weight: number
  scheduled_at?: string
  created_at: string
  updated_at: string
  created_by: string
}

const mockFacts: Fact[] = [
  {
    id: "1",
    title: "Hajar kan inte få cancer",
    content:
      "Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer. Deras brosk innehåller proteiner som hindrar tumörtillväxt.",
    category: "Djur",
    tags: ["hav", "medicin", "biologi"],
    read_time: 30,
    is_premium: false,
    source: "https://example.com/shark-research",
    lang: "sv",
    status: "published",
    weight: 0.8,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    created_by: "admin",
  },
  {
    id: "2",
    title: "Myror kan lyfta 50 gånger sin egen vikt",
    content:
      "Tack vare sin kroppsstruktur och muskelfibrer kan myror lyfta objekt som väger upp till 50 gånger deras egen kroppsvikt.",
    category: "Djur",
    tags: ["insekter", "styrka", "biologi"],
    read_time: 25,
    is_premium: true,
    lang: "sv",
    status: "draft",
    weight: 0.9,
    scheduled_at: "2024-01-20T09:00:00Z",
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-16T12:00:00Z",
    created_by: "editor",
  },
]

const categories = ["Alla", "Djur", "Rymden", "Mat", "Historia", "Teknik", "Natur"]
const statusOptions = [
  { value: "all", label: "Alla status" },
  { value: "published", label: "Publicerad" },
  { value: "draft", label: "Utkast" },
  { value: "scheduled", label: "Schemalagd" },
]

const sortOptions = [
  { value: "updated_desc", label: "Senast uppdaterad" },
  { value: "title_asc", label: "Titel A–Ö" },
  { value: "title_desc", label: "Titel Ö–A" },
  { value: "most_saved", label: "Mest sparad" },
  { value: "created_desc", label: "Senast skapad" },
]

export default function FactsManagement() {
  const [facts, setFacts] = useState<Fact[]>(mockFacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Alla")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("updated_desc")
  const [factToDelete, setFactToDelete] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFact, setEditingFact] = useState<Fact | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    source: "",
    is_premium: false,
    weight: 0.5,
    status: "draft" as const,
  })

  const filteredAndSortedFacts = facts
    .filter((fact) => {
      const matchesSearch =
        fact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fact.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "Alla" || fact.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || fact.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title, "sv")
        case "title_desc":
          return b.title.localeCompare(a.title, "sv")
        case "most_saved":
          return Math.random() - 0.5
        case "created_desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "updated_desc":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

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

  const handleCreateFact = () => {
    const newFact: Fact = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      read_time: Math.ceil((formData.content.length / 200) * 60),
      is_premium: formData.is_premium,
      source: formData.source || undefined,
      lang: "sv",
      status: formData.status,
      weight: formData.weight,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "admin",
    }

    setFacts([newFact, ...facts])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditFact = (fact: Fact) => {
    setEditingFact(fact)
    setFormData({
      title: fact.title,
      content: fact.content,
      category: fact.category,
      tags: fact.tags.join(", "),
      source: fact.source || "",
      is_premium: fact.is_premium,
      weight: fact.weight,
      status: fact.status,
    })
  }

  const handleUpdateFact = () => {
    if (!editingFact) return

    const updatedFact: Fact = {
      ...editingFact,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      read_time: Math.ceil((formData.content.length / 200) * 60),
      is_premium: formData.is_premium,
      source: formData.source || undefined,
      status: formData.status,
      weight: formData.weight,
      updated_at: new Date().toISOString(),
    }

    setFacts(facts.map((f) => (f.id === editingFact.id ? updatedFact : f)))
    setEditingFact(null)
    resetForm()
  }

  const handleDeleteFact = (id: string) => {
    const fact = facts.find((f) => f.id === id)
    setFacts(facts.filter((f) => f.id !== id))
    setFactToDelete(null)

    toast({
      title: "Fakta raderad",
      description: fact ? `"${fact.title}" har tagits bort permanent.` : "Faktan har tagits bort.",
      variant: "destructive",
    })
  }

  const handleToggleStatus = (fact: Fact) => {
    const newStatus = fact.status === "published" ? "draft" : "published"
    const updatedFact = { ...fact, status: newStatus, updated_at: new Date().toISOString() }

    setFacts(facts.map((f) => (f.id === fact.id ? updatedFact : f)))

    if (newStatus === "published") {
      toast({
        title: "Fakta publicerad",
        description: `"${fact.title}" är nu synlig för användare.`,
      })
    } else {
      toast({
        title: "Fakta tillbaka till utkast",
        description: `"${fact.title}" är nu dold från användare.`,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
      source: "",
      is_premium: false,
      weight: 0.5,
      status: "draft",
    })
  }

  const validateForm = () => {
    return (
      formData.title.length >= 3 &&
      formData.title.length <= 120 &&
      formData.content.length >= 20 &&
      formData.content.length <= 400 &&
      formData.category &&
      formData.weight >= 0 &&
      formData.weight <= 1
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fakta</h1>
          <p className="text-muted-foreground">Hantera faktainnehåll, publicering och kategorisering</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importera innehåll
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ny fakta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Skapa Ny Fakta</DialogTitle>
                <DialogDescription>Lägg till en ny fakta till innehållsbiblioteket</DialogDescription>
              </DialogHeader>
              <FactForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateFact}
                onCancel={() => {
                  setIsCreateDialogOpen(false)
                  resetForm()
                }}
                isValid={validateForm()}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Sök
            </CardTitle>
            <Badge variant="secondary">{filteredAndSortedFacts.length} resultat</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Sök titel eller text…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value="sv" disabled>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sv">Svenska</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedStatus !== "all" || selectedCategory !== "Alla" || searchTerm) && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Sök: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-muted rounded">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedStatus !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusOptions.find((s) => s.value === selectedStatus)?.label}
                    <button onClick={() => setSelectedStatus("all")} className="ml-1 hover:bg-muted rounded">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "Alla" && (
                  <Badge variant="secondary" className="gap-1">
                    Kategori: {selectedCategory}
                    <button onClick={() => setSelectedCategory("Alla")} className="ml-1 hover:bg-muted rounded">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Innehållslista ({filteredAndSortedFacts.length})</CardTitle>
          <CardDescription>Hantera alla fakta med status, kategorier och publicering</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedFacts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || selectedStatus !== "all" || selectedCategory !== "Alla"
                  ? "Inga fakta matchar filtren"
                  : "Inga fakta ännu"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedStatus !== "all" || selectedCategory !== "Alla"
                  ? "Prova att ändra dina filter eller söktermer."
                  : "Kom igång genom att skapa din första fakta eller importera innehåll."}
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Skapa din första fakta
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Importera innehåll
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titel</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Taggar</TableHead>
                  <TableHead>Uppdaterad</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedFacts.map((fact) => (
                  <TableRow key={fact.id}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{fact.title}</span>
                          {fact.is_premium && <Star className="w-4 h-4 text-yellow-500" />}
                          <Badge className={cn("text-xs", getStatusColor(fact.status))}>
                            {getStatusText(fact.status)}
                          </Badge>
                          {fact.scheduled_at && (
                            <Badge variant="outline" className="text-xs">
                              {new Date(fact.scheduled_at).toLocaleDateString("sv-SE")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{fact.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{fact.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {fact.tags.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {fact.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {fact.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{fact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Inga taggar</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(fact.updated_at).toLocaleDateString("sv-SE")}</div>
                        <div className="text-muted-foreground text-xs">
                          {new Date(fact.updated_at).toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditFact(fact)}>
                          <Edit className="w-4 h-4" />
                          <span className="sr-only">Redigera</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(fact)}
                          className={fact.status === "published" ? "text-orange-600" : "text-green-600"}
                        >
                          {fact.status === "published" ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              <span className="sr-only">Dra tillbaka</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              <span className="sr-only">Publicera</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFactToDelete(fact.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Radera</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingFact} onOpenChange={(open) => !open && setEditingFact(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Redigera Fakta</DialogTitle>
            <DialogDescription>Uppdatera faktainnehåll och inställningar</DialogDescription>
          </DialogHeader>
          <FactForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateFact}
            onCancel={() => {
              setEditingFact(null)
              resetForm()
            }}
            isValid={validateForm()}
            isEditing
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!factToDelete} onOpenChange={() => setFactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera fakta</AlertDialogTitle>
            <AlertDialogDescription>
              Är du säker på att du vill radera denna fakta? Denna åtgärd kan inte ångras.
              {factToDelete && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>{facts.find((f) => f.id === factToDelete)?.title}</strong>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => factToDelete && handleDeleteFact(factToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Radera permanent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface FactFormProps {
  formData: any
  setFormData: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
  isValid: boolean
  isEditing?: boolean
}

function FactForm({ formData, setFormData, onSubmit, onCancel, isValid, isEditing }: FactFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ange faktans titel..."
            className={cn(
              formData.title.length > 0 && (formData.title.length < 3 || formData.title.length > 120)
                ? "border-destructive"
                : "",
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.title.length}/120 tecken (minst 3)</p>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="content">Innehåll *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Skriv faktainnehållet här..."
            rows={4}
            className={cn(
              formData.content.length > 0 && (formData.content.length < 20 || formData.content.length > 400)
                ? "border-destructive"
                : "",
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.content.length}/400 tecken (minst 20)</p>
        </div>

        <div>
          <Label htmlFor="category">Kategori *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Välj kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Utkast</SelectItem>
              <SelectItem value="published">Publicerad</SelectItem>
              <SelectItem value="scheduled">Schemalagd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="tags">Taggar</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Separera med komma: hav, medicin, biologi"
          />
        </div>

        <div>
          <Label htmlFor="source">Källa (URL)</Label>
          <Input
            id="source"
            type="url"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="https://example.com/source"
          />
        </div>

        <div>
          <Label htmlFor="weight">Vikt (0-1)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number.parseFloat(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground mt-1">Högre värde = visas oftare</p>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="premium"
              checked={formData.is_premium}
              onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
            />
            <Label htmlFor="premium">Premium-innehåll</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button onClick={onSubmit} disabled={!isValid}>
          {isEditing ? "Uppdatera" : "Skapa"} Fakta
        </Button>
      </div>
    </div>
  )
}
