
'use client';

import * as React from 'react';

export default function MasterDataEducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-headline font-bold">
          Education
        </h2>
        <p className="text-muted-foreground">
          Manage education-related master data like degrees, domains, and institutions.
        </p>
      </div>
       <div className="pt-4">
           {children}
       </div>
    </div>
  );
}
