"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { auth } from './firebase'
import { 
  createOrUpdateUserProfile, 
  getUserProfile, 
  getUserWorkspaces, 
  isNewUser, 
  initializeNewUser,
  type UserProfile,
  type UserWorkspace 
} from './user-service'

// Member Types
export interface Member {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  joinedAt?: string
  lastActive?: string
  projects?: string[]
  ownerId?: string
}

// API Key Types
export interface ApiKey {
  id: string
  name: string
  description?: string
  key: string
  project?: string
  projectId?: string
  userId: string // Required field for user isolation
  workspaceId: string // Required field for workspace isolation
  status: 'active' | 'inactive' | 'expired' | 'revoked'
  createdAt: string
  lastUsed?: string
  expiresAt?: string
  requests?: number
  environment?: string
  serviceName?: string
  website?: string
  docsUrl?: string
  monthlyLimit?: number
  monthlyCost?: number
  tags?: string[]
}

// Project Types
export interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number // 0-100
  startDate: string
  dueDate: string
  budget: number
  spentBudget: number
  teamMembers: string[] // Member IDs
  tags: string[]
  milestones: Milestone[]
  tasks: Task[]
  createdAt: string
  updatedAt: string
  createdBy: string
  workspaceId: string // Required field for workspace isolation
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  progress: number
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
}

// Workspace Types
export interface Workspace {
  id: string
  name: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  createdBy: string
  members: WorkspaceMember[]
  settings: WorkspaceSettings
}

export interface WorkspaceMember {
  userId: string
  role: 'admin' | 'member' | 'viewer'
  joinedAt: string
  permissions: string[]
}

export interface WorkspaceSettings {
  allowGuestAccess: boolean
  defaultProjectVisibility: 'public' | 'private'
  requireApprovalForProjects: boolean
}

// Source Types
export interface Source {
  id: string
  title: string
  description: string
  url: string
  type: 'article' | 'video' | 'document' | 'link' | 'other'
  tags: string[]
  sharedBy: string
  sharedAt: string
  projectId?: string
  workspaceId: string // Required field for workspace isolation
}

// Chat Message Types
export interface ChatMessage {
  id: string
  content: string
  senderId: string
  timestamp: string
  projectId?: string
  replyTo?: string
  workspaceId: string // Required field for workspace isolation
}

// Progress Types
export interface ProgressGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  dueDate: string
  projectId?: string
  userId: string // Required field for user isolation
  workspaceId: string // Required field for workspace isolation
}

// Workspace Context Types
interface WorkspaceContextType {
  // Current Workspace
  currentWorkspace: Workspace | null
  setCurrentWorkspace: (workspace: Workspace | null) => void
  
  // Current User
  currentUserId: string | null
  userProfile: UserProfile | null
  
  // Workspaces Management
  workspaces: Workspace[]
  userWorkspaces: Workspace[]
  createWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>
  switchWorkspace: (workspaceId: string) => Promise<void>
  
  // Team Members (scoped to current workspace)
  teamMembers: Member[]
  totalMembers: number
  activeMembers: number
  pendingInvites: number
  refreshTeamMembers: () => Promise<void>
  addTeamMember: (member: Omit<Member, 'id'>) => Promise<void>
  updateTeamMember: (id: string, updates: Partial<Member>) => Promise<void>
  removeTeamMember: (id: string) => Promise<void>
  
  // API Keys (scoped to current workspace)
  apiKeys: ApiKey[]
  totalApiKeys: number
  activeApiKeys: number
  refreshApiKeys: () => Promise<void>
  addApiKey: (apiKey: Omit<ApiKey, 'id' | 'createdAt'>) => Promise<void>
  updateApiKey: (id: string, updates: Partial<ApiKey>) => Promise<void>
  deleteApiKey: (id: string) => Promise<void>
  
  // Projects (scoped to current workspace)
  projects: Project[]
  totalProjects: number
  activeProjects: number
  completedProjects: number
  refreshProjects: () => Promise<void>
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  addProjectActivity: (projectId: string, activity: Omit<WorkspaceContextType['recentActivity'][0], 'id' | 'timestamp'>) => void
  
  // Sources (scoped to current workspace)
  sources: Source[]
  refreshSources: () => Promise<void>
  addSource: (source: Omit<Source, 'id' | 'sharedAt'>) => Promise<void>
  updateSource: (id: string, updates: Partial<Source>) => Promise<void>
  deleteSource: (id: string) => Promise<void>
  
