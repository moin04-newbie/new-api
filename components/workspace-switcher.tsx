"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Plus, Settings, Users, Building2, Globe, Lock, Eye, EyeOff } from "lucide-react"
import { useWorkspace, type Workspace } from "@/lib/workspace-context"

export function WorkspaceSwitcher() {
  const { 
    currentWorkspace, 
    userWorkspaces, 
    createWorkspace, 
    updateWorkspace, 
    deleteWorkspace, 
    switchWorkspace,
    userRole 
  } = useWorkspace()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null)
  
  const [newWorkspaceData, setNewWorkspaceData] = useState({
    name: "",
    description: "",
    slug: "",
    allowGuestAccess: false,
    defaultProjectVisibility: "private" as const,
    requireApprovalForProjects: false
  })

  const handleCreateWorkspace = async () => {
    try {
      await createWorkspace({
        name: newWorkspaceData.name,
        description: newWorkspaceData.description,
        slug: newWorkspaceData.slug || newWorkspaceData.name.toLowerCase().replace(/\s+/g, '-'),
        members: [],
        settings: {
          allowGuestAccess: newWorkspaceData.allowGuestAccess,
          defaultProjectVisibility: newWorkspaceData.defaultProjectVisibility,
          requireApprovalForProjects: newWorkspaceData.requireApprovalForProjects
        }
      })
      
      setIsCreateDialogOpen(false)
      setNewWorkspaceData({
        name: "",
        description: "",
        slug: "",
        allowGuestAccess: false,
        defaultProjectVisibility: "private",
        requireApprovalForProjects: false
      })
    } catch (error) {
      console.error("Failed to create workspace:", error)
    }
  }

  const handleEditWorkspace = async () => {
    if (!editingWorkspace) return
    
    try {
      await updateWorkspace(editingWorkspace.id, {
        name: editingWorkspace.name,
        description: editingWorkspace.description,
        settings: editingWorkspace.settings
      })
      
      setIsEditDialogOpen(false)
      setEditingWorkspace(null)
    } catch (error) {
      console.error("Failed to update workspace:", error)
    }
  }

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
      try {
        await deleteWorkspace(workspaceId)
      } catch (error) {
        console.error("Failed to delete workspace:", error)
      }
    }
  }

  const handleSwitchWorkspace = async (workspaceId: string) => {
    try {
      await switchWorkspace(workspaceId)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to switch workspace:", error)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'member': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    return visibility === 'public' ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />
  }

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-500">No workspace selected</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Current Workspace Display */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between items-center p-3 h-auto"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-medium text-gray-900 truncate">{currentWorkspace.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentWorkspace.description}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Switch Workspace</DialogTitle>
            <DialogDescription>
              Choose a workspace to work in or manage your workspaces
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Create New Workspace Button */}
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Workspace
            </Button>
            
            {/* Workspaces List */}
            <div className="space-y-2">
              {userWorkspaces.map((workspace) => (
                <Card 
                  key={workspace.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    workspace.id === currentWorkspace.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 truncate">{workspace.name}</h4>
                            {workspace.id === currentWorkspace.id && (
                              <Badge variant="secondary" className="text-xs">Current</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{workspace.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleBadgeColor(userRole || '')}>
                              {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
                            </Badge>
                            {getVisibilityIcon(workspace.settings.defaultProjectVisibility)}
                            <span className="text-xs text-gray-500">
                              {workspace.settings.defaultProjectVisibility}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {userRole === 'admin' && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingWorkspace(workspace)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          {workspace.id !== currentWorkspace.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteWorkspace(workspace.id)
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Set up a new workspace for your team or projects
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                placeholder="Enter workspace name"
                value={newWorkspaceData.name}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workspace-description">Description</Label>
              <Textarea
                id="workspace-description"
                placeholder="Describe your workspace"
                value={newWorkspaceData.description}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Slug (optional)</Label>
              <Input
                id="workspace-slug"
                placeholder="workspace-slug"
                value={newWorkspaceData.slug}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, slug: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Settings</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="guest-access"
                    checked={newWorkspaceData.allowGuestAccess}
                    onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, allowGuestAccess: e.target.checked }))}
                  />
                  <Label htmlFor="guest-access">Allow guest access</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-visibility">Default Project Visibility</Label>
                  <Select 
                    value={newWorkspaceData.defaultProjectVisibility} 
                    onValueChange={(value: 'public' | 'private') => 
                      setNewWorkspaceData(prev => ({ ...prev, defaultProjectVisibility: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="require-approval"
                    checked={newWorkspaceData.requireApprovalForProjects}
                    onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, requireApprovalForProjects: e.target.checked }))}
                  />
                  <Label htmlFor="require-approval">Require approval for new projects</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceData.name.trim()}>
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update workspace settings and information
            </DialogDescription>
          </DialogHeader>
          
          {editingWorkspace && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workspace-name">Workspace Name</Label>
                <Input
                  id="edit-workspace-name"
                  value={editingWorkspace.name}
                  onChange={(e) => setEditingWorkspace(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-workspace-description">Description</Label>
                <Textarea
                  id="edit-workspace-description"
                  value={editingWorkspace.description}
                  onChange={(e) => setEditingWorkspace(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-guest-access"
                      checked={editingWorkspace.settings.allowGuestAccess}
                      onChange={(e) => setEditingWorkspace(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, allowGuestAccess: e.target.checked }
                      } : null)}
                    />
                    <Label htmlFor="edit-guest-access">Allow guest access</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-project-visibility">Default Project Visibility</Label>
                    <Select 
                      value={editingWorkspace.settings.defaultProjectVisibility} 
                      onValueChange={(value: 'public' | 'private') => 
                        setEditingWorkspace(prev => prev ? {
                          ...prev,
                          settings: { ...prev.settings, defaultProjectVisibility: value }
                        } : null)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-require-approval"
                      checked={editingWorkspace.settings.requireApprovalForProjects}
                      onChange={(e) => setEditingWorkspace(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, requireApprovalForProjects: e.target.checked }
                      } : null)}
                    />
                    <Label htmlFor="edit-require-approval">Require approval for new projects</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditWorkspace}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
