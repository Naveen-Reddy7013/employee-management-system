import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const leaveSchema = z.object({
  leave_type: z.enum(['casual', 'sick', 'earned'], { required_error: 'Please select a leave type' }),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
}).refine((data) => {
  if (!data.start_date || !data.end_date) return false;
  return new Date(data.end_date) >= new Date(data.start_date);
}, {
  message: 'End date must be after or equal to start date',
  path: ['end_date'],
});

type LeaveFormData = z.infer<typeof leaveSchema>;

interface BalanceItem {
  type: 'casual' | 'sick' | 'earned';
  total: number;
  used: number;
  remaining: number;
}

const BALANCE_DATA: BalanceItem[] = [
  { type: 'casual', total: 12, used: 3, remaining: 9 },
  { type: 'sick', total: 10, used: 1, remaining: 9 },
  { type: 'earned', total: 20, used: 5, remaining: 15 },
];

export default function LeaveApply() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leave_type: 'casual',
      start_date: '',
      end_date: '',
      reason: '',
    },
  });

  const onSubmit = async (data: LeaveFormData) => {
    console.log('Leave request:', data);
    navigate('/leave');
  };

  const getRemainingDays = (type: string) => {
    return BALANCE_DATA.find((b) => b.type === type)?.remaining || 0;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Apply for Leave"
        description="Submit a new leave request"
        actions={
          <Button variant="outline" onClick={() => navigate('/leave')}>
            <X className="mr-2 size-4" />
            Cancel
          </Button>
        }
      />

      {/* Leave Balances */}
      <Section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Your Leave Balances</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {BALANCE_DATA.map((balance) => (
            <Card key={balance.type}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {balance.type === 'casual' ? 'Casual' : balance.type === 'sick' ? 'Sick' : 'Earned'} Leave
                    </p>
                    <p className="mt-1 text-2xl font-bold">{balance.remaining}</p>
                    <p className="text-xs text-muted-foreground">of {balance.total} days</p>
                  </div>
                  <Badge variant="outline">{balance.used} used</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[#31439b]"
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Leave Form */}
      <Section>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
          {/* Leave Type */}
          <div className="space-y-2">
            <Label>Leave Type *</Label>
            <Select onValueChange={(val) => setValue('leave_type', val as 'casual' | 'sick' | 'earned')} value={getValues('leave_type')}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual Leave (9 days remaining)</SelectItem>
                <SelectItem value="sick">Sick Leave (9 days remaining)</SelectItem>
                <SelectItem value="earned">Earned Leave (15 days remaining)</SelectItem>
              </SelectContent>
            </Select>
            {errors.leave_type && (
              <p className="text-sm text-destructive">{errors.leave_type.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                {...register('start_date')}
              />
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                {...register('end_date')}
              />
              {errors.end_date && (
                <p className="text-sm text-destructive">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder="Please provide a reason for your leave request..."
              rows={4}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          {/* Days summary */}
          {getValues('start_date') && getValues('end_date') && (
            <div className={cn(
              'rounded-lg border p-3',
              (() => {
                const start = new Date(getValues('start_date'));
                const end = new Date(getValues('end_date'));
                return end < start ? 'border-destructive bg-destructive/5' : 'border-muted bg-muted/30';
              })()
            )}>
              <p className="text-sm">
                Duration: <span className="font-semibold">
                  {(() => {
                    const start = new Date(getValues('start_date'));
                    const end = new Date(getValues('end_date'));
                    if (end < start) return 'Invalid date range';
                    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return `${days} day${days > 1 ? 's' : ''}`;
                  })()}
                </span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/leave')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Section>
    </PageContainer>
  );
}
