import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!supabase;

// =====================================================
// DEMO DATA - Used when Supabase is not configured
// =====================================================

export interface DemoEmployee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: string;
  designation: string;
  joining_date: string;
  status: string;
  address: string;
  profile_picture?: string;
}

export interface DemoDepartment {
  id: string;
  name: string;
  description?: string;
  manager_id?: string;
}

export const DEMO_DEPARTMENTS: DemoDepartment[] = [
  { id: 'dept-1', name: 'Engineering', description: 'Software development and technical operations' },
  { id: 'dept-2', name: 'Marketing', description: 'Brand management, digital marketing and communications' },
  { id: 'dept-3', name: 'Finance', description: 'Financial planning, accounting and reporting' },
  { id: 'dept-4', name: 'Human Resources', description: 'Talent management, employee relations and compliance' },
  { id: 'dept-5', name: 'Sales', description: 'Revenue generation, client relationships and business development' },
  { id: 'dept-6', name: 'Operations', description: 'Logistics, supply chain and facility management' },
];

export const DEMO_EMPLOYEES: DemoEmployee[] = [
  // Engineering
  { id: 'emp-1', employee_id: 'EMP-24-0001', first_name: 'James', last_name: 'Anderson', email: 'james.anderson@company.com', phone: '+1 (555) 101-2001', department_id: 'dept-1', designation: 'Senior Software Engineer', joining_date: '2020-03-15', status: 'active', address: '123 Oak Street, San Francisco, CA 94102' },
  { id: 'emp-2', employee_id: 'EMP-24-0002', first_name: 'Sarah', last_name: 'Chen', email: 'sarah.chen@company.com', phone: '+1 (555) 101-2002', department_id: 'dept-1', designation: 'Full Stack Developer', joining_date: '2021-06-01', status: 'active', address: '456 Maple Avenue, San Francisco, CA 94103' },
  { id: 'emp-3', employee_id: 'EMP-24-0003', first_name: 'Michael', last_name: 'Roberts', email: 'michael.roberts@company.com', phone: '+1 (555) 101-2003', department_id: 'dept-1', designation: 'DevOps Engineer', joining_date: '2022-01-10', status: 'active', address: '789 Pine Road, Oakland, CA 94601' },
  { id: 'emp-4', employee_id: 'EMP-24-0004', first_name: 'Emily', last_name: 'Taylor', email: 'emily.taylor@company.com', phone: '+1 (555) 101-2004', department_id: 'dept-1', designation: 'UI/UX Developer', joining_date: '2023-03-20', status: 'active', address: '321 Elm Street, Berkeley, CA 94704' },
  // Marketing
  { id: 'emp-5', employee_id: 'EMP-24-0005', first_name: 'David', last_name: 'Kim', email: 'david.kim@company.com', phone: '+1 (555) 101-2005', department_id: 'dept-2', designation: 'Marketing Director', joining_date: '2019-08-15', status: 'active', address: '654 Cedar Lane, San Jose, CA 95101' },
  { id: 'emp-6', employee_id: 'EMP-24-0006', first_name: 'Jessica', last_name: 'Martinez', email: 'jessica.martinez@company.com', phone: '+1 (555) 101-2006', department_id: 'dept-2', designation: 'Content Strategist', joining_date: '2021-11-01', status: 'active', address: '987 Birch Court, San Jose, CA 95102' },
  { id: 'emp-7', employee_id: 'EMP-24-0007', first_name: 'Robert', last_name: 'Johnson', email: 'robert.johnson@company.com', phone: '+1 (555) 101-2007', department_id: 'dept-2', designation: 'SEO Specialist', joining_date: '2022-05-20', status: 'active', address: '147 Walnut Drive, Sunnyvale, CA 94086' },
  // Finance
  { id: 'emp-8', employee_id: 'EMP-24-0008', first_name: 'Amanda', last_name: 'White', email: 'amanda.white@company.com', phone: '+1 (555) 101-2008', department_id: 'dept-3', designation: 'Finance Manager', joining_date: '2018-04-10', status: 'active', address: '258 Spruce Avenue, Palo Alto, CA 94301' },
  { id: 'emp-9', employee_id: 'EMP-24-0009', first_name: 'Daniel', last_name: 'Brown', email: 'daniel.brown@company.com', phone: '+1 (555) 101-2009', department_id: 'dept-3', designation: 'Accountant', joining_date: '2020-09-15', status: 'active', address: '369 Ash Street, Mountain View, CA 94040' },
  { id: 'emp-10', employee_id: 'EMP-24-0010', first_name: 'Laura', last_name: 'Garcia', email: 'laura.garcia@company.com', phone: '+1 (555) 101-2010', department_id: 'dept-3', designation: 'Financial Analyst', joining_date: '2022-07-01', status: 'active', address: '741 Willow Way, Menlo Park, CA 94025' },
  // HR
  { id: 'emp-11', employee_id: 'EMP-24-0011', first_name: 'Christopher', last_name: 'Lee', email: 'christopher.lee@company.com', phone: '+1 (555) 101-2011', department_id: 'dept-4', designation: 'HR Director', joining_date: '2017-02-01', status: 'active', address: '852 Poplar Place, Redwood City, CA 94063' },
  { id: 'emp-12', employee_id: 'EMP-24-0012', first_name: 'Nicole', last_name: 'Patel', email: 'nicole.patel@company.com', phone: '+1 (555) 101-2012', department_id: 'dept-4', designation: 'HR Coordinator', joining_date: '2021-04-15', status: 'active', address: '963 Cypress Lane, Santa Clara, CA 95050' },
  // Sales
  { id: 'emp-13', employee_id: 'EMP-24-0013', first_name: 'Andrew', last_name: 'Wilson', email: 'andrew.wilson@company.com', phone: '+1 (555) 101-2013', department_id: 'dept-5', designation: 'Sales Director', joining_date: '2019-01-15', status: 'active', address: '159 Juniper Road, Fremont, CA 94536' },
  { id: 'emp-14', employee_id: 'EMP-24-0014', first_name: 'Rachel', last_name: 'Thompson', email: 'rachel.thompson@company.com', phone: '+1 (555) 101-2014', department_id: 'dept-5', designation: 'Sales Executive', joining_date: '2021-08-20', status: 'active', address: '267 Magnolia Street, San Leandro, CA 94577' },
  { id: 'emp-15', employee_id: 'EMP-24-0015', first_name: 'Kevin', last_name: 'Nguyen', email: 'kevin.nguyen@company.com', phone: '+1 (555) 101-2015', department_id: 'dept-5', designation: 'Account Manager', joining_date: '2022-10-01', status: 'active', address: '378 Dogwood Avenue, Hayward, CA 94541' },
  // Operations
  { id: 'emp-16', employee_id: 'EMP-24-0016', first_name: 'Michelle', last_name: 'Davis', email: 'michelle.davis@company.com', phone: '+1 (555) 101-2016', department_id: 'dept-6', designation: 'Operations Manager', joining_date: '2018-07-01', status: 'active', address: '489 Hawthorn Drive, Union City, CA 94587' },
  { id: 'emp-17', employee_id: 'EMP-24-0017', first_name: 'Brian', last_name: 'Harris', email: 'brian.harris@company.com', phone: '+1 (555) 101-2017', department_id: 'dept-6', designation: 'Logistics Coordinator', joining_date: '2021-02-15', status: 'active', address: '591 Sycamore Court, Newark, CA 94560' },
  { id: 'emp-18', employee_id: 'EMP-24-0018', first_name: 'Stephanie', last_name: 'Clark', email: 'stephanie.clark@company.com', phone: '+1 (555) 101-2018', department_id: 'dept-6', designation: 'Facility Manager', joining_date: '2020-11-20', status: 'active', address: '602 Chestnut Lane, San Mateo, CA 94402' },
  // Inactive
  { id: 'emp-19', employee_id: 'EMP-23-0019', first_name: 'Thomas', last_name: 'Walker', email: 'thomas.walker@company.com', phone: '+1 (555) 101-2019', department_id: 'dept-1', designation: 'Junior Developer', joining_date: '2023-06-01', status: 'inactive', address: '713 Redwood Place, San Bruno, CA 94066' },
  { id: 'emp-20', employee_id: 'EMP-22-0020', first_name: 'Patricia', last_name: 'Hall', email: 'patricia.hall@company.com', phone: '+1 (555) 101-2020', department_id: 'dept-3', designation: 'Payroll Specialist', joining_date: '2022-03-01', status: 'terminated', address: '824 Sequoia Way, Daly City, CA 94014' },
];

