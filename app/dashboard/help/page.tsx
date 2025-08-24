"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Learn how to use KeyNest</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Guides for creating projects, managing API keys, and setting up teams.</p>
            <Button asChild>
              <Link href="#">Open Docs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>We usually reply within 1 business day</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">Have a question or need help? Send us a message.</p>
            <Button asChild variant="outline">
              <Link href="mailto:support@keynest.app">Email Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


