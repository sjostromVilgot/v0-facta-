"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  Brain,
  Calendar,
  BarChart3,
  Download,
  Settings,
  LogOut,
  Shield,
  Home,
} from "lucide-react"

type UserRole = "admin" | "editor" | "analyst"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Mock authentication - replace with real auth
const mockUser: User = {
  id: "1",
  name: "Admin User",
  email: "admin@facta.se",
  role: "admin",
}

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { id: "facts", label: "Fakta", icon: FileText, href: "/admin/facts" },
  { id: "quiz", label: "Quiz", icon: Brain, href: "/admin/quiz" },
  { id: "schedule", label: "Schema", icon: Calendar, href: "/admin/schedule" },
  { id: "analytics", label: "Statistik", icon: BarChart3, href: "/admin/analytics" },
  { id: "import-export", label: "Import/Export", icon: Download, href: "/admin/import-export" },
  { id: "settings", label: "Inställningar", icon: Settings, href: "/admin/settings" },
]

const rolePermissions = {
  admin: ["dashboard", "facts", "quiz", "schedule", "analytics", "import-export", "settings"],
  editor: ["dashboard", "facts", "quiz", "schedule"],
  analyst: ["dashboard", "analytics"],
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Mock authentication check - replace with real auth
    const checkAuth = async () => {
      try {
        // Simulate auth check
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check if user is logged in and has admin role
        const isLoggedIn = localStorage.getItem("admin-logged-in")
        if (!isLoggedIn) {
          router.push("/admin/login")
          return
        }

        setUser(mockUser)
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin-logged-in")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse mx-auto" />
          <p className="text-muted-foreground">Laddar admin...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check if user has access to admin
  if (!["admin", "editor", "analyst"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Åtkomst nekad</CardTitle>
            <CardDescription>Du har inte behörighet att komma åt adminpanelen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full" variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Tillbaka till startsidan
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const allowedItems = navigationItems.filter((item) => rolePermissions[user.role].includes(item.id))

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h2 className="font-semibold text-sidebar-foreground">Facta Admin</h2>
                <p className="text-xs text-sidebar-foreground/60">Innehållshantering</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {allowedItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild>
                      <a href={item.href} className="flex items-center gap-3 px-3 py-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>

          <div className="mt-auto border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logga ut
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4 px-6 py-4">
              <SidebarTrigger />
              <div className="flex-1" />
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
