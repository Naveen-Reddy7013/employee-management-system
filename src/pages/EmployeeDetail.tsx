import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building2, Briefcase, Pencil } from 'lucide-react';

import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStatusColor } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { canEdit } from '@/utils/helpers';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user ? canEdit(user.role) : false;

  const employee = DEMO_EMPLOYEES.find((e) => e.id === id);
  const department = DEMO_DEPARTMENTS.find((d) => d.id === employee?.department_id);

  if (!employee) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Employee not found</h2>
            <Button className="mt-4" onClick={() => navigate('/employees')}>
              Back to Employees
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Employee Profile"
        description="View and manage employee information"
        actions={
          <div className="flex items-center gap-2">
            {canManage && (
              <Button variant="outline" onClick={() => navigate(`/employees/${id}/edit`)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/employees')}>
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
          </div>
        }
      />

      {/* Profile Header */}
      <Section>
        <div className="rounded-xl border bg-card p-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-[#31439b] text-2xl font-semibold text-white">
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <h2 className="text-2xl font-bold">{employee.first_name} {employee.last_name}</h2>
                <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
              </div>
              <p className="text-muted-foreground">{employee.designation}</p>
              <p className="text-sm text-muted-foreground">{department?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{employee.employee_id}</p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(employee.joining_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details">
          <Section>
            <div className="grid gap-6 md:grid-cols-2">
              <DetailItem
                icon={<Calendar className="size-4" />}
                label="Employee ID"
                value={employee.employee_id}
              />
              <DetailItem
                icon={<Calendar className="size-4" />}
                label="Joining Date"
                value={new Date(employee.joining_date).toLocaleDateString()}
              />
              <DetailItem
                icon={<Building2 className="size-4" />}
                label="Department"
                value={department?.name || 'N/A'}
              />
              <DetailItem
                icon={<Briefcase className="size-4" />}
                label="Designation"
                value={employee.designation}
              />
              <div className="md:col-span-2">
                <DetailItem
                  icon={<MapPin className="size-4" />}
                  label="Address"
                  value={employee.address || 'N/A'}
                />
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Section>
            <div className="grid gap-6 md:grid-cols-2">
              <DetailItem
                icon={<Mail className="size-4" />}
                label="Email"
                value={employee.email}
              />
              <DetailItem
                icon={<Phone className="size-4" />}
                label="Phone"
                value={employee.phone || 'N/A'}
              />
              <div className="md:col-span-2">
                <DetailItem
                  icon={<MapPin className="size-4" />}
                  label="Address"
                  value={employee.address || 'N/A'}
                />
              </div>
            </div>
          </Section>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Section>
            <div className="rounded-lg border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Attendance records will be displayed here once available.
              </p>
            </div>
          </Section>
        </TabsContent>

        {/* Leave Tab */}
        <TabsContent value="leave">
          <Section>
            <div className="rounded-lg border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Leave history will be displayed here once available.
              </p>
            </div>
          </Section>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll">
          <Section>
            <div className="rounded-lg border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Payroll records will be displayed here once available.
              </p>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
