"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Users, 
  Plus
} from "lucide-react"

// Type definitions
interface Post {
  id: string
  author: string
    role: string
  content: string
  tags: string[]
  likes: number
  comments: number
  timestamp: string
  type: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  attendees: number
  location: string
  eventType: string
  maxAttendees?: number
  organizer: string
  duration: string
  difficulty: string
  prerequisites: string
}

// Simple mock data
const simplePosts = [
  {
    id: "1",
    author: "Sarah Chen",
    role: "Senior Developer",
    content: "Just deployed our new API key management system! The real-time threat detection is working perfectly.",
    tags: ["AI", "Security", "Python"],
    likes: 47,
    comments: 2,
    timestamp: "2 hours ago",
    type: "project"
  },
  {
    id: "2",
    author: "Mike Rodriguez",
      role: "DevOps Engineer",
    content: "What's your preferred way to handle API rate limiting in microservices? We're using Redis but curious about alternatives.",
    tags: ["Microservices", "Rate Limiting", "Redis"],
    likes: 23,
    comments: 1,
    timestamp: "4 hours ago",
    type: "question"
  },
  {
    id: "3",
    author: "Emily Johnson",
      role: "Frontend Developer",
    content: "Sharing a React hook I built for managing API keys in the browser with encryption. Check it out! 🔐",
    tags: ["React", "Security", "Hooks"],
    likes: 89,
    comments: 1,
    timestamp: "6 hours ago",
    type: "project"
  },
  {
    id: "4",
    author: "Alex Thompson",
      role: "Backend Developer",
    content: "Question: How do you handle database migrations in production? We're using Flyway but looking for best practices.",
    tags: ["Database", "Migrations", "Production", "Flyway"],
    likes: 34,
    comments: 3,
    timestamp: "8 hours ago",
    type: "question"
  },
  {
    id: "5",
    author: "Lisa Wang",
      role: "SRE Engineer",
    content: "Built a comprehensive monitoring dashboard for our API infrastructure using Grafana and Prometheus. Real-time alerts and performance metrics!",
    tags: ["Monitoring", "Grafana", "Prometheus", "API", "DevOps"],
    likes: 156,
    comments: 8,
    timestamp: "1 day ago",
    type: "project"
  },
  {
    id: "6",
    author: "David Kim",
    role: "Full Stack Developer",
    content: "What's the best approach for implementing real-time notifications in a Next.js app? Should I use WebSockets or Server-Sent Events?",
    tags: ["Next.js", "Real-time", "WebSockets", "SSE", "Frontend"],
    likes: 67,
    comments: 5,
    timestamp: "1 day ago",
    type: "question"
  },
  {
    id: "7",
    author: "Maria Garcia",
      role: "Frontend Lead",
    content: "Created a design system component library with Storybook. Includes 50+ reusable components with full TypeScript support and accessibility features.",
    tags: ["Design System", "Storybook", "TypeScript", "Accessibility", "UI/UX"],
    likes: 234,
    comments: 12,
    timestamp: "2 days ago",
    type: "project"
  },
  {
    id: "8",
    author: "Carlos Rodriguez",
      role: "DevOps Engineer",
    content: "Question: How do you manage secrets in Kubernetes? Currently using AWS Secrets Manager but considering HashiCorp Vault.",
    tags: ["Kubernetes", "Secrets", "AWS", "Vault", "DevOps"],
    likes: 45,
    comments: 4,
    timestamp: "2 days ago",
    type: "question"
  }
]

