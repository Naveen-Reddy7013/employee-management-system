import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, UserPlus } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/states/EmptyState';
import { getStatusColor, canEdit } from '@/utils/helpers';

type EmploymentStatus = 'active' | 'inactive' | 'terminated';

function EmptyStateIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="mx-auto size-32 opacity-60">
      <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.25" className="text-[#31439b]" />
      <circle cx="80" cy="40" r="12" fill="currentColor" opacity="0.35" className="text-[#31439b]" />
      <circle cx="110" cy="50" r="15" fill="currentColor" opacity="0.25" className="text-[#31439b]" />
      <path d="M35 95c0-15 10-25 25-25s25 10 25 25" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#31439b]" opacity="0.3" strokeLinecap="round" />
      <path d="M65 85c0-12 8-20 15-20s15 8 15 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#31439b]" opacity="0.35" strokeLinecap="round" />
      <path d="M95 95c0-15 10-25 25-25s25 10 25 25" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#31439b]" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Employees() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus | ''>('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const canManageEmployees = user ? canEdit(user.role) : false;

  const departments = useMemo(() => DEMO_DEPARTMENTS, []);

  const filteredEmployees = useMemo(() => {
    return DEMO_EMPLOYEES.filter((emp) => {
      const matchesSearch = search === '' ||
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || emp.status === statusFilter;
      const matchesDepartment = !departmentFilter || emp.department_id === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [search, statusFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || 'Unknown';
  };

  return (
    <PageContainer>
      <PageHeader
        title="Employees"
        description="Manage your organization's employees"
        actions={canManageEmployees && (
          <Button onClick={() => navigate('/employees/new')}>
            <UserPlus className="mr-2 size-4" />
            Add Employee
          </Button>
        )}
      />

      <Section>
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as EmploymentStatus);
                setCurrentPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
        </div>

        {/* Table */}
        {filteredEmployees.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((emp) => (
                  <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/employees/${emp.id}`)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-[#31439b]/10 text-sm font-semibold text-[#31439b]">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                          <div className="text-xs text-muted-foreground">{emp.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{emp.employee_id}</TableCell>
                    <TableCell className="text-sm">{getDepartmentName(emp.department_id)}</TableCell>
                    <TableCell className="text-sm">{emp.designation}</TableCell>
                    <TableCell className="text-sm">{new Date(emp.joining_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(emp.status)}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/employees/${emp.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          {canManageEmployees && (
                            <DropdownMenuItem onClick={() => navigate(`/employees/${emp.id}/edit`)}>
                              Edit Employee
                            </DropdownMenuItem>
                          )}
                          {canManageEmployees && (
                            <DropdownMenuItem className="text-destructive">
                              Delete Employee
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyState
            icon={<EmptyStateIllustration />}
            title="No employees found"
            description={search || statusFilter || departmentFilter
              ? 'Try adjusting your filters'
              : 'Get started by adding your first employee.'}
            action={canManageEmployees ? (
              <Button onClick={() => navigate('/employees/new')}>
                Add Employee
              </Button>
            ) : undefined}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
