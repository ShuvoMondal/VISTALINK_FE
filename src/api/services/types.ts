// API Response Types based on OpenAPI specification

// Department entity
export interface Department {
  id?: number;
  name: string;
}

// Permission Group entity
export interface PermissionGroup {
  id?: number;
  name: string;
}

// Permission entity
export interface Permission {
  id?: number;
  name: string;
  group: PermissionGroup;
}

// Permission Response entity
export interface PermissionResponse {
  id?: number;
  name: string;
}

// Role entity
export interface Role {
  id?: number;
  name: string;
  permissions: Permission[];
}

// Update Password DTO
export interface UpdatePasswordDto {
  newPassword: string;
  oldPassword: string;
}

// User entity
export interface User {
  id?: number;
  name: string;
  username: string;
  password: string;
  passwordLastChanged?: string; // date-time
  idCardNo: string;
  enabled: boolean;
  department: Department;
  roles: Role[];
}

// Serial Port Config entity
export interface SerialPortConfig {
  id?: number;
  meterNumber: string;
  serialPortName: string;
  baudRate: number;
  active: boolean;
}

// PDF Record entity
export interface PdfRecord {
  id?: number;
  fromDateTime: string; // date-time
  toDateTime: string; // date-time
  dataId: number;
  name: 'PH' | 'ORP' | 'MV' | 'PHCAL' | 'ORPCAL' | 'TEMPERATURECAL';
  meterNumber: string;
  requestedBy: User;
  requestReason?: string;
  creationStartTime: string; // date-time
  reviewedBy?: User;
  reviewTime?: string; // date-time
  reviewStatus: 'PENDING' | 'REVIEWED' | 'REJECTED';
  reviewReason?: string;
  approvedBy?: User;
  approvalTime?: string; // date-time
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approveReason?: string;
  pdfUrl?: string;
}

// Password Policy entity
export interface PasswordPolicy {
  id?: number;
  numberOfDays: number;
}

// Notification entity
export interface Notification {
  id?: number;
  title: string;
  message: string;
  recipientUsername: string;
  createdAt: string; // date-time
  read: boolean;
}

// Login Request entity
export interface LoginRequest {
  username: string;
  password: string;
}

// Pageable entity
export interface Pageable {
  page: number; // minimum: 0
  size: number; // minimum: 1
  sort: string[];
}

// LocalTime entity
export interface LocalTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

// Serial Data Record entity
export interface SerialDataRecord {
  id?: number;
  raw: string;
  receivedAt: string; // date-time
}

// Sort Object entity
export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// Page Object entity
export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
}

