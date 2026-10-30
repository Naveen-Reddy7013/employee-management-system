import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreHorizontal, Building2, Users } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { DEMO_DEPARTMENTS, DEMO_EMPLOYEES } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/states/EmptyState';
import { canEdit, canDelete } from '@/utils/helpers';

function DepartmentIllustration() {
  return (
    <svg viewBox="0 0 160 120" className="mx-auto size-32 opacity-60">
      <rect x="40" y="30" width="80" height="70" rx="8" fill="currentColor" opacity="0.15" className="text-[#31439b]" />
      <rect x="50" y="45" width="60" height="4" rx="2" fill="currentColor" opacity="0.25" className="text-[#31439b]" />
      <rect x="50" y="55" width="45" height="4" rx="2" fill="currentColor" opacity="0.25" className="text-[#31439b]" />
      <rect x="50" y="65" width="55" height="4" rx="2" fill="currentColor" opacity="0.25" className="text-[#31439b]" />
      <rect x="50" y="80" width="30" height="15" rx="4" fill="currentColor" opacity="0.35" className="text-[#31439b]" />
    </svg>
  );
}

export default function Departments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const canManage = user ? canEdit(user.role) : false;

  const departments = useMemo(() => {
    return DEMO_DEPARTMENTS.map((dept) => {
      const employees = DEMO_EMPLOYEES.filter((e) => e.department_id === dept.id);
      return {
        ...dept,
        employee_count: employees.length,
        active_count: employees.filter((e) => e.status === 'active').length,
      };
    });
  }, []);

  const filtered = departments.filter(
    (d) => !search || d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedDepartment = departments.find((d) => d.id === selectedDept);

  return (
    <PageContainer>
      <PageHeader
        title="Departments"
        description="Manage your organization's departments"
        actions={canManage && (
          <Button onClick={() => navigate('/departments/new')}>
            <Plus className="mr-2 size-4" />
            Add Department
          </Button>
        )}
      />

      <Section>
        {/* Search */}
        <div className="mb-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Department Cards */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dept) => (
              <Card
                key={dept.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => setSelectedDept(dept.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#31439b]/10">
                      <Building2 className="size-5 text-[#31439b]" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{dept.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {dept.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="size-4 text-muted-foreground" />
                      <span>{dept.employee_count} employees</span>
                    </div>
                    <span className="text-green-600">{dept.active_count} active</span>
                  </div>
                  {canManage && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/departments/${dept.id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<DepartmentIllustration />}
            title="No departments found"
            description={search ? 'Try adjusting your search' : 'Get started by creating your first department.'}
            action={canManage ? (
              <Button onClick={() => navigate('/departments/new')}>
                Add Department
              </Button>
            ) : undefined}
          />
        )}
      </Section>

      {/* Department Detail Dialog */}
      <Dialog open={!!selectedDept} onOpenChange={() => setSelectedDept(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDepartment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#31439b]/10">
                    <Building2 className="size-5 text-[#31439b]" />
                  </div>
                  {selectedDepartment.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedDepartment.description}
                </DialogDescription>
              </DialogHeader>

              <div>
                <h4 className="mb-3 font-medium">
                  Employees ({selectedDepartment.employee_count})
                </h4>
                <div className="space-y-2">
                  {DEMO_EMPLOYEES
                    .filter((e) => e.department_id === selectedDepartment.id)
                    .map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-[#31439b]/10 text-xs font-semibold text-[#31439b]">
                            {emp.first_name[0]}{emp.last_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-muted-foreground">{emp.designation}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${emp.status === 'active' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {emp.status}
                        </span>
                      </div>
                    ))}
                  {DEMO_EMPLOYEES.filter((e) => e.department_id === selectedDepartment.id).length === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No employees in this department
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedDept(null)}>Close</Button>
                {canManage && (
                  <Button onClick={() => {
                    navigate(`/departments/${selectedDepartment.id}`);
                    setSelectedDept(null);
                  }}>
                    Edit Department
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
