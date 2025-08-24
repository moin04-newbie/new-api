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

import { fetchApiKeys, createApiKey, deleteApiKey, type ApiKey } from "@/lib/firestore"
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
    addActivity
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
  const [tempApiKeyData, setTempApiKeyData] = useState<any>(null)

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
        monthlyLimit: monthlyLimit ? Number(monthlyLimit) : undefined,
        monthlyCost: monthlyCost ? Number(monthlyCost) : undefined,

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
      
      // Create the API key first
      const apiKeyId = await createApiKey({
        ...tempApiKeyData,
        key: encryptedKey,
      })
      
      // Add activity for API key creation
      addActivity({
        type: 'api',
        action: 'create',
        description: `Created new API key: ${tempApiKeyData.name}`,
        user: 'Current User'
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
      alert("Failed to encrypt API key: " + error)
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your API keys</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add API Key
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search API keys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Select defaultValue="all-status" onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
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
          <SelectTrigger className="w-48">
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

      {/* API Keys List */}
      <div className="space-y-4">
        {filteredKeys.map((key) => (
          <Card key={key.id} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(key.status ?? "inactive")}
                    <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                    <Badge className={getStatusColor(key.status || "inactive")}>{key.status}</Badge>
                    <Badge variant="outline" className="text-gray-600">
                      {key.environment}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{key.description}</p>

                  {/* API Key Display */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono text-gray-900">
                        {visibleKeys.includes(key.id) ? decryptedKeys[key.id] || "••••••••••••••••" : "••••••••••••••••"}
                      </code>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleKeyVisibility(key)}>
                          {visibleKeys.includes(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(key.key)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Project</p>
                      <p className="text-gray-900 font-medium">{key.project}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Requests</p>
                      <p className="text-gray-900 font-medium">{(key.requests || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Last Used
                      </p>
                      <p className="text-gray-900 font-medium">{key.lastUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Expires
                      </p>
                      <p className="text-gray-900 font-medium">{key.expiresAt}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Key
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={async () => { 
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
        <Card className="border border-gray-200">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No API keys found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by adding your first API key to track and manage it securely.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First API Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="hidden" />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New API Key</DialogTitle>
            <DialogDescription>Add a new API key to your project. Make sure to store it securely.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Usage and banner */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                <span>{apiKeys.length} of {plan === "pro" ? 25 : 5} API keys used</span>
              </div>
              <div className="text-gray-500">{(plan === "pro" ? 25 : 5) - apiKeys.length} API keys remaining on {plan === "pro" ? "Pro" : "Free"} Tier.</div>
            </div>

            <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <div className="font-medium mb-1">Enhanced Security</div>
              <p>Your API key will be encrypted locally using a passphrase in the next step. This ensures maximum security — even if our database is compromised, your API keys remain protected. Your passphrase is never stored or transmitted.</p>
            </div>

            {/* Row 1: Service + Key Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="service">Service Name</Label>
                <Input id="service" placeholder="e.g., OpenAI, Stripe, Twilio" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keyname">Key Name</Label>
                <Input id="keyname" placeholder="Give your API key a name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
            </div>

            {/* Row 2: API Key */}
            <div className="grid gap-2">
              <Label htmlFor="apikey">API Key</Label>
              <div className="relative">
                <Input
                  id="apikey"
                  placeholder="sk-..."
                  type={showFormKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={apiKeyValue}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowFormKey((v) => !v)}
                  aria-label={showFormKey ? "Hide API key" : "Show API key"}
                >
                  {showFormKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">Your API key will be encrypted with the passphrase above before being stored</p>
            </div>



            {/* Row 3: Environment + Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Environment</Label>
                <Select value={newEnv} onValueChange={setNewEnv}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
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
            <div className="grid gap-2">
              <Label>Description (Optional)</Label>
              <Textarea placeholder="Brief description of what this API key is used for..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Service Website (Optional)</Label>
                <Input placeholder="https://openai.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>API Documentation (Optional)</Label>
                <Input placeholder="https://platform.openai.com/docs" value={docsUrl} onChange={(e) => setDocsUrl(e.target.value)} />
              </div>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Monthly Usage Limit (Optional)</Label>
                <Input type="number" placeholder="1000" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Monthly Cost (Optional)</Label>
                <Input type="number" placeholder="29.99" value={monthlyCost} onChange={(e) => setMonthlyCost(e.target.value)} />
              </div>

            </div>

            {/* Tags */}
            <div className="grid gap-2">
              <Label>Tags (Optional)</Label>
              <div className="flex gap-2">
                <Input placeholder="Add a tag..." value={tagEntry} onChange={(e) => setTagEntry(e.target.value)} />
                <Button type="button" variant="outline" onClick={() => { if (tagEntry.trim()) { setTags([...tags, tagEntry.trim()]); setTagEntry("") } }}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  {tags.map((t, i) => (
                    <span key={`${t}-${i}`} className="px-2 py-1 rounded-full bg-gray-100 border border-gray-200">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Project */}
            <div className="grid gap-2">
              <Label htmlFor="project">Project (Optional)</Label>
              <Input id="project" placeholder="Project name" value={newProject} onChange={(e) => setNewProject(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateKey} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View API Key Dialog */}
      <Dialog open={isViewKeyDialogOpen} onOpenChange={setIsViewKeyDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enter Passphrase to View Key</DialogTitle>
            <DialogDescription>
              To view the encrypted API key, please enter the passphrase you used to encrypt it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Passphrase</Label>
              <div className="relative">
                <Input
                  type={showViewPassphrase ? "text" : "password"}
                  placeholder="Enter passphrase"
                  value={viewKeyPassphrase}
                  onChange={(e) => setViewKeyPassphrase(e.target.value)}
                  className="pr-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowViewPassphrase((v) => !v)}
                  aria-label={showViewPassphrase ? "Hide passphrase" : "Show passphrase"}
                >
                  {showViewPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleViewKey} className="bg-blue-600 hover:bg-blue-700 text-white">
              View Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encrypt API Key Dialog */}
      <Dialog open={isEncryptionModalOpen} onOpenChange={setIsEncryptionModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">Encrypt API Key</DialogTitle>
                <DialogDescription className="text-base">
                  Choose a strong passphrase to encrypt your API key locally. This passphrase is never stored by KeyHaven, so make sure to remember it or store it securely.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Important Security Notice */}
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-2">Important Security Notice</h4>
                  <p className="text-sm text-orange-800">
                    Your passphrase is used to encrypt your API key locally. It is <strong>not stored anywhere</strong> by KeyHaven. 
                    If you forget this passphrase, your API key <strong>cannot be recovered</strong>. Please store it securely in a 
                    password manager or other secure location.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Passphrase Section */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Create Passphrase</h3>
              <div className="relative">
                <Input
                  type={showEncryptionPassphrase ? "text" : "password"}
                  placeholder="Enter a strong passphrase"
                  value={encryptionPassphrase}
                  onChange={(e) => setEncryptionPassphrase(e.target.value)}
                  className="pr-20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowEncryptionPassphrase((v) => !v)}
                  aria-label={showEncryptionPassphrase ? "Hide passphrase" : "Show passphrase"}
                >
                  {showEncryptionPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Minimum 8 characters. Use a mix of letters, numbers, and symbols for better security.
              </p>
            </div>

            {/* Passphrase Suggestion Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Need a suggestion?</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuggestedPassphrase(generateSecurePassphrase())}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate
                </Button>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-900 text-sm">Suggested Passphrase:</p>
                    <p className="text-green-800 font-mono text-sm mt-1">{suggestedPassphrase}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(suggestedPassphrase)}
                      className="text-green-700 hover:text-green-800"
                      disabled={!suggestedPassphrase}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEncryptionPassphrase(suggestedPassphrase)}
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
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
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEncryptAndSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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
