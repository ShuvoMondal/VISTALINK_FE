import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  useGetCurrentPolicyQuery,
  useSetNewPolicyMutation
} from '@/api/services'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data: policy, isLoading, isError, refetch } = useGetCurrentPolicyQuery()
  const setNewPolicyMutation = useSetNewPolicyMutation()
  
  const [passwordDays, setPasswordDays] = useState(policy?.numberOfDays?.toString() || '90')
  const [systemSettings, setSystemSettings] = useState({
    darkMode: true,
    notifications: true,
    autoBackup: true,
    dataRetention: 30
  })

  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading settings</div>

  const handlePolicyUpdate = () => {
    setNewPolicyMutation.mutate({
      id: policy?.id,
      numberOfDays: parseInt(passwordDays)
    }, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleSystemSettingsChange = (field: keyof typeof systemSettings, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="password">Password Policy</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password Policy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Expiration</h4>
                      <p className="text-sm text-muted-foreground">
                        Set how often users must change their passwords
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={passwordDays}
                        onChange={(e) => setPasswordDays(e.target.value)}
                        className="w-24 text-right"
                        min="1"
                      />
                      <span className="text-sm">days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="font-medium">Current Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        Passwords expire every {policy?.numberOfDays || 90} days
                      </p>
                    </div>
                    <Button 
                      onClick={handlePolicyUpdate}
                      disabled={setNewPolicyMutation.isPending}
                    >
                      {setNewPolicyMutation.isPending ? 'Updating...' : 'Update Policy'}
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Password Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Minimum 8 characters</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">At least 1 uppercase</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">At least 1 lowercase</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">At least 1 number</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the application
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.darkMode}
                      onCheckedChange={(checked) => handleSystemSettingsChange('darkMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important events
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.notifications}
                      onCheckedChange={(checked) => handleSystemSettingsChange('notifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Backup</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup data every 24 hours
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleSystemSettingsChange('autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <h4 className="font-medium">Data Retention</h4>
                      <p className="text-sm text-muted-foreground">
                        How long to keep old data (in days)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={systemSettings.dataRetention}
                        onChange={(e) => handleSystemSettingsChange('dataRetention', parseInt(e.target.value))}
                        className="w-24 text-right"
                        min="1"
                      />
                      <span className="text-sm">days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Control what information is visible to others
                      </p>
                    </div>
                    <Button variant="outline">Manage Privacy</Button>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Be careful, these actions are irreversible
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="destructive">Delete Account</Button>
                      <Button variant="outline">Export Account Data</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}