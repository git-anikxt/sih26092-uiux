'use client';

import { Landmark } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-5 sm:px-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
          <Landmark className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            NSFDC Scheme Finder
          </h1>
          <p className="truncate text-sm text-primary-foreground/80">
            National Scheduled Castes Finance &amp; Development Corporation
          </p>
        </div>
      </div>
    </header>
  );
}
