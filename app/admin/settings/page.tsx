"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Bell, Tag, Award, Users, Mail } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "analyst"
  status: "active" | "inactive"
  last_login: string
  created_at: string
}

interface Category {
  id: string
  name: string
  color: string
  icon: string
  fact_count: number
}

interface AdminBadge {
  id: string
  name: string
  description: string
  threshold: number
  icon: string
  color: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@facta.se",
    role: "admin",
    status: "active",
    last_login: "2024-01-21T10:30:00Z",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Content Editor",
    email: "editor@facta.se",
    role: "editor",
    status: "active",
    last_login: "2024-01-20T16:45:00Z",
    created_at: "2024-01-05T00:00:00Z",
  },
]

const mockCategories: Category[] = [
  { id: "1", name: "Djur", color: "#10b981", icon: "🐾", fact_count: 45 },
  { id: "2", name: "Rymden", color: "#3b82f6", icon: "🚀", fact_count: 32 },
  { id: "3", name: "Mat", color: "#f59e0b", icon: "🍕", fact_count: 28 },
  { id: "4", name: "Historia", color: "#8b5cf6", icon: "📚", fact_count: 19 },
]

const mockBadges: AdminBadge[] = [
  { id: "1", name: "Nybörjare", description: "Läs din första fakta", threshold: 1, icon: "🌟", color: "#10b981" },
  { id: "2", name: "Faktafantast", description: "Läs 50 fakta", threshold: 50, icon: "🧠", color: "#3b82f6" },
  { id: "3", name: "Quiz-mästare", description: "Klara 25 quiz", threshold: 25, icon: "🏆", color: "#f59e0b" },
]

