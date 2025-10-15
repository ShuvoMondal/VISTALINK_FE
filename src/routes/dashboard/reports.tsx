import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { 
  useGetAllPdfRecordsQuery,
  useDownloadPdfByIdQuery,
  useDownloadCsvDataQuery,
  useRequestSinglePdfMutation,
  useReviewPdfMutation,
  useApprovePdfMutation
} from '@/api/services'
import { PdfRecord } from '@/api/services/types'
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
import pdfRecordService from '@/api/services/pdfRecordService'

export const Route = createFileRoute('/dashboard/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return (
    <Tabs defaultValue="pdf-records">
      <TabsList>
        <TabsTrigger value="pdf-records">PDF Records</TabsTrigger>
        <TabsTrigger value="generate-report">Generate Report</TabsTrigger>
      </TabsList>
      <TabsContent value="pdf-records">
        <PdfRecordsPage />
      </TabsContent>
      <TabsContent value="generate-report">
        <GenerateReportPage />
      </TabsContent>
    </Tabs>
  )
}

function PdfRecordsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  const { data: pdfRecordsResponse, isLoading, isError, refetch } = useGetAllPdfRecordsQuery(page, size)
  
  // Extract pdf records from paginated response if needed
  const pdfRecords = pdfRecordsResponse?.content || pdfRecordsResponse || [];
  
  // Pagination details
  const totalPages = pdfRecordsResponse?.totalPages || 1;
  const totalElements = pdfRecordsResponse?.totalElements || pdfRecords.length;
  const currentPage = pdfRecordsResponse?.number || page;
  const requestSinglePdfMutation = useRequestSinglePdfMutation()
  const reviewPdfMutation = useReviewPdfMutation()
  const approvePdfMutation = useApprovePdfMutation()
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    requesterId: 1, // Default to 1, should be current user ID
    dataId: 1,
    dataType: 'PH' as 'PH' | 'ORP' | 'MV' | 'PHCAL' | 'ORPCAL' | 'TEMPERATURECAL',
    requestReason: ''
  })
  const [selectedRecord, setSelectedRecord] = useState<PdfRecord | null>(null)
  const [reviewAction, setReviewAction] = useState<'review' | 'approve' | null>(null)

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading PDF records...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading PDF records</div>

  const handleRequestNew = () => {
    requestSinglePdfMutation.mutate(formData, {
      onSuccess: () => {
        setIsRequestDialogOpen(false)
        setFormData({
          requesterId: 1,
          dataId: 1,
          dataType: 'PH',
          requestReason: ''
        })
        refetch()
      }
    })
  }

  const handleDownload = async (id: number) => {
    try {
      const blob = await pdfRecordService.downloadPdfById(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `record-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to download PDF', error);
    }
  };

  const handleDownloadCsv = async (id: number) => {
    try {
      const blob = await pdfRecordService.downloadCsvData(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `record-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to download CSV', error);
    }
  };

  const handleReviewOrApprove = (record: PdfRecord, action: 'review' | 'approve') => {
    setSelectedRecord(record)
    setReviewAction(action)
  }

  const handleReviewOrApproveSubmit = (status: 'APPROVED' | 'REVIEWED' | 'REJECTED', reason: string) => {
    if (!selectedRecord) return

    if (reviewAction === 'review') {
      reviewPdfMutation.mutate({
        pdfRecordId: selectedRecord.id!,
        reviewerUserId: 1, // Current user ID
        reviewStatus: status as 'PENDING' | 'REVIEWED' | 'REJECTED',
        reviewReason: reason
      }, {
        onSuccess: () => {
          setSelectedRecord(null)
          setReviewAction(null)
          refetch()
        }
      })
    } else if (reviewAction === 'approve') {
      approvePdfMutation.mutate({
        pdfRecordId: selectedRecord.id!,
        approverUserId: 1, // Current user ID
        approvalStatus: status as 'PENDING' | 'APPROVED' | 'REJECTED',
        approveReason: reason
      }, {
        onSuccess: () => {
          setSelectedRecord(null)
          setReviewAction(null)
          refetch()
        }
      })
    }
  }

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>PDF Records Management</CardTitle>
          <Button onClick={() => setIsRequestDialogOpen(true)}>Request New PDF</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Review Status</TableHead>
                  <TableHead>Approval Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.meterNumber}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.requestedBy?.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.reviewStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        record.reviewStatus === 'REVIEWED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.reviewStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        record.approvalStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        record.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.approvalStatus}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(record.fromDateTime).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(record.id!)}
                          disabled={!record.pdfUrl}
                        >
                          PDF
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadCsv(record.id!)}
                        >
                          CSV
                        </Button>
                        {record.reviewStatus === 'PENDING' && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleReviewOrApprove(record, 'review')}
                          >
                            Review
                          </Button>
                        )}
                        {record.reviewStatus === 'REVIEWED' && record.approvalStatus === 'PENDING' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleReviewOrApprove(record, 'approve')}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
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

      {/* Request New PDF Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New PDF</DialogTitle>
            <DialogDescription>
              Fill in the details to request a new PDF report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="data-type">Data Type</Label>
              <Select 
                value={formData.dataType} 
                onValueChange={(value) => handleFormChange('dataType', value as any)}
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
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="data-id">Data ID</Label>
              <Input
                id="data-id"
                type="number"
                value={formData.dataId}
                onChange={(e) => handleFormChange('dataId', parseInt(e.target.value))}
                placeholder="Enter data ID"
              />
            </div>
            <div>
              <Label htmlFor="request-reason">Request Reason</Label>
              <Input
                id="request-reason"
                value={formData.requestReason}
                onChange={(e) => handleFormChange('requestReason', e.target.value)}
                placeholder="Enter reason for request"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleRequestNew}
              disabled={requestSinglePdfMutation.isPending}
            >
              {requestSinglePdfMutation.isPending ? 'Requesting...' : 'Request PDF'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review/Approve Dialog */}
      {selectedRecord && reviewAction && (
        <Dialog open={!!(selectedRecord && reviewAction)} onOpenChange={() => {setSelectedRecord(null); setReviewAction(null);}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === 'review' ? 'Review PDF Record' : 'Approve PDF Record'} - ID: {selectedRecord.id}
              </DialogTitle>
              <DialogDescription>
                {reviewAction === 'review' 
                  ? 'Review the PDF record and select an action.'
                  : 'Approve or reject the PDF record after review.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>
                  <strong>Meter Number:</strong> {selectedRecord.meterNumber}
                </Label>
              </div>
              <div>
                <Label>
                  <strong>Data Type:</strong> {selectedRecord.name}
                </Label>
              </div>
              <div>
                <Label>
                  <strong>Requested By:</strong> {selectedRecord.requestedBy?.name}
                </Label>
              </div>
              <div>
                <Label htmlFor="action-reason">Reason</Label>
                <Input
                  id="action-reason"
                  placeholder="Enter your reason..."
                  onChange={(e) => setFormData(prev => ({...prev, requestReason: e.target.value}))}
                />
              </div>
            </div>
            <DialogFooter className="grid grid-cols-3 gap-2">
              <Button 
                variant="default" 
                onClick={() => handleReviewOrApproveSubmit(reviewAction === 'review' ? 'REVIEWED' : 'APPROVED', formData.requestReason)}
              >
                {reviewAction === 'review' ? 'Mark as Reviewed' : 'Approve'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {setSelectedRecord(null); setReviewAction(null);}}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReviewOrApproveSubmit('REJECTED', formData.requestReason)}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function GenerateReportPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'PH',
    dateRange: 'lastWeek',
    format: 'pdf'
  })

  // Mock data for existing reports
  const mockReports = [
    {
      id: 1,
      name: 'Daily pH Readings Report',
      type: 'pH Data',
      date: '2025-09-28',
      status: 'Completed',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Weekly ORP Analysis Report',
      type: 'ORP Data',
      date: '2025-09-25',
      status: 'Completed',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Monthly MV Calibration Report',
      type: 'MV Data',
      date: '2025-09-20',
      status: 'Processing',
      size: '3.2 MB'
    },
    {
      id: 4,
      name: 'Temperature Calibration Report',
      type: 'Temperature Data',
      date: '2025-09-18',
      status: 'Completed',
      size: '1.5 MB'
    },
    {
      id: 5,
      name: 'pH Calibration Summary',
      type: 'pH Calibration',
      date: '2025-09-15',
      status: 'Scheduled',
      size: 'N/A'
    }
  ]

  const handleCreate = () => {
    // In a real application, this would call an API to generate the report
    console.log('Creating report with data:', formData)
    setIsCreateDialogOpen(false)
    setFormData({
      name: '',
      type: 'PH',
      dateRange: 'lastWeek',
      format: 'pdf'
    })
  }

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDownload = (id: number) => {
    // In a real application, this would download the report
    alert(`Downloading report with ID: ${id}`)
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reports</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>Generate New Report</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Configure the parameters for your new report.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <Label htmlFor="report-type">Data Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleFormChange('type', value)}
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select 
                    value={formData.dateRange} 
                    onValueChange={(value) => handleFormChange('dateRange', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select 
                    value={formData.format} 
                    onValueChange={(value) => handleFormChange('format', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreate}
                >
                  Generate Report
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
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        report.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleDownload(report.id)}
                        disabled={report.status !== 'Completed'}
                      >
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Report Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
              <h3 className="font-medium mb-2">Standard Data Report</h3>
              <p className="text-sm text-muted-foreground">Includes all standard data measurements with charts and summaries.</p>
            </Card>
            <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
              <h3 className="font-medium mb-2">Calibration Report</h3>
              <p className="text-sm text-muted-foreground">Detailed calibration records with compliance metrics.</p>
            </Card>
            <Card className="p-4 cursor-pointer hover:bg-accent transition-colors">
              <h3 className="font-medium mb-2">Compliance Report</h3>
              <p className="text-sm text-muted-foreground">Regulatory compliance summary with alerts and recommendations.</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