// =====================================================
// DEMO ATTENDANCE DATA
// =====================================================

export interface DemoAttendance {
  id: string;
  employee_id: string;
  attendance_date: string;
  check_in: string;
  check_out: string;
  status: string;
}

// Pre-generate demo attendance records
const DEMO_ATTENDANCE_RECORDS = (() => {
  const records: DemoAttendance[] = [];
  const statuses: DemoAttendance['status'][] = ['present', 'present', 'present', 'present', 'present', 'late', 'present', 'present', 'absent', 'present'];
  const now = new Date();

  for (let day = 1; day <= now.getDate(); day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    DEMO_EMPLOYEES.forEach((emp, idx) => {
      if (emp.status === 'terminated') return;

      const statusIndex = (day + idx) % statuses.length;
      const status = statuses[statusIndex];
      const hour = 8 + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      const checkIn = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      if (status === 'present' || status === 'late') {
        records.push({
          id: `att-${day}-${idx}`,
          employee_id: emp.id,
          attendance_date: dateStr,
          check_in: status === 'late' ? `${hour + 1}:${minute.toString().padStart(2, '0')}` : checkIn,
          check_out: `${17 + Math.floor(Math.random() * 2)}:${(10 + Math.floor(Math.random() * 50)).toString().padStart(2, '0')}`,
          status,
        });
      } else if (status === 'absent') {
        records.push({
          id: `att-${day}-${idx}`,
          employee_id: emp.id,
          attendance_date: dateStr,
          check_in: '',
          check_out: '',
          status: 'absent',
        });
      }
    });
  }

  return records;
})();

