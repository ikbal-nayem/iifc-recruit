
'use client';

import * as React from 'react';

export default function MasterDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Master Data Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage the core data used across the application.
        </p>
      </div>
       <div>
           {children}
       </div>
    </div>
  );
}
