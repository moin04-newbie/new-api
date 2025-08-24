"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Edit, Save, X, Plus, Calendar, Users, IndianRupee, Target, Clock, CheckCircle, Circle, AlertCircle, MessageSquare, FileText, Shield, TrendingUp } from "lucide-react"
import { useWorkspace, type Project, type Milestone, type Task, type Source, type ChatMessage, type ProgressGoal } from "@/lib/workspace-context"
import { useRouter, useParams } from "next/navigation"
import { format } from "date-fns"

const statusColors = {
  planning: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  "on-hold": "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800"
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

const taskStatusColors = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  review: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800"
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const { 
    projects, 
    teamMembers, 
    sources,
    chatMessages,
    progressGoals,
    updateProject, 
    deleteProject,
    addProjectActivity,
    addSource,
    sendMessage,
    addProgressGoal,
    userRole,
    hasPermission,
    currentUserId
  } = useWorkspace()
  
  const project = projects.find(p => p.id === projectId)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Project>>({})
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", dueDate: "" })
  const [newTask, setNewTask] = useState({ 
    title: "", 
    description: "", 
    assignee: "", 
    dueDate: "", 
    estimatedHours: "", 
    priority: "medium" as const 
  })
  const [newSource, setNewSource] = useState({ title: "", description: "", url: "", type: "article" as const, tags: [] as string[] })
  const [newMessage, setNewMessage] = useState("")
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target: "", unit: "", dueDate: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (project) {
      setEditData(project)
    }
  }, [project])

  if (!project) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
        <p className="text-gray-600 mt-2">The project you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/dashboard/projects")} className="mt-4">
          Back to Projects
        </Button>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      await updateProject(projectId, editData)
      setIsEditing(false)
      addProjectActivity(projectId, {
        type: 'project',
        action: 'updated',
        description: `Project "${project.name}" details updated`,
        user: 'System'
      })
    } catch (error) {
      console.error("Failed to update project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditData(project)
    setIsEditing(false)
  }

  const handleAddMilestone = async () => {
    if (!newMilestone.title.trim() || !newMilestone.dueDate) return
    
    const milestone: Milestone = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newMilestone.title,
      description: newMilestone.description,
      dueDate: newMilestone.dueDate,
      status: 'pending',
      progress: 0
    }
    
    const updatedMilestones = [...project.milestones, milestone]
    await updateProject(projectId, { milestones: updatedMilestones })
    
    setNewMilestone({ title: "", description: "", dueDate: "" })
    addProjectActivity(projectId, {
      type: 'project',
      action: 'milestone_added',
      description: `Milestone "${milestone.title}" added`,
      user: 'System'
    })
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.assignee || !newTask.dueDate) return
    
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      estimatedHours: parseFloat(newTask.estimatedHours) || 0,
      actualHours: 0,
      tags: []
    }
    
    const updatedTasks = [...project.tasks, task]
    await updateProject(projectId, { tasks: updatedTasks })
    
    setNewTask({ 
      title: "", 
      description: "", 
      assignee: "", 
      dueDate: "", 
      estimatedHours: "", 
      priority: "medium" 
    })
    addProjectActivity(projectId, {
      type: 'project',
      action: 'task_added',
      description: `Task "${task.title}" added`,
      user: 'System'
    })
  }

  const handleAddSource = async () => {
    if (!newSource.title.trim() || !newSource.url.trim()) return
    
    if (!currentUserId || !project) {
      console.error("Cannot add source: No user or project context")
      return
    }
    
    try {
      await addSource({
        title: newSource.title,
        description: newSource.description,
        url: newSource.url,
        type: newSource.type,
        tags: newSource.tags,
        sharedBy: currentUserId,
        projectId: projectId,
        workspaceId: project.workspaceId
      })
      
      setNewSource({ title: "", description: "", url: "", type: "article", tags: [] })
    } catch (error) {
      console.error("Failed to add source:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    if (!currentUserId || !project) {
      console.error("Cannot send message: No user or project context")
      return
    }
    
    try {
      await sendMessage({
        content: newMessage,
        senderId: currentUserId,
        projectId: projectId,
        workspaceId: project.workspaceId
      })
      
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleAddGoal = async () => {
    if (!newGoal.title.trim() || !newGoal.target.trim() || !newGoal.dueDate.trim()) return
    
    if (!currentUserId || !project) {
      console.error("Cannot add goal: No user or project context")
      return
    }
    
    try {
      await addProgressGoal({
        title: newGoal.title,
        description: newGoal.description,
        target: parseFloat(newGoal.target),
        current: 0,
        unit: newGoal.unit,
        dueDate: newGoal.dueDate,
        projectId: projectId,
        userId: currentUserId,
        workspaceId: project.workspaceId
      })
      
      setNewGoal({ title: "", description: "", target: "", unit: "", dueDate: "" })
    } catch (error) {
      console.error("Failed to add goal:", error)
    }
  }

  const handleDeleteProject = async () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId)
        router.push("/dashboard/projects")
      } catch (error) {
        console.error("Failed to delete project:", error)
      }
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const projectSources = sources.filter(s => s.projectId === projectId)
  const projectChatMessages = chatMessages.filter(m => m.projectId === projectId)
  const projectGoals = progressGoals.filter(g => g.projectId === projectId)

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/projects")}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {hasPermission('edit') && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {hasPermission('delete') && (
                  <Button variant="outline" onClick={handleDeleteProject} className="text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className={statusColors[project.status]}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Priority</p>
                <Badge className={priorityColors[project.priority]}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </Badge>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <AlertCircle className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{project.progress}%</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-2xl font-bold text-gray-900">{project.teamMembers.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-gray-50">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Started {format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
              <span>Due {format(new Date(project.dueDate), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="chat">Team Chat</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editData.description || ""}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={editData.startDate || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={editData.dueDate || ""}
                          onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={editData.status || project.status} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, status: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select 
                          value={editData.priority || project.priority} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Started {format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Due {format(new Date(project.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Budget: ₹{project.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Spent: ₹{project.spentBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="font-medium">₹{project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-medium text-red-600">₹{project.spentBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-medium text-green-600">
                      ₹{(project.budget - project.spentBudget).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget Usage</span>
                    <span className="text-gray-500">{Math.round((project.spentBudget / project.budget) * 100)}%</span>
                  </div>
                  <Progress value={(project.spentBudget / project.budget) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sources</CardTitle>
              <CardDescription>Shared resources and references for this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Source */}
              {hasPermission('edit') && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Add New Source</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Source title"
                      value={newSource.title}
                      onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="URL"
                      value={newSource.url}
                      onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <Select value={newSource.type} onValueChange={(value: any) => setNewSource(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddSource} size="sm">
                      <Plus className="h-4 w-4" />
                      Add Source
                    </Button>
                  </div>
                </div>
              )}

              {/* Sources List */}
              <div className="space-y-4">
                {projectSources.map((source) => (
                  <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <h4 className="font-medium">{source.title}</h4>
                          <Badge variant="outline">{source.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                          {source.url}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>Project-specific communication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chat Messages */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {projectChatMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {teamMembers.find(m => m.id === message.senderId)?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {teamMembers.find(m => m.id === message.senderId)?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.timestamp), 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Send Message */}
              {hasPermission('chat') && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profiles Tab */}
        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Profiles</CardTitle>
              <CardDescription>Project team member details and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.teamMembers.map((memberId) => {
                  const member = teamMembers.find(m => m.id === memberId)
                  return (
                    <div key={memberId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium">
                          {member?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h4 className="font-medium">{member?.name || 'Unknown'}</h4>
                          <p className="text-sm text-gray-600">{member?.role || 'Team Member'}</p>
                          <p className="text-xs text-gray-500">{member?.lastActive || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage team member roles and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">Your Role: {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "No Role"}</h4>
                    <p className="text-sm text-gray-600">
                      {userRole === 'admin' && 'Full access to all project features and settings'}
                      {userRole === 'member' && 'Can edit project content and participate in discussions'}
                      {userRole === 'viewer' && 'Read-only access to project information'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Admin</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Full project control</li>
                      <li>• Manage team members</li>
                      <li>• Edit project settings</li>
                      <li>• Delete project</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Member</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Edit project content</li>
                      <li>• Add tasks & milestones</li>
                      <li>• Participate in chat</li>
                      <li>• View all data</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Viewer</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• View project content</li>
                      <li>• Read-only access</li>
                      <li>• No editing permissions</li>
                      <li>• Limited interactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Monitor project goals and milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Goal */}
              {hasPermission('edit') && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Add New Goal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Goal title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Input
                      placeholder="Target value"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                    />
                    <Input
                      placeholder="Unit (%, items, etc.)"
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <Input
                      type="date"
                      placeholder="Due date"
                      value={newGoal.dueDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                    <Button onClick={handleAddGoal} size="sm">
                      <Plus className="h-4 w-4" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              )}

              {/* Goals List */}
              <div className="space-y-4">
                {projectGoals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                      <Badge variant="outline">
                        Due: {format(new Date(goal.dueDate), 'MMM dd')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{goal.current} / {goal.target} {goal.unit}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes in this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Project Updated</h4>
                    <p className="text-sm text-blue-700">Project details were modified</p>
                    <p className="text-xs text-blue-600">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Milestone Completed</h4>
                    <p className="text-sm text-green-700">Architecture Design milestone reached 100%</p>
                    <p className="text-xs text-green-600">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium text-purple-900">Team Member Added</h4>
                    <p className="text-sm text-purple-700">Sarah Wilson joined the project</p>
                    <p className="text-xs text-purple-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
