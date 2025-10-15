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
  useGetAllRolesQuery, 
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useCreateRoleMutation,
  useGetAllPermissionsQuery
} from '@/api/services'
import { Role, Permission } from '@/api/services/types'
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

export const Route = createFileRoute('/dashboard/roles')({
  component: RolesPage,
})

function RolesPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { data: rolesResponse, isLoading, isError, refetch } = useGetAllRolesQuery(page, size)
  const { data: permissionsResponse } = useGetAllPermissionsQuery()
  
  // Extract data from paginated responses if needed
  const roles = rolesResponse?.content || rolesResponse || [];
  const permissions = permissionsResponse?.content || permissionsResponse || [];
  
  // Pagination details for roles
  const totalPages = rolesResponse?.totalPages || 1;
  const totalElements = rolesResponse?.totalElements || roles.length;
  const currentPage = rolesResponse?.number || page;
  const deleteRoleMutation = useDeleteRoleMutation()
  const updateRoleMutation = useUpdateRoleMutation()
  const createRoleMutation = useCreateRoleMutation()
  
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    permissions: []
  })
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading roles...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading roles</div>

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      id: role.id,
      name: role.name,
      permissions: role.permissions
    })
    setSelectedPermissions(role.permissions?.map(p => p.id!) || [])
  }

  const handleSave = () => {
    if (editingRole && editingRole.id) {
      // Create updated role with selected permissions
      const updatedPermissions = permissions?.filter(p => 
        selectedPermissions.includes(p.id!)
      ) || []
      
      updateRoleMutation.mutate({ 
        id: editingRole.id, 
        role: { ...formData, permissions: updatedPermissions } as Role 
      }, {
        onSuccess: () => {
          setEditingRole(null)
          setFormData({
            name: '',
            permissions: []
          })
          setSelectedPermissions([])
          refetch()
        }
      })
    }
  }

  const handleCreate = () => {
    // Create new role with selected permissions
    const newPermissions = permissions?.filter(p => 
      selectedPermissions.includes(p.id!)
    ) || []
    
    createRoleMutation.mutate({ 
      ...formData, 
      permissions: newPermissions 
    } as Role, {
      onSuccess: () => {
        setIsCreateDialogOpen(false)
        setFormData({
          name: '',
          permissions: []
        })
        setSelectedPermissions([])
        refetch()
      }
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      deleteRoleMutation.mutate(id, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId) 
        : [...prev, permissionId]
    )
  }

  const handleFormChange = (field: keyof Role, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Roles Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Role</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
                    {permissions?.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`perm-${permission.id}`}
                          checked={selectedPermissions.includes(permission.id!)}
                          onChange={() => togglePermission(permission.id!)}
                          className="h-4 w-4 mr-2"
                        />
                        <label htmlFor={`perm-${permission.id}`} className="text-sm">
                          <span className="font-medium">{permission.name}</span> 
                          <span className="text-xs text-muted-foreground ml-2">
                            ({permission.group?.name})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreate}
                  disabled={createRoleMutation.isPending}
                >
                  {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
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
                  <TableHead>Permissions Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles?.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.permissions?.length || 0}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEdit(role)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(role.id!)}
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

      {editingRole && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Role - {editingRole.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-role-name">Role Name</Label>
                <Input
                  id="edit-role-name"
                  value={formData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="mt-2 space-y-2 max-h-80 overflow-y-auto p-2 border rounded">
                  {permissions?.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-perm-${permission.id}`}
                        checked={selectedPermissions.includes(permission.id!)}
                        onChange={() => togglePermission(permission.id!)}
                        className="h-4 w-4 mr-2"
                      />
                      <label htmlFor={`edit-perm-${permission.id}`} className="text-sm">
                        <span className="font-medium">{permission.name}</span> 
                        <span className="text-xs text-muted-foreground ml-2">
                          ({permission.group?.name})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={handleSave}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingRole(null)
                  setFormData({
                    name: '',
                    permissions: []
                  })
                  setSelectedPermissions([])
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}