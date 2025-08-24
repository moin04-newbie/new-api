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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Community</h1>
            <p className="text-gray-600 mt-1">Connect, share, and learn with fellow developers</p>
          </div>
                     <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              onClick={() => setShowPostForm(true)}
             >
               <MessageSquare className="h-4 w-4 mr-2" />
               New Post
             </Button>
             <Button 
               variant="outline"
              onClick={() => setShowEventForm(true)}
             >
               <Plus className="h-4 w-4 mr-2" />
               Create Event
               </Button>
             </div>
           </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Input
            placeholder="Search posts, authors, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="feed" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">💬 Community Feed</TabsTrigger>
          <TabsTrigger value="events">📅 Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Simple Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Topics & Filters</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("all")}
                  >
                   All Posts
                  </Button>
                  <Button
                    variant={selectedFilter === "questions" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("questions")}
                  >
                   Questions
                  </Button>
                  <Button
                    variant={selectedFilter === "projects" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedFilter("projects")}
                  >
                  Projects
                  </Button>
              </div>
              
                               <div className="pt-4 border-t">
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="font-medium">Popular Tags</h4>
                     {selectedTag && (
                  <Button
                         variant="ghost" 
                         size="sm" 
                         onClick={() => setSelectedTag("")}
                         className="text-xs"
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
                         className="cursor-pointer hover:bg-blue-100"
                         onClick={() => handleTagClick(tag)}
                       >
                         {tag}
                       </Badge>
                     ))}
                   </div>
                   {selectedTag && (
                     <div className="mt-2 text-sm text-blue-600">
                       Filtering by: <span className="font-medium">{selectedTag}</span>
                     </div>
                   )}
              </div>
            </div>
          </div>

          {/* Center - Simple Feed */}
        <div className="lg:col-span-2">
            {/* Post Creation Form */}
            {showPostForm && (
              <div className="bg-white p-6 border rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Post Type</label>
                    <select
                      value={newPost.type}
                      onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    />
                  <Input
                    placeholder="Tags (comma separated): React, TypeScript, Next.js"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <Button onClick={handleCreatePost} disabled={!newPost.content.trim()}>
                      Create Post
                    </Button>
                    <Button variant="outline" onClick={() => setShowPostForm(false)}>
                      Cancel
                    </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
              {/* Results Counter */}
              <div className="text-sm text-gray-600 mb-4">
                Showing {filteredPosts.length} of {posts.length} posts
                {selectedFilter !== "all" && ` (${selectedFilter})`}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedTag && ` tagged with "${selectedTag}"`}
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No posts found</p>
                  <p className="text-sm">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white p-6 border rounded-lg shadow-sm">
                <div className="space-y-4">
                  {/* Post Header */}
                      <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                            {post.author.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">{post.author}</span>
                        <Badge variant="secondary" className="text-xs">
                              {post.role}
                        </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {post.type}
                          </Badge>
                      </div>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                        <p className="text-gray-900">{post.content}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Post Actions */}
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                          className="text-gray-600 hover:text-blue-600"
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {post.likes}
                      </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                         <MessageSquare className="h-4 w-4 mr-2" />
                          {post.comments}
                       </Button>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                          className="text-gray-600 hover:text-purple-600"
                          onClick={() => {
                            navigator.share ? navigator.share({
                              title: `Post by ${post.author}`,
                              text: post.content.substring(0, 100) + '...',
                              url: window.location.href
                            }) : navigator.clipboard.writeText(post.content)
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                                   </Button>
                                 </div>
                               </div>
                             </div>
                ))
              )}
           </div>
         </div>

          {/* Right Sidebar - Simple Widgets */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Top Contributors */}
            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-3">
                  {["Sarah Chen", "Mike Rodriguez", "Emily Johnson", "Alex Thompson"].map((name, index) => (
                    <div key={name} className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-medium text-sm">{name}</div>
                        <div className="text-xs text-gray-500">Developer</div>
                    </div>
                    {index < 3 && (
                      <div className="text-yellow-500">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

              {/* Quick Stats */}
            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Community Stats</h3>
              <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Members</span>
                    <span className="font-medium">1,247</span>
                     </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Today</span>
                    <span className="font-medium">89</span>
                     </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Posts This Week</span>
                    <span className="font-medium">156</span>
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
             <div className="bg-white p-6 border rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Event Title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    />
                    <Input
                      placeholder="Location (or 'Virtual')"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                    <Input
                      placeholder="Duration (e.g., 2 hours, 1 day)"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    />
                  </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium mb-2">Event Type</label>
                    <select
                        value={newEvent.eventType}
                        onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                      <select
                        value={newEvent.difficulty}
                        onChange={(e) => setNewEvent({ ...newEvent, difficulty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prerequisites</label>
                    <Input
                      placeholder="What should participants know beforehand? (optional)"
                      value={newEvent.prerequisites}
                      onChange={(e) => setNewEvent({ ...newEvent, prerequisites: e.target.value })}
                    />
                  </div>
                  <Textarea
                   placeholder="Describe your event in detail..."
                   value={newEvent.description}
                   onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                   rows={3}
                 />
                 <div className="flex gap-3">
                   <Button onClick={handleCreateEvent} disabled={!newEvent.title.trim() || !newEvent.description.trim()}>
                    Create Event
                  </Button>
                   <Button variant="outline" onClick={() => setShowEventForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 border rounded-lg shadow-sm">
             <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                 <div key={event.id} className="border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                   <div className="space-y-4">
                     {/* Event Header */}
                     <div className="space-y-2">
                                               <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {event.date}
                        </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees}</span>
                            {event.maxAttendees && <span>/ {event.maxAttendees}</span>}
                          </div>
                        </div>
                       <div className="flex items-center gap-2">
                         <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                         <Badge variant="outline" className="text-xs capitalize">
                           {event.eventType || 'workshop'}
                         </Badge>
                       </div>
                      </div>
                      
                     {/* Event Description */}
                     <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                     
                                           {/* Event Details */}
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Open for registration</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Location: {event.location || 'Virtual'}</span>
                        </div>
                        {event.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Duration: {event.duration}</span>
                          </div>
                        )}
                        {event.difficulty && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Level: {event.difficulty}</span>
                       </div>
                        )}
                        {event.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Organizer: {event.organizer}</span>
                         </div>
                        )}
                        {event.maxAttendees && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            <span>Capacity: {event.maxAttendees} attendees</span>
                       </div>
                        )}
                        {event.prerequisites && event.prerequisites !== "None" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span>Prerequisites: {event.prerequisites}</span>
                        </div>
                      )}
                      </div>
                      
                                           {/* Event Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
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
          </TabsContent>
        </Tabs>

      {/* Event Details Modal */}
        {selectedEvent && selectedEvent !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedEvent.eventType}
                      </Badge>
                      <span className="text-sm text-gray-500">• {selectedEvent.date}</span>
                    </div>
                  </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                    onClick={handleCloseEventDetails}
                    className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
              </div>
                
                {/* Event Image/Icon */}
                <div className="mb-6">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
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
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>
                
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📅</span>
                </div>
              <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{selectedEvent.date}</p>
                </div>
              </div>
              
                <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">⏱️</span>
                      </div>
                  <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">{selectedEvent.duration}</p>
                </div>
              </div>
              
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-lg">🎯</span>
                      </div>
              <div>
                        <p className="text-sm text-gray-500">Difficulty Level</p>
                        <p className="font-medium">{selectedEvent.difficulty}</p>
                    </div>
                </div>
              </div>
              
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-lg">📍</span>
              </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{selectedEvent.location}</p>
            </div>
          </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="text-pink-600 text-lg">👥</span>
                      </div>
            <div>
                        <p className="text-sm text-gray-500">Attendees</p>
                        <p className="font-medium">
                          {selectedEvent.attendees}
                          {selectedEvent.maxAttendees && ` / ${selectedEvent.maxAttendees}`}
                        </p>
                      </div>
                      </div>
                      
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Organizer</p>
                        <p className="font-medium">{selectedEvent.organizer}</p>
                    </div>
                  </div>
              </div>
            </div>
                
                {/* Prerequisites */}
                {selectedEvent.prerequisites && selectedEvent.prerequisites !== "None" && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Prerequisites</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">{selectedEvent.prerequisites}</p>
          </div>
        </div>
      )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // Handle registration logic here
                      alert(`Registration for "${selectedEvent.title}" would be processed here!`)
                    }}
                  >
                    Register for Event
                </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
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
