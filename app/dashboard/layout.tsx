"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Bell,
  Calendar,
  BarChartIcon as ChartBar,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Upload,
  User,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { ContactUsDialog } from "@/components/contact-us-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<{
    email: string
    role: string
    firstName: string
    lastName: string
    profilePicture?: string
  } | null>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if user is logged in
  useEffect(() => {
    if (isMounted) {
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        router.push("/")
        toast({
          title: "Authentication required",
          description: "Please log in to access the dashboard.",
          variant: "destructive",
        })
      } else {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [router, toast, isMounted])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const profilePicture = e.target?.result as string
        if (user) {
          const updatedUser = { ...user, profilePicture }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          setUser(updatedUser)
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = () => {
    if (!user) return "U"

    const firstInitial = user.firstName ? user.firstName.charAt(0) : ""
    const lastInitial = user.lastName ? user.lastName.charAt(0) : ""

    return (firstInitial + lastInitial).toUpperCase() || user.email.charAt(0).toUpperCase()
  }

  const getNavigation = () => {
    if (!user) return []

    // Student navigation items
    if (user.role === "student") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
        { name: "IA Marks", href: "/dashboard/ia-marks", icon: FileText },
        { name: "Study Materials", href: "/dashboard/materials", icon: BookOpen },
        { name: "Analytics", href: "/dashboard/analytics", icon: ChartBar },
        { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
    // Faculty navigation items
    else if (user.role === "faculty") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Classes", href: "/dashboard/classes", icon: Calendar },
        { name: "Student Marks", href: "/dashboard/student-marks", icon: FileText },
        { name: "Upload Materials", href: "/dashboard/upload-materials", icon: Upload },
        { name: "Student Feedback", href: "/dashboard/student-feedback", icon: MessageSquare },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
      ]
    }
    // Admin navigation items
    else if (user.role === "admin") {
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Faculty Management", href: "/dashboard/faculty", icon: GraduationCap },
        { name: "Student Management", href: "/dashboard/students", icon: Users },
        { name: "Course Management", href: "/dashboard/courses", icon: BookOpen },
        { name: "Reports", href: "/dashboard/reports", icon: ChartBar },
        { name: "System Settings", href: "/dashboard/system-settings", icon: Settings },
      ]
    }

    return [{ name: "Dashboard", href: "/dashboard", icon: Home }]
  }

  const navigation = getNavigation()

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Class Schedule Change",
      description: "Your Artificial Intelligence class on Friday has been moved to Room 302.",
      time: "5 hours ago",
    },
    {
      id: 2,
      title: "University Announcement",
      description: "The library will be closed this weekend for maintenance.",
      time: "2 days ago",
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5] dark:bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-background border-r">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b dark:bg-[#131825] bg-[#f9f9f7]">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/images/logo-dark.png"
                alt="NexaLink Logo"
                width={120}
                height={30}
                className="hidden dark:block"
              />
              <Image
                src="/images/logo-light.png"
                alt="NexaLink Logo"
                width={120}
                height={30}
                className="block dark:hidden"
              />
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md
                    ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => setProfileDialogOpen(true)}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
          <div className="flex items-center h-16 px-4 border-b dark:bg-[#131825] bg-[#f9f9f7]">
            <Link href="/dashboard" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/images/logo-dark.png"
                alt="NexaLink Logo"
                width={120}
                height={30}
                className="hidden dark:block"
              />
              <Image
                src="/images/logo-light.png"
                alt="NexaLink Logo"
                width={120}
                height={30}
                className="block dark:hidden"
              />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md
                    ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 cursor-pointer" onClick={() => setProfileDialogOpen(true)}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </p>
                <p className="text-xs text-muted-foreground">{user?.role || "User"}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
            <DialogDescription>Update your profile picture</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              Upload New Picture
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white dark:bg-[#131825] bg-[#f9f9f7] border-b flex">
          <button
            type="button"
            className="md:hidden px-4 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="flex-1 flex max-w-xs">
              <div className="w-full flex items-center">
                <div className="relative w-full text-muted-foreground focus-within:text-foreground">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <Input placeholder="Search..." className="pl-10 bg-muted/50" />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 gap-2">
              <ContactUsDialog />

              {/* Notification dropdown */}
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" aria-label="View notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      You have {notifications.length} unread notifications
                    </p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b last:border-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              toast({
                                title: "Notification dismissed",
                                description: "The notification has been dismissed.",
                              })
                              setNotificationsOpen(false)
                            }}
                          >
                            Dismiss
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              toast({
                                title: "Viewing details",
                                description: "Loading notification details...",
                              })
                              setNotificationsOpen(false)
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <ThemeToggle />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full">
                    <span className="sr-only">Open user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>
                        {user?.firstName || "User"} {user?.lastName || ""}
                      </span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Picture</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#f5f5f5] dark:bg-background">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
