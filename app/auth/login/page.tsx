"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmail, signInWithGoogle } from "@/lib/auth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmail(email, password)
      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
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
        <div className="absolute top-60 left-60 text-gray-500 animate-float text-sm" style={{animationDelay: '3s'}}>⚡</div>
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
        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(128, 128, 128, 0.2); }
          50% { box-shadow: 0 0 15px rgba(128, 128, 128, 0.4); }
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
        .input-glow:focus {
          animation: inputGlow 2s ease-in-out infinite;
        }
      `}</style>

      <Card className="w-full max-w-md relative z-10 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95 backdrop-blur-xl border border-gray-200 hover:border-gray-300 transition-all duration-500 hover:shadow-2xl animate-glow">
        <CardHeader className="text-center pb-6">
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
            💫 Welcome Back
          </CardTitle>
          <CardDescription className="text-black/80 text-lg leading-relaxed">
            Access your <span className="font-semibold text-gray-700">secure development environment</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <Alert className="border-red-300 bg-red-50/80 backdrop-blur-sm">
                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-2 border-gray-300 focus:border-gray-600 bg-white/70 backdrop-blur-sm text-black placeholder-gray-500 transition-all duration-300 input-glow"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 border-2 border-gray-300 focus:border-gray-600 bg-white/70 backdrop-blur-sm text-black placeholder-gray-500 transition-all duration-300 input-glow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="/auth/forgot-password" className="text-sm text-gray-700 hover:text-black underline font-semibold transition-colors duration-200">
                🔄 Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-gray-700 to-black hover:from-gray-600 hover:to-gray-900 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : "🔓 Sign Into DevHub"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-gray-300" />
              <span className="text-sm text-black/60 font-medium px-2">or continue with</span>
              <Separator className="flex-1 bg-gray-300" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4 border-2 border-gray-300 hover:border-gray-500 text-black bg-white/50 hover:bg-gray-100/80 font-semibold py-6 text-lg backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-black/70">
              New to DevHub?{" "}
              <Link href="/auth/signup" className="text-gray-700 hover:text-black underline font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}