
'use client';

import * as React from 'react';

export default function MasterDataEducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="space-y-4">
       <div className="pt-4">
           {children}
       </div>
    </div>
  );
}
