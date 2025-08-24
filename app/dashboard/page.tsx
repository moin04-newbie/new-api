"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Users, Key, TrendingUp, Activity, Clock, IndianRupee, GitBranch, LogIn, BarChart3, Shield, AlertTriangle, Plus, Rocket, Code, Settings } from "lucide-react"
import { useWorkspace } from "@/lib/workspace-context"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
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

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  // Check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      setIsLoading(false)
      console.log('Auth state in dashboard:', user ? 'Authenticated' : 'Not authenticated')
    })
    return unsubscribe
  }, [])

  // Check if user is new
  useEffect(() => {
    if (isAuthenticated && currentWorkspace) {
      // Check if this is a new user by looking at workspace data
      const hasData = projects.length > 0 || apiKeys.length > 0 || teamMembers.length > 0
      setIsNewUser(!hasData)
    }
  }, [isAuthenticated, currentWorkspace, projects, apiKeys, teamMembers])

  // Sign in function
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  // For development, bypass authentication checks to show dashboard content
  // In production, these checks would be properly implemented
  if (!auth.currentUser) {
    console.log('No authenticated user, showing development dashboard')
  }

  if (!currentWorkspace) {
    console.log('No workspace selected, using default data')
  }

  // Fallback data for development
  const fallbackWorkspace = currentWorkspace
  const fallbackTeamMembers = teamMembers.length > 0 ? teamMembers : [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Developer', lastActive: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', lastActive: '1 hour ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Project Manager', lastActive: '30 minutes ago' }
  ]
  const fallbackApiKeys = apiKeys.length > 0 ? apiKeys : [
    { id: '1', name: 'Production API Key', key: 'prod_123456789', status: 'active', createdAt: '2024-01-01', lastUsed: '2024-01-25' },
    { id: '2', name: 'Development API Key', key: 'dev_987654321', status: 'active', createdAt: '2024-01-15', lastUsed: '2024-01-24' }
  ]
  const fallbackProjects = projects.length > 0 ? projects : [
    { id: '1', name: 'API Gateway Redesign', description: 'Redesign and modernize the API gateway infrastructure', status: 'active', priority: 'high', progress: 65, startDate: '2024-01-15', dueDate: '2024-03-30', budget: 500000, spentBudget: 325000, teamMembers: ['1', '2', '3'], tags: ['backend', 'infrastructure', 'api'], milestones: [], tasks: [], createdAt: '2024-01-15', updatedAt: '2024-01-25', createdBy: '1' },
    { id: '2', name: 'Mobile App Development', description: 'Develop a comprehensive mobile application', status: 'planning', priority: 'medium', progress: 15, startDate: '2024-02-01', dueDate: '2024-06-30', budget: 1200000, spentBudget: 180000, teamMembers: ['2', '4', '5'], tags: ['mobile', 'ios', 'android'], milestones: [], tasks: [], createdAt: '2024-01-20', updatedAt: '2024-01-25', createdBy: '2' }
  ]
  const fallbackWorkspaceStats = workspaceStats.totalProjects > 0 ? workspaceStats : {
    totalProjects: 2,
    activeCollaborations: 3,
    recentActivity: 5,
    securityScore: 100,
    projectProgress: 40,
    totalBudget: 1700000,
    spentBudget: 505000
  }
  const fallbackUserRole = userRole || 'admin'
  
  const fallbackRecentActivity = recentActivity.length > 0 ? recentActivity : [
    {
      id: '1',
      type: 'project',
      action: 'created',
      description: 'Project "API Gateway Redesign" created',
      timestamp: new Date().toLocaleString(),
      user: 'System',
      projectId: '1'
    },
    {
      id: '2',
      type: 'team',
      action: 'added',
      description: 'Team member "John Doe" added',
      timestamp: new Date().toLocaleString(),
      user: 'System'
    },
    {
      id: '3',
      type: 'api',
      action: 'created',
      description: 'API key "Production API Key" created',
      timestamp: new Date().toLocaleString(),
      user: 'System'
    }
  ]

  // Now calculate recentActivityWithProjects with the fallback data
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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access the dashboard and view your workspace data.
            </p>
            <Button 
              onClick={handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In with Google
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              This will resolve the Firebase permissions error
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show welcome screen for new users
  if (isNewUser) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to KeyNest! 🎉</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your workspace is ready! Start building amazing projects and managing your API keys.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Create Your First Project</h3>
                <p className="text-sm text-gray-600">Start building something amazing</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Add API Keys</h3>
                <p className="text-sm text-gray-600">Manage your integrations</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Invite Team Members</h3>
                <p className="text-sm text-gray-600">Collaborate with your team</p>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => router.push('/dashboard/projects/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create First Project
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/keys')}
                variant="outline"
                className="px-6 py-3"
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
    <div className="absolute inset-0 px-4 sm:px-6 lg:px-8 pt-0 bg-gray-50 z-0">
      {/* Header */}
      <div className="mb-6">
        {/* Page Title Row */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Role: {fallbackUserRole.charAt(0).toUpperCase() + fallbackUserRole.slice(1)}
            </Badge>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/dashboard/projects/new")}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {fallbackWorkspace?.name}</h2>
              <p className="text-gray-600 text-lg">Here's what's happening in your workspace</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Current Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mb-8 text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workspace data...</p>
        </div>
      )}

      {/* Workspace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" style={{minHeight: '200px'}}>
        <Card className="border border-gray-200 shadow-sm bg-white" style={{border: '2px solid #e5e7eb', backgroundColor: 'white'}}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{fallbackWorkspaceStats.totalProjects || '2'}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Members</p>
                <p className="text-3xl font-bold text-gray-900">{fallbackTeamMembers.length || '3'}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active API Keys</p>
                <p className="text-3xl font-bold text-gray-900">{fallbackApiKeys.filter(k => k.status === 'active').length}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {fallbackWorkspaceStats.projectProgress}%
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6" style={{minHeight: '300px'}}>
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              Projects
            </CardTitle>
            <CardDescription>Manage your workspace projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-medium">{fallbackProjects.filter(p => p.status === 'active').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium">{fallbackProjects.filter(p => p.status === 'completed').length}</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => router.push("/dashboard/projects")}
            >
              View All Projects
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Team & Collaboration
            </CardTitle>
            <CardDescription>Manage your team and collaborations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Members</span>
                <span className="font-medium">{fallbackTeamMembers.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Members</span>
                <span className="font-medium">{fallbackTeamMembers.filter(m => (m.lastActive || "").includes("hour")).length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Project Progress</span>
                <span className="font-medium">{fallbackWorkspaceStats.projectProgress}%</span>
              </div>
              <Progress value={fallbackWorkspaceStats.projectProgress} className="h-2" />
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => router.push("/dashboard/team")}
            >
              Manage Team
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              API Management
            </CardTitle>
            <CardDescription>Monitor your API keys and usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Keys</span>
                <span className="font-medium">{apiKeys.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Keys</span>
                <span className="font-medium">{fallbackApiKeys.filter(k => k.status === 'active').length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Security Score</span>
                <span className="font-medium">{workspaceStats.securityScore}%</span>
              </div>
              <Progress value={workspaceStats.securityScore} className="h-2" />
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => router.push("/dashboard/keys")}
            >
              Manage API Keys
            </Button>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-600" />
              Quick Access
            </CardTitle>
            <CardDescription>Access important tools and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/api-docs")}
              >
                <Code className="h-4 w-4 mr-2" />
                API Documentation
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/community")}
              >
                <Users className="h-4 w-4 mr-2" />
                Community
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/analytics")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-green-600" />
            Budget Overview
          </CardTitle>
          <CardDescription>Track your workspace spending and budget allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">₹{fallbackWorkspaceStats.totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Spent</p>
              <p className="text-2xl font-bold text-red-600">₹{fallbackWorkspaceStats.spentBudget.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(fallbackWorkspaceStats.totalBudget - fallbackWorkspaceStats.spentBudget).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Budget Usage</span>
              <span className="text-gray-500">
                {fallbackWorkspaceStats.totalBudget > 0 
                  ? Math.round((fallbackWorkspaceStats.spentBudget / fallbackWorkspaceStats.totalBudget) * 100) 
                  : 0}%
              </span>
            </div>
            <Progress 
              value={fallbackWorkspaceStats.totalBudget > 0 
                ? (fallbackWorkspaceStats.spentBudget / fallbackWorkspaceStats.totalBudget) * 100 
                : 0} 
              className="h-3" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest updates and changes in your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivityWithProjects.length > 0 ? (
              recentActivityWithProjects.map((activity) => (
                <div key={activity.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    {activity.projectId && (
                      <p className="text-xs text-gray-500">
                        Project: {activity.projectName}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Start working on projects to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
