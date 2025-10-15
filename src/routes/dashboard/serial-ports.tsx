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
  useGetAllSerialPortsQuery, 
  useUpdateSerialPortMutation
} from '@/api/services'
import { SerialPortConfig } from '@/api/services/types'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/dashboard/serial-ports')({
  component: SerialPortsPage,
})

function SerialPortsPage() {
  const { data: serialPorts, isLoading, isError, refetch } = useGetAllSerialPortsQuery()
  const updateSerialPortMutation = useUpdateSerialPortMutation()
  
  const [editingPort, setEditingPort] = useState<SerialPortConfig | null>(null)
  const [formData, setFormData] = useState<Partial<SerialPortConfig>>({
    meterNumber: '',
    serialPortName: '',
    baudRate: 9600,
    active: true
  })

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading serial ports...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading serial ports</div>

  const handleEdit = (port: SerialPortConfig) => {
    setEditingPort(port)
    setFormData({
      id: port.id,
      meterNumber: port.meterNumber,
      serialPortName: port.serialPortName,
      baudRate: port.baudRate,
      active: port.active
    })
  }

  const handleSave = () => {
    if (editingPort && editingPort.id) {
      updateSerialPortMutation.mutate({ 
        id: editingPort.id, 
        config: formData as SerialPortConfig 
      }, {
        onSuccess: () => {
          setEditingPort(null)
          setFormData({
            meterNumber: '',
            serialPortName: '',
            baudRate: 9600,
            active: true
          })
          refetch()
        }
      })
    }
  }

  const toggleActive = (port: SerialPortConfig) => {
    const updatedPort: SerialPortConfig = { 
      ...port, 
      active: !port.active 
    };
    updateSerialPortMutation.mutate({ 
      id: port.id!, 
      config: updatedPort 
    }, {
      onSuccess: () => {
        refetch()
      }
    });
  }

  const handleFormChange = (field: keyof SerialPortConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Serial Ports Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Port Name</TableHead>
                  <TableHead>Baud Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serialPorts?.map((port) => (
                  <TableRow key={port.id}>
                    <TableCell className="font-medium">{port.id}</TableCell>
                    <TableCell>{port.meterNumber}</TableCell>
                    <TableCell>{port.serialPortName}</TableCell>
                    <TableCell>{port.baudRate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        port.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {port.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleEdit(port)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant={port.active ? "destructive" : "default"} 
                        size="sm"
                        onClick={() => toggleActive(port)}
                      >
                        {port.active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingPort && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Serial Port - {editingPort.meterNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-meter-number">Meter Number</Label>
                <Input
                  id="edit-meter-number"
                  value={formData.meterNumber || ''}
                  onChange={(e) => handleFormChange('meterNumber', e.target.value)}
                  placeholder="Enter meter number"
                />
              </div>
              <div>
                <Label htmlFor="edit-serial-port">Serial Port Name</Label>
                <Input
                  id="edit-serial-port"
                  value={formData.serialPortName || ''}
                  onChange={(e) => handleFormChange('serialPortName', e.target.value)}
                  placeholder="Enter port name (e.g., COM1, /dev/ttyUSB0)"
                />
              </div>
              <div>
                <Label htmlFor="edit-baud-rate">Baud Rate</Label>
                <Select 
                  value={formData.baudRate?.toString() || '9600'} 
                  onValueChange={(value) => handleFormChange('baudRate', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select baud rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9600">9600</SelectItem>
                    <SelectItem value="19200">19200</SelectItem>
                    <SelectItem value="38400">38400</SelectItem>
                    <SelectItem value="57600">57600</SelectItem>
                    <SelectItem value="115200">115200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <div className="flex space-x-4 mt-2">
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-active"
                      checked={formData.active === true}
                      onChange={() => handleFormChange('active', true)}
                      className="h-4 w-4"
                    />
                    <span>Active</span>
                  </Label>
                  <Label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edit-active"
                      checked={formData.active === false}
                      onChange={() => handleFormChange('active', false)}
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
                disabled={updateSerialPortMutation.isPending}
              >
                {updateSerialPortMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingPort(null)
                  setFormData({
                    meterNumber: '',
                    serialPortName: '',
                    baudRate: 9600,
                    active: true
                  })
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