export const DEMO_ATTENDANCE = DEMO_ATTENDANCE_RECORDS;

// Original function (kept for reference)
export function generateDemoAttendance(): DemoAttendance[] {
  const records: DemoAttendance[] = [];
  const statuses: DemoAttendance['status'][] = ['present', 'present', 'present', 'present', 'present', 'late', 'present', 'present', 'absent', 'present'];
  const now = new Date();

  for (let day = 1; day <= now.getDate(); day++) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];

    DEMO_EMPLOYEES.forEach((emp, idx) => {
      if (emp.status === 'terminated') return;

      const statusIndex = (day + idx) % statuses.length;
      const status = statuses[statusIndex];
      const hour = 8 + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      const checkIn = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      if (status === 'present' || status === 'late') {
        records.push({
          id: `att-${day}-${idx}`,
          employee_id: emp.id,
          attendance_date: dateStr,
          check_in: status === 'late' ? `${hour + 1}:${minute.toString().padStart(2, '0')}` : checkIn,
          check_out: `${17 + Math.floor(Math.random() * 2)}:${(10 + Math.floor(Math.random() * 50)).toString().padStart(2, '0')}`,
          status,
        });
      } else if (status === 'absent') {
        records.push({
          id: `att-${day}-${idx}`,
          employee_id: emp.id,
          attendance_date: dateStr,
          check_in: '',
          check_out: '',
          status: 'absent',
        });
      }
    });
  }

  return records;
}

// =====================================================
// DEMO LEAVE DATA
// =====================================================

export interface DemoLeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export interface DemoLeaveBalance {
  id: string;
  employee_id: string;
  leave_type: string;
  total_days: number;
  used_days: number;
}

