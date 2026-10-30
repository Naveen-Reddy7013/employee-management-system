import { useState } from 'react';
import { Bell, Check, CheckCheck, CheckCircle, XCircle, AlertCircle, Clock, DollarSign, Calendar } from 'lucide-react';

import { PageContainer, PageHeader, Section } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_NOTIFICATIONS } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type NotificationType = 'leave_request' | 'leave_approved' | 'leave_rejected' | 'attendance' | 'payroll' | 'system';

const notifications = DEMO_NOTIFICATIONS;

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  leave_request: { icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-100' },
  leave_approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  leave_rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  attendance: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  payroll: { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  system: { icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
};

export default function Notifications() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter((n) => !n.is_read).length;

  const handleMarkRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const filteredNotifications = notificationList.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.is_read;
    return n.type === activeFilter;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Your in-app notifications"
        actions={unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 size-4" />
            Mark All Read
          </Button>
        )}
      />

      <Section>
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
            {activeFilter === 'all' && (
              <Badge className="ml-2 size-5 p-0 text-xs">{notificationList.length}</Badge>
            )}
          </Button>
          <Button
            variant={activeFilter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('unread')}
          >
            Unread
            {activeFilter === 'unread' && (
              <Badge className="ml-2 size-5 p-0 text-xs">{unreadCount}</Badge>
            )}
          </Button>
          {(['leave_request', 'attendance', 'payroll'] as NotificationType[]).map((type) => (
            <Button
              key={type}
              variant={activeFilter === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(type)}
            >
              {type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Button>
          ))}
        </div>

        {/* Notification List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 rounded-lg border p-4 transition-colors',
                    !notification.is_read && 'bg-muted/30 border-[#31439b]/20',
                  )}
                >
                  <div className={cn('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg', config.bg)}>
                    <config.icon className={cn('size-4', config.color)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn('text-sm font-medium', !notification.is_read && 'text-foreground')}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-6 shrink-0"
                          onClick={() => handleMarkRead(notification.id)}
                        >
                          <Check className="size-3.5" />
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Bell className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-3 text-sm font-medium">No notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeFilter === 'unread'
                ? 'You have no unread notifications'
                : 'No notifications match the selected filter'}
            </p>
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
