import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS, DEMO_ATTENDANCE } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const COLORS = ['#31439b', '#4a5bd4', '#6b7ae6', '#8da3f0', '#afc0f7', '#d1d9fb'];

export default function Reports() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const filteredEmployees = useMemo(() => {
    if (selectedDept === 'all') return DEMO_EMPLOYEES;
    return DEMO_EMPLOYEES.filter((e) => e.department_id === selectedDept);
  }, [selectedDept]);

  // Department distribution
  const deptData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEmployees.forEach((emp) => {
      counts[emp.department_id] = (counts[emp.department_id] || 0) + 1;
    });
    return DEMO_DEPARTMENTS.map((dept) => ({
      name: dept.name,
      value: counts[dept.id] || 0,
    })).filter((d) => d.value > 0);
  }, [filteredEmployees]);

  // Status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredEmployees.forEach((emp) => {
      counts[emp.status] = (counts[emp.status] || 0) + 1;
    });
    return [
      { name: 'Active', value: counts.active || 0, color: '#22c55e' },
      { name: 'Inactive', value: counts.inactive || 0, color: '#6b7280' },
      { name: 'Terminated', value: counts.terminated || 0, color: '#ef4444' },
    ].filter((d) => d.value > 0);
  }, [filteredEmployees]);

  // Attendance stats
  const attendanceData = useMemo(() => {
    const deptAttendance = DEMO_DEPARTMENTS.map((dept) => {
      const deptEmps = filteredEmployees.filter((e) => e.department_id === dept.id);
      const empIds = deptEmps.map((e) => e.id);
      const records = DEMO_ATTENDANCE.filter((a) => empIds.includes(a.employee_id));
      const present = records.filter((a) => a.status === 'present' || a.status === 'late').length;
      const total = records.length || 1;
      return {
        name: dept.name,
        present,
        total,
        percentage: Math.round((present / total) * 100),
      };
    });
    return deptAttendance.filter((d) => d.total > 0);
  }, [filteredEmployees]);

  // Monthly salary distribution
  const salaryData = useMemo(() => {
    const deptSalary: Record<string, number> = {};
    filteredEmployees.forEach((emp) => {
      const salary = 8000 + Math.floor(Math.random() * 7000);
      deptSalary[emp.department_id] = (deptSalary[emp.department_id] || 0) + salary;
    });
    return DEMO_DEPARTMENTS.map((dept) => ({
      name: dept.name,
      salary: deptSalary[dept.id] || 0,
    })).filter((d) => d.salary > 0);
  }, [filteredEmployees]);

  return (
    <PageContainer>
      <PageHeader
        title="Reports & Analytics"
        description="View department-wise and monthly reports"
      />

      {/* Filters */}
      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Department</label>
            <Select value={selectedDept} onValueChange={setSelectedDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEMO_DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">Month</label>
            <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2025, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Charts */}
      <Section>
        <Tabs defaultValue="employee" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employee">Employee Distribution</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">By Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptData}>
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
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {deptData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">By Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Department Attendance %</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                      />
                      <Bar dataKey="percentage" fill="#31439b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Department-wise Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salaryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(v) => `$${v.toLocaleString()}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Salary']}
                      />
                      <Line type="monotone" dataKey="salary" stroke="#31439b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      {/* Data Table */}
      <Section>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Department Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium text-muted-foreground">Department</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Employees</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Active</th>
                    <th className="pb-3 text-left font-medium text-muted-foreground">Inactive</th>
                    <th className="pb-3 text-right font-medium text-muted-foreground">Avg. Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {DEMO_DEPARTMENTS.map((dept) => {
                    const deptEmps = filteredEmployees.filter((e) => e.department_id === dept.id);
                    const activeCount = deptEmps.filter((e) => e.status === 'active').length;
                    const inactiveCount = deptEmps.length - activeCount;
                    const avgSalary = deptEmps.length > 0
                      ? Math.round((8000 + Math.random() * 5000))
                      : 0;

                    return (
                      <tr key={dept.id}>
                        <td className="py-3 font-medium">{dept.name}</td>
                        <td className="py-3">{deptEmps.length}</td>
                        <td className="py-3 text-green-600">{activeCount}</td>
                        <td className="py-3 text-muted-foreground">{inactiveCount}</td>
                        <td className="py-3 text-right">{formatCurrency(avgSalary)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