// Pre-generate demo data
const DEMO_LEAVE_REQUESTS_DATA = generateDemoLeaveRequests();
export const DEMO_LEAVE_REQUESTS = DEMO_LEAVE_REQUESTS_DATA;

export function generateDemoLeaveRequests(): DemoLeaveRequest[] {
  return [
    { id: 'leave-1', employee_id: 'emp-1', leave_type: 'casual', start_date: '2025-07-15', end_date: '2025-07-16', reason: 'Family event', status: 'approved', approved_by: 'profile-2', approved_at: '2025-07-10' },
    { id: 'leave-2', employee_id: 'emp-2', leave_type: 'sick', start_date: '2025-07-20', end_date: '2025-07-20', reason: 'Medical appointment', status: 'pending' },
    { id: 'leave-3', employee_id: 'emp-3', leave_type: 'earned', start_date: '2025-07-25', end_date: '2025-07-27', reason: 'Planned vacation', status: 'pending' },
    { id: 'leave-4', employee_id: 'emp-5', leave_type: 'casual', start_date: '2025-07-10', end_date: '2025-07-11', reason: 'Personal work', status: 'rejected', rejection_reason: 'Critical marketing campaign in progress' },
    { id: 'leave-5', employee_id: 'emp-8', leave_type: 'sick', start_date: '2025-07-18', end_date: '2025-07-19', reason: 'Flu', status: 'approved', approved_by: 'profile-1', approved_at: '2025-07-17' },
  ];
}

const DEMO_LEAVE_BALANCES_DATA = generateDemoLeaveBalances();
export const DEMO_LEAVE_BALANCES = DEMO_LEAVE_BALANCES_DATA;

export function generateDemoLeaveBalances(): DemoLeaveBalance[] {
  const balances: DemoLeaveBalance[] = [];
  DEMO_EMPLOYEES.forEach((emp) => {
    if (emp.status === 'terminated') return;
    ['casual', 'sick', 'earned'].forEach((type) => {
      balances.push({
        id: `lb-${emp.id}-${type}`,
        employee_id: emp.id,
        leave_type: type,
        total_days: type === 'casual' ? 12 : type === 'sick' ? 10 : 20,
        used_days: Math.floor(Math.random() * 8),
      });
    });
  });
  return balances;
}

// =====================================================
// DEMO PAYROLL DATA
// =====================================================

export interface DemoPayroll {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  tax: number;
  net_salary: number;
  status: string;
}

const DEMO_PAYROLL_DATA = generateDemoPayroll();
export const DEMO_PAYROLL = DEMO_PAYROLL_DATA;

export function generateDemoPayroll(): DemoPayroll[] {
  const salararies: Record<string, number> = {
    'emp-1': 14000, 'emp-2': 12000, 'emp-3': 13000, 'emp-4': 11000,
    'emp-5': 13500, 'emp-6': 10000, 'emp-7': 9500,
    'emp-8': 12500, 'emp-9': 10500, 'emp-10': 11000,
    'emp-11': 13000, 'emp-12': 9000,
    'emp-13': 12000, 'emp-14': 9500, 'emp-15': 9000,
    'emp-16': 11500, 'emp-17': 8500, 'emp-18': 9500,
  };

  return DEMO_EMPLOYEES
    .filter((emp) => emp.status !== 'terminated')
    .map((emp) => {
      const basic = salararies[emp.id] || 8000;
      const allowances = basic * 0.2;
      const deductions = 500;
      const tax = (basic - deductions) * 0.1;
      return {
        id: `pay-${emp.id}`,
        employee_id: emp.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basic_salary: basic,
        allowances,
        deductions,
        tax: Math.round(tax * 100) / 100,
        net_salary: 0, // Will be calculated
        status: 'paid',
      };
    })
    .map((p) => ({ ...p, net_salary: p.basic_salary + p.allowances - p.deductions - p.tax }));
}

// =====================================================
// DEMO NOTIFICATIONS
// =====================================================

