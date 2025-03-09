import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useNavigate()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>, userType: string) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to appropriate dashboard based on user type
      router(userType === "teacher" ? "/teacher/dashboard" : "/student/dashboard")

      // router.push(userType === "teacher" ? "/teacher/dashboard" : "/student/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Education Platform</CardTitle>
          <CardDescription className="text-center">Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Teacher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={(e) => handleLogin(e, "student")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input id="student-email" type="email" placeholder="student@school.edu" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password">Password</Label>
                      <a href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input id="student-password" type="password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="student-remember" />
                    <Label htmlFor="student-remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Student"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={(e) => handleLogin(e, "teacher")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input id="teacher-email" type="email" placeholder="teacher@school.edu" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teacher-password">Password</Label>
                      <a href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input id="teacher-password" type="password" required />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="teacher-remember" />
                    <Label htmlFor="teacher-remember" className="text-sm font-normal">
                      Remember me
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in as Teacher"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Contact your administrator
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

