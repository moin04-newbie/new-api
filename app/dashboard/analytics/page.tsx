"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Calendar,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Eye,
  Download
} from "lucide-react"
import { fetchApiKeys, type ApiKey } from "@/lib/firestore"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"

// Mock data for demonstration - replace with real data from your API
const generateMockUsageData = (days: number = 7) => {
  const data = []
  const now = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: Math.floor(Math.random() * 1000) + 100,
      responseTime: Math.floor(Math.random() * 200) + 50,
      errors: Math.floor(Math.random() * 20) + 1,
      success: Math.floor(Math.random() * 100) + 90
    })
  }
  
  return data
}

const generateMockApiKeyData = () => {
  return [
    { name: 'OpenAI API', requests: 2450, errors: 12, avgResponse: 120, status: 'active' },
    { name: 'Stripe API', requests: 1890, errors: 8, avgResponse: 85, status: 'active' },
    { name: 'Twilio API', requests: 1560, errors: 15, avgResponse: 200, status: 'active' },
    { name: 'Google Maps', requests: 980, errors: 5, avgResponse: 150, status: 'inactive' },
    { name: 'Weather API', requests: 720, errors: 3, avgResponse: 95, status: 'active' }
  ]
}

export default function AnalyticsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [selectedApiKey, setSelectedApiKey] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [isLoading, setIsLoading] = useState(true)
  const [usageData, setUsageData] = useState<any[]>([])
  const [apiKeyData, setApiKeyData] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = await fetchApiKeys()
        setApiKeys(keys)
        
        // Generate mock data based on time range
        const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
        setUsageData(generateMockUsageData(days))
        setApiKeyData(generateMockApiKeyData())
        
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load analytics data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  const getTimeRangeLabel = () => {
    const now = new Date()
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const getTotalRequests = () => usageData.reduce((sum, item) => sum + item.requests, 0)
  const getTotalErrors = () => usageData.reduce((sum, item) => sum + item.errors, 0)
  const getAvgResponseTime = () => {
    const total = usageData.reduce((sum, item) => sum + item.responseTime, 0)
    return Math.round(total / usageData.length)
  }
  const getSuccessRate = () => {
    const totalRequests = getTotalRequests()
    const totalErrors = getTotalErrors()
    return totalRequests > 0 ? Math.round(((totalRequests - totalErrors) / totalRequests) * 100) : 0
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Usage Analytics</h1>
            <p className="text-gray-600 mt-1">Visualize your API usage over time</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All APIs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All APIs</SelectItem>
                {apiKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("7d")}
            className={timeRange === "7d" ? "bg-blue-50 border-blue-200" : ""}
          >
            7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("30d")}
            className={timeRange === "30d" ? "bg-blue-50 border-blue-200" : ""}
          >
            30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("90d")}
            className={timeRange === "90d" ? "bg-blue-50 border-blue-200" : ""}
          >
            90 Days
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {getTimeRangeLabel()}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalRequests().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSuccessRate()}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAvgResponseTime()}ms</div>
            <p className="text-xs text-muted-foreground">
              -8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalErrors()}</div>
            <p className="text-xs text-muted-foreground">
              -15% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Requests Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Requests Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Response Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responseTime" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* API Key Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Key Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">API Key</th>
                  <th className="text-left py-3 px-4 font-medium">Total Requests</th>
                  <th className="text-left py-3 px-4 font-medium">Errors</th>
                  <th className="text-left py-3 px-4 font-medium">Avg Response</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeyData.map((api, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{api.name}</td>
                    <td className="py-3 px-4">{api.requests.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={api.errors > 10 ? "destructive" : "secondary"}>
                        {api.errors}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{api.avgResponse}ms</td>
                    <td className="py-3 px-4">
                      <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                        {api.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Rate Limits', value: 45 },
                    { name: 'Authentication', value: 25 },
                    { name: 'Server Errors', value: 20 },
                    { name: 'Network Issues', value: 10 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Peak Usage Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Morning (9AM-12PM)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Afternoon (1PM-5PM)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-sm font-medium">90%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Evening (6PM-9PM)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Night (10PM-8AM)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
