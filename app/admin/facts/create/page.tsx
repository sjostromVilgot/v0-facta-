"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Eye,
  Share2,
  CalendarIcon,
  History,
  ChevronDown,
  X,
  Plus,
  HelpCircle,
  Smartphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { sv } from "date-fns/locale"

interface FactFormData {
  title: string
  content: string
  category: string
  tags: string[]
  readTime: string
  source: string
  language: string
  isPremium: boolean
  weight: number
  status: "draft" | "published"
  scheduledDate?: Date
}

interface HistoryEntry {
  id: string
  action: string
  timestamp: string
  user: string
}

const categories = ["Djur", "Rymden", "Mat", "Historia", "Teknik", "Natur"]
const suggestedTags = [
  "biologi",
  "medicin",
  "hav",
  "insekter",
  "styrka",
  "rymden",
  "planeter",
  "mat",
  "kök",
  "historia",
  "teknik",
  "natur",
]

const mockHistory: HistoryEntry[] = [
  { id: "1", action: "Skapad som utkast", timestamp: "2024-01-15T10:00:00Z", user: "admin" },
  { id: "2", action: "Titel uppdaterad", timestamp: "2024-01-15T10:15:00Z", user: "admin" },
  { id: "3", action: "Innehåll redigerat", timestamp: "2024-01-15T10:30:00Z", user: "editor" },
  { id: "4", action: "Publicerad", timestamp: "2024-01-15T11:00:00Z", user: "admin" },
  { id: "5", action: "Tillbaka till utkast", timestamp: "2024-01-15T14:00:00Z", user: "admin" },
]

export default function CreateFactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FactFormData>({
    title: "",
    content: "",
    category: "",
    tags: [],
    readTime: "",
    source: "",
    language: "sv",
    isPremium: false,
    weight: 0.5,
    status: "draft",
  })

  const [newTag, setNewTag] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const validateForm = () => {
    const titleValid = formData.title.length >= 3 && formData.title.length <= 120
    const contentValid = formData.content.length >= 20 && formData.content.length <= 400
    const categoryValid = formData.category !== ""
    const sourceValid = !formData.source || isValidUrl(formData.source)

    return titleValid && contentValid && categoryValid && sourceValid
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleSaveDraft = () => {
    toast({
      title: "Sparat som utkast",
      description: "Faktan har sparats och kan redigeras senare.",
    })
  }

  const handlePublish = () => {
    if (!validateForm()) {
      toast({
        title: "Fel – kontrollera fälten",
        description: "Vissa fält behöver korrigeras innan publicering.",
        variant: "destructive",
      })
      return
    }

    setFormData({ ...formData, status: "published" })
    toast({
      title: "Publicerat",
      description: "Faktan är nu synlig för alla användare.",
    })
  }

  const handleUpdate = () => {
    if (!validateForm()) {
      toast({
        title: "Fel – kontrollera fälten",
        description: "Vissa fält behöver korrigeras innan uppdatering.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Uppdaterat",
      description: "Ändringar har sparats framgångsrikt.",
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Skapa Ny Fakta</h1>
            <p className="text-muted-foreground">Lägg till en ny fakta till innehållsbiblioteket</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grundläggande Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Titel *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">3–120 tecken. Gör titeln engagerande och beskrivande.</p>
                    </PopoverContent>
                  </Popover>
                </Label>
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
                <p
                  className={cn(
                    "text-xs",
                    formData.title.length < 3 || formData.title.length > 120
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {formData.title.length}/120 tecken (minst 3)
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  Innehåll *
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">20–400 tecken. Skriv tydligt och engagerande faktainnehåll.</p>
                    </PopoverContent>
                  </Popover>
                </Label>
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
                <p
                  className={cn(
                    "text-xs",
                    formData.content.length < 20 || formData.content.length > 400
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {formData.content.length}/400 tecken (minst 20)
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Taggar</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Lägg till tagg..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddTag(newTag)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(newTag)}
                      disabled={!newTag || formData.tags.includes(newTag)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:bg-muted rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Suggested Tags */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Föreslagna taggar:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 8)
                        .map((tag) => (
                          <Button
                            key={tag}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTag(tag)}
                            className="h-7 text-xs"
                          >
                            {tag}
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Read Time */}
              <div className="space-y-2">
                <Label htmlFor="readTime">Läs-tid (valfritt)</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="t.ex. 20 sek"
                />
              </div>

              {/* Source */}
              <div className="space-y-2">
                <Label htmlFor="source">Källa (valfritt)</Label>
                <Input
                  id="source"
                  type="url"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="https://example.com/source"
                  className={cn(formData.source && !isValidUrl(formData.source) ? "border-destructive" : "")}
                />
                {formData.source && !isValidUrl(formData.source) && (
                  <p className="text-xs text-destructive">Ange en giltig URL</p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label>Språk</Label>
                <Select value={formData.language} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sv">Svenska</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Premium */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="premium"
                  checked={formData.isPremium}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPremium: checked })}
                />
                <Label htmlFor="premium">Premium-innehåll</Label>
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  Viktning
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">Styr hur ofta faktan visas i flödet. Högre värde = visas oftare.</p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[formData.weight]}
                    onValueChange={(value) => setFormData({ ...formData, weight: value[0] })}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Sällan (0)</span>
                    <span className="font-medium">{formData.weight}</span>
                    <span>Ofta (1)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Side Panel */}
        <div className="space-y-6">
          {/* Status & Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publicering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="draft"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                    />
                    <Label htmlFor="draft">Utkast</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="published"
                      name="status"
                      value="published"
                      checked={formData.status === "published"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                    />
                    <Label htmlFor="published">Publicerad</Label>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Schemalägg som "Dagens fakta"
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-0">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <p className="text-sm">Om du väljer datum hamnar den som Dagens fakta den dagen</p>
                    </PopoverContent>
                  </Popover>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduledDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledDate ? format(formData.scheduledDate, "PPP", { locale: sv }) : "Välj datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledDate}
                      onSelect={(date) => setFormData({ ...formData, scheduledDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formData.scheduledDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, scheduledDate: undefined })}
                    className="text-muted-foreground"
                  >
                    Rensa datum
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Förhandsgranskning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/30 max-w-sm mx-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {formData.category || "Kategori"}
                    </Badge>
                    {formData.isPremium && (
                      <Badge variant="secondary" className="text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm leading-tight">
                    {formData.title || "Faktans titel visas här..."}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {formData.content || "Faktainnehållet kommer att visas här när du skriver..."}
                  </p>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {formData.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{formData.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  {formData.readTime && <p className="text-xs text-muted-foreground">Läs-tid: {formData.readTime}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button onClick={handleSaveDraft} variant="outline" className="w-full bg-transparent">
                  <Save className="w-4 h-4 mr-2" />
                  Spara utkast
                </Button>

                <Button
                  onClick={formData.status === "published" ? handleUpdate : handlePublish}
                  disabled={!validateForm()}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {formData.status === "published" ? "Uppdatera" : "Publicera"}
                </Button>

                <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Share2 className="w-4 h-4 mr-2" />
                      Dela som bild
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dela som bild</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Delningsfunktion kommer snart...</p>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" onClick={() => router.back()} className="w-full">
                  Avbryt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Section */}
      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Historik
                </CardTitle>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isHistoryOpen && "rotate-180")} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                {mockHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">av {entry.user}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.timestamp), "PPp", { locale: sv })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
