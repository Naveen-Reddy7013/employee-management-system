// =====================================================
// Employee Management System - TypeScript Types
// =====================================================

// =====================================================
// AUTH & USER TYPES
// =====================================================

export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// EMPLOYEE TYPES
// =====================================================

export type EmploymentStatus = 'active' | 'inactive' | 'terminated';

export interface Employee {
  id: string;
  employee_id: string;
  user_id?: string;
  profile_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  designation: string;
  joining_date: string;
  status: EmploymentStatus;
  address?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeWithDetails extends Employee {
  department?: Department;
  profile?: Profile;
}

// =====================================================
// DEPARTMENT TYPES
// =====================================================

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentWithStats extends Department {
  employee_count: number;
  active_employee_count: number;
  manager?: Profile;
}

// =====================================================
// ATTENDANCE TYPES
// =====================================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';

export interface Attendance {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithEmployee extends Attendance {
  employee?: Employee;
}

// =====================================================
// LEAVE TYPES
// =====================================================

export type LeaveType = 'casual' | 'sick' | 'earned';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employee?: Employee;
  approver?: Profile;
}

export interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type: LeaveType;
  total_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// PAYROLL TYPES
// =====================================================

export type PayrollStatus = 'pending' | 'processed' | 'paid';

export interface Payroll {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  tax: number;
  net_salary: number;
  status: PayrollStatus;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollWithEmployee extends Payroll {
  employee?: Employee;
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

export type NotificationType = 'leave_request' | 'leave_approved' | 'leave_rejected' | 'attendance' | 'payroll' | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// =====================================================
// ACTIVITY LOG TYPES
// =====================================================

export interface ActivityLog {
  id: string;
  user_id?: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface EmployeeFormInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: string;
  designation: string;
  joining_date: string;
  status: EmploymentStatus;
  address?: string;
  profile_picture?: File | string;
  employee_id?: string;
}

export interface DepartmentFormInput {
  name: string;
  description?: string;
  manager_id?: string;
}

export interface AttendanceFormInput {
  employee_id: string;
  attendance_date: string;
  check_in?: string;
  check_out?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequestFormInput {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface PayrollFormInput {
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances?: number;
  deductions?: number;
  tax?: number;
  status?: PayrollStatus;
  paid_date?: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  total_employees: number;
  active_employees: number;
  employees_on_leave: number;
  total_departments: number;
  attendance_percentage: number;
  monthly_payroll: number;
  employee_growth: MonthlyEmployeeData[];
  department_distribution: DepartmentDistributionData[];
  recent_activities: ActivityLog[];
  upcoming_events: UpcomingEvent[];
}

export interface MonthlyEmployeeData {
  month: string;
  count: number;
}

export interface DepartmentDistributionData {
  name: string;
  count: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
}

// =====================================================
// PAGINATION TYPES
// =====================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string>;
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface EmployeeFilters {
  search?: string;
  department_id?: string;
  status?: EmploymentStatus;
  designation?: string;
}

export interface AttendanceFilters {
  search?: string;
  department_id?: string;
  status?: AttendanceStatus;
  date_from?: string;
  date_to?: string;
}

export interface LeaveFilters {
  search?: string;
  department_id?: string;
  status?: LeaveStatus;
  leave_type?: LeaveType;
  date_from?: string;
  date_to?: string;
}

export interface ReportFilters {
  department_id?: string;
  date_from?: string;
  date_to?: string;
  month?: number;
  year?: number;
}
