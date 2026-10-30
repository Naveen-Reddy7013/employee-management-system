import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, DollarSign, Briefcase, Building2 } from 'lucide-react';

import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS, generateDemoPayroll } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/helpers';
import type { PayrollStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { canManagePayroll } from '@/utils/helpers';

const MOCK_PAYROLL = generateDemoPayroll();

const statusConfig: Record<PayrollStatus, { color: string; bg: string }> = {
  pending: { color: 'text-amber-700', bg: 'bg-amber-50' },
  processed: { color: 'text-blue-700', bg: 'bg-blue-50' },
  paid: { color: 'text-green-700', bg: 'bg-green-50' },
};

export default function Payroll() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const canManage = user ? canManagePayroll(user.role) : false;

  const payrollData = useMemo(() => {
    return MOCK_PAYROLL.map((p) => {
      const emp = DEMO_EMPLOYEES.find((e) => e.id === p.employee_id);
      return {
        ...p,
        employee: emp,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return payrollData.filter((p) => {
      return !search ||
        (p.employee && `${p.employee.first_name} ${p.employee.last_name}`.toLowerCase().includes(search.toLowerCase()));
    });
  }, [search, payrollData]);

  // Stats
  const totalPayroll = useMemo(() => filtered.reduce((sum, p) => sum + p.net_salary, 0), [filtered]);
  const totalDeductions = useMemo(() => filtered.reduce((sum, p) => sum + p.deductions + p.tax, 0), [filtered]);
  const totalAllowances = useMemo(() => filtered.reduce((sum, p) => sum + p.allowances, 0), [filtered]);

  const handleDownloadSlip = (payrollId: string) => {
    console.log('Download slip:', payrollId);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Payroll"
        description="Manage employee salary records"
        actions={canManage && (
          <Button>
            <Plus className="mr-2 size-4" />
            Add Payroll
          </Button>
        )}
      />

      {/* Stats */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Payroll"
            value={formatCurrency(totalPayroll)}
            icon={<DollarSign className="size-5 text-green-600" />}
          />
          <StatCard
            label="Gross Salary"
            value={formatCurrency(totalPayroll + totalDeductions)}
            icon={<Briefcase className="size-5 text-blue-600" />}
          />
          <StatCard
            label="Deductions"
            value={formatCurrency(totalDeductions)}
            icon={<Building2 className="size-5 text-red-600" />}
          />
          <StatCard
            label="Allowances"
            value={formatCurrency(totalAllowances)}
            icon={<DollarSign className="size-5 text-amber-600" />}
          />
        </div>
      </Section>

      {/* Payroll Table */}
      <Section>
        <div className="mb-4 flex items-center justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {canManage && (
            <Button size="sm" variant="outline">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const config = statusConfig[p.status];
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.employee ? `${p.employee.first_name} ${p.employee.last_name}` : 'Unknown'}
                        <div className="text-xs text-muted-foreground">{p.employee?.employee_id}</div>
                      </TableCell>
                      <TableCell className="text-sm">{p.employee?.designation || '-'}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(p.basic_salary)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(p.allowances)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(p.deductions)}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{formatCurrency(p.tax)}</TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold">{formatCurrency(p.net_salary)}</TableCell>
                      <TableCell>
                        <Badge className={`${config.bg} ${config.color}`}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => handleDownloadSlip(p.id)}
                        >
                          <Download className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">No payroll records found.</p>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-xl font-bold">{value}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
