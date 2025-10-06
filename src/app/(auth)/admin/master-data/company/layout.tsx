'use client';

import * as React from 'react';

export default function MasterDataCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="space-y-4">
       <div>
           {children}
       </div>
    </div>
  );
}
