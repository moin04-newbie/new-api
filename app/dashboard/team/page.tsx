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
  Mail,
  MoreHorizontal,
  Calendar,
  Activity,
  Shield,
  UserMinus,
  Settings,
  Crown,
} from "lucide-react"
import { fetchMembers, addMember, type Member, deleteMember } from "@/lib/firestore"
import { useWorkspace } from "@/lib/workspace-context"
import Link from "next/link"

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")
  
  const { 
    teamMembers: members, 
    totalMembers, 
    activeMembers, 
    pendingInvites,
    refreshTeamMembers,
    addActivity
  } = useWorkspace()

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  async function handleInvite() {
    if (!inviteEmail.trim()) return
    await addMember({ email: inviteEmail.trim(), role: inviteRole })
    
    // Add activity for the invitation
    addActivity({
      type: 'team',
      action: 'invite',
      description: `Invited ${inviteEmail.trim()} as ${inviteRole}`,
      user: 'Current User'
    })
    
    // Refresh team members from shared context
    await refreshTeamMembers()
    setIsInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("viewer")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-[#013C5A] text-white"
      case "Editor":
        return "bg-blue-100 text-blue-800"
      case "Viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return <Crown className="h-3 w-3" />
      case "Editor":
        return <Settings className="h-3 w-3" />
      case "Viewer":
        return <Shield className="h-3 w-3" />
      default:
        return <Shield className="h-3 w-3" />
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#013C5A]">Team Management</h1>
            <p className="text-[#013C5A]/70 mt-2">Manage team members and their access permissions</p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#013C5A] hover:bg-[#013C5A]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your team with specific role permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <select className="border rounded px-3 py-2" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                    <option value="viewer">Viewer - Can view API keys and projects</option>
                    <option value="editor">Editor - Can create and manage API keys</option>
                    <option value="owner">Owner - Full administrative access</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="projects">Projects Access</Label>
                  <p className="text-sm text-[#013C5A]/60">(Configure per-project access later)</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleInvite} className="bg-[#013C5A] hover:bg-[#013C5A]/90 text-white">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#013C5A]/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#013C5A]/70">Total Members</p>
                <p className="text-2xl font-bold text-[#013C5A]">{members.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#013C5A]/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#013C5A]/70">Active Today</p>
                <p className="text-2xl font-bold text-[#013C5A]">{
                  members.filter((m) => (m.lastActive || "").includes("hour")).length
                }</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#013C5A]/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#013C5A]/70">Pending Invites</p>
                <p className="text-2xl font-bold text-[#013C5A]">2</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-[#013C5A]/10 mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#013C5A]/50" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#013C5A]/20 focus:border-[#013C5A]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="border-[#013C5A]/10">
        <CardHeader>
          <CardTitle className="text-[#013C5A]">Team Members</CardTitle>
          <CardDescription>Manage your team members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-[#013C5A]/10 rounded-lg hover:bg-[#013C5A]/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#013C5A] text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-[#013C5A]">{member.name}</h4>
                      <Badge className={getRoleColor(member.role)}>
                        <span className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-[#013C5A]/60">{member.email}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-[#013C5A]/50 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined {member.joinedAt}
                      </span>
                      <span className="text-xs text-[#013C5A]/50 flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        Active {member.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#013C5A]">{(member.projects?.length ?? 0)} Projects</div>
                    <div className="text-xs text-[#013C5A]/50">
                      {(member.projects ?? []).slice(0, 2).join(", ")}
                      {member.projects && member.projects.length > 2 && ` +${member.projects.length - 2} more`}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/team/${member.id}`} className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit Permissions
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Invite
                      </DropdownMenuItem>
                      {member.role !== "Owner" && (
                        <DropdownMenuItem className="text-red-600" onClick={async () => { 
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
        <Card className="border-[#013C5A]/10 mt-6">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-[#013C5A]/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#013C5A] mb-2">No team members found</h3>
            <p className="text-[#013C5A]/70 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Invite team members to collaborate on your projects"}
            </p>
            {!searchTerm && (
              <Button
                className="bg-[#013C5A] hover:bg-[#013C5A]/90 text-white"
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
