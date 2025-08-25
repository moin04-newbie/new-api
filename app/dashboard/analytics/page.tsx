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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse" />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Page Title Row */}
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">API Analytics</h1>
              <p className="text-slate-500 mt-2">Visualize your API usage and performance metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
                <SelectTrigger className="w-40 border-slate-200 bg-white/60 backdrop-blur-sm">
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
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25 border-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">

        {/* Time Range Selector */}
        <div className="relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-500/10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setTimeRange("7d")}
                className={timeRange === "7d" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25" 
                  : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50"}
              >
                7 Days
              </Button>
              <Button
                onClick={() => setTimeRange("30d")}
                className={timeRange === "30d" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25" 
                  : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50"}
              >
                30 Days
              </Button>
              <Button
                onClick={() => setTimeRange("90d")}
                className={timeRange === "90d" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25" 
                  : "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-slate-50"}
              >
                90 Days
              </Button>
            </div>
            <div className="text-sm font-medium text-slate-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200">
              {getTimeRangeLabel()}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Requests</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getTotalRequests().toLocaleString()}</div>
              <p className="text-xs text-green-600 font-medium">
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Success Rate</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getSuccessRate()}%</div>
              <p className="text-xs text-green-600 font-medium">
                +2.1% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Avg Response Time</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getAvgResponseTime()}ms</div>
              <p className="text-xs text-green-600 font-medium">
                -8% from last period
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Error Rate</CardTitle>
              <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{getTotalErrors()}</div>
              <p className="text-xs text-green-600 font-medium">
                -15% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Requests Over Time */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Requests Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="requests" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Response Time Distribution */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                Response Time Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="responseTime" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* API Key Performance Table */}
        <Card className="mb-8 group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              API Key Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">API Key</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Total Requests</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Errors</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Avg Response</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeyData.map((api, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200">
                      <td className="py-4 px-4 font-medium text-slate-900">{api.name}</td>
                      <td className="py-4 px-4 text-slate-700">{api.requests.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={api.errors > 10 ? "destructive" : "secondary"}
                          className={api.errors > 10 
                            ? "bg-red-100 text-red-700 border-red-200" 
                            : "bg-green-100 text-green-700 border-green-200"}
                        >
                          {api.errors}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-700">{api.avgResponse}ms</td>
                      <td className="py-4 px-4">
                        <Badge 
                          className={api.status === 'active' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'}
                        >
                          {api.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm" className="hover:bg-slate-100 rounded-xl">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-slate-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900">
                <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                Peak Usage Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Morning (9AM-12PM)</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 min-w-[3rem] text-right">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Afternoon (1PM-5PM)</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 min-w-[3rem] text-right">90%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Evening (6PM-9PM)</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full shadow-sm" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 min-w-[3rem] text-right">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Night (10PM-8AM)</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 min-w-[3rem] text-right">25%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