const simpleEvents = [
  {
    id: "1",
    title: "API Security Workshop",
    description: "Learn about advanced API security practices and threat detection. This comprehensive workshop will cover OAuth 2.0, JWT tokens, rate limiting, and security best practices for modern APIs.",
    date: "Tomorrow",
    attendees: 25,
    location: "Virtual",
    eventType: "workshop",
    maxAttendees: 50,
    organizer: "Sarah Chen",
    duration: "3 hours",
    difficulty: "Intermediate",
    prerequisites: "Basic understanding of APIs and web security"
  },
  {
    id: "2",
    title: "Code Review Session",
    description: "Community code review session for open source projects. Bring your code and get feedback from experienced developers. We'll cover best practices, common pitfalls, and code quality improvements.",
    date: "Friday",
    attendees: 15,
    location: "Community Hub",
    eventType: "meetup",
    maxAttendees: 30,
    organizer: "Mike Rodriguez",
    duration: "2 hours",
    difficulty: "All Levels",
    prerequisites: "None"
  },
  {
    id: "3",
    title: "React Performance Optimization",
    description: "Deep dive into React performance optimization techniques, code splitting, and bundle analysis. Learn how to identify and fix performance bottlenecks in your React applications.",
    date: "This Weekend",
    attendees: 45,
    location: "Virtual",
    eventType: "workshop",
    maxAttendees: 100,
    organizer: "Emily Johnson",
    duration: "4 hours",
    difficulty: "Advanced",
    prerequisites: "Strong React fundamentals"
  },
  {
    id: "4",
    title: "DevOps & Kubernetes Summit",
    description: "Comprehensive summit covering Kubernetes best practices, CI/CD pipelines, and cloud-native development. Network with DevOps professionals and learn from industry experts.",
    date: "Next Month",
    attendees: 120,
    location: "Convention Center",
    eventType: "conference",
    maxAttendees: 200,
    organizer: "DevOps Community",
    duration: "2 days",
    difficulty: "Intermediate to Advanced",
    prerequisites: "Basic DevOps knowledge"
  },
  {
    id: "5",
    title: "AI & Machine Learning Meetup",
    description: "Discussion on AI-powered development tools and automation. Share experiences and learn from others working with AI/ML in software development.",
    date: "Next Week",
    attendees: 35,
    location: "Tech Campus",
    eventType: "meetup",
    maxAttendees: 60,
    organizer: "AI Developers Group",
    duration: "3 hours",
    difficulty: "All Levels",
    prerequisites: "Interest in AI/ML"
  },
  {
    id: "6",
    title: "Frontend Architecture Summit",
    description: "Explore modern frontend architecture patterns, state management solutions, and performance optimization. Learn from leading frontend architects and engineers.",
    date: "Next Month",
    attendees: 80,
    location: "Virtual",
    eventType: "conference",
    maxAttendees: 150,
    organizer: "Frontend Masters",
    duration: "1 day",
    difficulty: "Intermediate to Advanced",
    prerequisites: "Frontend development experience"
  },
  {
    id: "7",
    title: "Data Engineering Workshop",
    description: "Hands-on workshop covering data pipelines, ETL processes, and real-time data processing with modern tools like Apache Kafka, Spark, and Airflow.",
    date: "Two Weeks",
    attendees: 40,
    location: "Data Lab",
    eventType: "workshop",
    maxAttendees: 50,
    organizer: "Data Engineering Team",
    duration: "6 hours",
    difficulty: "Intermediate",
    prerequisites: "Basic Python and SQL knowledge"
  }
]

