// =====================================================
// Employee Management System - Utility Functions
// =====================================================

import type { UserRole, EmploymentStatus, DepartmentDistributionData, PayrollStatus } from '@/types';

// =====================================================
// TYPES RE-EXPORTS
// =====================================================

export type { EmploymentStatus, PayrollStatus };

// =====================================================
// CURRENCY FORMATTING
// =====================================================

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// =====================================================
// DATE FORMATTING
// =====================================================

export function formatDate(date: string | Date): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateRange(start: string, end?: string): string {
  if (!start) return '-';
  if (!end) return formatDate(start);
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = endDate.getFullYear();
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export function formatTime(time?: string): string {
  if (!time) return '-';
  return time;
}

export function getDaysDifference(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function isToday(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month - 1] || '';
}

// =====================================================
// EMPLOYEE ID GENERATION
// =====================================================

export function generateEmployeeId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `EMP-${year}-${random}`;
}

// =====================================================
// SALARY CALCULATIONS
// =====================================================

export function calculateNetSalary(
  basic: number,
  allowances = 0,
  deductions = 0,
  tax = 0,
): number {
  return basic + allowances - deductions - tax;
}

export function calculateTax(salary: number, rate: number = 0.1): number {
  return salary * rate;
}

// =====================================================
// STATUS HELPERS
// =====================================================

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    terminated: 'text-red-600 bg-red-50',
    present: 'text-green-600 bg-green-50',
    absent: 'text-red-600 bg-red-50',
    late: 'text-yellow-600 bg-yellow-50',
    'half-day': 'text-blue-600 bg-blue-50',
    'on-leave': 'text-purple-600 bg-purple-50',
    pending: 'text-yellow-600 bg-yellow-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
    processed: 'text-blue-600 bg-blue-50',
    paid: 'text-green-600 bg-green-50',
  };
  return colors[status] || 'text-gray-600 bg-gray-50';
}

export function getBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'present':
    case 'approved':
    case 'processed':
    case 'paid':
      return 'success';
    case 'inactive':
    case 'terminated':
    case 'absent':
    case 'rejected':
      return 'destructive';
    case 'late':
    case 'half-day':
    case 'pending':
    case 'on-leave':
      return 'secondary';
    default:
      return 'default';
  }
}

// =====================================================
// ROLE HELPERS
// =====================================================

export function canView(role: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    hr: 3,
    manager: 2,
    employee: 1,
  };
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
}

export function canEdit(role: UserRole): boolean {
  return role === 'admin' || role === 'hr';
}

export function canDelete(role: UserRole): boolean {
  return role === 'admin';
}

export function canManagePayroll(role: UserRole): boolean {
  return role === 'admin' || role === 'hr';
}

export function canManageDepartments(role: UserRole): boolean {
  return role === 'admin' || role === 'hr';
}

export function canApproveLeave(role: UserRole): boolean {
  return role === 'admin' || role === 'hr' || role === 'manager';
}

// Alias for convenience
export const canApprove = canApproveLeave;

export function canViewAllDepartments(role: UserRole): boolean {
  return role === 'admin' || role === 'hr';
}

// =====================================================
// NAVIGATION HELPERS
// =====================================================

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
  roles?: Array<'admin' | 'hr' | 'manager' | 'employee'>;
}

export function getNavigationForRole(role: UserRole): NavItem[] {
  return [
    { title: 'Dashboard', href: '/dashboard', roles: ['admin' as const, 'hr' as const, 'manager' as const, 'employee' as const] },
    { title: 'Employees', href: '/employees', roles: ['admin' as const, 'hr' as const] },
    { title: 'Departments', href: '/departments', roles: ['admin' as const, 'hr' as const, 'manager' as const] },
    { title: 'Attendance', href: '/attendance', roles: ['admin' as const, 'hr' as const, 'manager' as const, 'employee' as const] },
    { title: 'Leave', href: '/leave', roles: ['admin' as const, 'hr' as const, 'manager' as const, 'employee' as const] },
    { title: 'Payroll', href: '/payroll', roles: ['admin' as const, 'hr' as const] },
    { title: 'Reports', href: '/reports', roles: ['admin' as const, 'hr' as const, 'manager' as const] },
    { title: 'Notifications', href: '/notifications', roles: ['admin' as const, 'hr' as const, 'manager' as const, 'employee' as const] },
    { title: 'Settings', href: '/settings', roles: ['admin' as const, 'hr' as const, 'manager' as const, 'employee' as const] },
  ].filter((item) => item.roles?.includes(role));
}

// =====================================================
// DEPARTMENT DISTRIBUTION CALCULATION
// =====================================================

export function calculateDepartmentDistribution(
  employees: Array<{ department_id: string }>,
  departments: Array<{ id: string; name: string }>,
): DepartmentDistributionData[] {
  const counts: Record<string, number> = {};

  employees.forEach((emp) => {
    counts[emp.department_id] = (counts[emp.department_id] || 0) + 1;
  });

  return departments
    .map((dept) => ({
      name: dept.name,
      count: counts[dept.id] || 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// =====================================================
// ATTENDANCE PERCENTAGE CALCULATION
// =====================================================

export function calculateAttendancePercentage(
  totalDays: number,
  presentDays: number,
): number {
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
}

// =====================================================
// DEPARTMENTS HELPERS
// =====================================================

export function validateDepartmentDeletion(
  activeEmployeeCount: number,
  managerReassigned: boolean = false,
): { canDelete: boolean; message?: string } {
  if (activeEmployeeCount > 0) {
    if (managerReassigned) {
      return { canDelete: true };
    }
    return {
      canDelete: false,
      message: `Cannot delete department with ${activeEmployeeCount} active employee(s). Please reassign employees first or transfer the manager.`,
    };
  }
  return { canDelete: true };
}

// =====================================================
// FILE UPLOAD HELPERS
// =====================================================

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, GIF or WebP.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB.' };
  }

  return { valid: true };
}

export function generateAvatarInitials(first: string, last: string): string {
  return `${(first?.[0] || '').toUpperCase()}${(last?.[0] || '').toUpperCase()}`;
}

// =====================================================
// DEBOUNCE UTILITY
// =====================================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
