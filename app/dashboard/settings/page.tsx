"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { onAuthStateChanged, changePassword, signOutUser } from "@/lib/auth"
import { getPlan, setPlan } from "@/lib/subscription"
import { Mail, Lock, Eye, EyeOff, Shield, Crown, Check, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

type Tab = "personal" | "account" | "billing"

export default function SettingsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("personal")
  const [email, setEmail] = useState("")
  const [plan, setPlanState] = useState<"free" | "pro">("free")
  const [showPass, setShowPass] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    email: "",
    phone: "+1 (555) 123-4567",
    bio: "Full-stack developer passionate about building scalable applications and APIs.",
    profilePhoto: "",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional"]
  })
  
  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    emailVisibility: "private",
    phoneVisibility: "private",
    skillsVisibility: "public"
  })
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppAlerts: true,
    marketingEmails: false
  })

  useEffect(() => {
    const unsub = onAuthStateChanged((u) => {
      if (u?.email) setEmail(u.email)
    })
    setPlanState(getPlan())
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    try {
      await signOutUser()
      router.push("/") // Redirect to landing page
    } catch (error) {
      console.error("Logout error:", error)
      // Still redirect even if there's an error
      router.push("/")
    }
  }

  const updateEmail = async () => {
    alert("Email update requires re-authentication; implement with Firebase updateEmail().")
  }

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (!email) { alert("No authenticated user"); return }
    try {
      await changePassword(email, currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      alert("Password updated successfully")
    } catch (e: any) {
      alert(e?.message || "Failed to update password")
    }
  }

  const handleUpgrade = () => {
    setPlan("pro"); setPlanState("pro")
  }
  const handleDowngrade = () => {
    setPlan("free"); setPlanState("free")
  }

  const savePersonalInfo = () => {
    // Here you would typically save to your backend/database
    alert("Personal information saved successfully!")
  }

  const savePrivacySettings = () => {
    // Here you would typically save to your backend/database
    alert("Privacy settings saved successfully!")
  }

  const saveNotificationSettings = () => {
    // Here you would typically save to your backend/database
    alert("Notification settings saved successfully!")
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === "personal" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
              onClick={() => setTab("personal")}
            >
              Personal Info
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === "account" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
              onClick={() => setTab("account")}
            >
              Account & Security
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === "billing" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}
              onClick={() => setTab("billing")}
            >
              Billing
            </button>
            
            {/* Logout Button */}
            <div className="pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {tab === "personal" ? (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile, skills, and expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Profile Photo */}
              <div>
                <Label className="text-sm">Profile Photo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    {personalInfo.profilePhoto ? (
                      <img src={personalInfo.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl text-gray-500">👤</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Upload Photo</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Full Name</Label>
                  <Input 
                    className="mt-1" 
                    value={personalInfo.name} 
                    onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm">Phone Number</Label>
                  <Input 
                    className="mt-1" 
                    value={personalInfo.phone} 
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Bio</Label>
                <textarea 
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  value={personalInfo.bio} 
                  onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills */}
              <div>
                <Label className="text-sm">Skills & Expertise</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                        <button 
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const newSkills = personalInfo.skills.filter((_, i) => i !== index)
                            setPersonalInfo({...personalInfo, skills: newSkills})
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a new skill" 
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          setPersonalInfo({
                            ...personalInfo, 
                            skills: [...personalInfo.skills, e.currentTarget.value.trim()]
                          })
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label className="text-sm">Certifications</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {personalInfo.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {cert}
                        <button 
                          className="ml-2 text-green-600 hover:text-green-800"
                          onClick={() => {
                            const newCerts = personalInfo.certifications.filter((_, i) => i !== index)
                            setPersonalInfo({...personalInfo, certifications: newCerts})
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a new certification" 
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          setPersonalInfo({
                            ...personalInfo, 
                            certifications: [...personalInfo.certifications, e.currentTarget.value.trim()]
                          })
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button variant="outline" size="sm">Add</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={savePersonalInfo}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        ) : tab === "account" ? (
          <Card className="lg:col-span-3">
                          <CardHeader>
                <CardTitle>Account & Security</CardTitle>
                <CardDescription>Update your account email, password, and security settings</CardDescription>
              </CardHeader>
            <CardContent className="space-y-8">
              {/* Email */}
              <div>
                <Label className="text-sm">Email Address</Label>
                <div className="mt-2 flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <Button onClick={updateEmail}>Update</Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">You'll need to confirm your new email address</p>
              </div>

              {/* Password */}
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <div className="grid gap-3 max-w-xl">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPass ? "text" : "password"}
                      className="pl-9 pr-10"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPass ? "text" : "password"}
                      className="pl-9 pr-10"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" className="absolute right-3 top-3 text-gray-400" onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPass ? "text" : "password"}
                      className="pl-9 pr-10"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Button onClick={updatePassword}>Update Password</Button>
                  </div>
                </div>
              </div>

              {/* Two-Factor placeholder */}
              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <div className="border rounded p-6 text-center text-gray-600">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  Two-factor authentication is not enabled.
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="font-medium mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Profile Visibility</Label>
                      <p className="text-xs text-gray-500">Who can see your profile information</p>
                    </div>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="team">Team Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Visibility</Label>
                      <p className="text-xs text-gray-500">Who can see your email address</p>
                    </div>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={privacySettings.emailVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, emailVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="team">Team Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Phone Visibility</Label>
                      <p className="text-xs text-gray-500">Who can see your phone number</p>
                    </div>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={privacySettings.phoneVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, phoneVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="team">Team Only</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Skills Visibility</Label>
                      <p className="text-xs text-gray-500">Who can see your skills and expertise</p>
                    </div>
                    <select 
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={privacySettings.skillsVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, skillsVisibility: e.target.value})}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="team">Team Only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-gray-500">Receive notifications via email</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-gray-500">Receive push notifications</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">In-App Alerts</Label>
                      <p className="text-xs text-gray-500">Show notifications within the app</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.inAppAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, inAppAlerts: e.target.checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Marketing Emails</Label>
                      <p className="text-xs text-gray-500">Receive promotional and marketing emails</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={notificationSettings.marketingEmails}
                      onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Save Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={savePrivacySettings}>Save Privacy Settings</Button>
                <Button variant="outline" onClick={saveNotificationSettings}>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Choose the plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className={`border rounded-xl p-6 ${plan === "free" ? "ring-2 ring-blue-500" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold">Free Tier</h3>
                    </div>
                    {plan === "free" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Current Plan</span>
                    )}
                  </div>
                  <div className="text-3xl font-bold">$0 <span className="text-base font-normal">/forever</span></div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Up to 5 API keys</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Advanced key management</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> In-app notifications</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Enhanced security features</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> HTTPS encryption</li>
                  </ul>
                  <div className="mt-6">
                    {plan === "free" ? (
                      <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={handleDowngrade}>Switch to Free</Button>
                    )}
                  </div>
                </div>

                {/* Pro Plan */}
                <div className={`border rounded-xl p-6 ${plan === "pro" ? "ring-2 ring-green-600" : ""}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-orange-600" />
                      <h3 className="text-xl font-semibold">Pro Plan</h3>
                    </div>
                  </div>
                  <div className="text-3xl font-bold">$9 <span className="text-base font-normal">/per month</span></div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Up to 25 API keys</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Advanced analytics & reporting</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Email notifications & alerts</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600"/> Enterprise security features</li>
                  </ul>
                  <div className="mt-6">
                    {plan === "pro" ? (
                      <Button className="w-full" disabled>You're on Pro</Button>
                    ) : (
                      <Button className="w-full" onClick={handleUpgrade}>Upgrade to Pro</Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">Cancel anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