export default function CommunityPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [showPostForm, setShowPostForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [posts, setPosts] = useState<Post[]>(simplePosts)
  const [events, setEvents] = useState<Event[]>(simpleEvents)
  const [newPost, setNewPost] = useState({ content: "", tags: "", type: "discussion" })
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    description: "", 
    date: "", 
    location: "",
    maxAttendees: "",
    eventType: "workshop",
    duration: "",
    difficulty: "All Levels",
    prerequisites: "",
    organizer: ""
  })
  
  // Filter posts based on selected filter and search query
  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === "all" || post.type === selectedFilter
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    
    return matchesFilter && matchesSearch && matchesTag
  })
  
  // Handle post creation
  const handleCreatePost = () => {
    if (!newPost.content.trim()) return

    const post = {
      id: Date.now().toString(),
      author: "Current User",
      role: "Developer",
      content: newPost.content,
      tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      type: newPost.type
    }
    
    setPosts([post, ...posts])
    setNewPost({ content: "", tags: "", type: "discussion" })
    setShowPostForm(false)
  }
  
  // Handle event creation
  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.description.trim()) return

    const event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date || "TBD",
      location: newEvent.location || "Virtual",
      attendees: 0,
      eventType: newEvent.eventType,
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : 0,
      duration: newEvent.duration || "TBD",
      difficulty: newEvent.difficulty,
      prerequisites: newEvent.prerequisites || "None",
      organizer: newEvent.organizer || "Community"
    }
    
    setEvents([event, ...events])
    setNewEvent({ title: "", description: "", date: "", location: "", maxAttendees: "", eventType: "workshop", duration: "", difficulty: "All Levels", prerequisites: "", organizer: "" })
    setShowEventForm(false)
  }
  
  // Handle post like
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }
  

  
  // Handle tag selection
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag)
  }
  
  // Handle viewing event details
  const handleViewEventDetails = (event: Event) => {
    setSelectedEvent(event)
  }
  
  // Handle closing event details
  const handleCloseEventDetails = () => {
    setSelectedEvent(null)
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Developer Community</h1>
              <p className="text-slate-500 mt-2 text-lg">Connect, share, and learn with fellow developers</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                onClick={() => setShowPostForm(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                New Post
              </Button>
              <Button 
                variant="outline"
                className="border-slate-200 hover:bg-slate-50 shadow-lg shadow-slate-500/10"
                onClick={() => setShowEventForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>
          
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-slate-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome to the Community! 💬</h2>
                <p className="text-slate-600 text-lg">Share knowledge, ask questions, and grow together</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              placeholder="Search posts, authors, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/20 shadow-lg shadow-slate-500/10 rounded-xl"
            />
            <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-2 shadow-xl shadow-slate-500/10 mb-8">
          <Tabs defaultValue="feed" className="">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-2">
              <TabsTrigger 
                value="feed" 
                className="relative bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-xl py-3 px-6 font-medium transition-all duration-300"
              >
                💬 Community Feed
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="relative bg-transparent data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 rounded-xl py-3 px-6 font-medium transition-all duration-300"
              >
                📅 Events
              </TabsTrigger>
            </TabsList>

        <TabsContent value="feed" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Modern Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl" />
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">Topics & Filters</h3>
                <div className="space-y-3">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-300 ${
                      selectedFilter === "all" 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                    onClick={() => setSelectedFilter("all")}
                  >
                   All Posts
                  </Button>
                  <Button
                    variant={selectedFilter === "questions" ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-300 ${
                      selectedFilter === "questions" 
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                    onClick={() => setSelectedFilter("questions")}
                  >
                   Questions
                  </Button>
                  <Button
                    variant={selectedFilter === "projects" ? "default" : "ghost"}
                    className={`w-full justify-start transition-all duration-300 ${
                      selectedFilter === "projects" 
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                    onClick={() => setSelectedFilter("projects")}
                  >
                  Projects
                  </Button>
              </div>
              
                               <div className="pt-6 border-t border-slate-200">
                   <div className="flex items-center justify-between mb-4">
                     <h4 className="font-semibold text-slate-900">Popular Tags</h4>
                     {selectedTag && (
                  <Button
                         variant="ghost" 
                         size="sm" 
                         onClick={() => setSelectedTag("")}
                         className="text-xs text-slate-500 hover:text-slate-700"
                       >
                         Clear Filter
                  </Button>
                     )}
                </div>
                                     <div className="flex flex-wrap gap-2">
                     {["JavaScript", "Python", "AI", "Cloud", "DevOps", "Security", "React"].map((tag) => (
                       <Badge 
                         key={tag} 
                         variant={selectedTag === tag ? "default" : "secondary"} 
                         className={`cursor-pointer transition-all duration-300 ${
                           selectedTag === tag 
                             ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25" 
                             : "bg-slate-100 text-slate-600 hover:bg-gradient-to-r hover:from-slate-200 hover:to-slate-300"
                         }`}
                         onClick={() => handleTagClick(tag)}
                       >
                         {tag}
                       </Badge>
                     ))}
                   </div>
                   {selectedTag && (
                     <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                       <span className="text-sm text-orange-700 font-medium">Filtering by: {selectedTag}</span>
                     </div>
                   )}
              </div>
              </div>
            </div>
          </div>

          {/* Center - Simple Feed */}
        <div className="lg:col-span-2">
            {/* Post Creation Form */}
            {showPostForm && (
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-2xl" />
                <div className="relative">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">Create New Post</h3>
                  <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Post Type</label>
                        <select
                          value={newPost.type}
                          onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                          className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        >
                          <option value="discussion">Discussion</option>
                          <option value="question">Question</option>
                          <option value="project">Project</option>
                        </select>
                      </div>
                        <Textarea
                          placeholder="What's on your mind? Share your thoughts..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          rows={4}
                          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        />
                      <Input
                        placeholder="Tags (comma separated): React, TypeScript, Next.js"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                        className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      />
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleCreatePost} 
                          disabled={!newPost.content.trim()}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25"
                        >
                          Create Post
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowPostForm(false)}
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                    </div>
                  </div>
                </div>
            </div>
          )}

          <div className="space-y-6">
              {/* Results Counter */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg shadow-slate-500/10">
                <p className="text-sm font-medium text-slate-600">
                  Showing <span className="font-bold text-slate-900">{filteredPosts.length}</span> of <span className="font-bold text-slate-900">{posts.length}</span> posts
                  {selectedFilter !== "all" && <span className="ml-1 text-blue-600 font-semibold">({selectedFilter})</span>}
                  {searchQuery && <span className="ml-1 text-purple-600 font-semibold">matching &quot;{searchQuery}&quot;</span>}
                  {selectedTag && <span className="ml-1 text-orange-600 font-semibold">tagged with &quot;{selectedTag}&quot;</span>}
                </p>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No posts found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 to-slate-100/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative space-y-4">
                  {/* Post Header */}
                      <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 ring-2 ring-white/50 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                            {post.author.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-slate-900 text-lg">{post.author}</span>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300">
                              {post.role}
                        </Badge>
                            <Badge variant="outline" className={`text-xs capitalize border-2 ${
                              post.type === 'project' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                              post.type === 'question' ? 'border-green-200 text-green-700 bg-green-50' :
                              'border-blue-200 text-blue-700 bg-blue-50'
                            }`}>
                              {post.type}
                          </Badge>
                      </div>
                          <span className="text-sm text-slate-500 font-medium">{post.timestamp}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                        <p className="text-slate-800 text-lg leading-relaxed">{post.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-600 hover:from-blue-50 hover:to-blue-100 hover:border-blue-200 hover:text-blue-700 transition-all duration-300 cursor-pointer">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Post Actions */}
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group/btn"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                        <span className="font-semibold">{post.likes}</span>
                      </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 group/btn">
                         <MessageSquare className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                          <span className="font-semibold">{post.comments}</span>
                       </Button>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                          className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 group/btn"
                          onClick={() => {
                            navigator.share ? navigator.share({
                              title: `Post by ${post.author}`,
                              text: post.content.substring(0, 100) + '...',
                              url: window.location.href
                            }) : navigator.clipboard.writeText(post.content)
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                          Share
                                   </Button>
                                 </div>
                               </div>
                             </div>
                ))
              )}
           </div>
         </div>

          {/* Right Sidebar - Modern Widgets */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 rounded-2xl" />
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">Top Contributors 🏆</h3>
              <div className="space-y-4">
                  {["Sarah Chen", "Mike Rodriguez", "Emily Johnson", "Alex Thompson"].map((name, index) => (
                    <div key={name} className="flex items-center gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 transition-all duration-300">
                    <Avatar className="w-10 h-10 ring-2 ring-white/50 shadow-lg">
                      <AvatarFallback className={`text-white font-bold text-sm ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                          {name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-semibold text-slate-900">{name}</div>
                        <div className="text-xs text-slate-500">Developer</div>
                    </div>
                    {index < 3 && (
                      <div className="text-2xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              </div>
            </div>

              {/* Quick Stats */}
            <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl" />
              <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">Community Stats 📊</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <span className="text-sm font-medium text-green-700">Total Members</span>
                    <span className="font-bold text-green-900 text-lg">1,247</span>
                     </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">Active Today</span>
                    <span className="font-bold text-blue-900 text-lg">89</span>
                     </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
                    <span className="text-sm font-medium text-purple-700">Posts This Week</span>
                    <span className="font-bold text-purple-900 text-lg">156</span>
                   </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
                     {/* Event Creation Form */}
           {showEventForm && (
             <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 mb-8">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 to-pink-50/30 rounded-2xl" />
               <div className="relative">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-6">Create New Event</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Event Title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <Input
                      placeholder="Location (or 'Virtual')"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                    <Input
                      placeholder="Duration (e.g., 2 hours, 1 day)"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Event Type</label>
                    <select
                        value={newEvent.eventType}
                        onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="meetup">Meetup</option>
                      <option value="conference">Conference</option>
                        <option value="hackathon">Hackathon</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  </div>
                    <Input
                      placeholder="Max Attendees (optional)"
                      type="number"
                      value={newEvent.maxAttendees}
                      onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                      <select
                        value={newEvent.difficulty}
                        onChange={(e) => setNewEvent({ ...newEvent, difficulty: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                  </div>
                    <Input
                      placeholder="Organizer Name"
                      value={newEvent.organizer}
                      onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Prerequisites</label>
                    <Input
                      placeholder="What should participants know beforehand? (optional)"
                      value={newEvent.prerequisites}
                      onChange={(e) => setNewEvent({ ...newEvent, prerequisites: e.target.value })}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>
                  <Textarea
                   placeholder="Describe your event in detail..."
                   value={newEvent.description}
                   onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                   rows={3}
                   className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                 />
                 <div className="flex gap-3">
                   <Button 
                     onClick={handleCreateEvent} 
                     disabled={!newEvent.title.trim() || !newEvent.description.trim()}
                     className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25"
                   >
                    Create Event
                  </Button>
                   <Button 
                     variant="outline" 
                     onClick={() => setShowEventForm(false)}
                     className="border-slate-200 hover:bg-slate-50"
                   >
                    Cancel
                  </Button>
                </div>
              </div>
              </div>
            </div>
          )}

          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 rounded-2xl" />
            <div className="relative">
             <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-8">Upcoming Events 🎆</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                 <div key={event.id} className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300">
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-slate-100/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <div className="relative space-y-4">
                     {/* Event Header */}
                     <div className="space-y-3">
                                               <div className="flex items-center justify-between">
                          <div className={`text-sm font-bold px-4 py-2 rounded-full shadow-lg ${
                            event.eventType === 'workshop' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25' :
                            event.eventType === 'meetup' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25' :
                            event.eventType === 'conference' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/25' :
                            event.eventType === 'hackathon' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/25' :
                            'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-500/25'
                          }`}>
                            {event.date}
                        </div>
                          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-slate-200">
                            <Users className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">{event.attendees}</span>
                            {event.maxAttendees && <span className="text-sm text-slate-500">/ {event.maxAttendees}</span>}
                          </div>
                        </div>
                       <div className="flex items-center gap-3">
                         <h3 className="text-xl font-bold text-slate-900 leading-tight">{event.title}</h3>
                         <Badge variant="outline" className={`text-xs capitalize border-2 ${
                           event.eventType === 'workshop' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                           event.eventType === 'meetup' ? 'border-green-200 text-green-700 bg-green-50' :
                           event.eventType === 'conference' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                           event.eventType === 'hackathon' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                           'border-pink-200 text-pink-700 bg-pink-50'
                         }`}>
                           {event.eventType || 'workshop'}
                         </Badge>
                       </div>
                      </div>
                      
                     {/* Event Description */}
                     <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{event.description}</p>
                     
                                           {/* Event Details */}
                      <div className="space-y-3 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg shadow-green-500/25"></div>
                          <span className="font-medium text-slate-700">Open for registration</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/25"></div>
                          <span className="text-slate-600">Location: <span className="font-medium text-slate-800">{event.location || 'Virtual'}</span></span>
                        </div>
                        {event.duration && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/25"></div>
                            <span className="text-slate-600">Duration: <span className="font-medium text-slate-800">{event.duration}</span></span>
                          </div>
                        )}
                        {event.difficulty && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/25"></div>
                            <span className="text-slate-600">Level: <span className="font-medium text-slate-800">{event.difficulty}</span></span>
                       </div>
                        )}
                        {event.organizer && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-500/25"></div>
                            <span className="text-slate-600">Organizer: <span className="font-medium text-slate-800">{event.organizer}</span></span>
                         </div>
                        )}
                        {event.maxAttendees && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/25"></div>
                            <span className="text-slate-600">Capacity: <span className="font-medium text-slate-800">{event.maxAttendees} attendees</span></span>
                       </div>
                        )}
                        {event.prerequisites && event.prerequisites !== "None" && (
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/25"></div>
                            <span className="text-slate-600">Prerequisites: <span className="font-medium text-slate-800">{event.prerequisites}</span></span>
                        </div>
                      )}
                      </div>
                      
                                           {/* Event Actions */}
                      <div className="flex gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg shadow-blue-500/25"
                          onClick={() => handleViewEventDetails(event)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Event Details Modal */}
        {selectedEvent && selectedEvent !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-lg border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-500/25">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <Badge variant="outline" className={`capitalize border-2 px-3 py-1 ${
                        selectedEvent.eventType === 'workshop' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                        selectedEvent.eventType === 'meetup' ? 'border-green-200 text-green-700 bg-green-50' :
                        selectedEvent.eventType === 'conference' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                        selectedEvent.eventType === 'hackathon' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                        'border-pink-200 text-pink-700 bg-pink-50'
                      }`}>
                        {selectedEvent.eventType}
                      </Badge>
                      <span className="text-lg text-slate-500 font-medium">• {selectedEvent.date}</span>
                    </div>
                  </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                    onClick={handleCloseEventDetails}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>
              </div>
                
                {/* Event Image/Icon */}
                <div className="mb-8">
                  <div className={`w-full h-48 rounded-2xl flex items-center justify-center shadow-xl ${
                    selectedEvent.eventType === 'workshop' ? 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-500/25' :
                    selectedEvent.eventType === 'meetup' ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-green-500/25' :
                    selectedEvent.eventType === 'conference' ? 'bg-gradient-to-br from-purple-100 to-purple-200 shadow-purple-500/25' :
                    selectedEvent.eventType === 'hackathon' ? 'bg-gradient-to-br from-orange-100 to-orange-200 shadow-orange-500/25' :
                    'bg-gradient-to-br from-pink-100 to-pink-200 shadow-pink-500/25'
                  }`}>
                    <div className="text-6xl">
                      {selectedEvent.eventType === 'workshop' && '🔧'}
                      {selectedEvent.eventType === 'meetup' && '👥'}
                      {selectedEvent.eventType === 'conference' && '🎤'}
                      {selectedEvent.eventType === 'hackathon' && '💻'}
                      {selectedEvent.eventType === 'webinar' && '📺'}
            </div>
                </div>
              </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About This Event</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">{selectedEvent.description}</p>
                </div>
                
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <span className="text-white text-xl">📅</span>
                </div>
              <div>
                        <p className="text-sm font-medium text-slate-500">Date</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedEvent.date}</p>
                </div>
              </div>
              
                <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                        <span className="text-white text-xl">⏱️</span>
                      </div>
                  <div>
                        <p className="text-sm font-medium text-slate-500">Duration</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedEvent.duration}</p>
                </div>
              </div>
              
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <span className="text-white text-xl">🎯</span>
                      </div>
              <div>
                        <p className="text-sm font-medium text-slate-500">Difficulty Level</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedEvent.difficulty}</p>
                    </div>
                </div>
              </div>
              
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <span className="text-white text-xl">📍</span>
              </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Location</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedEvent.location}</p>
            </div>
          </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <span className="text-white text-xl">👥</span>
                      </div>
            <div>
                        <p className="text-sm font-medium text-slate-500">Attendees</p>
                        <p className="font-bold text-slate-900 text-lg">
                          {selectedEvent.attendees}
                          {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`}
                        </p>
                      </div>
                      </div>
                      
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <span className="text-white text-xl">👤</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Organizer</p>
                        <p className="font-bold text-slate-900 text-lg">{selectedEvent.organizer}</p>
                    </div>
                  </div>
              </div>
            </div>
                
                {/* Prerequisites */}
                {selectedEvent.prerequisites && selectedEvent.prerequisites !== "None" && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Prerequisites</h3>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6">
                      <p className="text-yellow-800 font-medium">{selectedEvent.prerequisites}</p>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 py-3"
                    onClick={handleCloseEventDetails}
                  >
                    Register Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-slate-200 hover:bg-slate-50 py-3 px-6"
                    onClick={handleCloseEventDetails}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
        </div>
        )}
    </div>
  )
}
