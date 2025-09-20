"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Upload, Download, FileText, Brain, AlertCircle, CheckCircle, X, Eye, Info } from "lucide-react"

interface ParsedRow {
  id: number
  data: Record<string, any>
  errors: string[]
  isValid: boolean
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export default function ImportExport() {
  const [importType, setImportType] = useState<"facts" | "quiz">("facts")
  const [inputText, setInputText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedRow[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const factsSchema = {
    required: ["title", "content", "category"],
    optional: ["tags", "is_premium", "weight", "status", "source", "read_time"],
    rules: {
      title: "3-120 tecken",
      content: "20-400 tecken",
      category: "Måste finnas i systemet",
      tags: "Separera med komma",
      weight: "0-1 (decimaltal)",
      status: "draft, published, eller scheduled",
    },
  }

  const quizSchema = {
    required: ["question", "type", "correct"],
    optional: ["category", "explanation", "options", "related_fact"],
    rules: {
      question: "10-200 tecken",
      type: "true_false, multi, eller recap",
      options: "Minst 2 för flerval",
      correct: "Index för flerval, boolean för sant/falskt",
      explanation: "Rekommenderas för bättre användarupplevelse",
    },
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fel",
          description: "Filen är för stor (max 10MB)",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
      setInputText("")
      setShowPreview(false)
      setParsedData([])
    }
  }

  const handlePreview = async () => {
    let content = inputText

    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        content = e.target?.result as string
        processContent(content)
      }
      reader.readAsText(selectedFile)
    } else {
      processContent(content)
    }
  }

