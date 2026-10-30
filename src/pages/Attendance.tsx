import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

import { DEMO_EMPLOYEES, DEMO_DEPARTMENTS, DEMO_ATTENDANCE } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStatusColor } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';
import { canEdit } from '@/utils/helpers';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'on-leave';

const statusIcons: Record<AttendanceStatus, typeof CheckCircle> = {
  present: CheckCircle,
  absent: XCircle,
  late: AlertCircle,
  'half-day': AlertCircle,
  'on-leave': Clock,
};

const today = new Date().toISOString().split('T')[0];

// Mock attendance for today
const todayAttendance = DEMO_EMPLOYEES
  .filter((e) => e.status === 'active')
  .slice(0, 8)
  .map((emp, i) => ({
    id: `att-today-${emp.id}`,
    employee_id: emp.id,
    employee: emp,
    attendance_date: today,
    check_in: i < 6 ? `${7 + i}:${(10 + i * 5).toString().padStart(2, '0')}` : null,
    check_out: i < 4 ? `${17}:${(10 + i * 10).toString().padStart(2, '0')}` : null,
    status: i < 6 ? (i < 2 ? 'present' : 'late') : (i === 6 ? 'absent' : 'on-leave'),
  }));

export default function Attendance() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | ''>('');
  const [showToday, setShowToday] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<typeof todayAttendance[0] | null>(null);

  const canManage = user ? canEdit(user.role) : false;

  const filteredRecords = useMemo(() => {
    return todayAttendance.filter((rec) => {
      const matchesSearch = !search ||
        `${rec.employee.first_name} ${rec.employee.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
        rec.employee.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || rec.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: todayAttendance.length,
    present: todayAttendance.filter((r) => r.status === 'present' || r.status === 'late').length,
    absent: todayAttendance.filter((r) => r.status === 'absent').length,
    onLeave: todayAttendance.filter((r) => r.status === 'on-leave').length,
    late: todayAttendance.filter((r) => r.status === 'late').length,
  }), []);

  const handleCheckIn = (empId: string) => {
    console.log('Check in:', empId, new Date().toLocaleTimeString());
  };

  const handleCheckOut = (empId: string) => {
    console.log('Check out:', empId, new Date().toLocaleTimeString());
  };

  return (
    <PageContainer>
      <PageHeader
        title="Attendance"
        description="Manage daily attendance tracking"
      />

      {/* Stats */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={stats.total} color="text-blue-600" bgColor="bg-blue-50" />
          <StatCard label="Present" value={stats.present} color="text-green-600" bgColor="bg-green-50" />
          <StatCard label="Absent" value={stats.absent} color="text-red-600" bgColor="bg-red-50" />
          <StatCard label="Late" value={stats.late} color="text-amber-600" bgColor="bg-amber-50" />
          <StatCard label="On Leave" value={stats.onLeave} color="text-purple-600" bgColor="bg-purple-50" />
        </div>
      </Section>

      {/* Today's Attendance */}
      <Section>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={showToday ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowToday(true)}
            >
              <CalendarIcon className="mr-2 size-4" />
              Today
            </Button>
            <Button
              variant={!showToday ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowToday(false)}
            >
              History
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>

        {showToday ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const StatusIcon = statusIcons[record.status];
                  return (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRecord(record)}>
                      <TableCell className="font-medium">
                        {record.employee.first_name} {record.employee.last_name}
                      </TableCell>
                      <TableCell>{record.attendance_date}</TableCell>
                      <TableCell className="font-mono text-sm">{record.check_in || '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{record.check_out || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          <StatusIcon className="mr-1 size-3" />
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {!record.check_in && canManage && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-500 text-green-600"
                              onClick={() => handleCheckIn(record.employee_id)}
                            >
                              Check In
                            </Button>
                          )}
                          {record.check_in && !record.check_out && canManage && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-amber-500 text-amber-600"
                              onClick={() => handleCheckOut(record.employee_id)}
                            >
                              Check Out
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">
              Historical attendance data will be displayed here.
            </p>
          </div>
        )}
      </Section>

      {/* Attendance Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent>
          {selectedRecord && (
            <>
              <DialogHeader>
                <DialogTitle>Attendance Details</DialogTitle>
                <DialogDescription>
                  {selectedRecord.employee.first_name} {selectedRecord.employee.last_name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium">{selectedRecord.attendance_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check In</span>
                  <span className="text-sm font-medium font-mono">{selectedRecord.check_in || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check Out</span>
                  <span className="text-sm font-medium font-mono">{selectedRecord.check_out || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedRecord(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

function StatCard({ label, value, color, bgColor }: { label: string; value: number; color: string; bgColor: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-lg', bgColor)}>
            <Clock className={cn('size-5', color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
