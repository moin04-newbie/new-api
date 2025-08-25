"use client"

import { useState, useEffect, useMemo } from "react"
import { useWorkspace } from "@/lib/workspace-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  MessageSquare, 
  Share2, 
  Code, 
  FileText, 
  Link, 
  Users, 
  Crown, 
  Star, 
  Target, 
  CheckCircle, 
  Clock, 
  Plus,
  Search,
  Filter,
  Pin,
  Send,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  GitBranch,
  Globe,
  BookOpen,
  Zap,
  ThumbsUp,
  FolderOpen,
  Play
} from "lucide-react"

// Types - Using the actual types from workspace context
import type { Source, ChatMessage, Project, Task, Member } from "@/lib/workspace-context"

// Real-time data from workspace context - no mock data needed






export default function WorkspacePage() {
  // Custom CSS for line-clamp utilities
  const lineClampStyles = `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `
  const { 
    teamMembers: contextTeamMembers, 
    totalMembers, 
    activeMembers,
    addActivity,
    addTeamMember,
    currentWorkspace,
    currentUserId,
    sources: contextSources,
    chatMessages: contextChatMessages,
    projects: contextProjects,
    addSource,
    sendMessage,
    addProject,
    userProfile,
    workspaceStats,
    recentActivity
  } = useWorkspace()
  
  // Use context data instead of local state
  const sources = contextSources || []
  const chatMessages = contextChatMessages || []
  const projects = contextProjects || []
  
  // Use context team members directly - no mapping needed
  const teamMembers = contextTeamMembers
  
  // Loading state - check if workspace context is still initializing
  const isLoading = !contextSources || !contextChatMessages || !contextProjects || !userProfile || !teamMembers
  
  const [activeTab, setActiveTab] = useState("sources")
  
  // Handle URL tab parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['sources', 'chat', 'projects', 'profiles', 'roles', 'progress', 'recent'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("general")
  
  const [showSourceDialog, setShowSourceDialog] = useState(false)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [newSource, setNewSource] = useState<{
    title: string
    description: string
    type: "article" | "video" | "document" | "link" | "other"
    tags: string
    url: string
  }>({
    title: "",
    description: "",
    type: "article",
    tags: "",
    url: ""
  })
  const [newMember, setNewMember] = useState<{
    name: string
    email: string
    role: "admin" | "member" | "viewer"
    currentRole: string
    skills: string
    bio: string
  }>({
    name: "",
    email: "",
    role: "member",
    currentRole: "",
    skills: "",
    bio: ""
  })
  // Use real user profile data from workspace context - memoized to prevent infinite loops
  const myProfile = useMemo(() => {
    if (!userProfile) {
      return {
        name: "Loading...",
        email: "",
        bio: "",
        skills: [],
    portfolio: {
          github: "",
          linkedin: "",
          website: ""
        }
      }
    }
    
    return {
      name: (userProfile as any).name || "User",
      email: userProfile.email || "",
      bio: (userProfile as any).bio || "",
      skills: Array.isArray((userProfile as any).skills) ? (userProfile as any).skills : [],
    portfolio: {
        github: (userProfile as any).github || "",
        linkedin: (userProfile as any).linkedin || "",
        website: (userProfile as any).website || ""
      }
    }
  }, [userProfile])

  const [newProject, setNewProject] = useState<{
    title: string
    description: string
    status: "planning" | "active" | "on-hold" | "completed" | "cancelled"
    priority: "low" | "medium" | "high" | "urgent"
    startDate: string
    dueDate: string
    category: string
    tags: string
    budget: string
  }>({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: "",
    dueDate: "",
    category: "",
    tags: "",
    budget: ""
  })

  // Dynamic categories based on workspace data - memoized to prevent unnecessary re-renders
  const categories = useMemo(() => {
    return ["all", ...new Set(sources.flatMap(source => source.tags).filter(tag => tag))].slice(0, 10)
  }, [sources])
  
  const projectCategories = useMemo(() => {
    return ["Frontend Development", "Backend Development", "Mobile Development", "DevOps", "Design", "Research", "Infrastructure", "Testing", "Documentation"]
  }, [])

    const handleCreateSource = async () => {
    try {
      await addSource({
      title: newSource.title,
      description: newSource.description,
      type: newSource.type,
      tags: newSource.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        url: newSource.url,
        sharedBy: currentUserId || "",
        workspaceId: currentWorkspace?.id || ""
    })
    
    setShowSourceDialog(false)
    setNewSource({
      title: "",
      description: "",
        type: "article",
      tags: "",
      url: ""
    })
    } catch (error) {
      console.error('Failed to create source:', error)
    }
  }

    const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    try {
      await sendMessage({
      content: newMessage,
        senderId: currentUserId || "",
        projectId: undefined,
        replyTo: undefined,
        workspaceId: currentWorkspace?.id || ""
      })
      
    setNewMessage("")
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleAddMember = async () => {
    try {
      // Use the workspace context to add team member
      await addTeamMember({
      name: newMember.name,
        email: newMember.email,
      role: newMember.role,
        avatar: "/placeholder-user.jpg",
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        projects: [],
        ownerId: currentUserId || ""
    })
    
    setShowAddMemberDialog(false)
    setNewMember({
      name: "",
      email: "",
      role: "member",
      currentRole: "",
      skills: "",
      bio: ""
    })
    } catch (error) {
      console.error('Failed to add team member:', error)
    }
  }

  // Profile editing state - initialize with empty values to prevent infinite loops
  const [editingProfile, setEditingProfile] = useState<{
    name: string
    email: string
    bio: string
    skills: string[]
    portfolio: {
      github: string
      linkedin: string
      website: string
    }
  }>({
    name: "",
    email: "",
    bio: "",
    skills: [],
    portfolio: {
      github: "",
      linkedin: "",
      website: ""
    }
  })

  // Initialize editing profile when dialog opens - no automatic synchronization to prevent loops

  const handleUpdateProfile = () => {
    // In a real implementation, this would update the user profile in the workspace context
    // For now, we'll just close the dialog
    // TODO: Implement profile update functionality with workspace context
    setShowProfileDialog(false)
  }

  const initializeEditingProfile = () => {
    if (myProfile) {
      setEditingProfile({
        name: myProfile.name,
        email: myProfile.email,
        bio: myProfile.bio,
        skills: myProfile.skills,
        portfolio: { ...myProfile.portfolio }
      })
    }
  }

    const handleCreateProject = async () => {
    try {
      await addProject({
        name: newProject.title,
      description: newProject.description,
        status: newProject.status as any,
        priority: newProject.priority as any,
      progress: 0,
      startDate: newProject.startDate,
      dueDate: newProject.dueDate,
        budget: parseFloat(newProject.budget) || 0,
        spentBudget: 0,
        teamMembers: [],
      tags: newProject.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      milestones: [],
      tasks: [],
        createdBy: currentUserId || "",
        workspaceId: currentWorkspace?.id || ""
    })
    
    setShowNewProjectDialog(false)
    setNewProject({
      title: "",
      description: "",
      status: "planning",
      priority: "medium",
      startDate: "",
      dueDate: "",
      category: "",
      tags: "",
      budget: ""
    })
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  // Real-time data loading - no sample data needed
  // The workspace context automatically loads user-specific data from Firestore
  // Each user sees only their own workspace data in real-time

  const filteredSources = useMemo(() => {
    return sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesSearch
  })
  }, [sources, searchQuery])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: lineClampStyles }} />
             <div className="space-y-8">
       <div className="flex items-start justify-between">
         <div className="max-w-2xl">
           <h1 className="text-4xl font-bold text-gray-900 mb-3">Workspace</h1>
           <p className="text-lg text-gray-600 leading-relaxed">Collaborate, share resources, and track team progress</p>
           <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
             <div className="flex items-center justify-between">
               <p className="text-sm text-blue-800">
                 <strong>Real-Time User Isolation:</strong> Your workspace automatically loads your personal data from your account. 
                 Each user sees only their own workspace content, projects, and sources in real-time.
               </p>
               <div className="flex items-center space-x-2">
                 <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                 <span className="text-xs text-blue-700 font-medium">
                   {isLoading ? 'Loading...' : 'Live'}
                 </span>
               </div>
             </div>
           </div>
         </div>
                  <div className="flex flex-col space-y-3 pt-2">
            <Button onClick={() => setShowAddMemberDialog(true)} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 px-6">
              <Users className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button onClick={() => setShowProfileDialog(true)} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 px-6">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>

                     </div>
         </div>

         {/* Real-Time Workspace Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
             <div className="flex items-center space-x-3">
               <FolderOpen className="h-8 w-8 text-blue-600" />
               <div>
                 <p className="text-sm font-medium text-gray-600">Total Projects</p>
                 <p className="text-2xl font-bold text-gray-900">{workspaceStats?.totalProjects || 0}</p>
               </div>
             </div>
           </div>
           
           <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
             <div className="flex items-center space-x-3">
               <FileText className="h-8 w-8 text-green-600" />
               <div>
                 <p className="text-sm font-medium text-gray-600">Sources Shared</p>
                 <p className="text-2xl font-bold text-gray-900">{sources.length}</p>
               </div>
             </div>
           </div>
           
           <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
             <div className="flex items-center space-x-3">
               <MessageSquare className="h-8 w-8 text-purple-600" />
               <div>
                 <p className="text-sm font-medium text-gray-600">Messages</p>
                 <p className="text-2xl font-bold text-gray-900">{chatMessages.length}</p>
               </div>
             </div>
           </div>
           
           <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
             <div className="flex items-center space-x-3">
               <Users className="h-8 w-8 text-orange-600" />
               <div>
                 <p className="text-sm font-medium text-gray-600">Team Members</p>
                 <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
               </div>
             </div>
          </div>
       </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                 <TabsList className="grid w-full grid-cols-6">
           <TabsTrigger value="sources">Sources</TabsTrigger>
           <TabsTrigger value="chat">Team Chat</TabsTrigger>
           <TabsTrigger value="profiles">Profiles</TabsTrigger>
           <TabsTrigger value="roles">Roles</TabsTrigger>
           <TabsTrigger value="progress">Progress</TabsTrigger>
           <TabsTrigger value="recent">Recent</TabsTrigger>
         </TabsList>

                 {/* Sources Tab */}
         <TabsContent value="sources" className="space-y-8">
           {/* Sources Header */}
           <div className="p-8 rounded-2xl border border-gray-200">
             <div className="flex items-start justify-between">
               <div className="max-w-xl">
                 <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Sources</h3>
                 <p className="text-lg text-gray-700 leading-relaxed">Share and discover resources in your workspace</p>
                 <div className="mt-2">
                   <Badge variant="outline" className="text-xs">
                     Real-time user data
                   </Badge>
                 </div>
               </div>
               <Button onClick={() => setShowSourceDialog(true)} className="px-8 py-3 text-lg shadow-lg">
                 <Plus className="h-5 w-5 mr-3" />
                 Share Source
               </Button>
             </div>
           </div>

           {/* Search and Filter Controls */}
           <div className="p-6 rounded-xl border border-gray-200">
             <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
               <div className="flex-1 min-w-0">
                 <Input
                   placeholder="Search sources by title, description, or tags..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="max-w-md text-lg py-3"
                 />
               </div>
               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                 <SelectTrigger className="w-56 py-3">
                   <SelectValue placeholder="Select category" />
                 </SelectTrigger>
                 <SelectContent>
                   {categories.map(category => (
                     <SelectItem key={category} value={category}>
                       {category === "all" ? "All Categories" : category}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>

                     {/* Sources Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {filteredSources.map((source, index) => (
               <div key={source.id} className={`bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                 index % 3 === 0 ? 'p-8' : 
                 index % 3 === 1 ? 'p-7' : 'p-6'
               }`}>
                {/* Source Header with Icon */}
                <div className="flex items-center space-x-3 mb-4">
                                     <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200">
                    {source.type === "article" && <FileText className="h-6 w-6" />}
                    {source.type === "video" && <Play className="h-6 w-6" />}
                    {source.type === "document" && <FileText className="h-6 w-6" />}
                    {source.type === "link" && <Link className="h-6 w-6" />}
                    {source.type === "other" && <Globe className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{source.type}</Badge>
                    </div>
                  </div>
                </div>

                {/* Source Content */}
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{source.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">{source.description}</p>

                {/* URL Display */}
                {source.url && (
                                     <div className="mb-4 p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4 text-blue-600" />
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium truncate"
                      >
                        {source.url.includes('youtube.com') ? 'YouTube' :
                         source.url.includes('github.com') ? 'GitHub' :
                         source.url.includes('google.com') ? 'Google' :
                         source.url.includes('stackoverflow.com') ? 'Stack Overflow' :
                         source.url.includes('medium.com') ? 'Medium' :
                         source.url.includes('dev.to') ? 'Dev.to' :
                         source.url.includes('css-tricks.com') ? 'CSS Tricks' :
                         source.url.includes('mdn.com') ? 'MDN' :
                         source.url.includes('w3schools.com') ? 'W3Schools' :
                         'External Link'}
                      </a>
                    </div>
                  </div>
                )}



                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {source.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {source.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{source.tags.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-xs">U</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">You</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>{source.sharedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading your real-time workspace...</h3>
              <p className="text-gray-500">Fetching your personal data from your account</p>
              <div className="mt-4 text-sm text-gray-400">
                <p>This may take a moment while we set up your workspace...</p>
              </div>
            </div>
          )}

          
        </TabsContent>

                 {/* Team Chat Tab */}
         <TabsContent value="chat" className="space-y-8">
           <div className="p-8 rounded-2xl border border-gray-200 mb-8">
             <div className="flex items-center justify-between">
               <div>
                 <h3 className="text-3xl font-bold text-gray-900 mb-3">Your Workspace Chat</h3>
                 <p className="text-lg text-gray-700">Stay connected with your workspace in real-time</p>
               </div>
               <Badge variant="outline" className="text-xs">
                 Real-time messages
               </Badge>
             </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
             {/* Channels */}
             <div className="p-6 border rounded-2xl">
               <h3 className="text-xl font-semibold mb-6 text-gray-900">Channels</h3>
               <div className="space-y-3">
                 {["general", ...new Set(chatMessages.flatMap(msg => msg.projectId ? [msg.projectId] : []).filter(Boolean))].slice(0, 5).map(channel => (
                   <button
                     key={channel}
                     onClick={() => setSelectedChannel(channel)}
                     className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                       selectedChannel === channel
                         ? "border-2 border-gray-300 text-gray-800"
                         : "hover:bg-gray-50 text-gray-700"
                     }`}
                   >
                     # {channel}
                   </button>
                 ))}
               </div>
             </div>

                         {/* Chat Messages */}
             <div className="col-span-1 lg:col-span-3 border rounded-2xl">
               <div className="p-6 border-b border-gray-100">
                 <h3 className="text-xl font-semibold text-gray-900">Workspace Chat</h3>
                 <p className="text-sm text-gray-500 mt-1">Active now • {chatMessages.length} messages</p>
               </div>
               
               <div className="h-96 overflow-y-auto p-6 space-y-6">
                 {chatMessages.map(message => (
                     <div key={message.id} className="flex space-x-4">
                       <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-gray-100">
                       <AvatarImage src="/placeholder-user.jpg" />
                       <AvatarFallback className="text-sm">U</AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                         <div className="flex items-center space-x-3 mb-2">
                         <span className="font-semibold text-gray-900">You</span>
                         <span className="text-xs text-gray-400">{message.timestamp}</span>
                         </div>
                         <p className="text-gray-800 text-lg leading-relaxed">{message.content}</p>
                       </div>
                     </div>
                   ))}
               </div>

               <div className="p-6 border-t border-gray-100">
                 <div className="flex space-x-3">
                   <Input
                     placeholder="Type a message..."
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                     
                     className="text-lg py-3 px-4 rounded-xl"
                   />
                   <Button onClick={handleSendMessage} className="px-6 py-3 rounded-xl">
                     <Send className="h-5 w-5" />
                   </Button>
                 </div>
                 <p className="text-xs text-blue-600 mt-2 font-medium">
                   Messages are visible only to your workspace members and synced in real-time.
                 </p>
               </div>
             </div>
          </div>
                 </TabsContent>

                   

                   {/* Profiles Tab */}
         <TabsContent value="profiles" className="space-y-8">
           {/* My Profile Section */}
           <div className="p-8 border border-gray-200 rounded-3xl shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-3">
               <h3 className="text-3xl font-bold text-blue-900">My Profile</h3>
                 <Badge variant="outline" className="text-xs">
                   Account data
                 </Badge>
               </div>
                           <Button onClick={() => {
              initializeEditingProfile()
              setShowProfileDialog(true)
            }} variant="outline" size="lg" className="border-blue-300 text-blue-700 hover:bg-blue-100 px-6 py-3 rounded-xl">
                 <Edit className="h-5 w-5 mr-2" />
                 Edit Profile
               </Button>
             </div>
             <div className="flex items-start space-x-8">
               <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                 <AvatarImage src="/placeholder-user.jpg" />
                 <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">{myProfile.name[0]}</AvatarFallback>
               </Avatar>
               
               <div className="flex-1">
                 <div className="flex items-center space-x-4 mb-4">
                   <h4 className="text-3xl font-bold text-blue-900">{myProfile.name}</h4>
                   <Badge variant="default" className="px-4 py-2 text-lg">You</Badge>
                 </div>
                 
                 <p className="text-blue-800 text-lg leading-relaxed mb-6">{myProfile.bio}</p>
                 
                 <div className="flex flex-wrap gap-3 mb-6">
                   {myProfile.skills.map((skill: string) => (
                     <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm font-medium">
                       {skill}
                     </Badge>
                   ))}
                 </div>

                 <div className="flex space-x-4">
                   {myProfile.portfolio.github && (
                     <a
                       href={myProfile.portfolio.github}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center space-x-3 px-6 py-3 bg-white rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                     >
                       <GitBranch className="h-5 w-5" />
                       <span className="font-medium">GitHub</span>
                     </a>
                   )}
                   {myProfile.portfolio.linkedin && (
                     <a
                       href={myProfile.portfolio.linkedin}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center space-x-3 px-6 py-3 bg-white rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                     >
                       <Globe className="h-5 w-5" />
                       <span className="font-medium">LinkedIn</span>
                     </a>
                   )}
                   {myProfile.portfolio.website && (
                     <a
                       href={myProfile.portfolio.website}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center space-x-3 px-6 py-3 bg-white rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
                     >
                       <Globe className="h-5 w-5" />
                       <span className="font-medium">Website</span>
                     </a>
                   )}
                 </div>
               </div>
             </div>
           </div>

                     <div className="mb-6">
                       <div className="flex items-center justify-between mb-4">
                         <h3 className="text-xl font-semibold text-gray-900">Team Members</h3>
                                                <Badge variant="outline" className="text-xs">
                         Real-time members
                       </Badge>
                       </div>
                     </div>
                     <div className="grid gap-8">
             {teamMembers.map((member, index) => (
               <div key={member.id} className={`border rounded-2xl hover:shadow-lg transition-all duration-300 ${
                 index % 2 === 0 ? 'p-8' : 'p-7'
               }`}>
                 <div className="flex items-start space-x-6">
                   <Avatar className={`${index % 2 === 0 ? 'w-20 h-20' : 'w-18 h-18'} border-4 border-gray-100`}>
                     <AvatarImage src={member.avatar} />
                     <AvatarFallback className={`${index % 2 === 0 ? 'text-xl' : 'text-lg'} bg-gradient-to-br from-gray-600 to-gray-800 text-white`}>{member.name[0]}</AvatarFallback>
                   </Avatar>
                   
                   <div className="flex-1">
                     <div className="flex items-center space-x-4 mb-4">
                       <h3 className={`${index % 2 === 0 ? 'text-2xl' : 'text-xl'} font-bold text-gray-900`}>{member.name}</h3>
                       <Badge variant={member.role === "admin" ? "default" : "secondary"} className="px-3 py-1">
                         {member.role === "admin" ? "Admin" : "Member"}
                       </Badge>
                       {/* Removed member.currentRole as it does not exist on Member */}
                     </div>
                     
                     {/* Removed member.bio as it does not exist on Member */}
                     <p className="text-gray-600 text-lg leading-relaxed mb-6">No bio available</p>
                     <div className="grid grid-cols-3 gap-6 mb-6">
                       <div className="text-center p-4 border border-gray-200 rounded-xl">
                         <div className="text-3xl font-bold text-gray-600 mb-1">0</div>
                         <div className="text-sm text-gray-700 font-medium">Sources Shared</div>
                       </div>
                       <div className="text-center p-4 border border-gray-200 rounded-xl">
                         <div className="text-3xl font-bold text-gray-600 mb-1">0</div>
                         <div className="text-sm text-gray-700 font-medium">Tasks Completed</div>
                       </div>
                       <div className="text-center p-4 border border-gray-200 rounded-xl">
                         <div className="text-3xl font-bold text-gray-600 mb-1">0</div>
                         <div className="text-sm text-gray-700 font-medium">Messages Sent</div>
                       </div>
                     </div>

                     <div className="flex flex-wrap gap-3 mb-6">
                       {/* Skills not available in Member type - using empty state */}
                       <Badge variant="outline" className="px-3 py-1 text-sm">
                         No skills listed
                         </Badge>
                     </div>

                     <div className="flex space-x-4">
                       {/* Portfolio links not available in Member type */}
                       <Badge variant="outline" className="px-3 py-1 text-sm">
                         No portfolio links available
                       </Badge>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          {/* Team Management Header */}
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Workspace Management</h3>
                <p className="text-gray-600 mt-1">Manage workspace members, roles, and permissions</p>
              </div>
                             <Badge variant="outline" className="text-xs">
                 Real-time settings
               </Badge>
              <Button onClick={() => setShowAddMemberDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Total Members</span>
                </div>
                <div className="text-2xl font-bold text-gray-600 mt-2">{totalMembers}</div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Admins</span>
                </div>
                <div className="text-2xl font-bold text-gray-600 mt-2">{teamMembers.filter(m => m.role === 'admin').length}</div>
              </div>
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-600 mt-2">{activeMembers}</div>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Role Management</h3>
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">Current: {member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select defaultValue={member.role}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          {/* Progress section will be implemented when goals and tasks are added to the workspace context */}
          <div className="p-6 border rounded-lg">
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-500">Goals and tasks will be available when implemented in the workspace context.</p>
                  </div>
                    </div>
        </TabsContent>

        {/* Recent Tab */}
        <TabsContent value="recent" className="space-y-6">
                     <div className="p-6 border border-gray-200 rounded-lg">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h3 className="text-2xl font-bold text-gray-900">Recent Workspace Activity</h3>
                 <p className="text-gray-700 mt-1">Latest sources, messages, and workspace updates</p>
                      </div>
               <Badge variant="outline" className="text-xs">
                 Real-time activity
               </Badge>
          </div>

             {/* Real-Time Activity Feed */}
             <div className="space-y-3 mt-6">
               {recentActivity && recentActivity.length > 0 ? (
                 recentActivity.slice(0, 5).map((activity, index) => (
                   <div key={activity.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                     <div className="flex-shrink-0">
                       {activity.type === 'workspace' && <Globe className="h-5 w-5 text-blue-600" />}
                       {activity.type === 'project' && <FolderOpen className="h-5 w-5 text-purple-600" />}
                       {activity.type === 'source' && <FileText className="h-5 w-5 text-green-600" />}
                       {activity.type === 'chat' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                       {activity.type === 'team' && <Users className="h-5 w-5 text-indigo-600" />}
                       {activity.type === 'api' && <Code className="h-5 w-5 text-red-600" />}
                       {activity.type === 'progress' && <Target className="h-5 w-5 text-yellow-600" />}
                          </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm text-gray-900">{activity.description}</p>
                       <div className="flex items-center space-x-2 mt-1">
                         <span className="text-xs text-gray-500">{activity.user}</span>
                         <span className="text-xs text-gray-400">•</span>
                         <span className="text-xs text-gray-400">{activity.timestamp}</span>
                              </div>
                               </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-6 text-gray-500">
                   <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                   <p>No recent activity</p>
                            </div>
                          )}
                        </div>
           </div>

                     {/* Recent Projects */}
           <div className="p-6 border rounded-lg">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-semibold flex items-center">
               <FolderOpen className="h-5 w-5 mr-2 text-purple-600" />
                 Your Recent Projects
             </h3>
               <Badge variant="outline" className="text-xs">
                 Real-time data
               </Badge>
             </div>
             <div className="space-y-4">
               {projects.slice(0, 3).map(project => (
                 <div key={project.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                   <div className="flex-shrink-0">
                                            <Badge 
                         variant={
                           project.status === 'active' ? 'default' :
                           project.status === 'planning' ? 'secondary' :
                           project.status === 'completed' ? 'default' : 'outline'
                         }
                       >
                       {project.status}
                     </Badge>
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                     <p className="text-sm text-gray-500 truncate">{project.description}</p>
                     <div className="flex items-center space-x-2 mt-1">
                       <span className="text-xs text-gray-500">Progress: {project.progress}%</span>
                       <span className="text-xs text-gray-500">•</span>
                       <span className="text-xs text-gray-500">Due: {project.dueDate}</span>
                     </div>
                   </div>
                   <div className="text-right text-sm text-gray-500">
                     <div>You</div>
                     <div className="text-xs">{project.teamMembers.length} members</div>
                   </div>
                 </div>
               ))}
               {projects.length === 0 && (
                 <div className="text-center py-8 text-gray-500">
                   <FolderOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                   <p>No projects created yet</p>
                 </div>
               )}
             </div>
           </div>

           {/* Recent Sources */}
           <div className="p-6 border rounded-lg">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-semibold flex items-center">
               <FileText className="h-5 w-5 mr-2 text-blue-600" />
                 Your Recently Shared Sources
             </h3>
               <Badge variant="outline" className="text-xs">
                 Real-time sources
               </Badge>
             </div>
            <div className="space-y-4">
              {sources.slice(0, 3).map(source => (
                <div key={source.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <Badge variant="outline">
                      {source.type}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{source.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{source.description}</p>
                    {source.url && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Link className="h-3 w-3 text-blue-600" />
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 truncate"
                        >
                          {source.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{source.sharedAt}</div>
                  </div>
                </div>
              ))}
              {sources.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No sources shared yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="p-6 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Your Recent Messages
            </h3>
              <Badge variant="outline" className="text-xs">
                Real-time messages
              </Badge>
            </div>
            <div className="space-y-4">
              {chatMessages.slice(0, 3).map(message => (
                <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">You</span>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-900 text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {chatMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Source Dialog */}
      <Dialog open={showSourceDialog} onOpenChange={setShowSourceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center space-x-3">
            <DialogTitle>Share New Source</DialogTitle>
              <Badge variant="outline" className="text-xs">
                Real-time user data
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newSource.title}
                onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                placeholder="Enter source title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSource.description}
                onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                placeholder="Describe the source"
              />
            </div>
              <div>
                <Label htmlFor="type">Type</Label>
              <Select value={newSource.type} onValueChange={(value: "article" | "video" | "document" | "link" | "other") => setNewSource({ ...newSource, type: value })}>
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
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newSource.tags}
                onChange={(e) => setNewSource({ ...newSource, tags: e.target.value })}
                placeholder="React, JavaScript, Best Practices"
              />
            </div>

             <div>
               <Label htmlFor="url">URL (Optional)</Label>
               <Input
                 id="url"
                 type="url"
                 value={newSource.url}
                 onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                 placeholder="https://youtube.com, https://github.com, etc."
               />
               <p className="text-xs text-gray-500 mt-1">
                 URLs from YouTube, GitHub, Stack Overflow, Medium, MDN, and other platforms will be automatically detected and displayed with appropriate icons.
                 <br />
                 <span className="text-blue-600 font-medium">This source will be visible only to you and your workspace members.</span>
               </p>
             </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSourceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSource} className="bg-blue-600 hover:bg-blue-700">
                Share Source
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Real-Time User Isolation:</strong> This source will be created in your personal workspace and visible only to you and your workspace members. Data is automatically synced across your devices.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center space-x-3">
              <DialogTitle>Add New Workspace Member</DialogTitle>
              <Badge variant="outline" className="text-xs">
                Real-time workspace
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="member-name">Full Name</Label>
                <Input
                  id="member-name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="member-role">Role</Label>
                                 <Select value={newMember.role} onValueChange={(value: "admin" | "member" | "viewer") => setNewMember({ ...newMember, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="member-current-role">Current Role</Label>
                <Input
                  id="member-current-role"
                  value={newMember.currentRole}
                  onChange={(e) => setNewMember({ ...newMember, currentRole: e.target.value })}
                  placeholder="e.g., Senior Developer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="member-skills">Skills (comma separated)</Label>
              <Input
                id="member-skills"
                value={newMember.skills}
                onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            <div>
              <Label htmlFor="member-bio">Bio</Label>
              <Textarea
                id="member-bio"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                placeholder="Brief description about the team member"
                rows={3}
              />
              <p className="text-xs text-blue-600 mt-1 font-medium">
                This member will be added to your current workspace only.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember} className="bg-blue-600 hover:bg-blue-700">
                Add Member
              </Button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Real-Time Workspace Isolation:</strong> This member will be added to your current workspace only. Changes are automatically synced in real-time.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center space-x-3">
            <DialogTitle>Edit My Profile</DialogTitle>
              <Badge variant="outline" className="text-xs">
                Account data
              </Badge>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={editingProfile.email}
                  onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                  value={editingProfile.bio}
                  onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="profile-skills">Skills (comma separated)</Label>
              <Input
                id="profile-skills"
                  value={editingProfile.skills.join(", ")}
                  onChange={(e) => setEditingProfile({ ...editingProfile, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                placeholder="React, TypeScript, Node.js"
              />
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  Your profile information is synced to your account and visible only to you.
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="profile-github">GitHub URL</Label>
                <Input
                  id="profile-github"
                  value={editingProfile.portfolio.github}
                  onChange={(e) => setEditingProfile({ ...editingProfile, portfolio: { ...editingProfile.portfolio, github: e.target.value } })}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <Label htmlFor="profile-linkedin">LinkedIn URL</Label>
                <Input
                  id="profile-linkedin"
                  value={editingProfile.portfolio.linkedin}
                  onChange={(e) => setEditingProfile({ ...editingProfile, portfolio: { ...editingProfile.portfolio, linkedin: e.target.value } })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="profile-website">Website URL</Label>
                <Input
                  id="profile-website"
                  value={editingProfile.portfolio.website}
                  onChange={(e) => setEditingProfile({ ...editingProfile, portfolio: { ...editingProfile.portfolio, website: e.target.value } })}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile} className="bg-green-600 hover:bg-green-700">
                Update Profile
              </Button>
            </div>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>Account Data:</strong> Your profile information is synced to your account and visible only to you.
              </p>
            </div>
          </div>
                  </DialogContent>
        </Dialog>

        {/* Create Project Dialog */}
        <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center space-x-3">
              <DialogTitle>Create New Project</DialogTitle>
                <Badge variant="outline" className="text-xs">
                  Real-time user data
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-title">Project Title</Label>
                  <Input
                    id="project-title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="project-category">Category</Label>
                  <Select value={newProject.category} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="project-description">Description</Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe the project goals and scope"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="project-status">Status</Label>
                  <Select value={newProject.status} onValueChange={(value: "planning" | "active" | "on-hold" | "completed" | "cancelled") => setNewProject({ ...newProject, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project-priority">Priority</Label>
                  <Select value={newProject.priority} onValueChange={(value: "low" | "medium" | "high" | "urgent") => setNewProject({ ...newProject, priority: value })}>
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
                <div>
                  <Label htmlFor="project-budget">Budget (USD)</Label>
                  <Input
                    id="project-budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-start-date">Start Date</Label>
                  <Input
                    id="project-start-date"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="project-due-date">Due Date</Label>
                  <Input
                    id="project-due-date"
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="project-tags">Tags (comma separated)</Label>
                <Input
                  id="project-tags"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  placeholder="React, TypeScript, Node.js, etc."
                />
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  This project will be visible only to you and your workspace members. Data is automatically synced in real-time.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} className="bg-purple-600 hover:bg-purple-700">
                  Create Project
                </Button>
              </div>
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-800">
                  <strong>Real-Time User Isolation:</strong> This project will be created in your personal workspace and visible only to you and your workspace members. Data is automatically synced across your devices.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </>
    )
  }
