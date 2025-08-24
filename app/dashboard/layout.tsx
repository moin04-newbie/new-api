"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { WorkspaceProvider } from "@/lib/workspace-context"
import { AuthWrapper } from "@/components/auth-wrapper"
import { WorkspaceSwitcher } from "@/components/workspace-switcher"
import { 
  LayoutDashboard, 
  Users, 
  Key, 
  GitBranch, 
  Settings, 
  HelpCircle, 
  BarChart3, 
  MessageSquare,
  FileText,
  Target,
  Menu,
  X,
  ChevronDown,
  Code
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <AuthWrapper>
      <WorkspaceProvider>
        <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">KeyNest</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Workspace Switcher */}
            <div className="p-4 border-b border-gray-200">
              <WorkspaceSwitcher />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Link>

              {/* MyWorkspace Section */}
              <div className="space-y-1">
                <button
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-colors ${
                    pathname.startsWith("/dashboard/workspace") || pathname.startsWith("/dashboard/keys") || pathname.startsWith("/dashboard/team") || pathname.startsWith("/dashboard/projects")
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setProjectsMenuOpen((o) => !o)}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">MyWorkspace</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${projectsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {projectsMenuOpen && (
                  <div className="ml-6 space-y-1">
                    <Link
                      href="/dashboard/keys"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                        pathname.startsWith("/dashboard/keys")
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Key className="h-5 w-5" />
                      <span className="font-medium">API Keys</span>
                    </Link>
                    <Link
                      href="/dashboard/team"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                        pathname.startsWith("/dashboard/team")
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-medium">Team Members</span>
                    </Link>
                    <Link
                      href="/dashboard/workspace"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                        pathname.startsWith("/dashboard/workspace")
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Target className="h-5 w-5" />
                      <span className="font-medium">MyWorkspace</span>
                    </Link>
                    <Link
                      href="/dashboard/projects"
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                        pathname.startsWith("/dashboard/projects")
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <GitBranch className="h-5 w-5" />
                      <span className="font-medium">Projects</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Analytics */}
              <Link
                href="/dashboard/analytics"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname.startsWith("/dashboard/analytics")
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Analytics</span>
              </Link>

              {/* Community */}
              <Link
                href="/dashboard/community"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname.startsWith("/dashboard/community")
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Community</span>
              </Link>

              {/* API Documentation */}
              <Link
                href="/dashboard/api-docs"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname.startsWith("/dashboard/api-docs")
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Code className="h-5 w-5" />
                <span className="font-medium">API Docs</span>
              </Link>

              {/* Help */}
              <Link
                href="/dashboard/help"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname.startsWith("/dashboard/help")
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Help</span>
              </Link>

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                  pathname.startsWith("/dashboard/settings")
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">© 2024 KeyNest</p>
                <p className="text-xs text-gray-400 mt-1">API Management Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 lg:left-64 z-0">
          {/* Top Bar */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  {pathname === "/dashboard" && "Dashboard"}
                  {pathname.startsWith("/dashboard/keys") && "API Keys"}
                  {pathname.startsWith("/dashboard/team") && "Team Members"}
                  {pathname.startsWith("/dashboard/workspace") && "MyWorkspace"}
                  {pathname.startsWith("/dashboard/projects") && "Projects"}
                  {pathname.startsWith("/dashboard/analytics") && "Analytics"}
                  {pathname.startsWith("/dashboard/community") && "Community"}
                  {pathname.startsWith("/dashboard/api-docs") && "API Documentation"}
                  {pathname.startsWith("/dashboard/help") && "Help"}
                  {pathname.startsWith("/dashboard/settings") && "Settings"}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                {/* User Profile Placeholder */}
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">U</span>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="py-6">
            {children}
          </main>
        </div>
      </div>
        </WorkspaceProvider>
      </AuthWrapper>
    )
  }
