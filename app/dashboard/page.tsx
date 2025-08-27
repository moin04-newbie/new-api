"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Users, Key, TrendingUp, Activity, Clock, IndianRupee, GitBranch, LogIn, BarChart3, Plus, Rocket, Code } from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"

export default function DashboardPage() {
  const router = useRouter()
  const { 
    currentWorkspace,
    teamMembers, 
    apiKeys, 
    projects, 
    workspaceStats, 
    recentActivity,
    userRole 
  } = useWorkspace()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentWorkspace) {
      const hasData = projects.length > 0 || apiKeys.length > 0 || teamMembers.length > 0
      setIsNewUser(!hasData)
    }
  }, [isAuthenticated, currentWorkspace, projects, apiKeys, teamMembers])

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  // Fallback data
  const fallbackTeamMembers = teamMembers.length > 0 ? teamMembers : [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer', lastActive: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', lastActive: '1 hour ago' }
  ]
  const fallbackApiKeys = apiKeys.length > 0 ? apiKeys : [
    { id: '1', name: 'Production API Key', status: 'active' },
    { id: '2', name: 'Development API Key', status: 'active' }
  ]
  // Do not show mock projects; reflect real data only
  const fallbackProjects = projects
  const fallbackWorkspaceStats = workspaceStats.totalProjects > 0 ? workspaceStats : {
    totalProjects: projects.length,
    projectProgress: 0,
    totalBudget: 0,
    spentBudget: 0,
    securityScore: 100
  }
  const fallbackUserRole = userRole || 'admin'
  
  const fallbackRecentActivity = recentActivity.length > 0 ? recentActivity : [
    {
      id: '1',
      type: 'project',
      description: 'Project "API Gateway Redesign" created',
      timestamp: new Date().toLocaleString(),
      projectId: '1'
    }
  ]

  const recentActivityWithProjects = useMemo(() => {
    return fallbackRecentActivity.slice(0, 5).map((activity, index) => {
      const project = fallbackProjects.find(p => p.id === activity.projectId)
      return {
        ...activity,
        projectName: project?.name || 'Unknown Project',
        key: `${activity.id}-${index}`
      }
    })
  }, [fallbackRecentActivity, fallbackProjects])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-12 max-w-md shadow-2xl shadow-slate-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-3xl" />
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/25">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-3">Authentication Required</h2>
              <p className="text-slate-600 mb-8">Please sign in to access the dashboard.</p>
              <Button 
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg shadow-blue-500/25 w-full"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isNewUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-12 max-w-4xl shadow-2xl shadow-slate-500/20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/25">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-4">Welcome to DevHub! 🎉</h1>
            <p className="text-xl text-slate-600 mb-12">Your workspace is ready! Start building amazing projects.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Create Your First Project</h3>
                <p className="text-slate-600">Start building something amazing</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Add API Keys</h3>
                <p className="text-slate-600">Manage your integrations</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Invite Team Members</h3>
                <p className="text-slate-600">Collaborate with your team</p>
              </div>
            </div>
            
            <div className="flex gap-6 justify-center">
              <Button 
                onClick={() => router.push('/dashboard/projects/new')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 shadow-lg shadow-blue-500/25"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create First Project
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/keys')}
                variant="outline"
                className="px-8 py-4 border-slate-200 hover:bg-slate-50"
              >
                <Key className="h-5 w-5 mr-2" />
                Add API Keys
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-slate-500 mt-2">Overview of your workspace activity</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white/50 backdrop-blur-sm">
                {fallbackUserRole.charAt(0).toUpperCase() + fallbackUserRole.slice(1)}
              </Badge>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                onClick={() => router.push("/dashboard/projects/new")}
              >
                <GitBranch className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
          
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-slate-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome back! 👋</h2>
                <p className="text-slate-600 text-lg">Here's what's happening in your workspace</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Total Projects</p>
                  <p className="text-3xl font-bold text-slate-900">{fallbackWorkspaceStats.totalProjects}</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Team Members</p>
                  <p className="text-3xl font-bold text-slate-900">{fallbackTeamMembers.length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Active API Keys</p>
                  <p className="text-3xl font-bold text-slate-900">{fallbackApiKeys.filter(k => k.status === 'active').length}</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                  <Key className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-2">Success Rate</p>
                  <p className="text-3xl font-bold text-slate-900">{fallbackWorkspaceStats.projectProgress}%</p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                  <GitBranch className="h-5 w-5 text-white" />
                </div>
                Projects
              </CardTitle>
              <CardDescription className="text-slate-500">Manage your workspace projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Projects</span>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {fallbackProjects.filter(p => p.status === 'active').length}
                  </Badge>
                </div>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                onClick={() => router.push("/dashboard/projects")}
              >
                View All Projects
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Team
              </CardTitle>
              <CardDescription className="text-slate-500">Manage your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Project Progress</span>
                  <span className="text-sm font-medium text-slate-900">{fallbackWorkspaceStats.projectProgress}%</span>
                </div>
                <Progress value={fallbackWorkspaceStats.projectProgress} className="h-2 bg-slate-100" />
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                onClick={() => router.push("/dashboard/team")}
              >
                Manage Team
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25">
                  <Key className="h-5 w-5 text-white" />
                </div>
                API Management
              </CardTitle>
              <CardDescription className="text-slate-500">Monitor your API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Security Score</span>
                  <span className="text-sm font-medium text-slate-900">{fallbackWorkspaceStats.securityScore}%</span>
                </div>
                <Progress value={fallbackWorkspaceStats.securityScore} className="h-2 bg-slate-100" />
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
                onClick={() => router.push("/dashboard/keys")}
              >
                Manage API Keys
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card className="mb-8 group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                <IndianRupee className="h-5 w-5 text-white" />
              </div>
              Budget Overview
            </CardTitle>
            <CardDescription className="text-slate-500">Track your workspace spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <p className="text-sm font-medium text-slate-500 mb-2">Total Budget</p>
                <p className="text-3xl font-bold text-slate-900">₹{fallbackWorkspaceStats.totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <p className="text-sm font-medium text-red-600 mb-2">Spent</p>
                <p className="text-3xl font-bold text-red-700">₹{fallbackWorkspaceStats.spentBudget.toLocaleString()}</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <p className="text-sm font-medium text-green-600 mb-2">Remaining</p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{(fallbackWorkspaceStats.totalBudget - fallbackWorkspaceStats.spentBudget).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Budget Usage</span>
                <span className="text-sm font-bold text-slate-900">
                  {Math.round((fallbackWorkspaceStats.spentBudget / fallbackWorkspaceStats.totalBudget) * 100)}%
                </span>
              </div>
              <Progress 
                value={(fallbackWorkspaceStats.spentBudget / fallbackWorkspaceStats.totalBudget) * 100} 
                className="h-3 bg-slate-100" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-500">Latest updates in your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivityWithProjects.length > 0 ? (
                recentActivityWithProjects.map((activity) => (
                  <div key={activity.key} className="group/item flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover/item:scale-110 transition-transform duration-300">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white/50">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No recent activity</p>
                  <p className="text-sm text-slate-400 mt-1">Start working on projects to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}