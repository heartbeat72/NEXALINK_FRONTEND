"use client"

import { useState } from "react"
import { Save, Server, Shield, Bell, Users, Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function SystemSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // General settings state
  const [siteName, setSiteName] = useState("NexaLink Academic System")
  const [siteDescription, setSiteDescription] = useState("Comprehensive academic management system")
  const [academicYear, setAcademicYear] = useState("2025-2026")
  const [semester, setSemester] = useState("Spring")

  // Security settings state
  const [passwordPolicy, setPasswordPolicy] = useState("strong")
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [ipRestriction, setIpRestriction] = useState(false)

  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [attendanceAlerts, setAttendanceAlerts] = useState(true)
  const [gradingAlerts, setGradingAlerts] = useState(true)

  // User management settings state
  const [userApproval, setUserApproval] = useState(true)
  const [bulkImport, setBulkImport] = useState(true)
  const [accountLockout, setAccountLockout] = useState("3")

  // Backup settings state
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [retentionPeriod, setRetentionPeriod] = useState("30")

  const handleSaveSettings = () => {
    // In a real application, this would save to a database
    toast({
      title: "Settings saved",
      description: "Your system settings have been updated successfully.",
    })
  }

  const handleBackupNow = () => {
    toast({
      title: "Backup initiated",
      description: "System backup has been started. You will be notified when complete.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure and manage system-wide settings for the academic platform</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>Configure basic system settings and academic period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input
                  id="site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Current Academic Year</Label>
                  <Input id="academic-year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, 1 number, 1 uppercase)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, numbers, mixed case, symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                <Switch id="two-factor" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ip-restriction">IP Restriction</Label>
                <Switch id="ip-restriction" checked={ipRestriction} onCheckedChange={setIpRestriction} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="attendance-alerts">Attendance Alerts</Label>
                <Switch id="attendance-alerts" checked={attendanceAlerts} onCheckedChange={setAttendanceAlerts} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="grading-alerts">Grading Alerts</Label>
                <Switch id="grading-alerts" checked={gradingAlerts} onCheckedChange={setGradingAlerts} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* User Management Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>Configure user account settings and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="user-approval">Require Admin Approval for New Users</Label>
                <Switch id="user-approval" checked={userApproval} onCheckedChange={setUserApproval} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bulk-import">Enable Bulk User Import</Label>
                <Switch id="bulk-import" checked={bulkImport} onCheckedChange={setBulkImport} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-lockout">Account Lockout After Failed Attempts</Label>
                <Input
                  id="account-lockout"
                  type="number"
                  value={accountLockout}
                  onChange={(e) => setAccountLockout(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Backup & Recovery</span>
              </CardTitle>
              <CardDescription>Configure system backup settings and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={!autoBackup}>
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-period">Retention Period (days)</Label>
                <Input
                  id="retention-period"
                  type="number"
                  value={retentionPeriod}
                  onChange={(e) => setRetentionPeriod(e.target.value)}
                  disabled={!autoBackup}
                />
              </div>
              <Button variant="outline" className="w-full" onClick={handleBackupNow}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
