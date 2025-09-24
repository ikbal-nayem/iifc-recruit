'use client';

import { AdminProfileForm } from '@/components/app/admin/admin-profile-form';

export default function AdminProfilePage() {
  const adminUser = {
    name: 'Admin User',
    email: 'admin@iifc.com',
    phone: '123-456-7890',
    avatar: 'https://picsum.photos/seed/admin/100/100',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Admin Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information.
        </p>
      </div>
      <AdminProfileForm user={adminUser} />
    </div>
  );
}
