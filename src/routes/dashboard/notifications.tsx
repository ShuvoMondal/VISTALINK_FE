import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
  useGetCurrentUserQuery
} from '@/api/services'
import { Notification } from '@/api/services/types'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const { data: currentUser } = useGetCurrentUserQuery()
  const { data: notifications, isLoading, isError, refetch } = useGetNotificationsQuery(currentUser?.username || '')
  const markAsReadMutation = useMarkAsReadMutation()
  const deleteNotificationMutation = useDeleteNotificationMutation()
  const createNotificationMutation = useCreateNotificationMutation()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipientUsername: '',
    read: false
  })

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading notifications...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading notifications</div>

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      deleteNotificationMutation.mutate(id, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const handleCreate = () => {
    createNotificationMutation.mutate({
      ...formData,
      recipientUsername: formData.recipientUsername || 'admin'
    } as Notification, {
      onSuccess: () => {
        setIsCreateDialogOpen(false)
        setFormData({
          title: '',
          message: '',
          recipientUsername: '',
          read: false
        })
        refetch()
      }
    })
  }

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Count unread notifications
  const unreadCount = notifications?.filter(n => !n.read).length || 0

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Create Notification</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Notification</DialogTitle>
                  <DialogDescription>
                    Send a new notification to a user.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder="Enter notification title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Input
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      placeholder="Enter notification message"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      value={formData.recipientUsername}
                      onChange={(e) => handleFormChange('recipientUsername', e.target.value)}
                      placeholder="Enter recipient username"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleCreate}
                    disabled={createNotificationMutation.isPending}
                  >
                    {createNotificationMutation.isPending ? 'Creating...' : 'Create Notification'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications?.length ? (
                  notifications.map((notification) => (
                    <TableRow 
                      key={notification.id} 
                      className={!notification.read ? 'bg-blue-50' : ''}
                    >
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          notification.read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.read ? 'Read' : 'Unread'}
                        </span>
                      </TableCell>
                      <TableCell className={!notification.read ? 'font-semibold' : ''}>
                        {notification.title}
                      </TableCell>
                      <TableCell className={!notification.read ? 'font-semibold' : ''}>
                        {notification.message}
                      </TableCell>
                      <TableCell>{notification.recipientUsername}</TableCell>
                      <TableCell>
                        {new Date(notification.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id!)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(notification.id!)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}