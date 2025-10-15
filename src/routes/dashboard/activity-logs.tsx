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
  useGetAllLogsQuery,
  useSearchByUsernameQuery
} from '@/api/services'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/dashboard/activity-logs')({
  component: ActivityLogsPage,
})

function ActivityLogsPage() {
  const [usernameFilter, setUsernameFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const {
    data: logsResponse,
    isLoading,
    isError
  } = useGetAllLogsQuery()

  const {
    data: filteredLogsResponse
  } = useSearchByUsernameQuery(usernameFilter, page, size, !!usernameFilter)
  
  // Extract logs from paginated response if needed
  const logs = logsResponse?.content || logsResponse || [];
  const filteredLogs = filteredLogsResponse?.content || filteredLogsResponse;

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading activity logs...</div>
  if (isError) return <div className="flex justify-center items-center h-64 text-red-500">Error loading activity logs</div>

  // Apply additional client-side filtering if needed
  const filteredData = usernameFilter ? filteredLogs : logs
  const displayedLogs = filteredData?.content?.filter(log => {
    if (!log) return false
    return (
      (!actionFilter || log.action.toLowerCase().includes(actionFilter.toLowerCase()))
    )
  }) || []

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="username-filter">Username</Label>
              <Input
                id="username-filter"
                value={usernameFilter}
                onChange={(e) => {
                  setUsernameFilter(e.target.value)
                  setPage(0) // Reset to first page when filtering
                }}
                placeholder="Filter by username"
              />
            </div>
            <div>
              <Label htmlFor="action-filter">Action</Label>
              <Input
                id="action-filter"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  setPage(0) // Reset to first page when filtering
                }}
                placeholder="Filter by action"
              />
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setUsernameFilter('')
                  setActionFilter('')
                  setPage(0)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedLogs.length > 0 ? (
                  displayedLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{log?.username}</TableCell>
                      <TableCell>{log?.action}</TableCell>
                      <TableCell>{log?.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No activity logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredData && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {displayedLogs.length} of {filteredData.totalElements} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={filteredData.number === 0}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {filteredData.number + 1} of {filteredData.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(prev => Math.min(filteredData.totalPages - 1, prev + 1))}
                  disabled={filteredData.number === filteredData.totalPages - 1 || filteredData.totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}