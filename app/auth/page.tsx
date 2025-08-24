"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Key, ArrowRight, Mail, Shield, Github, LogIn } from 'lucide-react'
import { initializeNewUser } from "@/lib/user-service"

export default function AuthGatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already authenticated, go straight to dashboard.
  useEffect(() => {
    const unsub = (async () => {
      const { onAuthStateChanged } = await import("@/lib/auth")
      return onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // Initialize new user if needed
            await initializeNewUser()
            router.replace("/dashboard")
          } catch (error) {
            console.error('Error initializing user:', error)
            // Still redirect to dashboard even if initialization fails
            router.replace("/dashboard")
          }
        }
      })
    })()
    // No unsubscribe needed for the IIFE promise resolution here
  }, [router])

  const continueWithGoogle = async () => {
    setError(null)
    setLoading(true)
    try {
      const { signInWithGoogle } = await import("@/lib/auth")
      await signInWithGoogle()
      
      // User will be automatically initialized in the useEffect above
      // No need to call initializeNewUser here
      
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#013C5A]/10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-9 h-9 bg-[#013C5A] rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#013C5A]">KeyNest</span>
          </div>
          <CardTitle className="text-2xl text-[#013C5A]">Authenticate to continue</CardTitle>
          <CardDescription>Choose a sign-in method to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full bg-[#013C5A] hover:bg-[#013C5A]/90 text-white"
            onClick={continueWithGoogle}
            disabled={loading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-[#013C5A]/50">or</span>
            <Separator className="flex-1" />
          </div>

          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full border-[#013C5A]/20 text-[#013C5A] bg-transparent">
              <Mail className="w-4 h-4 mr-2" />
              Sign in with Email
            </Button>
          </Link>

          <Link href="/auth/signup" className="w-full block">
            <Button variant="ghost" className="w-full text-[#013C5A] hover:bg-[#013C5A]/10">
              Create an account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <div className="pt-2 text-center text-xs text-[#013C5A]/60">
            <div className="flex justify-center items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Protected access — you can change auth later in Settings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
