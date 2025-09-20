"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, ExternalLink, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface Quiz {
  id: string
  type: "recap" | "true_false" | "multi"
  question: string
  options: string[]
  correct: number | boolean | number[]
  explanation: string
  category: string
  related_fact_id?: string
  related_fact_title?: string
  status: "draft" | "published"
  difficulty?: "easy" | "medium" | "hard"
  usage_count?: number
  created_at: string
  updated_at: string
}

const mockQuizzes: Quiz[] = [
  {
    id: "1",
    type: "true_false",
    question: "Hajar kan inte få cancer",
    options: ["Sant", "Falskt"],
    correct: true,
    explanation: "Sant! Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer.",
    category: "Djur",
    related_fact_id: "1",
    related_fact_title: "Hajars unika immunsystem",
    status: "published",
    difficulty: "medium",
    usage_count: 245,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "multi",
    question: "Hur mycket kan myror lyfta jämfört med sin egen vikt?",
    options: ["10 gånger", "25 gånger", "50 gånger", "100 gånger"],
    correct: 2,
    explanation: "Myror kan lyfta upp till 50 gånger sin egen kroppsvikt tack vare sin unika kroppsstruktur.",
    category: "Djur",
    related_fact_id: "2",
    related_fact_title: "Myrors superstyrka",
    status: "draft",
    difficulty: "hard",
    usage_count: 89,
    created_at: "2024-01-14T15:30:00Z",
    updated_at: "2024-01-16T12:00:00Z",
  },
  {
    id: "3",
    type: "recap",
    question: "Vilken planet är närmast solen?",
    options: ["Venus", "Merkurius", "Mars", "Jorden"],
    correct: 1,
    explanation: "Merkurius är den planet som ligger närmast solen i vårt solsystem.",
    category: "Rymden",
    status: "published",
    difficulty: "easy",
    usage_count: 156,
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-17T14:20:00Z",
  },
]

const categories = ["Alla", "Djur", "Rymden", "Mat", "Historia", "Teknik", "Natur"]
const quizTypes = [
  { value: "all", label: "Alla typer" },
  { value: "recap", label: "Recap" },
  { value: "true_false", label: "Sant/Falskt" },
  { value: "multi", label: "Flerval" },
]

