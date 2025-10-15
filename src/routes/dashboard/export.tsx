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
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/dashboard/export')({
  component: ExportPage,
})

function ExportPage() {
  const [exportConfig, setExportConfig] = useState({
    dataType: 'PH',
    startDate: '',
    endDate: '',
    format: 'csv',
    includeMetadata: true,
    compression: 'none'
  })
  const [isExporting, setIsExporting] = useState(false)

  // Mock data for export history
  const exportHistory = [
    {
      id: 1,
      name: 'pH Data Export - Sep 2025',
      type: 'pH Data',
      format: 'CSV',
      date: '2025-09-28',
      size: '2.4 MB',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'ORP Calibration Export',
      type: 'ORP Calibration',
      format: 'Excel',
      date: '2025-09-27',
      size: '1.8 MB',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'MV Measurements Export',
      type: 'MV Data',
      format: 'JSON',
      date: '2025-09-25',
      size: '3.2 MB',
      status: 'Processing'
    },
    {
      id: 4,
      name: 'Temperature Data Export',
      type: 'Temperature Data',
      format: 'CSV',
      date: '2025-09-20',
      size: '1.5 MB',
      status: 'Completed'
    }
  ]

  const handleExport = () => {
    setIsExporting(true)
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      alert(`Exporting ${exportConfig.dataType} data from ${exportConfig.startDate} to ${exportConfig.endDate} in ${exportConfig.format.toUpperCase()} format`)
    }, 1500)
  }

  const handleConfigChange = (field: keyof typeof exportConfig, value: any) => {
    setExportConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="data-type">Data Type</Label>
                    <Select 
                      value={exportConfig.dataType} 
                      onValueChange={(value) => handleConfigChange('dataType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PH">pH Data</SelectItem>
                        <SelectItem value="ORP">ORP Data</SelectItem>
                        <SelectItem value="MV">MV Data</SelectItem>
                        <SelectItem value="PHCAL">pH Calibration</SelectItem>
                        <SelectItem value="ORPCAL">ORP Calibration</SelectItem>
                        <SelectItem value="TEMPERATURECAL">Temperature Calibration</SelectItem>
                        <SelectItem value="ALL">All Data Types</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="format">Export Format</Label>
                    <Select 
                      value={exportConfig.format} 
                      onValueChange={(value) => handleConfigChange('format', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xml">XML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={exportConfig.startDate}
                        onChange={(e) => handleConfigChange('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={exportConfig.endDate}
                        onChange={(e) => handleConfigChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-metadata">Include Metadata</Label>
                    <div>
                      <Input
                        id="include-metadata"
                        type="checkbox"
                        checked={exportConfig.includeMetadata}
                        onChange={(e) => handleConfigChange('includeMetadata', e.target.checked)}
                        className="mr-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="compression">Compression</Label>
                    <Select 
                      value={exportConfig.compression} 
                      onValueChange={(value) => handleConfigChange('compression', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="zip">ZIP</SelectItem>
                        <SelectItem value="gzip">GZIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    onClick={handleExport}
                    disabled={isExporting || !exportConfig.startDate || !exportConfig.endDate}
                  >
                    {isExporting ? 'Exporting...' : 'Start Export'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Selected Type:</span>
                      <span>{exportConfig.dataType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Range:</span>
                      <span>{exportConfig.startDate} to {exportConfig.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span>{exportConfig.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Include Metadata:</span>
                      <span>{exportConfig.includeMetadata ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compression:</span>
                      <span>{exportConfig.compression.toUpperCase()}</span>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Export Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on your selections, this export will include approximately 2,450 records.
                        The estimated file size is 2.4 MB in CSV format.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Select the data type and date range for your export</li>
                    <li>Choose your preferred export format (CSV, Excel, JSON, etc.)</li>
                    <li>Large datasets may take several minutes to process</li>
                    <li>Exported files will be available in your data library</li>
                    <li>Consider using compression for large exports</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Export History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportHistory.map((exportItem) => (
                  <TableRow key={exportItem.id}>
                    <TableCell className="font-medium">
                      {exportItem.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{exportItem.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{exportItem.format}</Badge>
                    </TableCell>
                    <TableCell>{exportItem.date}</TableCell>
                    <TableCell>{exportItem.size}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        exportItem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        exportItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {exportItem.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={exportItem.status !== 'Completed'}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}