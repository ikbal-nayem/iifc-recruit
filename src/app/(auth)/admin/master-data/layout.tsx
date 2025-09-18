
'use client';

import * as React from 'react';

export default function MasterDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="space-y-8">
       {children}
    </div>
  );
}