// Response pages
export interface PageSerialDataRecord {
  totalPages: number;
  totalElements: number;
  size: number;
  content: SerialDataRecord[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// Temperature Calibration entity
export interface TemperatureCalibration {
  id?: number;
  meterNumber: string;
  logDate: string; // date
  logTime: LocalTime;
  logAmPm: string;
  atc1Temp?: number;
  atc1TempUnit?: string;
  enteredTemp1?: number;
  enteredTempUnit1?: string;
  enteredTemp2?: number;
  enteredTempUnit2?: string;
  offsetTemp?: number;
  offsetTempUnit?: string;
}

export interface PageTemperatureCalibration {
  totalPages: number;
  totalElements: number;
  size: number;
  content: TemperatureCalibration[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// pH entity
export interface Ph {
  id?: number;
  meterNumber: string;
  dataLogNumber: number;
  dataLogDate: string; // date
  dataLogTime: LocalTime;
  dataLogAmPm: string;
  userName: string;
  readType: string;
  mode: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureMethod?: string;
  readTime?: string;
  averageSlope?: number;
  averageSlopeUnit?: string;
  calibLogNumber?: string;
  calibLogDate?: string; // date
  calibLogTime?: LocalTime;
  calibLogAmPm?: string;
  instrumentName?: string;
  meterModel?: string;
  meterSerialNumber?: string;
  softwareRevision?: string;
  exportDate?: string; // date
  exportTime?: LocalTime;
  exportAmPm?: string;
  mv?: number;
  mvunit?: string;
  ph?: number;
  phunit?: string;
}

export interface PagePh {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Ph[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// pH Calibration entity
export interface PhCalibration {
  id?: number;
  meterNumber: string;
  calLogDate: string; // date
  calLogTime: LocalTime;
  calLogAmPm: string;
  ph: number;
  temperature?: number;
  temperatureUnit?: string;
  enteredSlopePercentage?: number;
  points: number;
  pointsSlopePercentage?: number;
}

export interface PagePhCalibration {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PhCalibration[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// ORP entity
export interface Orp {
  id?: number;
  meterNumber: string;
  dataLogNumber: number;
  dataLogDate: string; // date
  dataLogTime: LocalTime;
  dataLogAmPm: string;
  userName: string;
  readType: string;
  mode: string;
  orp?: number;
  orpUnit?: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureMethod?: string;
  readTime?: string;
  orpCalType?: string;
  offsetValue?: number;
  offsetValueUnit?: string;
  calibLogNumber?: string;
  calibLogDate?: string; // date
  calibLogTime?: LocalTime;
  calibLogAmPm?: string;
  instrumentName?: string;
  meterModel?: string;
  meterSerialNumber?: string;
  softwareRevision?: string;
  exportDate?: string; // date
  exportTime?: LocalTime;
  exportAmPm?: string;
  mv?: number;
  mvunit?: string;
}

export interface PageOrp {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Orp[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// ORP Calibration entity
export interface OrpCalibration {
  id?: number;
  meterNumber: string;
  calLogDate: string; // date
  calLogTime: LocalTime;
  calLogAmPm: string;
  orpCalType: string;
  rmv?: number;
  temperature?: number;
  temperatureUnit?: string;
  offset?: number;
  offsetUnit?: string;
}

export interface PageOrpCalibration {
  totalPages: number;
  totalElements: number;
  size: number;
  content: OrpCalibration[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// MV entity
export interface Mv {
  id?: number;
  meterNumber: string;
  dataLogNumber: number;
  dataLogDate: string; // date
  dataLogTime: LocalTime;
  dataLogAmPm: string;
  userName: string;
  readType: string;
  mode: string;
  temperature?: number;
  temperatureUnit?: string;
  temperatureMethod?: string;
  readTime?: string;
  instrumentName?: string;
  meterModel?: string;
  meterSerialNumber?: string;
  softwareRevision?: string;
  exportDate?: string; // date
  exportTime?: LocalTime;
  exportAmPm?: string;
  mv?: number;
  mvunit?: string;
}

export interface PageMv {
  totalPages: number;
  totalElements: number;
  size: number;
  content: Mv[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// User Activity Log entity
export interface UserActivityLog {
  username: string;
  action: string;
  timestamp: string; // date-time
}

export interface PageUserActivityLog {
  totalPages: number;
  totalElements: number;
  size: number;
  content: UserActivityLog[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: PageableObject;
  empty: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Request parameters
export interface PdfRecordRequestParams {
  requesterId: number;
  dataId: number;
  dataType: 'PH' | 'ORP' | 'MV' | 'PHCAL' | 'ORPCAL' | 'TEMPERATURECAL';
  requestReason?: string;
}

export interface ReviewPdfParams {
  pdfRecordId: number;
  reviewerUserId: number;
  reviewStatus: 'PENDING' | 'REVIEWED' | 'REJECTED';
  reviewReason?: string;
}

export interface ApprovePdfParams {
  pdfRecordId: number;
  approverUserId: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approveReason?: string;
}

export interface GetDataByMeterParams {
  meterNumber: string;
  page?: number;
  size?: number;
}

export interface GetDataByTimeRangeParams {
  start: string; // date-time
  end: string; // date-time
  page: number;
  size: number;
}

export interface GetDataByFilterParams extends GetDataByTimeRangeParams {
  meterNumber: string;
  dataType: string;
}