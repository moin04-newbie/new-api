"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Mail, Shield, LogIn } from 'lucide-react'

export default function AuthGatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If already authenticated, go straight to dashboard.
  useEffect(() => {
    (async () => {
      const { onAuthStateChanged } = await import("@/lib/auth")
      return onAuthStateChanged((user) => {
        if (user) router.replace("/dashboard")
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
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-300/20 to-gray-400/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-gray-100/10 to-gray-200/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating security particles */}
        <div className="absolute top-20 left-20 text-gray-400 animate-float text-xl" style={{animationDelay: '0s'}}>🔒</div>
        <div className="absolute top-40 right-32 text-gray-500 animate-float text-lg" style={{animationDelay: '2s'}}>🛡</div>
        <div className="absolute bottom-32 left-40 text-gray-400 animate-float text-xl" style={{animationDelay: '4s'}}>🔐</div>
        <div className="absolute bottom-20 right-20 text-gray-600 animate-float text-lg" style={{animationDelay: '1s'}}>🔑</div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(128, 128, 128, 0.3), 0 0 40px rgba(160, 160, 160, 0.2); }
          50% { box-shadow: 0 0 30px rgba(128, 128, 128, 0.6), 0 0 60px rgba(160, 160, 160, 0.4); }
        }
        .animate-float {
          animation: float 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #000 0%, #666666 25%, #999999 50%, #777777 75%, #000 100%);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>

      <Card className="w-full max-w-md relative z-10 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 backdrop-blur-xl border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:shadow-2xl animate-glow">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative w-16 h-16 group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl animate-pulse group-hover:scale-105 transition-all duration-300"></div>
              <div className="absolute inset-1 bg-white rounded-3xl overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/da/af/3c/daaf3ccf26c9ac4aef97a0bc86c87460.jpg" 
                  alt="DevHub Logo" 
                  className="w-full h-full object-cover rounded-2xl filter brightness-110 contrast-110 saturate-110 transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
                  style={{
                    mixBlendMode: 'multiply',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)'
                  }}
                />
                {/* Cutout overlay for enhanced quality */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-2xl pointer-events-none"></div>
              </div>
              {/* Enhanced glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/20 to-gray-800/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-black shimmer-text">DevHub</span>
          </div>
          <CardTitle className="text-3xl font-bold text-black mb-3 bg-gradient-to-r from-black via-gray-700 to-gray-600 bg-clip-text text-transparent">
            🔐 Secure Access
          </CardTitle>
          <CardDescription className="text-black/80 text-lg leading-relaxed">
            Choose your <span className="font-semibold text-gray-700">authentication method</span> to enter the developer hub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-300 bg-red-50/80 backdrop-blur-sm">
              <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            onClick={continueWithGoogle}
            disabled={loading}
          >
            <LogIn className="w-5 h-5 mr-3" />
            {loading ? "Authenticating..." : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-4">
            <Separator className="flex-1 bg-gray-300" />
            <span className="text-sm text-black/60 font-medium px-2">or</span>
            <Separator className="flex-1 bg-gray-300" />
          </div>

          <Link href="/auth/login" className="w-full">
            <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-gray-500 text-black bg-white/50 hover:bg-gray-100/80 font-semibold py-6 text-lg backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <Mail className="w-5 h-5 mr-3" />
              Sign in with Email
            </Button>
          </Link>

          <Link href="/auth/signup" className="w-full block">
            <Button variant="ghost" className="w-full text-black hover:bg-gray-100/80 font-semibold py-6 text-lg backdrop-blur-sm transition-all duration-300 hover:shadow-md group">
              Create an account
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          <div className="pt-4 text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-black/70">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="font-medium">
                <span className="text-gray-700">Enterprise-grade security</span> — Customize auth in Settings
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}