export interface DemoNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const DEMO_NOTIFICATIONS_DATA = generateDemoNotifications();
export const DEMO_NOTIFICATIONS = DEMO_NOTIFICATIONS_DATA;

export function generateDemoNotifications(): DemoNotification[] {
  const now = new Date();
  return [
    { id: 'notif-1', user_id: 'profile-2', type: 'leave_request', title: 'New Leave Request', message: 'Sarah Chen has submitted a sick leave request.', is_read: false, created_at: new Date(now.getTime() - 3600000).toISOString() },
    { id: 'notif-2', user_id: 'profile-2', type: 'leave_request', title: 'New Leave Request', message: 'Michael Roberts has submitted an earned leave request.', is_read: false, created_at: new Date(now.getTime() - 7200000).toISOString() },
    { id: 'notif-3', user_id: 'profile-1', type: 'payroll', title: 'Payroll Processed', message: 'June 2025 payroll has been processed for all employees.', is_read: true, created_at: new Date(now.getTime() - 86400000).toISOString() },
    { id: 'notif-4', user_id: 'profile-3', type: 'attendance', title: 'Attendance Reminder', message: 'Please mark your attendance for today.', is_read: false, created_at: new Date(now.getTime() - 10800000).toISOString() },
    { id: 'notif-5', user_id: 'profile-4', type: 'leave_approved', title: 'Leave Approved', message: 'Your casual leave request has been approved.', is_read: true, created_at: new Date(now.getTime() - 172800000).toISOString() },
    { id: 'notif-6', user_id: 'profile-5', type: 'system', title: 'System Update', message: 'Employee Management System has been updated with new features.', is_read: false, created_at: new Date(now.getTime() - 259200000).toISOString() },
  ];
}

// =====================================================
// DEMO ACTIVITY LOGS
// =====================================================

export interface DemoActivityLog {
  id: string;
  user_id?: string;
  action: string;
  entity: string;
  details?: Record<string, unknown>;
  created_at: string;
}

const DEMO_ACTIVITY_LOGS_DATA = generateDemoActivityLogs();
export const DEMO_ACTIVITY_LOGS = DEMO_ACTIVITY_LOGS_DATA;

export function generateDemoActivityLogs(): DemoActivityLog[] {
  return [
    { id: 'act-1', user_id: 'profile-1', action: 'create', entity: 'employee', details: { name: 'Kevin Nguyen' }, created_at: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'act-2', user_id: 'profile-2', action: 'approve', entity: 'leave_request', details: { employee: 'James Anderson', type: 'Casual Leave' }, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'act-3', user_id: 'profile-1', action: 'create', entity: 'department', details: { name: 'Operations' }, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'act-4', user_id: 'profile-2', action: 'update', entity: 'attendance', details: { employee: 'Sarah Chen', date: '2025-07-15' }, created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'act-5', user_id: 'profile-1', action: 'process', entity: 'payroll', details: { month: 'June 2025' }, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'act-6', user_id: 'profile-2', action: 'reject', entity: 'leave_request', details: { employee: 'David Kim', type: 'Casual Leave' }, created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  ];
}

// =====================================================
// DEMO USERS (for testing login without Supabase)
// =====================================================

export interface DemoUser {
  email: string;
  password: string;
  profile: {
    id: string;
    full_name: string;
    role: 'admin' | 'hr' | 'manager' | 'employee';
  };
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'admin@company.com',
    password: 'Admin123!',
    profile: { id: 'profile-1', full_name: 'John Admin', role: 'admin' },
  },
  {
    email: 'hr@company.com',
    password: 'Hr123456!',
    profile: { id: 'profile-2', full_name: 'Jane HR', role: 'hr' },
  },
  {
    email: 'manager@company.com',
    password: 'Manager123!',
    profile: { id: 'profile-3', full_name: 'Mike Manager', role: 'manager' },
  },
  {
    email: 'employee@company.com',
    password: 'Employee123!',
    profile: { id: 'profile-4', full_name: 'Alex Employee', role: 'employee' },
  },
];
