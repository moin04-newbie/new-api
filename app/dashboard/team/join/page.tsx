"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, 
  Shield, 
  Settings, 
  Crown, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  ArrowRight,
  UserPlus
} from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { toast } from "sonner"

export default function TeamJoinPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [joinStatus, setJoinStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  
  const workspaceId = searchParams.get('workspace')
  const role = searchParams.get('role')
  const email = searchParams.get('email')
  
  const { currentWorkspace, addTeamMember, refreshTeamMembers } = useWorkspace()

  useEffect(() => {
    if (!workspaceId || !role || !email) {
      setJoinStatus('error')
      return
    }

    // Validate invitation parameters
    if (!['viewer', 'editor', 'owner'].includes(role)) {
      setJoinStatus('error')
      return
    }

    setJoinStatus('loading')
  }, [workspaceId, role, email])

  const handleAcceptInvitation = async () => {
    if (!workspaceId || !role || !email) {
      toast.error("Invalid invitation link")
      return
    }

    setIsLoading(true)

    try {
      // Add user to team
      await addTeamMember({
        email: email,
        role: role as 'viewer' | 'editor' | 'owner',
        name: email.split('@')[0], // Use email prefix as name
        avatar: "",
        projects: []
        // Note: 'status' field removed as it doesn't exist in Member interface
      })

      setJoinStatus('success')
      toast.success("Successfully joined the team!")

      // Redirect to dashboard after delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)

    } catch (error) {
      console.error('Failed to join team:', error)
      setJoinStatus('error')
      toast.error("Failed to join team. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          name: 'Owner',
          description: 'Full administrative access to all features',
          icon: <Crown className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-purple-600 to-pink-600'
        }
      case 'editor':
        return {
          name: 'Editor',
          description: 'Can create and manage API keys and projects',
          icon: <Settings className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }
      case 'viewer':
        return {
          name: 'Viewer',
          description: 'Can view API keys and projects',
          icon: <Shield className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-slate-500 to-slate-600'
        }
      default:
        return {
          name: 'Member',
          description: 'Basic access to workspace',
          icon: <Users className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-slate-400 to-slate-500'
        }
    }
  }

  const roleInfo = getRoleInfo(role || '')

  if (joinStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (joinStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Invalid Invitation</h3>
            <p className="text-slate-600 mb-6">This invitation link is invalid or has expired.</p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (joinStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-orange-700 mb-2">Invitation Expired</h3>
            <p className="text-slate-600 mb-6">This invitation has expired. Please request a new one.</p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (joinStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-700 mb-2">Welcome to the Team!</h3>
            <p className="text-slate-600 mb-6">You have successfully joined the workspace.</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                Redirecting to dashboard in a few seconds...
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Go to Dashboard Now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Team Invitation
          </CardTitle>
          <CardDescription className="text-slate-600 text-lg">
            You've been invited to join a workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Workspace:</span>
              <span className="text-sm font-semibold text-slate-800">
                {currentWorkspace?.name || 'API Management Workspace'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Your Email:</span>
              <span className="text-sm font-semibold text-slate-800">{email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Role:</span>
              <Badge className={`${roleInfo.color} text-white shadow-md`}>
                <span className="flex items-center space-x-1">
                  {roleInfo.icon}
                  <span>{roleInfo.name}</span>
                </span>
              </Badge>
            </div>
          </div>

          {/* Role Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Role Permissions
            </h4>
            <p className="text-sm text-blue-700">{roleInfo.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleAcceptInvitation}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining Team...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-full border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-xs text-slate-500">
            <p>By accepting this invitation, you agree to join the workspace and follow its guidelines.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
