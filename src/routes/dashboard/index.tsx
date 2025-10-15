import { createFileRoute } from '@tanstack/react-router'
import { ApprovalWorkflow } from '@/components/approval-workflow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'

import { SectionCards } from '@/components/section-cards'
import { Button } from '@/components/ui/button'
import { 
  IconUsers, 
  IconUserShield, 
  IconListDetails, 
  IconDatabase, 
  IconFileCertificate,
  IconActivity,
  IconMail,
  IconSettings,
  IconReport
} from '@tabler/icons-react'
import { useGetCurrentUserQuery } from '@/api/services/authService'
import { useGetAllUsersQuery, useGetAllRolesQuery, useGetAllDepartmentsQuery } from '@/api/services'
import data from '@/app/dashboard/data.json'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndex,
})

function DashboardIndex() {
  const { data: currentUser, isLoading: currentUserLoading } = useGetCurrentUserQuery()
  const { data: usersResponse, isLoading: usersLoading } = useGetAllUsersQuery(0, 100) // Get all users for stats
  const { data: rolesResponse, isLoading: rolesLoading } = useGetAllRolesQuery()
  const { data: departmentsResponse, isLoading: departmentsLoading } = useGetAllDepartmentsQuery(0, 100) // Get all departments for stats
  
  // Extract content from paginated response if needed, otherwise use as-is
  const users = usersResponse?.content || usersResponse || [];
  const roles = rolesResponse?.content || rolesResponse || [];
  const departments = departmentsResponse?.content || departmentsResponse || [];
  
  // Show loading state while data is being fetched
  if (currentUserLoading || usersLoading || rolesLoading || departmentsLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }
  
  const quickActions = [
    { title: "Manage Users", icon: IconUsers, path: "/dashboard/users", description: "Create, edit, or delete user accounts" },
    { title: "Configure Roles", icon: IconUserShield, path: "/dashboard/roles", description: "Manage user roles and permissions" },
    { title: "View Data", icon: IconDatabase, path: "/dashboard/serial-data", description: "Access and analyze serial data" },
    { title: "PDF Records", icon: IconFileCertificate, path: "/dashboard/pdf-records", description: "View and manage PDF records" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      {/* Welcome Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-full p-3">
                <IconUsers className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Welcome back, {currentUser?.name || 'User'}!
                </h2>
                <p className="text-muted-foreground">
                  Here's what's happening with your dashboard today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{(Array.isArray(users) ? users.filter(u => u.passwordLastChanged && new Date(u.passwordLastChanged) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length : 0) || 0} this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{(Array.isArray(roles) ? roles.filter(r => r.id && r.id > 1).length : 0) || 0} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {(Array.isArray(departments) ? departments.filter(d => d.name).length : 0) || 0} configured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-2 text-left"
                onClick={() => {
                  // Navigate to the action path
                  window.location.hash = `#${action.path}`;
                }}
              >
                <action.icon className="h-8 w-8 text-primary" />
                <div className="font-medium">{action.title}</div>
                <p className="text-xs text-muted-foreground text-center">{action.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Data */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Data Ports Active</span>
                <span className="text-sm">4/4</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">System Health</span>
                <span className="text-sm">Optimal</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Security Status</span>
                <span className="text-sm">Active</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalWorkflow />
        </CardContent>
      </Card>
    </div>
  )
}
