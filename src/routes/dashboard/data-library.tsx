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
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/data-library')({
  component: DataLibraryPage,
})

function DataLibraryPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Mock data for data library
  const mockDataEntries = [
    {
      id: 1,
      name: 'pH Sensor Data - Q3 2025',
      type: 'pH Data',
      size: '2.4 MB',
      lastUpdated: '2025-09-28',
      category: 'Sensor Data',
      records: 12450
    },
    {
      id: 2,
      name: 'ORP Calibration Records',
      type: 'ORP Calibration',
      size: '1.8 MB',
      lastUpdated: '2025-09-27',
      category: 'Calibration',
      records: 8760
    },
    {
      id: 3,
      name: 'MV Measurements - Monthly',
      type: 'MV Data',
      size: '3.2 MB',
      lastUpdated: '2025-09-26',
      category: 'Sensor Data',
      records: 21560
    },
    {
      id: 4,
      name: 'Temperature Calibrations',
      type: 'Temperature Data',
      size: '1.5 MB',
      lastUpdated: '2025-09-25',
      category: 'Calibration',
      records: 7540
    },
    {
      id: 5,
      name: 'pH Calibration Data',
      type: 'pH Calibration',
      size: '2.1 MB',
      lastUpdated: '2025-09-24',
      category: 'Calibration',
      records: 9800
    },
    {
      id: 6,
      name: 'ORP Sensor Readings',
      type: 'ORP Data',
      size: '4.0 MB',
      lastUpdated: '2025-09-23',
      category: 'Sensor Data',
      records: 32400
    }
  ]

  // Filter data based on search term
  const filteredData = mockDataEntries.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUpload = () => {
    // In a real application, this would handle file upload
    console.log('Uploading file...')
    setIsUploadDialogOpen(false)
  }

  const handleImport = () => {
    // In a real application, this would handle data import
    console.log('Importing data...')
    setIsImportDialogOpen(false)
  }

  const handleDownload = (id: number) => {
    // In a real application, this would download the data file
    alert(`Downloading data with ID: ${id}`)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this data entry? This action cannot be undone.')) {
      console.log(`Deleting data with ID: ${id}`)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Data Library</CardTitle>
          <div className="flex space-x-2">
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Upload Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Data File</DialogTitle>
                  <DialogDescription>
                    Upload a new data file to the library. Supported formats: CSV, Excel, JSON.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input id="file-upload" type="file" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="data-name">Data Name</Label>
                    <Input
                      id="data-name"
                      placeholder="Enter a name for your data"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sensordata">Sensor Data</SelectItem>
                        <SelectItem value="calibration">Calibration Data</SelectItem>
                        <SelectItem value="measurements">Measurements</SelectItem>
                        <SelectItem value="reports">Reports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleUpload}
                  >
                    Upload File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button>Import Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Data</DialogTitle>
                  <DialogDescription>
                    Import data from an external source or API.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="import-source">Import Source</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API Endpoint</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="file">File Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="import-url">Source URL/Path</Label>
                    <Input
                      id="import-url"
                      placeholder="Enter URL or file path"
                    />
                  </div>
                  <div>
                    <Label htmlFor="import-name">Data Name</Label>
                    <Input
                      id="import-name"
                      placeholder="Enter a name for imported data"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleImport}
                  >
                    Import Data
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search data library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="data-type-filter">Filter:</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alls">All Types</SelectItem>
                  <SelectItem value="ph">pH Data</SelectItem>
                  <SelectItem value="orp">ORP Data</SelectItem>
                  <SelectItem value="mv">MV Data</SelectItem>
                  <SelectItem value="calibration">Calibration Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {entry.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{entry.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.category}</Badge>
                      </TableCell>
                      <TableCell>{entry.size}</TableCell>
                      <TableCell>{entry.records.toLocaleString()}</TableCell>
                      <TableCell>{entry.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(entry.id)}
                          >
                            Download
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No data entries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="font-medium mb-2">Sensor Data</h3>
              <p className="text-sm text-muted-foreground mb-2">Raw sensor readings and measurements</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Entries:</span> 12
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-2">Calibration Data</h3>
              <p className="text-sm text-muted-foreground mb-2">Calibration records and adjustments</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Entries:</span> 8
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium mb-2">Reports</h3>
              <p className="text-sm text-muted-foreground mb-2">Generated reports and summaries</p>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Entries:</span> 5
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}