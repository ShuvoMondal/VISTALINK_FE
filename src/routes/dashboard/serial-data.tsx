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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  useGetLatestSerialDataQuery,
  useGetPhByMeterQuery,
  useGetOrpByMeterQuery,
  useGetMvByMeterQuery,
  useGetPhCalibrationByMeterQuery,
  useGetOrpCalibrationByMeterQuery,
  useGetTemperatureCalibrationByMeterQuery,
  useGetRecordsByFilterQuery
} from '@/api/services'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute('/dashboard/serial-data')({
  component: SerialDataPage,
})

function SerialDataPage() {
  const [meterNumber, setMeterNumber] = useState('')
  const [dataType, setDataType] = useState('ph')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  // Get data based on selected type
  const { data: latestData, isLoading: latestLoading } = useGetLatestSerialDataQuery({ page, size })
  const { data: phData, isLoading: phLoading } = useGetPhByMeterQuery({ meterNumber, page, size })
  const { data: orpData, isLoading: orpLoading } = useGetOrpByMeterQuery({ meterNumber, page, size })
  const { data: mvData, isLoading: mvLoading } = useGetMvByMeterQuery({ meterNumber, page, size })
  const { data: phCalData, isLoading: phCalLoading } = useGetPhCalibrationByMeterQuery({ meterNumber, page, size })
  const { data: orpCalData, isLoading: orpCalLoading } = useGetOrpCalibrationByMeterQuery({ meterNumber, page, size })
  const { data: tempCalData, isLoading: tempCalLoading } = useGetTemperatureCalibrationByMeterQuery({ meterNumber, page, size })

  // Filter data if date range is selected
  const { data: filteredData, isLoading: filterLoading } = 
    startDate && endDate && meterNumber ? 
    useGetRecordsByFilterQuery({ meterNumber, dataType, start: startDate, end: endDate, page, size }) : 
    { data: undefined, isLoading: false }

  const currentData = filteredData || 
    (dataType === 'ph' ? phData : 
     dataType === 'orp' ? orpData : 
     dataType === 'mv' ? mvData : 
     dataType === 'phcal' ? phCalData : 
     dataType === 'orpcal' ? orpCalData : 
     tempCalData)

  const isLoading = filteredData ? filterLoading : 
    dataType === 'ph' ? phLoading : 
    dataType === 'orp' ? orpLoading : 
    dataType === 'mv' ? mvLoading : 
    dataType === 'phcal' ? phCalLoading : 
    dataType === 'orpcal' ? orpCalLoading : 
    dataType === 'tempcal' ? tempCalLoading : latestLoading

  const handleSearch = () => {
    // Reset pagination when searching
    setPage(0)
  }

  const renderTableHeader = () => {
    switch(dataType) {
      case 'ph':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Data Log Date</TableHead>
            <TableHead>pH Value</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Mode</TableHead>
          </>
        )
      case 'orp':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Data Log Date</TableHead>
            <TableHead>ORP Value</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Mode</TableHead>
          </>
        )
      case 'mv':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Data Log Date</TableHead>
            <TableHead>mV Value</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Mode</TableHead>
          </>
        )
      case 'phcal':
      case 'orpcal':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Cal Log Date</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Slope %</TableHead>
          </>
        )
      case 'tempcal':
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Meter Number</TableHead>
            <TableHead>Log Date</TableHead>
            <TableHead>ATC Temp</TableHead>
            <TableHead>Entered Temp 1</TableHead>
            <TableHead>Offset Temp</TableHead>
          </>
        )
      default:
        return (
          <>
            <TableHead>ID</TableHead>
            <TableHead>Raw Data</TableHead>
            <TableHead>Received At</TableHead>
          </>
        )
    }
  }

  const renderTableRows = () => {
    if (!currentData?.content) return null
    
    return currentData.content.map((record: any, index: number) => {
      switch(dataType) {
        case 'ph':
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.meterNumber}</TableCell>
              <TableCell>{record.dataLogDate}</TableCell>
              <TableCell>{record.ph}</TableCell>
              <TableCell>{record.temperature} {record.temperatureUnit}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.mode}</TableCell>
            </TableRow>
          )
        case 'orp':
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.meterNumber}</TableCell>
              <TableCell>{record.dataLogDate}</TableCell>
              <TableCell>{record.orp}</TableCell>
              <TableCell>{record.temperature} {record.temperatureUnit}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.mode}</TableCell>
            </TableRow>
          )
        case 'mv':
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.meterNumber}</TableCell>
              <TableCell>{record.dataLogDate}</TableCell>
              <TableCell>{record.mv}</TableCell>
              <TableCell>{record.userName}</TableCell>
              <TableCell>{record.mode}</TableCell>
            </TableRow>
          )
        case 'phcal':
        case 'orpcal':
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.meterNumber}</TableCell>
              <TableCell>{record.calLogDate}</TableCell>
              <TableCell>{record.temperature} {record.temperatureUnit}</TableCell>
              <TableCell>{record.points}</TableCell>
              <TableCell>{record.pointsSlopePercentage}%</TableCell>
            </TableRow>
          )
        case 'tempcal':
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.meterNumber}</TableCell>
              <TableCell>{record.logDate}</TableCell>
              <TableCell>{record.atc1Temp} {record.atc1TempUnit}</TableCell>
              <TableCell>{record.enteredTemp1} {record.enteredTempUnit1}</TableCell>
              <TableCell>{record.offsetTemp} {record.offsetTempUnit}</TableCell>
            </TableRow>
          )
        default:
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.id}</TableCell>
              <TableCell>{record.raw}</TableCell>
              <TableCell>{new Date(record.receivedAt).toLocaleString()}</TableCell>
            </TableRow>
          )
      }
    })
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Serial Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="meter-number">Meter Number</Label>
              <Input
                id="meter-number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Enter meter number"
              />
            </div>
            <div>
              <Label htmlFor="data-type">Data Type</Label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ph">pH Data</SelectItem>
                  <SelectItem value="orp">ORP Data</SelectItem>
                  <SelectItem value="mv">MV Data</SelectItem>
                  <SelectItem value="phcal">pH Calibration</SelectItem>
                  <SelectItem value="orpcal">ORP Calibration</SelectItem>
                  <SelectItem value="tempcal">Temperature Calibration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <Button onClick={handleSearch}>Search</Button>
          </div>

          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="data">Data View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            <TabsContent value="data">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {renderTableHeader()}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          Loading data...
                        </TableCell>
                      </TableRow>
                    ) : currentData?.content && currentData.content.length > 0 ? (
                      renderTableRows()
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {currentData && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentData.numberOfElements} of {currentData.totalElements} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(prev => Math.max(0, prev - 1))}
                      disabled={currentData.number === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentData.number + 1} of {currentData.totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(prev => Math.min(currentData.totalPages - 1, prev + 1))}
                      disabled={currentData.number === currentData.totalPages - 1 || currentData.totalPages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Chart View</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-12">
                  Chart visualization will be displayed here based on the selected data type and filter criteria.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}