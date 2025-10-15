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
  useGetAllPdfRecordsQuery,
  useReviewPdfMutation,
  useApprovePdfMutation
} from '@/api/services'
import { PdfRecord } from '@/api/services/types'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ApprovalWorkflow() {
  const { data: pdfRecords, isLoading, isError, refetch } = useGetAllPdfRecordsQuery()
  const reviewPdfMutation = useReviewPdfMutation()
  const approvePdfMutation = useApprovePdfMutation()
  
  const [selectedRecord, setSelectedRecord] = useState<PdfRecord | null>(null)
  const [reviewAction, setReviewAction] = useState<'review' | 'approve' | null>(null)
  const [reason, setReason] = useState('')

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading approval workflow...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading approval workflow</div>

  // Filter records that need review or approval
  const pendingReviewRecords = pdfRecords?.filter(record => record.reviewStatus === 'PENDING') || []
  const pendingApprovalRecords = pdfRecords?.filter(record => 
    record.reviewStatus === 'REVIEWED' && record.approvalStatus === 'PENDING'
  ) || []

  const handleReviewOrApprove = (record: PdfRecord, action: 'review' | 'approve') => {
    setSelectedRecord(record)
    setReviewAction(action)
    setReason('')
  }

  const handleReviewOrApproveSubmit = (status: 'APPROVED' | 'REVIEWED' | 'REJECTED') => {
    if (!selectedRecord || !reason.trim()) return

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
          setReason('')
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
          setReason('')
          refetch()
        }
      })
    }
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Pending Review Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Records Awaiting Review</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Meter Number</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReviewRecords.length > 0 ? (
                      pendingReviewRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.meterNumber}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.requestedBy?.name}</TableCell>
                          <TableCell>{new Date(record.fromDateTime).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleReviewOrApprove(record, 'review')}
                              >
                                Review
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No records awaiting review
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pending Approval Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Records Awaiting Approval</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Meter Number</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Reviewed By</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovalRecords.length > 0 ? (
                      pendingApprovalRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.meterNumber}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.requestedBy?.name}</TableCell>
                          <TableCell>{record.reviewedBy?.name}</TableCell>
                          <TableCell>
                            {record.reviewTime ? new Date(record.reviewTime).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleReviewOrApprove(record, 'approve')}
                              >
                                Approve
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No records awaiting approval
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review/Approve Dialog */}
      {selectedRecord && reviewAction && (
        <Dialog 
          open={!!(selectedRecord && reviewAction)} 
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRecord(null)
              setReviewAction(null)
              setReason('')
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === 'review' 
                  ? `Review PDF Record #${selectedRecord.id}` 
                  : `Approve PDF Record #${selectedRecord.id}`}
              </DialogTitle>
              <DialogDescription>
                {reviewAction === 'review' 
                  ? 'Review the PDF record details and provide your feedback.'
                  : 'Approve or reject the PDF record after review.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label><strong>Meter Number:</strong> {selectedRecord.meterNumber}</Label>
                <Label><strong>Data Type:</strong> {selectedRecord.name}</Label>
                <Label><strong>Requested By:</strong> {selectedRecord.requestedBy?.name}</Label>
                <Label><strong>Request Reason:</strong> {selectedRecord.requestReason || 'N/A'}</Label>
              </div>
              <div>
                <Label htmlFor="action-reason">Action Reason</Label>
                <Input
                  id="action-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason for the action..."
                />
              </div>
            </div>
            <DialogFooter className="grid grid-cols-3 gap-2">
              <Button 
                variant="default" 
                onClick={() => handleReviewOrApproveSubmit(reviewAction === 'review' ? 'REVIEWED' : 'APPROVED')}
                disabled={!reason.trim()}
              >
                {reviewAction === 'review' ? 'Mark as Reviewed' : 'Approve'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedRecord(null)
                  setReviewAction(null)
                  setReason('')
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleReviewOrApproveSubmit('REJECTED')}
                disabled={!reason.trim()}
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
