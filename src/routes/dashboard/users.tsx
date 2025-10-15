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
  useGetAllUsersQuery, 
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation
} from '@/api/services'
import { User, Department, Role } from '@/api/services/types'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGetAllDepartmentsQuery } from '@/api/services'
import { useGetAllRolesQuery } from '@/api/services'

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
})

function UsersPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { data: usersResponse, isLoading, isError, refetch } = useGetAllUsersQuery(page, size)
  const { data: departmentsResponse } = useGetAllDepartmentsQuery()
  const { data: rolesResponse } = useGetAllRolesQuery()
  
  // Extract data from paginated responses if needed
  const users = usersResponse?.content || usersResponse || [];
  const departments = departmentsResponse?.content || departmentsResponse || [];
  const roles = rolesResponse?.content || rolesResponse || [];
  
  // Pagination details
  const totalPages = usersResponse?.totalPages || 1;
  const totalElements = usersResponse?.totalElements || users.length;
  const currentPage = usersResponse?.number || page;
  const deleteUserMutation = useDeleteUserMutation()
  const updateUserMutation = useUpdateUserMutation()
  const createUserMutation = useCreateUserMutation()
  
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    idCardNo: '',
    enabled: true,
    department: undefined,
    roles: []
  })
  
  // State for delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading users...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading users</div>

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      id: user.id,
      name: user.name,
      username: user.username,
      idCardNo: user.idCardNo,
      enabled: user.enabled,
      department: user.department,
      roles: user.roles
    })
  }

  const handleSave = () => {
    if (editingUser && editingUser.id) {
      updateUserMutation.mutate({ 
        id: editingUser.id, 
        user: formData as User 
      }, {
        onSuccess: () => {
          setEditingUser(null)
          setFormData({
            name: '',
            username: '',
            idCardNo: '',
            enabled: true,
            department: undefined,
            roles: []
          })
          refetch()
        }
      })
    }
  }

  const handleCreate = () => {
    createUserMutation.mutate(formData as User, {
      onSuccess: () => {
        setIsCreateDialogOpen(false)
        setFormData({
          name: '',
          username: '',
          idCardNo: '',
          enabled: true,
          department: undefined,
          roles: []
        })
        refetch()
      }
    })
  }

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  }

  const handleFormChange = (field: keyof User, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleUserStatus = (user: User) => {
    if (user.id) {
      const updatedUser = {
        ...user,
        enabled: !user.enabled
      };
      updateUserMutation.mutate({ 
        id: user.id, 
        user: updatedUser 
      }, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  }

  const handleDeleteConfirm = () => {
    if (userToDelete && userToDelete.id) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          refetch();
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
        }
      });
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. Fill in the required details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">Username</Label>
                  <Input
                    id="username"
                    value={formData.username || ''}
                    onChange={(e) => handleFormChange('username', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="idCardNo" className="text-right">ID Card No</Label>
                  <Input
                    id="idCardNo"
                    value={formData.idCardNo || ''}
                    onChange={(e) => handleFormChange('idCardNo', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">Department</Label>
                  <Select 
                    value={formData.department?.id?.toString() || ''} 
                    onValueChange={(value) => {
                      const dept = departments?.find(d => d.id?.toString() === value)
                      handleFormChange('department', dept)
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id?.toString() || ''}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="enabled"
                        checked={formData.enabled === true}
                        onChange={() => handleFormChange('enabled', true)}
                        className="h-4 w-4"
                      />
                      <span>Active</span>
                    </Label>
                    <Label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="enabled"
                        checked={formData.enabled === false}
                        onChange={() => handleFormChange('enabled', false)}
                        className="h-4 w-4"
                      />
                      <span>Inactive</span>
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreate}
                  disabled={createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>ID Card</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.idCardNo}</TableCell>
                    <TableCell>{user.department?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {user.roles?.map(role => role.name).join(', ') || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          user.enabled 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.enabled ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage * size) + 1}-{Math.min((currentPage + 1) * size, totalElements)} of {totalElements} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(prev => prev + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingUser && (
        <Card>
          <CardHeader>
            <CardTitle>Edit User - {editingUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username || ''}
                  onChange={(e) => handleFormChange('username', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-idCardNo">ID Card No</Label>
                <Input
                  id="edit-idCardNo"
                  value={formData.idCardNo || ''}
                  onChange={(e) => handleFormChange('idCardNo', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Select 
                  value={formData.department?.id?.toString() || ''} 
                  onValueChange={(value) => {
                    const dept = departments?.find(d => d.id?.toString() === value)
                    handleFormChange('department', dept)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id?.toString() || ''}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Status</Label>
                <div className="flex space-x-4 mt-2">
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-enabled"
                      checked={formData.enabled === true}
                      onChange={() => handleFormChange('enabled', true)}
                      className="h-4 w-4"
                    />
                    <span>Active</span>
                  </Label>
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-enabled"
                      checked={formData.enabled === false}
                      onChange={() => handleFormChange('enabled', false)}
                      className="h-4 w-4"
                    />
                    <span>Inactive</span>
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingUser(null)
                  setFormData({
                    name: '',
                    username: '',
                    idCardNo: '',
                    enabled: true,
                    department: undefined,
                    roles: []
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user <strong>{userToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
