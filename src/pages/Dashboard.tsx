import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell,
} from 'recharts';
import { Users, UserCheck, UserX, Building2, TrendingUp, Clock, DollarSign, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS, DEMO_ATTENDANCE, DEMO_ACTIVITY_LOGS } from '@/lib/supabase';
import { StatCard } from '@/components/layout/StatCard';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/states/EmptyState';

// Calculate dashboard stats from demo data
function useDashboardStats() {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  // Filter employees based on role
  const filteredEmployees = useMemo(() => {
    if (isManager && user) {
      // For demo, managers see all employees for simplicity
      // In production, filter by manager's department
      return DEMO_EMPLOYEES;
    }
    return DEMO_EMPLOYEES;
  }, [isManager, user]);

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter((e) => e.status === 'active').length;
  const inactiveEmployees = filteredEmployees.filter((e) => e.status !== 'active').length;

  // Count employees on leave (from attendance)
  const today = new Date().toISOString().split('T')[0];
  const onLeave = filteredEmployees.filter((emp) => {
    const att = DEMO_ATTENDANCE.find(
      (a) => a.employee_id === emp.id && a.attendance_date === today && a.status === 'on-leave',
    );
    return !!att;
  }).length;

  // Or use pending leave requests
  const pendingLeaveCount = 2;

  const totalDepartments = DEMO_DEPARTMENTS.length;

  // Calculate attendance percentage
  const totalAttendanceRecords = DEMO_ATTENDANCE.length;
  const presentRecords = DEMO_ATTENDANCE.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendancePercentage = totalAttendanceRecords > 0
    ? Math.round((presentRecords / totalAttendanceRecords) * 100)
    : 0;

  // Monthly payroll (current month)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Salary ranges per role
  const salaryMap: Record<string, { min: number; max: number }> = {
    'Senior Software Engineer': { min: 13000, max: 15000 },
    'Full Stack Developer': { min: 11000, max: 13000 },
    'DevOps Engineer': { min: 12000, max: 14000 },
    'UI/UX Developer': { min: 10000, max: 12000 },
    'Marketing Director': { min: 13000, max: 15000 },
    'Content Strategist': { min: 9000, max: 11000 },
    'SEO Specialist': { min: 8500, max: 10000 },
    'Finance Manager': { min: 12000, max: 14000 },
    'Accountant': { min: 10000, max: 12000 },
    'Financial Analyst': { min: 10000, max: 12000 },
    'HR Director': { min: 12000, max: 14000 },
    'HR Coordinator': { min: 8500, max: 10000 },
    'Sales Director': { min: 12000, max: 14000 },
    'Sales Executive': { min: 9000, max: 11000 },
    'Account Manager': { min: 8500, max: 10000 },
    'Operations Manager': { min: 11000, max: 13000 },
    'Logistics Coordinator': { min: 8000, max: 9500 },
    'Facility Manager': { min: 9000, max: 10500 },
    'Junior Developer': { min: 7000, max: 9000 },
    'Payroll Specialist': { min: 8000, max: 9500 },
  };

  let totalPayroll = 0;
  filteredEmployees.forEach((emp) => {
    const salaryRange = salaryMap[emp.designation];
    if (salaryRange) {
      totalPayroll += salaryRange.min + Math.floor(Math.random() * (salaryRange.max - salaryRange.min));
    }
  });
  totalPayroll = Math.round(totalPayroll / filteredEmployees.length) * filteredEmployees.length;

  // Department distribution
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEmployees.forEach((emp) => {
      counts[emp.department_id] = (counts[emp.department_id] || 0) + 1;
    });

    return DEMO_DEPARTMENTS.map((dept) => ({
      name: dept.name,
      count: counts[dept.id] || 0,
    })).filter((d) => d.count > 0);
  }, [filteredEmployees]);

  // Employee growth (mock monthly data)
  const growthData = useMemo(() => [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 14 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 16 },
    { month: 'May', count: 17 },
    { month: 'Jun', count: 18 },
    { month: 'Jul', count: totalEmployees },
  ], [totalEmployees]);

  // Recent activities
  const activities = DEMO_ACTIVITY_LOGS.slice(0, 5);

  // Upcoming events (mock)
  const events = [
    { id: '1', title: 'Team Meeting', date: '2025-07-22', type: 'meeting' },
    { id: '2', title: 'Project Deadline', date: '2025-07-25', type: 'deadline' },
    { id: '3', title: 'Company Workshop', date: '2025-07-28', type: 'workshop' },
  ];

  return {
    stats: {
      total_employees: totalEmployees,
      active_employees: activeEmployees,
      inactive_employees: inactiveEmployees,
      employees_on_leave: pendingLeaveCount,
      total_departments: totalDepartments,
      attendance_percentage: attendancePercentage,
      monthly_payroll: totalPayroll,
    },
    departmentData,
    growthData,
    activities,
    events,
  };
}

export default function Dashboard() {
  const { stats, departmentData, growthData, activities, events } = useDashboardStats();

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome to the Employee Management System"
      />

      {/* Stats Grid */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            label="Total Employees"
            value={stats.total_employees}
            icon={Users}
            trend={{ value: '+3', direction: 'up' as const }}
          />
          <StatCard
            label="Active Employees"
            value={stats.active_employees}
            icon={UserCheck}
            trend={{ value: '+2', direction: 'up' as const }}
          />
          <StatCard
            label="On Leave"
            value={stats.employees_on_leave}
            icon={UserX}
          />
          <StatCard
            label="Departments"
            value={stats.total_departments}
            icon={Building2}
          />
          <StatCard
            label="Attendance %"
            value={`${stats.attendance_percentage}%`}
            icon={Clock}
            trend={{ value: '+2%', direction: 'up' as const }}
          />
          <StatCard
            label="Monthly Payroll"
            value={`$${stats.monthly_payroll.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: '+$2.1K', direction: 'up' as const }}
          />
        </div>
      </Section>

      {/* Charts */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Employee Growth */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Employee Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#31439b"
                    strokeWidth={2}
                    dot={{ fill: '#31439b', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {departmentData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#31439b', '#4a5bd4', '#6b7ae6', '#8da3f0', '#afc0f7', '#d1d9fb'][index % 6]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Section>

      {/* Recent Activity & Upcoming Events */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <div className="divide-y">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="px-6 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 size-2 rounded-full bg-[#31439b]" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{' '}
                          <span className="capitalize">{activity.entity}</span>
                          {activity.details?.name && (
                            <span className="font-medium">: {String(activity.details.name)}</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<TrendingUp className="size-8 text-muted-foreground" />}
                  title="No recent activity"
                  description="Activity will appear here when users perform actions."
                />
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4">
              <h3 className="font-semibold">Upcoming Events</h3>
            </div>
            <div className="divide-y">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-[#31439b]/10">
                      {event.type === 'meeting' ? (
                        <Users className="size-4 text-[#31439b]" />
                      ) : event.type === 'deadline' ? (
                        <Clock className="size-4 text-[#31439b]" />
                      ) : (
                        <Calendar className="size-4 text-[#31439b]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}
