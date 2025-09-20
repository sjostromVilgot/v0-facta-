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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, CalendarIcon, Clock, Trash2, Search } from "lucide-react"
import { format } from "date-fns"
import { sv } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ScheduledFact {
  id: string
  date: string
  fact_id: string
  fact_title: string
  fact_content: string
  fact_category: string
  time: string
  status: "scheduled" | "published" | "failed"
  created_at: string
}

// Mock data
const mockScheduledFacts: ScheduledFact[] = [
  {
    id: "1",
    date: "2024-01-20",
    fact_id: "1",
    fact_title: "Hajar kan inte få cancer",
    fact_content: "Hajar har ett unikt immunsystem som gör dem nästan immuna mot cancer...",
    fact_category: "Djur",
    time: "09:00",
    status: "scheduled",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    date: "2024-01-19",
    fact_id: "2",
    fact_title: "Myror kan lyfta 50 gånger sin egen vikt",
    fact_content: "Tack vare sin kroppsstruktur och muskelfibrer kan myror lyfta objekt...",
    fact_category: "Djur",
    time: "09:00",
    status: "published",
    created_at: "2024-01-14T15:30:00Z",
  },
]

const mockFacts = [
  { id: "1", title: "Hajar kan inte få cancer", category: "Djur" },
  { id: "2", title: "Myror kan lyfta 50 gånger sin egen vikt", category: "Djur" },
  { id: "3", title: "Rymden är helt tyst", category: "Rymden" },
  { id: "4", title: "Honung blir aldrig dåligt", category: "Mat" },
]

export default function ScheduleManagement() {
  const [scheduledFacts, setScheduledFacts] = useState<ScheduledFact[]>(mockScheduledFacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduledFact | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    fact_id: "",
    date: new Date(),
    time: "09:00",
  })

  const filteredScheduledFacts = scheduledFacts.filter(
    (item) =>
      item.fact_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fact_category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Publicerad"
      case "scheduled":
        return "Schemalagd"
      case "failed":
        return "Misslyckades"
      default:
        return status
    }
  }

  const handleCreateSchedule = () => {
    const selectedFact = mockFacts.find((f) => f.id === formData.fact_id)
    if (!selectedFact) return

    const newSchedule: ScheduledFact = {
      id: Date.now().toString(),
      date: format(formData.date, "yyyy-MM-dd"),
      fact_id: formData.fact_id,
      fact_title: selectedFact.title,
      fact_content: "Faktainnehåll...",
      fact_category: selectedFact.category,
      time: formData.time,
      status: "scheduled",
      created_at: new Date().toISOString(),
    }

    setScheduledFacts([newSchedule, ...scheduledFacts])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleDeleteSchedule = (id: string) => {
    setScheduledFacts(scheduledFacts.filter((s) => s.id !== id))
  }

  const resetForm = () => {
    setFormData({
      fact_id: "",
      date: new Date(),
      time: "09:00",
    })
  }

  const validateForm = () => {
    return formData.fact_id && formData.date && formData.time
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schema</h1>
          <p className="text-muted-foreground">Schemalägg dagens fakta för publicering</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schemalägg Fakta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schemalägg Fakta</DialogTitle>
              <DialogDescription>Välj fakta och tid för publicering</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fact">Fakta *</Label>
                <Select
                  value={formData.fact_id}
                  onValueChange={(value) => setFormData({ ...formData, fact_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Välj fakta" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFacts.map((fact) => (
                      <SelectItem key={fact.id} value={fact.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {fact.category}
                          </Badge>
                          <span className="truncate">{fact.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Datum *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP", { locale: sv }) : "Välj datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="time">Tid *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleCreateSchedule} disabled={!validateForm()}>
                  Schemalägg
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sök Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Sök schemalagda fakta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Facts */}
      <Card>
        <CardHeader>
          <CardTitle>Schemalagda Fakta ({filteredScheduledFacts.length})</CardTitle>
          <CardDescription>Alla schemalagda publikationer</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fakta</TableHead>
                <TableHead>Datum & Tid</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Åtgärder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScheduledFacts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{item.fact_title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.fact_content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{format(new Date(item.date), "d MMM yyyy", { locale: sv })}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.fact_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{getStatusText(item.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
