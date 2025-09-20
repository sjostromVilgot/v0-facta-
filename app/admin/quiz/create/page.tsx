"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Info, ArrowLeft, Save, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface QuizFormData {
  type: "recap" | "true_false" | "multi"
  question: string
  options: string[]
  correct: number | boolean
  explanation: string
  category: string
  related_fact_id?: string
  status: "draft" | "published"
}

const categories = ["Djur", "Rymden", "Mat", "Historia", "Teknik", "Natur", "Vetenskap", "Sport"]

// Mock facts for autocomplete
const mockFacts = [
  { id: "1", title: "Hajars unika immunsystem" },
  { id: "2", title: "Myrors superstyrka" },
  { id: "3", title: "Merkurius närmast solen" },
  { id: "4", title: "Honungs hållbarhet" },
  { id: "5", title: "Bläckfiskars blå blod" },
]

export default function CreateQuizPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<QuizFormData>({
    type: "true_false",
    question: "",
    options: ["", ""],
    correct: false,
    explanation: "",
    category: "",
    related_fact_id: "",
    status: "draft",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [relatedFactSearch, setRelatedFactSearch] = useState("")
  const [showFactSuggestions, setShowFactSuggestions] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Question validation
    if (formData.question.length < 10) {
      newErrors.question = "Frågan måste vara minst 10 tecken"
    } else if (formData.question.length > 200) {
      newErrors.question = "Frågan får vara max 200 tecken"
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Kategori krävs"
    }

    // Explanation validation
    if (!formData.explanation.trim()) {
      newErrors.explanation = "Förklaring krävs"
    }

    // Type-specific validation
    if (formData.type === "multi") {
      const validOptions = formData.options.filter((opt) => opt.trim().length > 0)
      if (validOptions.length < 2) {
        newErrors.options = "Minst 2 alternativ krävs för flerval"
      }
      if (typeof formData.correct !== "number" || formData.correct >= validOptions.length) {
        newErrors.correct = "Ett korrekt svar måste väljas"
      }
    }

    if (formData.type === "true_false") {
      if (typeof formData.correct !== "boolean") {
        newErrors.correct = "Sant eller falskt måste väljas"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (publish = false) => {
    const finalFormData = { ...formData, status: publish ? "published" : "draft" }

    if (!validateForm()) {
      toast({
        title: "Fel – kontrollera fälten",
        description: "Vissa fält behöver korrigeras innan du kan spara.",
        variant: "destructive",
      })
      return
    }

    // Here you would normally save to database
    console.log("Saving quiz:", finalFormData)

    toast({
      title: publish ? "Quiz publicerat" : "Quiz sparat",
      description: `"${formData.question.substring(0, 50)}..." har ${publish ? "publicerats" : "sparats som utkast"}.`,
    })

    router.push("/admin/quiz")
  }

  const addOption = () => {
    if (formData.options.length < 5) {
      setFormData({
        ...formData,
        options: [...formData.options, ""],
      })
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        options: newOptions,
        correct: typeof formData.correct === "number" && formData.correct >= newOptions.length ? 0 : formData.correct,
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions,
    })
  }

  const handleTypeChange = (newType: "recap" | "true_false" | "multi") => {
    setFormData({
      ...formData,
      type: newType,
      options: newType === "true_false" ? ["Sant", "Falskt"] : ["", ""],
      correct: newType === "true_false" ? false : 0,
    })
    setErrors({})
  }

  const filteredFacts = mockFacts.filter((fact) => fact.title.toLowerCase().includes(relatedFactSearch.toLowerCase()))

  const isFormValid = validateForm()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/admin/quiz")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tillbaka
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Skapa Quiz</h1>
          <p className="text-muted-foreground">Lägg till en ny quizfråga</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz-typ</CardTitle>
              <CardDescription>Välj vilken typ av quiz du vill skapa</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={formData.type} onValueChange={handleTypeChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recap">Recap</TabsTrigger>
                  <TabsTrigger value="true_false">Sant/Falskt</TabsTrigger>
                  <TabsTrigger value="multi">Flerval</TabsTrigger>
                </TabsList>

                <TabsContent value="recap" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Recap-quiz plockar fakta användaren sett de senaste dagarna och skapar frågor baserat på dem.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="true_false" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Sant/Falskt-quiz presenterar påståenden som användaren ska bedöma som sanna eller falska.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="multi" className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Flerval-quiz ger användaren flera alternativ att välja mellan, där endast ett är korrekt.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grundläggande information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Fråga *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Skriv quizfrågan här..."
                  rows={3}
                  className={cn(errors.question && "border-destructive")}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{formData.question.length}/200 tecken (minst 10)</p>
                  {errors.question && <p className="text-xs text-destructive">{errors.question}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className={cn(errors.category && "border-destructive")}>
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
                  {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="related_fact">Relaterad fakta (valfritt)</Label>
                  <div className="relative">
                    <Input
                      id="related_fact"
                      value={relatedFactSearch}
                      onChange={(e) => {
                        setRelatedFactSearch(e.target.value)
                        setShowFactSuggestions(true)
                      }}
                      onFocus={() => setShowFactSuggestions(true)}
                      placeholder="Sök efter relaterad fakta..."
                    />
                    {showFactSuggestions && relatedFactSearch && (
                      <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                        {filteredFacts.map((fact) => (
                          <button
                            key={fact.id}
                            className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                            onClick={() => {
                              setFormData({ ...formData, related_fact_id: fact.id })
                              setRelatedFactSearch(fact.title)
                              setShowFactSuggestions(false)
                            }}
                          >
                            {fact.title}
                          </button>
                        ))}
                        {filteredFacts.length === 0 && (
                          <div className="px-3 py-2 text-sm text-muted-foreground">Inga fakta hittades</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer Options */}
          <Card>
            <CardHeader>
              <CardTitle>Svarsalternativ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.type === "true_false" ? (
                <div>
                  <Label>Korrekt svar *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correct"
                        checked={formData.correct === true}
                        onChange={() => setFormData({ ...formData, correct: true })}
                        className="w-4 h-4"
                      />
                      <span>Sant</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correct"
                        checked={formData.correct === false}
                        onChange={() => setFormData({ ...formData, correct: false })}
                        className="w-4 h-4"
                      />
                      <span>Falskt</span>
                    </label>
                  </div>
                  {errors.correct && <p className="text-xs text-destructive mt-1">{errors.correct}</p>}
                </div>
              ) : (
                <div>
                  <Label>Alternativ (minst 2, max 5) *</Label>
                  <div className="space-y-3 mt-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="radio"
                            name="correct"
                            checked={formData.correct === index}
                            onChange={() => setFormData({ ...formData, correct: index })}
                            className="w-4 h-4"
                          />
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Alternativ ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                        {formData.options.length > 2 && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {formData.options.length < 5 && (
                      <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        <Plus className="w-4 h-4 mr-2" />
                        Lägg till alternativ
                      </Button>
                    )}
                  </div>
                  {errors.options && <p className="text-xs text-destructive mt-1">{errors.options}</p>}
                  {errors.correct && <p className="text-xs text-destructive mt-1">{errors.correct}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Förklaring</CardTitle>
              <CardDescription>Förklara varför svaret är korrekt</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="explanation">Förklaringstext *</Label>
                <Textarea
                  id="explanation"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Visste du att...?"
                  rows={3}
                  className={cn(errors.explanation && "border-destructive")}
                />
                {errors.explanation && <p className="text-xs text-destructive mt-1">{errors.explanation}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="status">Publiceringsstatus</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Utkast</SelectItem>
                    <SelectItem value="published">Publicerad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Förhandsvisning</CardTitle>
              <CardDescription>Se hur quizen kommer att se ut</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="text-center space-y-4">
                  <Badge variant="outline" className="text-xs">
                    {formData.category || "Kategori"}
                  </Badge>
                  <h3 className="font-bold text-sm">{formData.question || "Din fråga kommer att visas här..."}</h3>
                  {formData.type === "true_false" ? (
                    <div className="flex gap-2">
                      <div className="flex-1 bg-green-100 text-green-800 py-2 px-3 rounded text-xs font-medium">
                        SANT
                      </div>
                      <div className="flex-1 bg-red-100 text-red-800 py-2 px-3 rounded text-xs font-medium">FALSKT</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.options.filter(Boolean).map((option, index) => (
                        <div
                          key={index}
                          className={cn(
                            "p-2 rounded border text-xs text-left",
                            formData.correct === index ? "bg-primary/10 border-primary" : "bg-background",
                          )}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                          {option || `Alternativ ${index + 1}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button onClick={() => handleSubmit(false)} variant="outline" className="w-full" disabled={!isFormValid}>
              <Save className="w-4 h-4 mr-2" />
              Spara utkast
            </Button>
            <Button onClick={() => handleSubmit(true)} className="w-full" disabled={!isFormValid}>
              <Eye className="w-4 h-4 mr-2" />
              Publicera
            </Button>
            <Button variant="ghost" onClick={() => router.push("/admin/quiz")} className="w-full">
              Avbryt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
