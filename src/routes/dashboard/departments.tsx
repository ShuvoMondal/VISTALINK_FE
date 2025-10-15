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
  useGetAllDepartmentsQuery, 
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation,
  useCreateDepartmentMutation 
} from '@/api/services'
import { Department } from '@/api/services/types'
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

export const Route = createFileRoute('/dashboard/departments')({
  component: DepartmentsPage,
})

function DepartmentsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { data: departmentsResponse, isLoading, isError, refetch } = useGetAllDepartmentsQuery(page, size)
  
  // Extract departments from paginated response if needed
  const departments = departmentsResponse?.content || departmentsResponse || [];
  
  // Pagination details
  const totalPages = departmentsResponse?.totalPages || 1;
  const totalElements = departmentsResponse?.totalElements || departments.length;
  const currentPage = departmentsResponse?.number || page;
  const deleteDepartmentMutation = useDeleteDepartmentMutation()
  const updateDepartmentMutation = useUpdateDepartmentMutation()
  const createDepartmentMutation = useCreateDepartmentMutation()
  
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Department>>({
    name: ''
  })

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading departments...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading departments</div>

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      id: department.id,
      name: department.name
    })
  }

  const handleSave = () => {
    if (editingDepartment && editingDepartment.id) {
      updateDepartmentMutation.mutate({ 
        id: editingDepartment.id, 
        department: formData as Department 
      }, {
        onSuccess: () => {
          setEditingDepartment(null)
          setFormData({ name: '' })
          refetch()
        }
      })
    }
  }

  const handleCreate = () => {
    createDepartmentMutation.mutate(formData as Department, {
      onSuccess: () => {
        setIsCreateDialogOpen(false)
        setFormData({ name: '' })
        refetch()
      }
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      deleteDepartmentMutation.mutate(id, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const handleFormChange = (field: keyof Department, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Departments Management</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Department</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to the organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dept-name" className="text-right">Name</Label>
                  <Input
                    id="dept-name"
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="col-span-3"
                    placeholder="Enter department name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreate}
                  disabled={createDepartmentMutation.isPending}
                >
                  {createDepartmentMutation.isPending ? 'Creating...' : 'Create Department'}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments?.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.id}</TableCell>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEdit(department)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(department.id!)}
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

      {editingDepartment && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Department - {editingDepartment.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-dept-name">Department Name</Label>
                <Input
                  id="edit-dept-name"
                  value={formData.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="Enter department name"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={handleSave}
                disabled={updateDepartmentMutation.isPending}
              >
                {updateDepartmentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingDepartment(null)
                  setFormData({ name: '' })
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