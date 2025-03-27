"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, GraduationCap, Moon, Sun } from "lucide-react"
import { useUser } from "@/contexts/user-context"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import api from "@/lib/api";


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const navigate = useNavigate()
  const { setUserData, isAuthenticated } = useUser()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  // Check for system preference on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>, userType: "student" | "teacher") => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Get form data
      const emailId = userType === "student" ? "student-email" : "teacher-email";
      const passwordId = userType === "student" ? "student-password" : "teacher-password";

      const email = (document.getElementById(emailId) as HTMLInputElement).value;
      const password = (document.getElementById(passwordId) as HTMLInputElement).value;

      let res;
      try {
        res = await api.post("/v1/auth/login", {
          email,
          password,
          role: userType
        });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          return toast.error(error.response.data.message);
        }
        if (error.response && error.response.status === 400) {
          return toast.error(error.response.data.message);
        }

        throw error; // Rethrow other errors to be caught by the outer catch
      }

      if (res.status !== 200) {
        toast.error(res.data.message);
        return;
      }

      setUserData(userType, true, res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Handle error (show message to user)
      toast.error(`there was an error logging in . Please try again: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-700/20 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm shadow-lg transition-colors duration-300">
        <CardHeader className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/20 pb-6 relative">
          <div className="absolute right-6 top-6">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-8 w-8 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-zinc-700" />
              ) : (
                <Sun className="h-4 w-4 text-zinc-300" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-50">
            Education Platform
          </CardTitle>
          <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
            Sign in to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-100 dark:bg-zinc-800/50">
              <TabsTrigger
                value="student"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white"
              >
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4" />
                Teacher
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={(e) => handleLogin(e, "student")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email" className="text-zinc-700 dark:text-zinc-300">
                      Email
                    </Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="student@school.edu"
                      required
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/30 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-zinc-400 dark:focus:ring-zinc-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="student-password" className="text-zinc-700 dark:text-zinc-300">
                        Password
                      </Label>
                      <a
                        href="/forgot-password"
                        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="student-password"
                      type="password"
                      required
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/30 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="student-remember"
                      className="border-zinc-300 dark:border-zinc-600 data-[state=checked]:bg-zinc-700 dark:data-[state=checked]:bg-zinc-600 data-[state=checked]:text-white"
                    />
                    <Label htmlFor="student-remember" className="text-sm font-normal text-zinc-700 dark:text-zinc-300">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in as Student"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={(e) => handleLogin(e, "teacher")}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email" className="text-zinc-700 dark:text-zinc-300">
                      Email
                    </Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="teacher@school.edu"
                      required
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/30 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-zinc-400 dark:focus:ring-zinc-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="teacher-password" className="text-zinc-700 dark:text-zinc-300">
                        Password
                      </Label>
                      <a
                        href="/forgot-password"
                        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="teacher-password"
                      type="password"
                      required
                      className="bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/30 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="teacher-remember"
                      className="border-zinc-300 dark:border-zinc-600 data-[state=checked]:bg-zinc-700 dark:data-[state=checked]:bg-zinc-600 data-[state=checked]:text-white"
                    />
                    <Label htmlFor="teacher-remember" className="text-sm font-normal text-zinc-700 dark:text-zinc-300">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in as Teacher"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-zinc-100 dark:border-zinc-800/20 pt-6">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-500">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 hover:underline"
            >
              Contact your administrator
            </a>
          </div>
        </CardFooter>
      </Card>
      <Toaster 
        position="top-right"
        expand={false}
        closeButton
        visibleToasts={5}
      />
    </div>
  )
}

