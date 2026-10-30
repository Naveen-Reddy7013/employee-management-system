import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const departmentSchema = z.object({
  name: z.string().min(2, 'Department name must be at least 2 characters'),
  description: z.string().optional(),
  manager_id: z.string().optional(),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

// Mock data for demo
const MOCK_EMPLOYEES = [
  { id: 'emp-1', name: 'James Anderson', department: 'Engineering' },
  { id: 'emp-5', name: 'David Kim', department: 'Marketing' },
  { id: 'emp-8', name: 'Amanda White', department: 'Finance' },
  { id: 'emp-11', name: 'Christopher Lee', department: 'HR' },
  { id: 'emp-13', name: 'Andrew Wilson', department: 'Sales' },
  { id: 'emp-16', name: 'Michelle Davis', department: 'Operations' },
];

export default function DepartmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: isEdit ? 'Engineering' : '',
      description: isEdit ? 'Software development and technical operations' : '',
      manager_id: isEdit ? 'emp-1' : '',
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    console.log('Department data:', data);
    navigate('/departments');
  };

  return (
    <PageContainer>
      <PageHeader
        title={isEdit ? 'Edit Department' : 'Add New Department'}
        description={isEdit ? 'Update department information' : 'Create a new department for your organization'}
        actions={
          <Button variant="outline" onClick={() => navigate('/departments')}>
            <X className="mr-2 size-4" />
            Cancel
          </Button>
        }
      />

      <Section>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. Engineering"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the department"
              rows={3}
            />
          </div>

          {/* Manager */}
          <div className="space-y-2">
            <Label htmlFor="manager_id">Department Manager</Label>
            <Select onValueChange={(val) => {
              // In a real form, we'd use setValue here
            }} value={undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a manager (optional)" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_EMPLOYEES.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name} - {emp.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/departments')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 size-4" />
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Section>
    </PageContainer>
  );
}