export default function AdminSettings() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [badges, setBadges] = useState<AdminBadge[]>(mockBadges)
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false)
  const [isCreateBadgeDialogOpen, setIsCreateBadgeDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  const [settingsData, setSettingsData] = useState({
    // Notification settings
    daily_push_enabled: true,
    daily_push_time: "09:00",
    quiz_reminder_enabled: true,
    quiz_reminder_time: "19:00",
  })

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "editor" as const,
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    color: "#10b981",
    icon: "📝",
  })

  const [badgeForm, setBadgeForm] = useState({
    name: "",
    description: "",
    threshold: 1,
    icon: "🏅",
    color: "#10b981",
  })

  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "editor" as const,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettingsData((prev) => ({ ...prev, [key]: value }))
    toast({ description: "Uppdaterat" })
  }

  const handleCreateUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: "active",
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    setUsers([...users, newUser])
    setIsCreateUserDialogOpen(false)
    resetUserForm()
    toast({ description: "Användare skapad" })
  }

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name,
      color: categoryForm.color,
      icon: categoryForm.icon,
      fact_count: 0,
    }

    setCategories([...categories, newCategory])
    setIsCreateCategoryDialogOpen(false)
    resetCategoryForm()
    toast({ description: "Kategori skapad" })
  }

  const handleCreateBadge = () => {
    const newBadge: AdminBadge = {
      id: Date.now().toString(),
      name: badgeForm.name,
      description: badgeForm.description,
      threshold: badgeForm.threshold,
      icon: badgeForm.icon,
      color: badgeForm.color,
    }

    setBadges([...badges, newBadge])
    setIsCreateBadgeDialogOpen(false)
    resetBadgeForm()
    toast({ description: "Badge skapad" })
  }

  const handleInviteUser = () => {
    // Simulate sending invitation
    setIsInviteDialogOpen(false)
    resetInviteForm()
    toast({ description: "Inbjudan skickad" })
  }

  const handleChangeUserRole = (userId: string, newRole: "admin" | "editor" | "analyst") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    toast({ description: "Roll ändrad" })
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
    toast({ description: "Användare raderad" })
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id))
    toast({ description: "Kategori raderad" })
  }

  const handleDeleteBadge = (id: string) => {
    setBadges(badges.filter((b) => b.id !== id))
    toast({ description: "Badge raderad" })
  }

  const resetUserForm = () => {
    setUserForm({ name: "", email: "", role: "editor" })
  }

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", color: "#10b981", icon: "📝" })
  }

  const resetBadgeForm = () => {
    setBadgeForm({ name: "", description: "", threshold: 1, icon: "🏅", color: "#10b981" })
  }

  const resetInviteForm = () => {
    setInviteForm({ email: "", role: "editor" })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-700 dark:text-red-300"
      case "editor":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300"
      case "analyst":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-300"
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inställningar</h1>
        <p className="text-muted-foreground">Hantera systemkonfiguration och användare</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notiser</TabsTrigger>
          <TabsTrigger value="categories">Kategorier & Taggar</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="users">Roller & Användare</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifikationsinställningar
              </CardTitle>
              <CardDescription>Konfigurera när och hur notifikationer skickas till användare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daglig push-notifikation</Label>
                  <p className="text-sm text-muted-foreground">Skicka dagens fakta som push-notifikation</p>
                </div>
                <Switch
                  checked={settingsData.daily_push_enabled}
                  onCheckedChange={(checked) => handleSettingChange("daily_push_enabled", checked)}
                />
              </div>

              {settingsData.daily_push_enabled && (
                <div>
                  <Label htmlFor="daily_push_time">Tid för daglig push</Label>
                  <Input
                    id="daily_push_time"
                    type="time"
                    value={settingsData.daily_push_time}
                    onChange={(e) => handleSettingChange("daily_push_time", e.target.value)}
                    className="w-48"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Quiz-påminnelse</Label>
                  <p className="text-sm text-muted-foreground">Påminn användare om att göra quiz</p>
                </div>
                <Switch
                  checked={settingsData.quiz_reminder_enabled}
                  onCheckedChange={(checked) => handleSettingChange("quiz_reminder_enabled", checked)}
                />
              </div>

              {settingsData.quiz_reminder_enabled && (
                <div>
                  <Label htmlFor="quiz_reminder_time">Tid för quiz-påminnelse</Label>
                  <Input
                    id="quiz_reminder_time"
                    type="time"
                    value={settingsData.quiz_reminder_time}
                    onChange={(e) => handleSettingChange("quiz_reminder_time", e.target.value)}
                    className="w-48"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Kategorier & Taggar
                </CardTitle>
                <CardDescription>Hantera innehållskategorier och deras utseende</CardDescription>
              </div>
              <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till kategori
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Skapa ny kategori</DialogTitle>
                    <DialogDescription>Lägg till en ny innehållskategori</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category_name">Namn</Label>
                      <Input
                        id="category_name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="Kategorinamn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category_icon">Ikon (emoji)</Label>
                      <Input
                        id="category_icon"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        placeholder="📝"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category_color">Färg</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="category_color"
                          type="color"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsCreateCategoryDialogOpen(false)}>
                        Avbryt
                      </Button>
                      <Button onClick={handleCreateCategory} disabled={!categoryForm.name}>
                        Skapa kategori
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Antal fakta</TableHead>
                    <TableHead>Färg</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <BadgeComponent variant="outline">{category.fact_count} fakta</BadgeComponent>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm text-muted-foreground">{category.color}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Badges
                </CardTitle>
                <CardDescription>Hantera användarutmärkelser och deras krav</CardDescription>
              </div>
              <Dialog open={isCreateBadgeDialogOpen} onOpenChange={setIsCreateBadgeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till badge
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Skapa ny badge</DialogTitle>
                    <DialogDescription>Lägg till en ny användarutmärkelse</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="badge_name">Namn</Label>
                      <Input
                        id="badge_name"
                        value={badgeForm.name}
                        onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                        placeholder="Badge-namn"
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge_description">Beskrivning</Label>
                      <Input
                        id="badge_description"
                        value={badgeForm.description}
                        onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                        placeholder="Vad krävs för att få denna badge?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge_threshold">Tröskel</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[badgeForm.threshold]}
                          onValueChange={(value) => setBadgeForm({ ...badgeForm, threshold: value[0] })}
                          max={100}
                          min={1}
                          step={1}
                        />
                        <div className="text-sm text-muted-foreground">Krav: {badgeForm.threshold}</div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="badge_icon">Ikon (emoji)</Label>
                      <Input
                        id="badge_icon"
                        value={badgeForm.icon}
                        onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                        placeholder="🏅"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge_color">Färg</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="badge_color"
                          type="color"
                          value={badgeForm.color}
                          onChange={(e) => setBadgeForm({ ...badgeForm, color: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={badgeForm.color}
                          onChange={(e) => setBadgeForm({ ...badgeForm, color: e.target.value })}
                          placeholder="#10b981"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsCreateBadgeDialogOpen(false)}>
                        Avbryt
                      </Button>
                      <Button onClick={handleCreateBadge} disabled={!badgeForm.name || !badgeForm.description}>
                        Skapa badge
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge</TableHead>
                    <TableHead>Beskrivning</TableHead>
                    <TableHead>Tröskel</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {badges.map((badge) => (
                    <TableRow key={badge.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{badge.icon}</span>
                          <span className="font-medium">{badge.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </TableCell>
                      <TableCell>
                        <BadgeComponent variant="outline">{badge.threshold}</BadgeComponent>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteBadge(badge.id)}>
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
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Roller & Användare
                </CardTitle>
                <CardDescription>Hantera adminanvändare och deras behörigheter</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Bjud in via mail
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bjud in användare</DialogTitle>
                      <DialogDescription>Skicka en inbjudan via e-post</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="invite_email">E-post</Label>
                        <Input
                          id="invite_email"
                          type="email"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                          placeholder="anvandare@facta.se"
                        />
                      </div>
                      <div>
                        <Label htmlFor="invite_role">Roll</Label>
                        <Select
                          value={inviteForm.role}
                          onValueChange={(value: any) => setInviteForm({ ...inviteForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                          Avbryt
                        </Button>
                        <Button onClick={handleInviteUser} disabled={!inviteForm.email}>
                          Skicka inbjudan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Lägg till användare
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Skapa ny användare</DialogTitle>
                      <DialogDescription>Lägg till en ny användare med adminbehörigheter</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Namn</Label>
                        <Input
                          id="name"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="Användarens namn"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-post</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="anvandare@facta.se"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Roll</Label>
                        <Select
                          value={userForm.role}
                          onValueChange={(value: any) => setUserForm({ ...userForm, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                          Avbryt
                        </Button>
                        <Button onClick={handleCreateUser} disabled={!userForm.name || !userForm.email}>
                          Skapa användare
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Användare</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Senast inloggad</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={user.role} onValueChange={(value: any) => handleChangeUserRole(user.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="analyst">Analyst</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <BadgeComponent className={getStatusColor(user.status)}>
                          {user.status === "active" ? "Aktiv" : "Inaktiv"}
                        </BadgeComponent>
                      </TableCell>
                      <TableCell>{new Date(user.last_login).toLocaleDateString("sv-SE")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === "1"} // Prevent deleting main admin
                          >
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
