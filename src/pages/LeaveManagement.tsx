import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';

import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { DEMO_LEAVE_REQUESTS, DEMO_EMPLOYEES } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { canApprove } from '@/utils/helpers';

type LeaveStatus = 'pending' | 'approved' | 'rejected';
type LeaveType = 'casual' | 'sick' | 'earned';

const statusConfig: Record<LeaveStatus, { icon: typeof Clock; color: string; bg: string }> = {
  pending: { icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50' },
  approved: { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-50' },
  rejected: { icon: XCircle, color: 'text-red-700', bg: 'bg-red-50' },
};

const typeLabels: Record<LeaveType, string> = {
  casual: 'Casual Leave',
  sick: 'Sick Leave',
  earned: 'Earned Leave',
};

const MOCK_REQUESTS = DEMO_LEAVE_REQUESTS.map((req) => {
  const emp = DEMO_EMPLOYEES.find((e) => e.id === req.employee_id);
  return {
    ...req,
    employee: emp,
  };
});

export default function LeaveManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | ''>('');
  const [activeTab, setActiveTab] = useState('all');
  const canApproveAction = user ? canApprove(user.role) : false;

  const filteredRequests = useMemo(() => {
    return MOCK_REQUESTS.filter((req) => {
      const matchesSearch = !search ||
        (req.employee && `${req.employee.first_name} ${req.employee.last_name}`.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = !statusFilter || req.status === statusFilter;
      const matchesTab = activeTab === 'all' || req.status === activeTab;
      return matchesSearch && matchesStatus && matchesTab;
    });
  }, [search, statusFilter, activeTab]);

  const handleApprove = (id: string) => {
    console.log('Approved:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Leave Management"
        description="Manage leave requests and approvals"
        actions={
          <Button onClick={() => navigate('/leave/apply')}>
            <Plus className="mr-2 size-4" />
            Apply Leave
          </Button>
        }
      />

      {/* Stats */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">
                  {MOCK_REQUESTS.filter((r) => r.status === 'pending').length}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="size-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Approved</p>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  {MOCK_REQUESTS.filter((r) => r.status === 'approved').length}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="size-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Rejected</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {MOCK_REQUESTS.filter((r) => r.status === 'rejected').length}
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                <XCircle className="size-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Leave Requests */}
      <Section>
        {/* Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeaveStatus)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredRequests.length > 0 ? (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      {canApproveAction && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((req) => {
                      const config = statusConfig[req.status];
                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.employee ? `${req.employee.first_name} ${req.employee.last_name}` : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{typeLabels[req.leave_type]}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(req.start_date).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">to</div>
                              <div>{new Date(req.end_date).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                          <TableCell>
                            <Badge className={cn(config.bg, config.color)}>
                              <config.icon className="mr-1 size-3" />
                              {req.status}
                            </Badge>
                          </TableCell>
                          {canApproveAction && req.status === 'pending' && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-green-500 text-green-600"
                                  onClick={() => handleApprove(req.id)}
                                >
                                  <Check className="size-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-red-500 text-red-600"
                                  onClick={() => handleReject(req.id)}
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No leave requests found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </PageContainer>
  );
}
