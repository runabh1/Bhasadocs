import { Leaf } from 'lucide-react';
import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="BhashaDocs Logo">
      <Leaf className="h-7 w-7 text-accent" />
      <h1 className="text-3xl font-bold font-headline text-primary">BhashaDocs</h1>
    </div>
  );
}
