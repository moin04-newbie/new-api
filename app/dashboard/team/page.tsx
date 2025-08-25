"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import {
  Plus,
  Search,
  Users,
  MoreHorizontal,
  Calendar,
  Activity,
  Shield,
  UserMinus,
  Settings,
  Crown,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { fetchMembers, addMember, type Member, deleteMember } from "@/lib/firestore"
import { useWorkspace } from "@/lib/workspace-context"
import Link from "next/link"
import { toast } from "sonner"

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isSending, setIsSending] = useState(false)
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  const { 
    teamMembers: members, 
    totalMembers, 
    activeMembers, 
    pendingInvites,
    refreshTeamMembers,
    addTeamMember,
    addActivity,
    currentWorkspace
  } = useWorkspace()

  // Debug logging
  console.log('TeamPage render:', {
    membersCount: members.length,
    currentWorkspace: currentWorkspace?.id,
    members: members
  })

  // Refresh team members when component mounts or workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      console.log('Refreshing team members for workspace:', currentWorkspace.id)
      refreshTeamMembers()
    }
  }, [currentWorkspace, refreshTeamMembers])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add team member directly
  const handleAddTeamMember = async () => {
    if (!inviteName.trim()) {
      toast.error("Please enter a valid name")
      return
    }

    // Debug logging
    console.log('Adding team member:', {
      inviteName: inviteName.trim(),
      inviteRole,
      currentWorkspace: currentWorkspace?.id,
      currentUserId: currentWorkspace?.id
    })

    setIsSending(true)
    setInviteStatus('sending')

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.info("Team member added successfully!")

      // Add team member to workspace
      await addTeamMember({ 
        email: `${inviteName.toLowerCase().replace(/\s+/g, '')}@mock.com`, 
        role: inviteRole,
        name: inviteName.trim()
      })
    
      // Add activity for the invitation
      addActivity({
        type: 'team',
        action: 'invite',
        description: `Added ${inviteName.trim()} as ${inviteRole}`,
        user: 'Current User'
      })
    
      setInviteStatus('success')
      toast.success(`Team member ${inviteName.trim()} added successfully!`)

      // Refresh team members
      await refreshTeamMembers()
      
      // Reset form after delay
      setTimeout(() => {
        setIsInviteDialogOpen(false)
        setInviteName("")
        setInviteRole("member")
        setInviteStatus('idle')
      }, 3000)

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to add team member:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          inviteName: inviteName.trim()
        })
      } else {
        console.error('Failed to add team member:', error)
        console.error('Error details:', {
          message: String(error),
          inviteName: inviteName.trim()
        })
      }
      setInviteStatus('error')
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unknown error'
      toast.error(`Failed to add team member: ${errorMessage}`)
    } finally {
      setIsSending(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
      case "member":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
      case "viewer":
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-md"
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-md"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-3 w-3" />
      case "member":
        return <Settings className="h-3 w-3" />
      case "viewer":
        return <Shield className="h-3 w-3" />
      default:
        return <Shield className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent drop-shadow-sm">Team Management</h1>
            <p className="text-slate-600 mt-3 text-lg">Manage team members and their access permissions</p>
          </div>
                      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Add Team Member</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Add a new team member directly to your workspace with specific role permissions.
                </DialogDescription>
              </DialogHeader>

              {inviteStatus === 'idle' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Team Member Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter team member name" 
                    value={inviteName} 
                    onChange={(e) => setInviteName(e.target.value)}
                    className="bg-white/60 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-slate-700 font-medium">Role</Label>
                  <select 
                    className="bg-white/60 border border-slate-200 rounded-md px-3 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                    value={inviteRole} 
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="viewer">Viewer - Can view API keys and projects</option>
                    <option value="member">Member - Can create and manage API keys</option>
                    <option value="admin">Admin - Full administrative access</option>
                  </select>
                </div>
                
                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <Users className="h-4 w-4 inline mr-2" />
                    Team member will be added directly to your workspace with the specified role.
                  </p>
                </div>
              </div>
              )}

              {inviteStatus === 'sending' && (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">
                    Processing invitation...
                  </p>
                </div>
              )}

              {inviteStatus === 'success' && (
                <div className="py-6">
                  <div className="text-center mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Team Member Added Successfully!</h3>
                    <p className="text-slate-600">{inviteName} has been added to your team as {inviteRole}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <Button 
                      onClick={() => setInviteStatus('idle')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Member
                    </Button>
                  </div>
                </div>
              )}

              {inviteStatus === 'error' && (
                <div className="py-6 text-center">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-700 mb-2">Failed to Add Team Member</h3>
                  <p className="text-slate-600 mb-4">There was an error adding the team member. Please try again.</p>
                  <Button 
                    onClick={() => setInviteStatus('idle')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Try Again
                  </Button>
              </div>
              )}

              {inviteStatus === 'idle' && (
              <DialogFooter>
                <Button 
                  type="button" 
                    onClick={handleAddTeamMember} 
                    disabled={!inviteName.trim() || isSending}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300"
                >
                    <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Members</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{members.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Today</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{
                  members.filter((m) => (m.lastActive || "").includes("hour")).length
                }</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Team Members</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {members.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all duration-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Team Members</CardTitle>
          <CardDescription className="text-slate-600">Manage your team members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-sm border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white/60 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-14 h-14 ring-2 ring-white/50 shadow-lg">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-base font-semibold text-slate-800">{member.name}</h4>
                      <Badge className={`${getRoleColor(member.role)} shadow-md`}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </span>
                      </Badge>
                      {/* 
                        Removed member.status check and Pending badge
                        because 'status' does not exist on type 'Member'.
                        This can be re-enabled once the Member interface includes a status field.
                      */}
                    </div>
                    <p className="text-sm text-slate-600">{member.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-slate-500 flex items-center bg-slate-100/80 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined {member.joinedAt}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center bg-slate-100/80 px-2 py-1 rounded-full">
                        <Activity className="h-3 w-3 mr-1" />
                        Active {member.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">{(member.projects?.length ?? 0)} Projects</div>
                    <div className="text-xs text-slate-500">
                      {(member.projects ?? []).slice(0, 2).join(", ")}
                      {member.projects && member.projects.length > 2 && ` +${member.projects.length - 2} more`}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg transition-all duration-200">
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/team/${member.id}`} className="flex items-center w-full hover:bg-blue-50/80 transition-colors">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Permissions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-blue-50/80 transition-colors">
                        <Shield className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                      {/* 
                        Removed member.status check and Resend Invite option
                        because 'status' does not exist on type 'Member'.
                        This can be re-enabled once the Member interface includes a status field.
                      */}
                      {member.role !== "admin" && (
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50/80 transition-colors" onClick={async () => { 
                          await deleteMember(member.id)
                          
                          // Add activity for member removal
                          addActivity({
                            type: 'team',
                            action: 'remove',
                            description: `Removed ${member.name} from team`,
                            user: 'Current User'
                          })
                          
                          // Refresh team members from shared context
                          await refreshTeamMembers()
                        }}>
                          <UserMinus className="mr-2 h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredMembers.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 mt-6">
          <CardContent className="p-12 text-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 w-fit mx-auto mb-6">
              <Users className="h-12 w-12 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">No team members found</h3>
            <p className="text-slate-600 mb-6 text-lg">
              {searchTerm ? "Try adjusting your search terms" : "Invite team members to collaborate on your projects"}
            </p>
            {!searchTerm && (
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
