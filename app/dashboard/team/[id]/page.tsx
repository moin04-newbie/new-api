"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMember, fetchProjects, deleteMember, updateMemberRole, type Project, type Member } from "@/lib/firestore"
import { Users, Calendar, Trash2, ArrowLeft, Shield, Settings, Crown } from "lucide-react"

export default function TeamMemberDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newRole, setNewRole] = useState("")
  const memberId = params.id

  useEffect(() => {
    if (!memberId) return
    ;(async () => {
      const m = await getMember(memberId)
      setMember(m)
      if (m) {
        setNewRole(m.role)
        const projs = await fetchProjects()
        setProjects(projs)
      }
    })()
  }, [memberId])

  if (!member) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => router.push("/dashboard/team")}> <ArrowLeft className="h-4 w-4 mr-2"/> Back</Button>
        <div className="text-gray-700 mt-4">Loading member…</div>
      </div>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner": return <Crown className="h-4 w-4" />
      case "Editor": return <Settings className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Owner": return "bg-[#013C5A] text-white"
      case "Editor": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleRoleUpdate = async () => {
    if (newRole !== member.role) {
      await updateMemberRole(member.id, newRole)
      setMember({ ...member, role: newRole })
    }
    setIsEditing(false)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#013C5A]">{member.name}</h1>
          <p className="text-[#013C5A]/70">{member.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Settings className="h-4 w-4 mr-2"/> Edit Permissions
          </Button>
          <Button variant="destructive" onClick={async () => { await deleteMember(member.id); router.push("/dashboard/team") }}>
            <Trash2 className="h-4 w-4 mr-2"/> Remove Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#013C5A]/10">
          <CardHeader>
            <CardTitle className="text-[#013C5A]">Member Info</CardTitle>
            <CardDescription>Basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                {getRoleIcon(member.role)} {member.role}
              </span>
            </div>
            <div className="text-sm">
              <div className="text-[#013C5A]/70">Joined</div>
              <div>{member.joinedAt || "—"}</div>
            </div>
            <div className="text-sm">
              <div className="text-[#013C5A]/70">Last Active</div>
              <div>{member.lastActive || "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#013C5A]/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#013C5A] flex items-center"><Users className="h-5 w-5 mr-2"/> Projects Access ({member.projects?.length || 0})</CardTitle>
            <CardDescription>Projects this member can access</CardDescription>
          </CardHeader>
          <CardContent>
            {!member.projects || member.projects.length === 0 ? (
              <div className="text-sm text-[#013C5A]/70">No project access configured yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {member.projects.map(projectId => {
                  const project = projects.find(p => p.id === projectId)
                  return project ? (
                    <div key={projectId} className="border rounded p-3 text-sm">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-[#013C5A]/70">{project.description}</div>
                    </div>
                  ) : null
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Role Dialog */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Edit Role</CardTitle>
              <CardDescription>Change member's role permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view API keys and projects</SelectItem>
                    <SelectItem value="editor">Editor - Can create and manage API keys</SelectItem>
                    <SelectItem value="owner">Owner - Full administrative access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRoleUpdate} className="flex-1">Update Role</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