const statusOptions = [
  { value: "all", label: "Alla status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
]

const sortOptions = [
  { value: "updated", label: "Senast uppdaterad" },
  { value: "difficulty", label: "Svårighetsgrad" },
  { value: "usage", label: "Användning" },
  { value: "question", label: "Fråga A-Ö" },
]

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    type: "true_false" as const,
    question: "",
    options: ["", ""],
    correct: 0,
    explanation: "",
    category: "",
    status: "draft" as const,
  })

  const filteredAndSortedQuizzes = quizzes
    .filter((quiz) => {
      const matchesSearch = quiz.question.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory
      const matchesType = selectedType === "all" || quiz.type === selectedType
      const matchesStatus = selectedStatus === "all" || quiz.status === selectedStatus

      return matchesSearch && matchesCategory && matchesType && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "updated":
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return (difficultyOrder[a.difficulty || "easy"] || 1) - (difficultyOrder[b.difficulty || "easy"] || 1)
        case "usage":
          return (b.usage_count || 0) - (a.usage_count || 0)
        case "question":
          return a.question.localeCompare(b.question, "sv")
        default:
          return 0
      }
    })

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedType !== "all",
    selectedStatus !== "all",
    searchTerm.length > 0,
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedType("all")
    setSelectedStatus("all")
  }

  const handleCreateQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      type: formData.type,
      question: formData.question,
      options: formData.type === "true_false" ? ["Sant", "Falskt"] : formData.options.filter(Boolean),
      correct: formData.type === "true_false" ? formData.correct === 0 : formData.correct,
      explanation: formData.explanation,
      category: formData.category,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setQuizzes([newQuiz, ...quizzes])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setFormData({
      type: quiz.type,
      question: quiz.question,
      options: quiz.type === "true_false" ? ["Sant", "Falskt"] : quiz.options,
      correct: quiz.type === "true_false" ? (quiz.correct ? 0 : 1) : (quiz.correct as number),
      explanation: quiz.explanation,
      category: quiz.category,
      status: quiz.status,
    })
  }

  const handleUpdateQuiz = () => {
    if (!editingQuiz) return

    const updatedQuiz: Quiz = {
      ...editingQuiz,
      type: formData.type,
      question: formData.question,
      options: formData.type === "true_false" ? ["Sant", "Falskt"] : formData.options.filter(Boolean),
      correct: formData.type === "true_false" ? formData.correct === 0 : formData.correct,
      explanation: formData.explanation,
      category: formData.category,
      status: formData.status,
      updated_at: new Date().toISOString(),
    }

    setQuizzes(quizzes.map((q) => (q.id === editingQuiz.id ? updatedQuiz : q)))
    setEditingQuiz(null)
    resetForm()
  }

  const handleToggleStatus = (quiz: Quiz) => {
    const newStatus = quiz.status === "published" ? "draft" : "published"
    const updatedQuiz = { ...quiz, status: newStatus, updated_at: new Date().toISOString() }

    setQuizzes(quizzes.map((q) => (q.id === quiz.id ? updatedQuiz : q)))

    toast({
      title: newStatus === "published" ? "Quiz publicerad" : "Quiz tillbaka till utkast",
      description: `"${quiz.question.substring(0, 50)}..." har uppdaterats.`,
    })
  }

  const handleDeleteQuiz = (id: string) => {
    const quiz = quizzes.find((q) => q.id === id)
    setQuizzes(quizzes.filter((q) => q.id !== id))
    setDeleteConfirmId(null)

    toast({
      title: "Quiz raderad",
      description: quiz ? `"${quiz.question.substring(0, 50)}..." har raderats.` : "Quiz har raderats.",
    })
  }

  const resetForm = () => {
    setFormData({
      type: "true_false",
      question: "",
      options: ["", ""],
      correct: 0,
      explanation: "",
      category: "",
      status: "draft",
    })
  }

  const validateForm = () => {
    const hasValidQuestion = formData.question.length >= 10 && formData.question.length <= 200
    const hasValidOptions = formData.type === "true_false" || formData.options.filter(Boolean).length >= 2
    const hasValidExplanation = formData.explanation.length > 0
    const hasCategory = formData.category.length > 0

    return hasValidQuestion && hasValidOptions && hasValidExplanation && hasCategory
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    })
  }

  const removeOption = (index: number) => {
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      options: newOptions,
      correct: formData.correct >= newOptions.length ? 0 : formData.correct,
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "draft":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recap":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "true_false":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300"
      case "multi":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "recap":
        return "Recap"
      case "true_false":
        return "Sant/Falskt"
      case "multi":
        return "Flerval"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quiz</h1>
          <p className="text-muted-foreground">Hantera quizfrågor och svar</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ny Quiz
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sök & Filter</CardTitle>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Rensa filter ({activeFiltersCount})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök frågetext..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters and Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                {quizTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla kategorier</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sortering" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="w-4 h-4 mr-2" />
              {filteredAndSortedQuizzes.length} av {quizzes.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quiz ({filteredAndSortedQuizzes.length})</CardTitle>
          <CardDescription>Alla quizfrågor i systemet</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Inga quiz hittades</h3>
              <p className="text-muted-foreground mb-4">
                {activeFiltersCount > 0
                  ? "Inga quiz matchar dina filter. Prova att justera sökningen."
                  : "Inga quiz ännu"}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsCreateDialogOpen(true)}>Skapa din första quiz</Button>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Rensa filter
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fråga</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Kopplad fakta</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uppdaterad</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <p className="font-medium line-clamp-2">{quiz.question}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {quiz.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {quiz.difficulty === "easy" ? "Lätt" : quiz.difficulty === "medium" ? "Medel" : "Svår"}
                            </Badge>
                          )}
                          {quiz.usage_count && <span>{quiz.usage_count} användningar</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(quiz.type)}>{getTypeText(quiz.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {quiz.related_fact_id ? (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          <span className="text-xs truncate max-w-32">{quiz.related_fact_title}</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Ingen koppling</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quiz.status)}>
                        {quiz.status === "published" ? "Publicerad" : "Utkast"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(quiz.updated_at).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditQuiz(quiz)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(quiz)}
                          className={quiz.status === "published" ? "text-yellow-600" : "text-green-600"}
                        >
                          {quiz.status === "published" ? "Dra tillbaka" : "Publicera"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(quiz.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekräfta radering</DialogTitle>
            <DialogDescription>
              Är du säker på att du vill radera denna quiz? Denna åtgärd kan inte ångras.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Avbryt
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDeleteQuiz(deleteConfirmId)}>
              Radera quiz
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Skapa Ny Quiz</DialogTitle>
            <DialogDescription>Lägg till en ny quizfråga till systemet</DialogDescription>
          </DialogHeader>
          <QuizForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateQuiz}
            onCancel={() => {
              setIsCreateDialogOpen(false)
              resetForm()
            }}
            isValid={validateForm()}
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingQuiz} onOpenChange={(open) => !open && setEditingQuiz(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Redigera Quiz</DialogTitle>
            <DialogDescription>Uppdatera quizfråga och svar</DialogDescription>
          </DialogHeader>
          <QuizForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateQuiz}
            onCancel={() => {
              setEditingQuiz(null)
              resetForm()
            }}
            isValid={validateForm()}
            isEditing
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface QuizFormProps {
  formData: any
  setFormData: (data: any) => void
  onSubmit: () => void
  onCancel: () => void
  isValid: boolean
  isEditing?: boolean
  addOption: () => void
  removeOption: (index: number) => void
  updateOption: (index: number, value: string) => void
}

function QuizForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isValid,
  isEditing,
  addOption,
  removeOption,
  updateOption,
}: QuizFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Typ *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true_false">Sant/Falskt</SelectItem>
              <SelectItem value="multi">Flerval</SelectItem>
              <SelectItem value="recap">Recap</SelectItem>
            </SelectContent>
          </Select>
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

        <div className="md:col-span-2">
          <Label htmlFor="question">Fråga *</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="Skriv quizfrågan här..."
            rows={3}
            className={cn(
              formData.question.length > 0 && (formData.question.length < 10 || formData.question.length > 200)
                ? "border-destructive"
                : "",
            )}
          />
          <p className="text-xs text-muted-foreground mt-1">{formData.question.length}/200 tecken (minst 10)</p>
        </div>

        {formData.type !== "true_false" && (
          <div className="md:col-span-2">
            <Label>Svarsalternativ *</Label>
            <div className="space-y-3 mt-2">
              {formData.options.map((option: string, index: number) => (
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
              {formData.options.length < 6 && (
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till alternativ
                </Button>
              )}
            </div>
          </div>
        )}

        {formData.type === "true_false" && (
          <div className="md:col-span-2">
            <Label>Korrekt svar *</Label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={formData.correct === 0}
                  onChange={() => setFormData({ ...formData, correct: 0 })}
                  className="w-4 h-4"
                />
                <span>Sant</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={formData.correct === 1}
                  onChange={() => setFormData({ ...formData, correct: 1 })}
                  className="w-4 h-4"
                />
                <span>Falskt</span>
              </label>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="explanation">Förklaring *</Label>
          <Textarea
            id="explanation"
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            placeholder="Förklara varför svaret är korrekt..."
            rows={3}
          />
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button onClick={onSubmit} disabled={!isValid}>
          {isEditing ? "Uppdatera" : "Skapa"} Quiz
        </Button>
      </div>
    </div>
  )
}