  // Team Chat (scoped to current workspace)
  chatMessages: ChatMessage[]
  refreshChatMessages: () => Promise<void>
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>
  
  // Progress Tracking (scoped to current workspace)
  progressGoals: ProgressGoal[]
  refreshProgressGoals: () => Promise<void>
  addProgressGoal: (goal: Omit<ProgressGoal, 'id'>) => Promise<void>
  updateProgressGoal: (id: string, updates: Partial<ProgressGoal>) => Promise<void>
  deleteProgressGoal: (id: string) => Promise<void>
  
        // Workspace Stats
      workspaceStats: {
        totalProjects: number
        activeCollaborations: number
        recentActivity: number
        securityScore: number
        projectProgress: number
        totalBudget: number
        spentBudget: number
      }
  
  // Recent Activity
  recentActivity: Array<{
    id: string
    type: 'team' | 'api' | 'workspace' | 'project' | 'source' | 'chat' | 'progress'
    action: string
    description: string
    timestamp: string
    user: string
    projectId?: string
  }>
  
  // Add activity
  addActivity: (activity: Omit<WorkspaceContextType['recentActivity'][0], 'id' | 'timestamp'>) => void
  
  // User Permissions
  userRole: 'admin' | 'member' | 'viewer' | null
  hasPermission: (permission: string) => boolean
  
  // Loading State
  isInitializing: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [progressGoals, setProgressGoals] = useState<ProgressGoal[]>([])
  const [recentActivity, setRecentActivity] = useState<WorkspaceContextType['recentActivity']>([])

