"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { isPro as isProFn, setPlan, getPlan } from "@/lib/subscription"
import { Crown, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function UpgradePage() {
  const router = useRouter()
  const [plan, setPlanState] = useState<"free" | "pro">("free")

  useEffect(() => {
    setPlanState(getPlan())
  }, [])

  const upgrade = () => {
    setPlan("pro")
    setPlanState("pro")
    router.refresh()
  }

  const downgrade = () => {
    setPlan("free")
    setPlanState("free")
    router.refresh()
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan & Billing</h1>
          <p className="text-gray-600 mt-1">Manage your KeyNest subscription</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Free</span>
              {plan === "free" && <Badge variant="secondary">Current</Badge>}
            </CardTitle>
            <CardDescription>Great for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• Up to 5 API keys</li>
              <li>• Basic usage</li>
              <li>• Limited audit logs</li>
            </ul>
            {plan === "free" ? (
              <Button onClick={upgrade} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                Upgrade to Pro
              </Button>
            ) : (
              <Button onClick={downgrade} variant="outline" className="w-full">
                Downgrade to Free
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-orange-600" />
              <span>Pro</span>
              {plan === "pro" && (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Unlock advanced analytics, alerts, and more</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• Unlimited API keys</li>
              <li>• Advanced analytics & charts</li>
                              <li>• Email notifications & advanced security</li>
              <li>• Extended audit logs</li>
            </ul>
            {plan === "pro" ? (
              <Button onClick={downgrade} variant="outline" className="w-full">
                Downgrade to Free
              </Button>
            ) : (
              <Button onClick={upgrade} className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                Upgrade to Pro - $9/month
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