  const processContent = (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Fel",
        description: "Ingen data att förhandsgranska",
        variant: "destructive",
      })
      return
    }

    try {
      let parsed: ParsedRow[] = []

      if (content.trim().startsWith("[") || content.trim().startsWith("{")) {
        // JSON format
        const jsonData = JSON.parse(content)
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]

        parsed = dataArray.map((item, index) => {
          const errors = validateRow(item, importType)
          return {
            id: index + 1,
            data: item,
            errors,
            isValid: errors.length === 0,
          }
        })
      } else {
        // CSV format
        const lines = content.split("\n").filter((line) => line.trim())
        if (lines.length < 2) {
          throw new Error("CSV måste ha minst en header-rad och en data-rad")
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

        parsed = lines.slice(1).map((line, index) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
          const rowData: Record<string, any> = {}

          headers.forEach((header, i) => {
            rowData[header] = values[i] || ""
          })

          const errors = validateRow(rowData, importType)
          return {
            id: index + 2, // +2 because we skip header and start from 1
            data: rowData,
            errors,
            isValid: errors.length === 0,
          }
        })
      }

      setParsedData(parsed)
      setShowPreview(true)

      toast({
        title: "Förhandsgranskning klar",
        description: `${parsed.length} rader tolkade, ${parsed.filter((r) => r.isValid).length} giltiga`,
      })
    } catch (error) {
      toast({
        title: "Fel vid tolkning",
        description: error instanceof Error ? error.message : "Kunde inte tolka data",
        variant: "destructive",
      })
    }
  }

  const validateRow = (data: Record<string, any>, type: "facts" | "quiz"): string[] => {
    const errors: string[] = []

    if (type === "facts") {
      if (!data.title || data.title.length < 3) {
        errors.push("Titel måste vara minst 3 tecken")
      }
      if (data.title && data.title.length > 120) {
        errors.push("Titel får vara max 120 tecken")
      }
      if (!data.content || data.content.length < 20) {
        errors.push("Innehåll måste vara minst 20 tecken")
      }
      if (data.content && data.content.length > 400) {
        errors.push("Innehåll får vara max 400 tecken")
      }
      if (!data.category) {
        errors.push("Kategori krävs")
      }
      if (data.weight && (isNaN(data.weight) || data.weight < 0 || data.weight > 1)) {
        errors.push("Vikt måste vara mellan 0 och 1")
      }
    } else if (type === "quiz") {
      if (!data.question || data.question.length < 10) {
        errors.push("Fråga måste vara minst 10 tecken")
      }
      if (data.question && data.question.length > 200) {
        errors.push("Fråga får vara max 200 tecken")
      }
      if (!data.type || !["true_false", "multi", "recap"].includes(data.type)) {
        errors.push("Typ måste vara true_false, multi eller recap")
      }
      if (data.type === "multi" && (!data.options || data.options.length < 2)) {
        errors.push("Flerval måste ha minst 2 alternativ")
      }
      if (data.correct === undefined || data.correct === null) {
        errors.push("Korrekt svar krävs")
      }
    }

    return errors
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return

    const validRows = parsedData.filter((row) => row.isValid)
    if (validRows.length === 0) {
      toast({
        title: "Fel",
        description: "Inga giltiga rader att importera",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportResult(null)

    // Simulate import process
    const steps = validRows.length
    for (let i = 0; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setImportProgress((i / steps) * 100)
    }

    const failedRows = parsedData.filter((row) => !row.isValid)
    const result: ImportResult = {
      success: validRows.length,
      failed: failedRows.length,
      errors: failedRows.map((row) => `Rad ${row.id}: ${row.errors.join(", ")}`),
    }

    setImportResult(result)
    setIsImporting(false)

    toast({
      title: "Import slutförd",
      description: `${result.success} rader importerade, ${result.failed} misslyckades`,
    })
  }

  const handleExport = async (type: "facts" | "quiz", format: "csv" | "json") => {
    setIsExporting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock data based on type
    let data: string
    let filename: string

    if (type === "facts") {
      if (format === "csv") {
        data = `title,content,category,tags,is_premium,weight,status
"Hajar kan inte få cancer","Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer.","Djur","hav,medicin,biologi",false,0.8,published
"Myror kan lyfta 50 gånger sin egen vikt","Tack vare sin kroppsstruktur kan myror lyfta objekt som väger upp till 50 gånger deras egen kroppsvikt.","Djur","insekter,styrka",true,0.9,draft`
        filename = `fakta-export.csv`
      } else {
        data = JSON.stringify(
          [
            {
              title: "Hajar kan inte få cancer",
              content: "Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer.",
              category: "Djur",
              tags: ["hav", "medicin", "biologi"],
              is_premium: false,
              weight: 0.8,
              status: "published",
            },
          ],
          null,
          2,
        )
        filename = `fakta-export.json`
      }
    } else {
      data = JSON.stringify(
        [
          {
            type: "true_false",
            question: "Hajar kan inte få cancer",
            correct: true,
            explanation: "Sant! Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer.",
            category: "Djur",
          },
        ],
        null,
        2,
      )
      filename = `quiz-export.json`
    }

    const blob = new Blob([data], {
      type: format === "json" ? "application/json" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Import/Export</h1>
        <p className="text-muted-foreground">Hantera massimport och export av innehåll</p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Importera</TabsTrigger>
          <TabsTrigger value="export">Exportera</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Importera Innehåll</CardTitle>
              <CardDescription>Välj innehållstyp och ladda upp eller klistra in data för import</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Välj typ</Label>
                <RadioGroup
                  value={importType}
                  onValueChange={(value) => setImportType(value as "facts" | "quiz")}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="facts" id="facts" />
                    <Label htmlFor="facts">Fakta</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quiz" id="quiz" />
                    <Label htmlFor="quiz">Quiz</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Klistra in CSV/JSON eller ladda upp fil</Label>
                  <Textarea
                    id="content"
                    placeholder={
                      importType === "facts" ? "Klistra in CSV-data eller JSON här..." : "Klistra in JSON-data här..."
                    }
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value)
                      setSelectedFile(null)
                      setShowPreview(false)
                    }}
                    rows={6}
                    className="mt-2"
                  />
                </div>

                <div className="text-center text-muted-foreground">eller</div>

                <div>
                  <Input type="file" accept=".csv,.json" onChange={handleFileSelect} className="cursor-pointer" />
                  <p className="text-sm text-muted-foreground mt-1">Stödda format: CSV, JSON (max 10MB)</p>
                </div>

                {selectedFile && (
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Vald fil: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Förväntat schema för {importType === "facts" ? "Fakta" : "Quiz"}:</p>
                    <div className="text-sm">
                      <p>
                        <strong>Obligatoriska fält:</strong>{" "}
                        {(importType === "facts" ? factsSchema : quizSchema).required.join(", ")}
                      </p>
                      <p>
                        <strong>Valfria fält:</strong>{" "}
                        {(importType === "facts" ? factsSchema : quizSchema).optional.join(", ")}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <Button
                onClick={handlePreview}
                disabled={!inputText.trim() && !selectedFile}
                className="w-full bg-transparent"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Förhandsgranska
              </Button>

              {showPreview && parsedData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Förhandsgranskning</CardTitle>
                    <CardDescription>
                      {parsedData.filter((r) => r.isValid).length} av {parsedData.length} rader är giltiga
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rad</TableHead>
                            <TableHead>Status</TableHead>
                            {importType === "facts" ? (
                              <>
                                <TableHead>Titel</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Status</TableHead>
                              </>
                            ) : (
                              <>
                                <TableHead>Fråga</TableHead>
                                <TableHead>Typ</TableHead>
                                <TableHead>Kategori</TableHead>
                              </>
                            )}
                            <TableHead>Fel</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedData.map((row) => (
                            <TableRow key={row.id} className={!row.isValid ? "bg-red-50" : ""}>
                              <TableCell>{row.id}</TableCell>
                              <TableCell>
                                {row.isValid ? (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    Giltig
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">Fel</Badge>
                                )}
                              </TableCell>
                              {importType === "facts" ? (
                                <>
                                  <TableCell className="max-w-48 truncate">{row.data.title || "—"}</TableCell>
                                  <TableCell>{row.data.category || "—"}</TableCell>
                                  <TableCell>{row.data.status || "draft"}</TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="max-w-48 truncate">{row.data.question || "—"}</TableCell>
                                  <TableCell>{row.data.type || "—"}</TableCell>
                                  <TableCell>{row.data.category || "—"}</TableCell>
                                </>
                              )}
                              <TableCell>
                                {row.errors.length > 0 && (
                                  <div className="text-sm text-red-600">{row.errors.join(", ")}</div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Importerar...</span>
                    <span className="text-sm text-muted-foreground">{Math.round(importProgress)}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                </div>
              )}

              {importResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-2xl font-bold text-green-600">{importResult.success}</p>
                            <p className="text-sm text-muted-foreground">Lyckade</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                          <X className="w-5 h-5 text-red-500" />
                          <div>
                            <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                            <p className="text-sm text-muted-foreground">Misslyckade</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {importResult.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <p className="font-medium">Fel som uppstod:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {importResult.errors.slice(0, 5).map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li>... och {importResult.errors.length - 5} fler fel</li>
                            )}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <Button
                onClick={handleImport}
                disabled={!showPreview || parsedData.filter((r) => r.isValid).length === 0 || isImporting}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? "Importerar..." : `Importera ${parsedData.filter((r) => r.isValid).length} rader`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Exportera Fakta
                </CardTitle>
                <CardDescription>Ladda ner alla fakta i olika format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleExport("facts", "csv")}
                  disabled={isExporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportera Fakta (CSV)
                </Button>
                <Button
                  onClick={() => handleExport("facts", "json")}
                  disabled={isExporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportera Fakta (JSON)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Exportera Quiz
                </CardTitle>
                <CardDescription>Ladda ner alla quiz i JSON-format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleExport("quiz", "json")}
                  disabled={isExporting}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportera Quiz (JSON)
                </Button>
                <div className="text-sm text-muted-foreground">
                  Quiz exporteras endast i JSON-format för att bevara strukturen
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
