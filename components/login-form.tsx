"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { saveUserCredentials, getRememberedCredentials, clearUserCredentials } from "@/lib/auth-storage"

// Mock database for storing credentials
const userCredentials = [
  { email: "admin@example.com", password: "admin123", role: "admin", firstName: "Admin", lastName: "User" },
  { email: "student@example.com", password: "student123", role: "student", firstName: "Student", lastName: "User" },
  { email: "faculty@example.com", password: "faculty123", role: "faculty", firstName: "Faculty", lastName: "Member" },
  { email: "acedqd@example.com", password: "password", role: "student", firstName: "ACEDQD", lastName: "" },
]

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("student")
  const [rememberMe, setRememberMe] = useState(false)
  const [savedAccounts, setSavedAccounts] = useState<{ email: string; name: string }[]>([])
  const router = useRouter()
  const { toast } = useToast()

  // Load saved accounts and remembered credentials on component mount
  useEffect(() => {
    // Get saved accounts from localStorage
    const accounts = localStorage.getItem("savedAccounts")
    if (accounts) {
      setSavedAccounts(JSON.parse(accounts))
    }

    // Check for remembered credentials
    const { email: rememberedEmail, rememberMe: remembered } = getRememberedCredentials()
    if (rememberedEmail && remembered) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check credentials against mock database
    const user = userCredentials.find((user) => user.email === email && user.password === password)

    setTimeout(() => {
      setIsLoading(false)

      if (user) {
        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        )

        // Save account to saved accounts
        const newAccount = { email: user.email, name: `${user.firstName} ${user.lastName}`.trim() }
        const updatedAccounts = [...savedAccounts.filter((acc) => acc.email !== user.email), newAccount]
        localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts))

        // Handle remember me functionality
        if (rememberMe) {
          saveUserCredentials(email, true)
        } else {
          clearUserCredentials()
        }

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.firstName}!`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if email already exists
    const userExists = userCredentials.some((user) => user.email === email)

    setTimeout(() => {
      setIsLoading(false)

      if (userExists) {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        })
      } else {
        // Add new user to mock database
        const newUser = {
          email,
          password,
          role,
          firstName,
          lastName,
        }

        userCredentials.push(newUser)

        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            email,
            role,
            firstName,
            lastName,
          }),
        )

        // Save account to saved accounts
        const newAccount = { email, name: `${firstName} ${lastName}`.trim() }
        const updatedAccounts = [...savedAccounts.filter((acc) => acc.email !== email), newAccount]
        localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts))

        toast({
          title: "Account created",
          description: `Welcome to NexaLink, ${firstName}! Your account has been created successfully.`,
        })
        router.push("/dashboard")
      }
    }, 1500)
  }

  const handleSavedAccountSelect = (email: string) => {
    setEmail(email)
    // Focus on password field
    const passwordInput = document.getElementById("password") as HTMLInputElement
    if (passwordInput) {
      passwordInput.focus()
    }
  }

  return (
    <Card className="w-full">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">Sign in to access your academic portal</CardDescription>
          </CardHeader>
          <CardContent>
            {savedAccounts.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Saved accounts</Label>
                <div className="space-y-2">
                  {savedAccounts.map((account) => (
                    <button
                      key={account.email}
                      className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-muted transition-colors text-left"
                      onClick={() => handleSavedAccountSelect(account.email)}
                    >
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{account.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <ForgotPasswordDialog>
                    <Button variant="link" className="px-0 font-normal h-auto">
                      Forgot password?
                    </Button>
                  </ForgotPasswordDialog>
                </div>
                <Input
                  id="password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="signup">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your NexaLink account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
      <CardFooter className="flex flex-col">
        <p className="mt-2 text-xs text-center text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
