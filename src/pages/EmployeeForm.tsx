import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { DEMO_DEPARTMENTS } from '@/lib/supabase';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateEmployeeId } from '@/utils/helpers';
import type { EmploymentStatus } from '@/types';

const employeeSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  department_id: z.string().min(1, 'Please select a department'),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
  joining_date: z.string().min(1, 'Please select a joining date'),
  status: z.enum(['active', 'inactive', 'terminated']),
  address: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function EmployeeForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      department_id: '',
      designation: '',
      joining_date: new Date().toISOString().split('T')[0],
      status: 'active',
      address: '',
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    // In production, this would call an API
    console.log('Employee data:', { ...data, employee_id: isEdit ? undefined : generateEmployeeId() });
    // Show success and navigate back
    navigate('/employees');
  };

  const departments = DEMO_DEPARTMENTS;

  return (
    <PageContainer>
      <PageHeader
        title={isEdit ? 'Edit Employee' : 'Add New Employee'}
        description={isEdit ? 'Update employee information' : 'Add a new employee to the system'}
        actions={
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <X className="mr-2 size-4" />
            Cancel
          </Button>
        }
      />

      <Section>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="employee@company.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department_id">Department *</Label>
              <Select onValueChange={(val) => setValue('department_id', val)} value={getValues('department_id')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department_id && (
                <p className="text-sm text-destructive">{errors.department_id.message}</p>
              )}
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                {...register('designation')}
                placeholder="e.g. Software Engineer"
              />
              {errors.designation && (
                <p className="text-sm text-destructive">{errors.designation.message}</p>
              )}
            </div>

            {/* Joining Date */}
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date *</Label>
              <Input
                id="joining_date"
                type="date"
                {...register('joining_date')}
              />
              {errors.joining_date && (
                <p className="text-sm text-destructive">{errors.joining_date.message}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Employment Status *</Label>
            <Select onValueChange={(val) => setValue('status', val as EmploymentStatus)} value={getValues('status')}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Section>
    </PageContainer>
  );
}
