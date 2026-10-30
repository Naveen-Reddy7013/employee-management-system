import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Save, User, Key, Mail, Phone, MapPin } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors, isSubmitting: profileSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors, isSubmitting: passwordSubmitting } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    await updateProfile({ full_name: data.full_name, phone: data.phone, address: data.address });
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    console.log('Password update:', { new_password: data.new_password });
    // Reset form
    registerPassword('current_password', { value: '' });
    registerPassword('new_password', { value: '' });
    registerPassword('confirm_password', { value: '' });
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your account settings"
      />

      {/* Profile Section */}
      <Section>
        <div className="flex items-center gap-6">
          <Avatar className="size-20">
            <AvatarFallback className="bg-[#31439b] text-xl text-white">
              {getInitials(user?.full_name || 'U')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user?.full_name}</h2>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
            <p className="text-sm text-muted-foreground">{user?.phone || 'No phone number set'}</p>
          </div>
        </div>
      </Section>

      {/* Tabs */}
      <Section>
        <div className="mb-6">
          <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(handleProfileSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="full_name"
                        className="pl-10"
                        {...registerProfile('full_name')}
                      />
                    </div>
                    {profileErrors.full_name && (
                      <p className="text-sm text-destructive">{profileErrors.full_name.message}</p>
                    )}
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={user?.full_name || ''}
                        disabled
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        className="pl-10"
                        {...registerProfile('phone')}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="address"
                        className="pl-10"
                        {...registerProfile('address')}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={profileSubmitting}>
                    <Save className="mr-2 size-4" />
                    {profileSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="size-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    {...registerPassword('current_password')}
                  />
                  {passwordErrors.current_password && (
                    <p className="text-sm text-destructive">{passwordErrors.current_password.message}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    {...registerPassword('new_password')}
                  />
                  {passwordErrors.new_password && (
                    <p className="text-sm text-destructive">{passwordErrors.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...registerPassword('confirm_password')}
                  />
                  {passwordErrors.confirm_password && (
                    <p className="text-sm text-destructive">{passwordErrors.confirm_password.message}</p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={passwordSubmitting}>
                    <Save className="mr-2 size-4" />
                    {passwordSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </Section>
    </PageContainer>
  );
}