  // Get current user ID from Firebase auth - this will update when auth state changes
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Define functions first
  const addActivity = useCallback((activity: Omit<WorkspaceContextType['recentActivity'][0], 'id' | 'timestamp'>) => {
    const newActivity = {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toLocaleString()
    }
    
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]) // Keep only last 10 activities
  }, [])

  // Workspace Management Functions
  const createWorkspace = useCallback(async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkspace: Workspace = {
      ...workspace,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setWorkspaces(prev => [...prev, newWorkspace])
    
    // Add current user as admin, only if currentUserId is not null
    if (currentUserId) {
      newWorkspace.members.push({
        userId: currentUserId,
        role: 'admin',
        joinedAt: new Date().toISOString(),
        permissions: ['*'] // All permissions for admin
      })
    }
    
    addActivity({
      type: 'workspace',
      action: 'created',
      description: `Workspace "${newWorkspace.name}" created`,
      user: 'System'
    })
  }, [addActivity, currentUserId])

  const updateWorkspace = useCallback(async (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(workspace => 
      workspace.id === id 
        ? { ...workspace, ...updates, updatedAt: new Date().toISOString() }
        : workspace
    ))
    
    addActivity({
      type: 'workspace',
      action: 'updated',
      description: `Workspace updated`,
      user: 'System'
    })
  }, [addActivity])

  const deleteWorkspace = useCallback(async (id: string) => {
    const workspace = workspaces.find(w => w.id === id)
    setWorkspaces(prev => prev.filter(w => w.id !== id))
    
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(null)
    }
    
    if (workspace) {
      addActivity({
        type: 'workspace',
        action: 'deleted',
        description: `Workspace "${workspace.name}" deleted`,
        user: 'System'
      })
    }
  }, [addActivity, workspaces, currentWorkspace])

  const switchWorkspace = useCallback(async (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId)
    if (workspace) {
      setCurrentWorkspace(workspace)
      
      // Clear current workspace data
      setTeamMembers([])
      setApiKeys([])
      setProjects([])
      setSources([])
      setChatMessages([])
      setProgressGoals([])
      setRecentActivity([])
      
      // Load new workspace data
      await Promise.all([
        refreshTeamMembers(),
        refreshApiKeys(),
        refreshProjects(),
        refreshSources(),
        refreshChatMessages(),
        refreshProgressGoals()
      ])
      
      addActivity({
        type: 'workspace',
        action: 'switched',
        description: `Switched to workspace "${workspace.name}"`,
        user: 'System'
      })
    }
  }, [workspaces, addActivity])

  // Team Members Functions
  const refreshTeamMembers = useCallback(async () => {
    console.log('refreshTeamMembers called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) {
      console.log('Skipping team members refresh - no workspace or user ID')
      return
    }
    
    try {
      // Fetch team members from Firestore for current workspace
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const membersRef = collection(db, 'teamMembers')
      const q = query(
        membersRef,
        where('workspaceId', '==', currentWorkspace.id)
      )
      
      const snapshot = await getDocs(q)
      const fetchedMembers: Member[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Member[]
      
      console.log('Setting team members from Firestore:', fetchedMembers)
      setTeamMembers(fetchedMembers)
      
      addActivity({
        type: 'team',
        action: 'refresh',
        description: 'Team members refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch team members:', error)
      // Fallback to empty array if Firestore fails
      setTeamMembers([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const addTeamMember = useCallback(async (member: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...member,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setTeamMembers(prev => [...prev, newMember])
    
    addActivity({
      type: 'team',
      action: 'added',
      description: `Team member "${newMember.name}" added`,
      user: 'System'
    })
  }, [addActivity])

  const updateTeamMember = useCallback(async (id: string, updates: Partial<Member>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ))
    
    addActivity({
      type: 'team',
      action: 'updated',
      description: 'Team member updated',
      user: 'System'
    })
  }, [addActivity])

  const removeTeamMember = useCallback(async (id: string) => {
    const member = teamMembers.find(m => m.id === id)
    setTeamMembers(prev => prev.filter(m => m.id !== id))
    
    if (member) {
      addActivity({
        type: 'team',
        action: 'removed',
        description: `Team member "${member.name}" removed`,
        user: 'System'
      })
    }
  }, [addActivity, teamMembers])

  // API Keys Functions
  const refreshApiKeys = useCallback(async () => {
    console.log('refreshApiKeys called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) return
    
    try {
      // Fetch API keys from Firestore for current user in current workspace
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const apiKeysRef = collection(db, 'apiKeys')
      const q = query(
        apiKeysRef,
        where('userId', '==', currentUserId),
        where('workspaceId', '==', currentWorkspace.id)
      )
      
      const snapshot = await getDocs(q)
      const fetchedApiKeys: ApiKey[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ApiKey[]
      
      console.log('Setting API keys from Firestore:', fetchedApiKeys)
      setApiKeys(fetchedApiKeys)
      
      addActivity({
        type: 'api',
        action: 'refresh',
        description: 'API keys refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      // Fallback to empty array if Firestore fails
      setApiKeys([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const addApiKey = useCallback(async (apiKey: Omit<ApiKey, 'id' | 'createdAt'>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot create API key: User not authenticated or no workspace selected')
      return
    }

    const newApiKey: ApiKey = {
      ...apiKey,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUserId, // Ensure user isolation
      workspaceId: currentWorkspace.id, // Ensure workspace isolation
      createdAt: new Date().toISOString()
    }
    
    try {
      // Save to Firestore
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const apiKeysRef = collection(db, 'apiKeys')
      await addDoc(apiKeysRef, newApiKey)
      
      // Update local state
      setApiKeys(prev => [...prev, newApiKey])
      
      addActivity({
        type: 'api',
        action: 'created',
        description: `API key "${newApiKey.name}" created`,
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to create API key:', error)
      // Don't update local state if Firestore save fails
    }
  }, [addActivity, currentUserId, currentWorkspace])

  const updateApiKey = useCallback(async (id: string, updates: Partial<ApiKey>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot update API key: User not authenticated or no workspace selected')
      return
    }

    try {
      // Update in Firestore
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const apiKeyRef = doc(db, 'apiKeys', id)
      await updateDoc(apiKeyRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      // Update local state
      setApiKeys(prev => prev.map(key => 
        key.id === id ? { ...key, ...updates } : key
      ))
      
      addActivity({
        type: 'api',
        action: 'updated',
        description: 'API key updated',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to update API key:', error)
    }
  }, [addActivity, currentUserId, currentWorkspace])

  const deleteApiKey = useCallback(async (id: string) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot delete API key: User not authenticated or no workspace selected')
      return
    }

    const apiKey = apiKeys.find(k => k.id === id)
    if (!apiKey) return

    try {
      // Delete from Firestore
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const apiKeyRef = doc(db, 'apiKeys', id)
      await deleteDoc(apiKeyRef)
      
      // Update local state
      setApiKeys(prev => prev.filter(k => k.id !== id))
      
      addActivity({
        type: 'api',
        action: 'deleted',
        description: `API key "${apiKey.name}" deleted`,
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }, [addActivity, currentUserId, currentWorkspace, apiKeys])

  // Projects Functions
  const refreshProjects = useCallback(async () => {
    console.log('refreshProjects called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) return
    
    try {
      // Fetch projects from Firestore for current workspace
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const projectsRef = collection(db, 'projects')
      const q = query(
        projectsRef,
        where('workspaceId', '==', currentWorkspace.id)
      )
      
      const snapshot = await getDocs(q)
      const fetchedProjects: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]
      
      console.log('Setting projects from Firestore:', fetchedProjects)
      setProjects(fetchedProjects)
      
      addActivity({
        type: 'project',
        action: 'refresh',
        description: 'Projects refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      // Fallback to empty array if Firestore fails
      setProjects([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const addProject = useCallback(async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot create project: User not authenticated or no workspace selected')
      return
    }

    const newProject: Project = {
      ...project,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdBy: currentUserId, // Ensure user isolation
      workspaceId: currentWorkspace.id, // Ensure workspace isolation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    try {
      // Save to Firestore
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const projectsRef = collection(db, 'projects')
      await addDoc(projectsRef, newProject)
      
      // Update local state
      setProjects(prev => [newProject, ...prev])
      
      addActivity({
        type: 'project',
        action: 'created',
        description: `Project "${newProject.name}" created`,
        user: 'System',
        projectId: newProject.id
      })
    } catch (error) {
      console.error('Failed to create project:', error)
      // Don't update local state if Firestore save fails
    }
  }, [addActivity, currentUserId, currentWorkspace])

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ))
    
    const project = projects.find(p => p.id === id)
    if (project) {
      addActivity({
        type: 'project',
        action: 'updated',
        description: `Project "${project.name}" updated`,
        user: 'System',
        projectId: id
      })
    }
  }, [addActivity, projects])

  const deleteProject = useCallback(async (id: string) => {
    const project = projects.find(p => p.id === id)
    setProjects(prev => prev.filter(p => p.id !== id))
    
    if (project) {
      addActivity({
        type: 'project',
        action: 'deleted',
        description: `Project "${project.name}" deleted`,
        user: 'System'
      })
    }
  }, [addActivity, projects])

  const addProjectActivity = useCallback((projectId: string, activity: Omit<WorkspaceContextType['recentActivity'][0], 'id' | 'timestamp'>) => {
    addActivity({
      ...activity,
      projectId
    })
  }, [addActivity])

  // Sources Functions
  const refreshSources = useCallback(async () => {
    console.log('refreshSources called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) return
    
    try {
      // Fetch sources from Firestore for current workspace
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const sourcesRef = collection(db, 'sources')
      const q = query(
        sourcesRef,
        where('workspaceId', '==', currentWorkspace.id)
      )
      
      const snapshot = await getDocs(q)
      const fetchedSources: Source[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Source[]
      
      console.log('Setting sources from Firestore:', fetchedSources)
      setSources(fetchedSources)
      
      addActivity({
        type: 'source',
        action: 'refresh',
        description: 'Sources refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch sources:', error)
      // Fallback to empty array if Firestore fails
      setSources([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const addSource = useCallback(async (source: Omit<Source, 'id' | 'sharedAt'>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot create source: User not authenticated or no workspace selected')
      return
    }

    const newSource: Source = {
      ...source,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sharedBy: currentUserId, // Ensure user isolation
      workspaceId: currentWorkspace.id, // Ensure workspace isolation
      sharedAt: new Date().toISOString()
    }
    
    try {
      // Save to Firestore
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const sourcesRef = collection(db, 'sources')
      await addDoc(sourcesRef, newSource)
      
      // Update local state
      setSources(prev => [newSource, ...prev])
      
      addActivity({
        type: 'source',
        action: 'shared',
        description: `Source "${newSource.title}" shared`,
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to create source:', error)
      // Don't update local state if Firestore save fails
    }
  }, [addActivity, currentUserId, currentWorkspace])

  const updateSource = useCallback(async (id: string, updates: Partial<Source>) => {
    setSources(prev => prev.map(source => 
      source.id === id ? { ...source, ...updates } : source
    ))
    
    addActivity({
      type: 'source',
      action: 'updated',
      description: 'Source updated',
      user: 'System'
    })
  }, [addActivity])

  const deleteSource = useCallback(async (id: string) => {
    const source = sources.find(s => s.id === id)
    setSources(prev => prev.filter(s => s.id !== id))
    
    if (source) {
      addActivity({
        type: 'source',
        action: 'deleted',
        description: `Source "${source.title}" deleted`,
        user: 'System'
      })
    }
  }, [addActivity, sources])

  // Chat Functions
  const refreshChatMessages = useCallback(async () => {
    console.log('refreshChatMessages called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) return
    
    try {
      // Fetch chat messages from Firestore for current workspace
      const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const messagesRef = collection(db, 'chatMessages')
      const q = query(
        messagesRef,
        where('workspaceId', '==', currentWorkspace.id),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      
      const snapshot = await getDocs(q)
      const fetchedMessages: ChatMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[]
      
      console.log('Setting chat messages from Firestore:', fetchedMessages)
      setChatMessages(fetchedMessages)
      
      addActivity({
        type: 'chat',
        action: 'refresh',
        description: 'Chat messages refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch chat messages:', error)
      // Fallback to empty array if Firestore fails
      setChatMessages([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const sendMessage = useCallback(async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot send message: User not authenticated or no workspace selected')
      return
    }

    const newMessage: ChatMessage = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUserId, // Ensure user isolation
      workspaceId: currentWorkspace.id, // Ensure workspace isolation
      timestamp: new Date().toISOString()
    }
    
    try {
      // Save to Firestore
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const messagesRef = collection(db, 'chatMessages')
      await addDoc(messagesRef, newMessage)
      
      // Update local state
      setChatMessages(prev => [...prev, newMessage])
      
      addActivity({
        type: 'chat',
        action: 'sent',
        description: 'New message sent',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to send message:', error)
      // Don't update local state if Firestore save fails
    }
  }, [addActivity, currentUserId, currentWorkspace])

  // Progress Functions
  const refreshProgressGoals = useCallback(async () => {
    console.log('refreshProgressGoals called, currentWorkspace:', !!currentWorkspace)
    if (!currentWorkspace || !currentUserId) return
    
    try {
      // Fetch progress goals from Firestore for current user
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const goalsRef = collection(db, 'progressGoals')
      const q = query(
        goalsRef,
        where('userId', '==', currentUserId)
      )
      
      const snapshot = await getDocs(q)
      const fetchedGoals: ProgressGoal[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProgressGoal[]
      
      console.log('Setting progress goals from Firestore:', fetchedGoals)
      setProgressGoals(fetchedGoals)
      
      addActivity({
        type: 'progress',
        action: 'refresh',
        description: 'Progress goals refreshed',
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to fetch progress goals:', error)
      // Fallback to empty array if Firestore fails
      setProgressGoals([])
    }
  }, [currentWorkspace, currentUserId, addActivity])

  const addProgressGoal = useCallback(async (goal: Omit<ProgressGoal, 'id'>) => {
    if (!currentUserId || !currentWorkspace) {
      console.error('Cannot create progress goal: User not authenticated or no workspace selected')
      return
    }

    const newGoal: ProgressGoal = {
      ...goal,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUserId, // Ensure user isolation
      workspaceId: currentWorkspace.id // Ensure workspace isolation
    }
    
    try {
      // Save to Firestore
      const { addDoc, collection } = await import('firebase/firestore')
      const { db } = await import('./firebase')
      
      const goalsRef = collection(db, 'progressGoals')
      await addDoc(goalsRef, newGoal)
      
      // Update local state
      setProgressGoals(prev => [...prev, newGoal])
      
      addActivity({
        type: 'progress',
        action: 'added',
        description: `Progress goal "${newGoal.title}" added`,
        user: 'System'
      })
    } catch (error) {
      console.error('Failed to create progress goal:', error)
      // Don't update local state if Firestore save fails
    }
  }, [addActivity, currentUserId, currentWorkspace])

  const updateProgressGoal = useCallback(async (id: string, updates: Partial<ProgressGoal>) => {
    setProgressGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ))
    
    addActivity({
      type: 'progress',
      action: 'updated',
      description: 'Progress goal updated',
      user: 'System'
    })
  }, [addActivity])

  const deleteProgressGoal = useCallback(async (id: string) => {
    const goal = progressGoals.find(g => g.id === id)
    setProgressGoals(prev => prev.filter(g => g.id !== id))
    
    if (goal) {
      addActivity({
        type: 'progress',
        action: 'deleted',
        description: `Progress goal "${goal.title}" deleted`,
        user: 'System'
      })
    }
  }, [addActivity, progressGoals])

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user ? 'User signed in' : 'User signed out')
      
      if (user) {
        console.log('User authenticated, UID:', user.uid)
        // Set current user ID
        setCurrentUserId(user.uid)
        
        try {
          // Check if user is new
          const newUser = await isNewUser()
          console.log('Is new user:', newUser)
          
          if (newUser) {
            // Initialize new user with default workspace
            console.log('Initializing new user...')
            await initializeNewUser()
            console.log('New user initialized with default workspace')
          }
          
          // Get user profile
          console.log('Getting user profile...')
          const profile = await getUserProfile()
          console.log('User profile loaded:', profile)
          setUserProfile(profile)
          
          // Get user's workspaces from Firestore
          console.log('Getting user workspaces...')
          const userWorkspaces = await getUserWorkspaces()
          console.log('User workspaces loaded:', userWorkspaces)
          
          // Convert UserWorkspace to Workspace format
          const convertedWorkspaces: Workspace[] = userWorkspaces.map(uw => ({
            id: uw.id,
            name: uw.name,
            description: uw.description,
            slug: uw.slug,
            createdAt: uw.createdAt,
            updatedAt: uw.updatedAt,
            createdBy: uw.createdBy,
            members: uw.members.map(m => ({
              userId: m.userId,
              role: m.role,
              joinedAt: m.joinedAt,
              permissions: m.permissions
            })),
            settings: uw.settings
          }))
          
          setWorkspaces(convertedWorkspaces)
          
          // Set first workspace as current
          if (convertedWorkspaces.length > 0) {
            console.log('Setting current workspace:', convertedWorkspaces[0])
            setCurrentWorkspace(convertedWorkspaces[0])
          } else {
            console.log('No workspaces found for user, creating default workspace...')
            // Create a default workspace if none exists
            try {
              await initializeNewUser()
              const newWorkspaces = await getUserWorkspaces()
              if (newWorkspaces.length > 0) {
                const newWorkspace = newWorkspaces[0]
                const convertedNewWorkspace: Workspace = {
                  id: newWorkspace.id,
                  name: newWorkspace.name,
                  description: newWorkspace.description,
                  slug: newWorkspace.slug,
                  createdAt: newWorkspace.createdAt,
                  updatedAt: newWorkspace.updatedAt,
                  createdBy: newWorkspace.createdBy,
                  members: newWorkspace.members.map(m => ({
                    userId: m.userId,
                    role: m.role,
                    joinedAt: m.joinedAt,
                    permissions: m.permissions
                  })),
                  settings: newWorkspace.settings
                }
                setWorkspaces([convertedNewWorkspace])
                setCurrentWorkspace(convertedNewWorkspace)
                console.log('Default workspace created and set:', convertedNewWorkspace)
              }
            } catch (error) {
              console.error('Failed to create default workspace:', error)
            }
          }
          
        } catch (error) {
          console.error('Error initializing user:', error)
          // Set default values on error
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewUser: false
          })
        }
      } else {
        // User signed out, clear all data
        setCurrentUserId(null)
        setUserProfile(null)
        setWorkspaces([])
        setCurrentWorkspace(null)
        setTeamMembers([])
        setApiKeys([])
        setProjects([])
        setSources([])
        setChatMessages([])
        setProgressGoals([])
        setRecentActivity([])
      }
      
      setIsInitializing(false)
    })
    
    return unsubscribe
  }, [])

  // Load workspace data when current workspace changes
  useEffect(() => {
    console.log('Data loading effect triggered:', { 
      currentWorkspace: !!currentWorkspace, 
      currentUserId: !!currentUserId,
      isInitializing 
    })
    
    if (currentWorkspace && currentUserId && !isInitializing) {
      console.log('Loading workspace data...')
      // Add a small delay to ensure auth state is fully established
      const timer = setTimeout(() => {
        console.log('Executing data loading...')
        Promise.all([
          refreshTeamMembers(),
          refreshApiKeys(),
          refreshProjects(),
          refreshSources(),
          refreshChatMessages(),
          refreshProgressGoals()
        ]).then(() => {
          console.log('All data loaded successfully')
        }).catch((error) => {
          console.error('Error loading data:', error)
        })
      }, 100)
      
      return () => clearTimeout(timer)
    } else {
      console.log('Skipping data loading - conditions not met:', {
        hasWorkspace: !!currentWorkspace,
        hasUserId: !!currentUserId,
        isInitializing
      })
    }
  }, [currentWorkspace, currentUserId, isInitializing, refreshTeamMembers, refreshApiKeys, refreshProjects, refreshSources, refreshChatMessages, refreshProgressGoals])

  // Calculate security score based on actual workspace data
  const calculateSecurityScore = useCallback(() => {
    let score = 100
    
    // Deduct points for inactive API keys
    const inactiveKeys = apiKeys.filter(key => key.status !== 'active').length
    score -= inactiveKeys * 5
    
    // Deduct points for expired API keys
    const expiredKeys = apiKeys.filter(key => key.status === 'expired').length
    score -= expiredKeys * 10
    
    // Deduct points for too many admin users
    const adminUsers = teamMembers.filter(m => m.role === 'admin').length
    if (adminUsers > 3) {
      score -= (adminUsers - 3) * 15
    }
    
    // Deduct points for no recent activity
    if (recentActivity.length === 0) {
      score -= 20
    }
    
    return Math.max(0, score)
  }, [apiKeys, teamMembers, recentActivity])

  // Calculate derived stats
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter(m => (m.lastActive || "").includes("hour")).length
  const pendingInvites = 0 // TODO: Implement pending invites from Firestore
  
  const totalApiKeys = apiKeys.length
  const activeApiKeys = apiKeys.filter(key => key.status === 'active').length

  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  const workspaceStats = {
    totalProjects,
    activeCollaborations: teamMembers.filter(m => (m as any)?.contributions?.messagesSent > 0).length,
    recentActivity: recentActivity.length,
    securityScore: calculateSecurityScore(), // Calculate based on actual workspace data
    projectProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    spentBudget: projects.reduce((sum, p) => sum + p.spentBudget, 0)
  }

  // User permissions
  const userRole = currentWorkspace?.members.find(m => m.userId === currentUserId)?.role || null
  
  console.log('User role calculation:', {
    currentWorkspace: !!currentWorkspace,
    currentUserId,
    members: currentWorkspace?.members,
    userRole
  })
  
  const hasPermission = useCallback((permission: string) => {
    if (!currentWorkspace || !userRole) return false
    const member = currentWorkspace.members.find(m => m.userId === currentUserId)
    if (!member) return false
    
    if (member.permissions.includes('*')) return true
    return member.permissions.includes(permission)
  }, [currentWorkspace, userRole, currentUserId])

  // User workspaces (workspaces where user is a member)
  const userWorkspaces = workspaces.filter(workspace => 
    workspace.members.some(member => member.userId === currentUserId)
  )

  const value: WorkspaceContextType = {
    // Current Workspace
    currentWorkspace,
    setCurrentWorkspace,
    
    // Current User
    currentUserId,
    userProfile,
    
    // Workspaces Management
    workspaces,
    userWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
    
    // Team Members
    teamMembers,
    totalMembers,
    activeMembers,
    pendingInvites,
    refreshTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    
    // API Keys
    apiKeys,
    totalApiKeys,
    activeApiKeys,
    refreshApiKeys,
    addApiKey,
    updateApiKey,
    deleteApiKey,
    
    // Projects
    projects,
    totalProjects,
    activeProjects,
    completedProjects,
    refreshProjects,
    addProject,
    updateProject,
    deleteProject,
    addProjectActivity,
    
    // Sources
    sources,
    refreshSources,
    addSource,
    updateSource,
    deleteSource,
    
    // Team Chat
    chatMessages,
    refreshChatMessages,
    sendMessage,
    
    // Progress Tracking
    progressGoals,
    refreshProgressGoals,
    addProgressGoal,
    updateProgressGoal,
    deleteProgressGoal,
    
    // Workspace Stats
    workspaceStats,
    
    // Recent Activity
    recentActivity,
    addActivity,
    
    // User Permissions
    userRole,
    hasPermission,
    
    // Loading State
    isInitializing
  }

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}
