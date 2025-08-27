"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"

import { fetchApiKeys, deleteApiKey, type ApiKey } from "@/lib/firestore"
import { getPlan } from "@/lib/subscription"
import { encryptApiKey, generateSecurePassphrase, decryptApiKey } from "@/lib/utils"
import { useWorkspace } from "@/lib/workspace-context"

export default function APIKeysPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterEnvironment, setFilterEnvironment] = useState("all")
  const [visibleKeys, setVisibleKeys] = useState<string[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [plan, setPlan] = useState<"free" | "pro">("free")
  
  const { 
    apiKeys, 
    totalApiKeys, 
    activeApiKeys,
    refreshApiKeys,
    addActivity,
    addApiKey,
    currentUserId,
    currentWorkspace
  } = useWorkspace()
  // New API Key form state
  const [serviceName, setServiceName] = useState("")
  const [newName, setNewName] = useState("")
  const [apiKeyValue, setApiKeyValue] = useState("")
  const [showFormKey, setShowFormKey] = useState(false)
  const [newEnv, setNewEnv] = useState("development")
  const [newStatus, setNewStatus] = useState("active")
  const [newDesc, setNewDesc] = useState("")
  const [website, setWebsite] = useState("")
  const [docsUrl, setDocsUrl] = useState("")
  const [monthlyLimit, setMonthlyLimit] = useState<string>("")
  const [monthlyCost, setMonthlyCost] = useState<string>("")

  const [tags, setTags] = useState<string[]>([])
  const [tagEntry, setTagEntry] = useState("")
  const [newProject, setNewProject] = useState("")
  // View key passphrase state
  const [viewKeyPassphrase, setViewKeyPassphrase] = useState("")
  const [showViewPassphrase, setShowViewPassphrase] = useState(false)
  const [decryptedKeys, setDecryptedKeys] = useState<Record<string, string>>({})
  const [isViewKeyDialogOpen, setIsViewKeyDialogOpen] = useState(false)
  const [currentViewingKey, setCurrentViewingKey] = useState<ApiKey | null>(null)
  // Encryption modal state
  const [isEncryptionModalOpen, setIsEncryptionModalOpen] = useState(false)
  const [encryptionPassphrase, setEncryptionPassphrase] = useState("")
  const [showEncryptionPassphrase, setShowEncryptionPassphrase] = useState(false)
  const [suggestedPassphrase, setSuggestedPassphrase] = useState("")
  const [tempApiKeyData, setTempApiKeyData] = useState<{
    name: string;
    serviceName: string;
    description: string;
    key: string;
    project: string;
    environment: string;
    status: string;
    website: string;
    docsUrl: string;
    monthlyLimit: number;
    monthlyCost: number;
    tags: string[];
  } | null>(null)

  useEffect(() => {
    setPlan(getPlan())
  }, [])

  // Generate suggested passphrase when encryption modal opens
  useEffect(() => {
    if (isEncryptionModalOpen && !suggestedPassphrase) {
      setSuggestedPassphrase(generateSecurePassphrase())
    }
  }, [isEncryptionModalOpen, suggestedPassphrase])

  const toggleKeyVisibility = async (key: ApiKey) => {
    if (visibleKeys.includes(key.id)) {
      // Hide the key
      setVisibleKeys((prev) => prev.filter((id) => id !== key.id))
      setDecryptedKeys((prev) => {
        const newKeys = { ...prev }
        delete newKeys[key.id]
        return newKeys
      })
    } else {
      // Show the key - need passphrase
      setCurrentViewingKey(key)
      setIsViewKeyDialogOpen(true)
    }
  }

  const handleViewKey = async () => {
    if (!currentViewingKey || !viewKeyPassphrase.trim()) return
    
    try {
      const decryptedKey = await decryptApiKey(currentViewingKey.key, viewKeyPassphrase.trim())
      setDecryptedKeys((prev) => ({ ...prev, [currentViewingKey.id]: decryptedKey }))
      setVisibleKeys((prev) => [...prev, currentViewingKey.id])
      setIsViewKeyDialogOpen(false)
      setViewKeyPassphrase("")
      setShowViewPassphrase(false)
    } catch (error) {
      alert("Invalid passphrase. Please try again.")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You would typically show a toast notification here
  }

  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (key.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (key.project || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || key.status === filterStatus
    const matchesEnvironment = filterEnvironment === "all" || key.environment === filterEnvironment

    return matchesSearch && matchesStatus && matchesEnvironment
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expiring":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "inactive":
        return <Shield className="h-4 w-4 text-gray-400" />
      default:
        return <Shield className="h-4 w-4 text-gray-400" />
    }
  }

  async function handleCreateKey() {
    if (!newName.trim() || !apiKeyValue.trim()) return
    
    // Store the API key data temporarily and show encryption modal
    setTempApiKeyData({
        name: newName.trim(),
        serviceName: serviceName.trim(),
        description: newDesc.trim(),
        key: apiKeyValue.trim(),
        project: newProject.trim(),
        environment: newEnv,
        status: newStatus,
        website: website.trim(),
        docsUrl: docsUrl.trim(),
        monthlyLimit: monthlyLimit ? Number(monthlyLimit) : 0,
        monthlyCost: monthlyCost ? Number(monthlyCost) : 0,
        tags,
      })
    
    // Generate a suggested passphrase
    setSuggestedPassphrase(generateSecurePassphrase())
    
    // Close the create dialog and open the encryption modal
    setIsCreateDialogOpen(false)
    setIsEncryptionModalOpen(true)
  }

  async function handleEncryptAndSave() {
    if (!encryptionPassphrase.trim()) {
      alert("Please enter a passphrase to encrypt your API key")
      return
    }
    
    if (!tempApiKeyData) return
    
    try {
      const encryptedKey = await encryptApiKey(tempApiKeyData.key, encryptionPassphrase.trim())
      
      // Create the API key using workspace context
      await addApiKey({
        name: tempApiKeyData.name,
        serviceName: tempApiKeyData.serviceName,
        description: tempApiKeyData.description,
        key: encryptedKey,
        project: tempApiKeyData.project,
        environment: tempApiKeyData.environment,
        status: tempApiKeyData.status as "active" | "inactive" | "expired" | "revoked",
        website: tempApiKeyData.website,
        docsUrl: tempApiKeyData.docsUrl,
        monthlyLimit: tempApiKeyData.monthlyLimit,
        monthlyCost: tempApiKeyData.monthlyCost,
        tags: tempApiKeyData.tags,
        userId: currentUserId || "",
        workspaceId: currentWorkspace?.id || "",
        createdBy: currentUserId || "",
        uid: currentUserId || "",
        projectId: tempApiKeyData.project || "",
        requests: 0,
        lastUsed: new Date().toISOString(),
        expiresAt: ""
      })
      
      // Refresh API keys from shared context
      await refreshApiKeys()
      
      // Close encryption modal and reset all states
      setIsEncryptionModalOpen(false)
      setEncryptionPassphrase("")
      setShowEncryptionPassphrase(false)
      setSuggestedPassphrase("")
      setTempApiKeyData(null)
      
      // Reset create dialog states
      setServiceName("")
      setNewName("")
      setApiKeyValue("")
      setNewEnv("development")
      setNewStatus("active")
      setNewDesc("")
      setWebsite("")
      setDocsUrl("")
      setMonthlyLimit("")
      setMonthlyCost("")

      setTags([])
      setTagEntry("")
      setNewProject("")
    } catch (error) {
      console.error("Error creating API key:", error)
      alert("Failed to create API key: " + (error instanceof Error ? error.message : String(error)))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "expiring":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">API Keys</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage and monitor your API keys securely</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add API Key
            </Button>
          </div>
          
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl shadow-slate-500/10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Secure API Management 🔐</h2>
                <p className="text-slate-600 text-lg">Your keys are encrypted and protected with industry-standard security</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">{activeApiKeys} Active</span>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {/* Search and Filters */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search API keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all duration-300"
              />
            </div>
            <Select defaultValue="all-status" onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-12 bg-white/80 backdrop-blur-sm border-white/20 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-environments" onValueChange={setFilterEnvironment}>
              <SelectTrigger className="w-48 h-12 bg-white/80 backdrop-blur-sm border-white/20 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-environments">All Environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-6">
          {filteredKeys.map((key) => (
            <Card key={key.id} className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10 hover:shadow-2xl hover:shadow-slate-500/20 transition-all duration-300">
              <CardContent className="p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/30 to-slate-100/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                        {getStatusIcon(key.status ?? "inactive")}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{key.name}</h3>
                        <div className="flex items-center space-x-3">
                          <Badge className={`${
                            key.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25' :
                            key.status === 'expired' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25' :
                            'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/25'
                          }`}>
                            {key.status}
                          </Badge>
                          <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white/50">
                            {key.environment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-6 text-lg leading-relaxed">{key.description}</p>

                    {/* API Key Display */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 mb-6 shadow-inner">
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono text-slate-900 tracking-wider">
                          {visibleKeys.includes(key.id) ? decryptedKeys[key.id] || "••••••••••••••••" : "••••••••••••••••"}
                        </code>
                        <div className="flex items-center space-x-3">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => toggleKeyVisibility(key)}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group/btn"
                          >
                            {visibleKeys.includes(key.id) ? 
                              <EyeOff className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" /> : 
                              <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                            }
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(key.key)}
                            className="hover:bg-green-50 hover:text-green-600 transition-all duration-300 group/btn"
                          >
                            <Copy className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <p className="text-blue-600 font-medium text-sm mb-1">Project</p>
                        <p className="text-slate-900 font-bold text-lg">{key.project}</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                        <p className="text-green-600 font-medium text-sm mb-1">Requests</p>
                        <p className="text-slate-900 font-bold text-lg">{(key.requests || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                        <p className="text-purple-600 font-medium text-sm mb-1 flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Last Used
                        </p>
                        <p className="text-slate-900 font-bold text-lg">{key.lastUsed}</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                        <p className="text-orange-600 font-medium text-sm mb-1 flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expires
                        </p>
                        <p className="text-slate-900 font-bold text-lg">{key.expiresAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-full w-10 h-10 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl">
                      <DropdownMenuItem className="hover:bg-blue-50 hover:text-blue-600">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Key
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50" onClick={async () => { 
                        await deleteApiKey(key.id)
                        
                        // Add activity for API key deletion
                        addActivity({
                          type: 'api',
                          action: 'delete',
                          description: `Revoked API key: ${key.name}`,
                          user: 'Current User'
                        })
                        
                        // Refresh API keys from shared context
                        await refreshApiKeys()
                      }}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Revoke Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredKeys.length === 0 && (
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-slate-500/10">
            <CardContent className="py-20">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Shield className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">No API keys found</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                  Get started by adding your first API key to track and manage it securely.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 px-8 py-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-500/25 rounded-3xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Add New API Key</DialogTitle>
                <DialogDescription className="text-slate-600 text-lg">Add a new API key to your project. Make sure to store it securely.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            {/* Usage and banner */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/25" />
                <span className="font-semibold text-slate-700">{apiKeys.length} of {plan === "pro" ? 25 : 5} API keys used</span>
              </div>
              <div className="text-slate-500 font-medium">{(plan === "pro" ? 25 : 5) - apiKeys.length} API keys remaining on {plan === "pro" ? "Pro" : "Free"} Tier.</div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div className="font-bold text-blue-900 text-lg">Enhanced Security</div>
              </div>
              <p className="text-blue-800 leading-relaxed">Your API key will be encrypted locally using a passphrase in the next step. This ensures maximum security — even if our database is compromised, your API keys remain protected. Your passphrase is never stored or transmitted.</p>
            </div>

            {/* Row 1: Service + Key Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="service" className="text-slate-700 font-semibold">Service Name</Label>
                <Input id="service" placeholder="e.g., OpenAI, Stripe, Twilio" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="keyname" className="text-slate-700 font-semibold">Key Name</Label>
                <Input id="keyname" placeholder="Give your API key a name" value={newName} onChange={(e) => setNewName(e.target.value)} className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" />
              </div>
            </div>

            {/* Row 2: API Key */}
            <div className="grid gap-3">
              <Label htmlFor="apikey" className="text-slate-700 font-semibold">API Key</Label>
              <div className="relative">
                <Input
                  id="apikey"
                  placeholder="sk-..."
                  type={showFormKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={apiKeyValue}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pr-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-100 rounded-full w-8 h-8 p-0"
                  onClick={() => setShowFormKey((v) => !v)}
                  aria-label={showFormKey ? "Hide API key" : "Show API key"}
                >
                  {showFormKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-slate-500">Your API key will be encrypted with the passphrase above before being stored</p>
            </div>

            {/* Row 3: Environment + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label className="text-slate-700 font-semibold">Environment</Label>
                <Select value={newEnv} onValueChange={setNewEnv}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label className="text-slate-700 font-semibold">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expiring">Expiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label className="text-slate-700 font-semibold">Description (Optional)</Label>
              <Textarea placeholder="Brief description of what this API key is used for..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 min-h-[100px]" />
            </div>

            {/* Project */}
            <div className="grid gap-3">
              <Label htmlFor="project" className="text-slate-700 font-semibold">Project (Optional)</Label>
              <Input id="project" placeholder="Project name" value={newProject} onChange={(e) => setNewProject(e.target.value)} className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300" />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateKey} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 px-8">
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View API Key Dialog */}
      <Dialog open={isViewKeyDialogOpen} onOpenChange={setIsViewKeyDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-500/25 rounded-3xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Enter Passphrase to View Key</DialogTitle>
                <DialogDescription className="text-slate-600">
                  To view the encrypted API key, please enter the passphrase you used to encrypt it.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label className="text-slate-700 font-semibold">Passphrase</Label>
              <div className="relative">
                <Input
                  type={showViewPassphrase ? "text" : "password"}
                  placeholder="Enter passphrase"
                  value={viewKeyPassphrase}
                  onChange={(e) => setViewKeyPassphrase(e.target.value)}
                  className="h-12 bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 pr-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-100 rounded-full w-8 h-8 p-0"
                  onClick={() => setShowViewPassphrase((v) => !v)}
                  aria-label={showViewPassphrase ? "Hide passphrase" : "Show passphrase"}
                >
                  {showViewPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setIsViewKeyDialogOpen(false)} className="border-slate-200 hover:bg-slate-50">
              Cancel
            </Button>
            <Button onClick={handleViewKey} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/25">
              View Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encrypt API Key Dialog */}
      <Dialog open={isEncryptionModalOpen} onOpenChange={setIsEncryptionModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl shadow-slate-500/25 rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Encrypt API Key</DialogTitle>
                <DialogDescription className="text-slate-600 text-lg leading-relaxed">
                  Choose a strong passphrase to encrypt your API key locally. This passphrase is never stored by KeyHaven, so make sure to remember it or store it securely.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            {/* Important Security Notice */}
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-orange-900 mb-3 text-lg">Important Security Notice</h4>
                  <p className="text-orange-800 leading-relaxed">
                    Your passphrase is used to encrypt your API key locally. It is <strong>not stored anywhere</strong> by KeyHaven. 
                    If you forget this passphrase, your API key <strong>cannot be recovered</strong>. Please store it securely in a 
                    password manager or other secure location.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Passphrase Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-xl">Create Passphrase</h3>
              <div className="relative">
                <Input
                  type={showEncryptionPassphrase ? "text" : "password"}
                  placeholder="Enter a strong passphrase"
                  value={encryptionPassphrase}
                  onChange={(e) => setEncryptionPassphrase(e.target.value)}
                  className="h-14 text-lg bg-white/80 backdrop-blur-sm border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 pr-14"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-slate-100 rounded-full w-10 h-10 p-0"
                  onClick={() => setShowEncryptionPassphrase((v) => !v)}
                  aria-label={showEncryptionPassphrase ? "Hide passphrase" : "Show passphrase"}
                >
                  {showEncryptionPassphrase ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Minimum 8 characters. Use a mix of letters, numbers, and symbols for better security.
              </p>
            </div>

            {/* Passphrase Suggestion Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xl">Need a suggestion?</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestedPassphrase(generateSecurePassphrase())}
                  className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate
                </Button>
              </div>
              <div className="rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-green-900 text-lg mb-2">Suggested Passphrase:</p>
                    <p className="text-green-800 font-mono text-lg break-all">{suggestedPassphrase}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestedPassphrase)}
                      className="text-green-700 hover:text-green-800 hover:bg-green-200 rounded-full w-10 h-10 p-0"
                      disabled={!suggestedPassphrase}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setEncryptionPassphrase(suggestedPassphrase)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/25 px-6"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEncryptionModalOpen(false)
                setIsCreateDialogOpen(true)
                setEncryptionPassphrase("")
                setShowEncryptionPassphrase(false)
                setSuggestedPassphrase("")
                setTempApiKeyData(null)
              }}
              className="border-slate-200 hover:bg-slate-50 px-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEncryptAndSave}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 px-8"
              disabled={!encryptionPassphrase.trim() || encryptionPassphrase.length < 8}
            >
              Encrypt & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
