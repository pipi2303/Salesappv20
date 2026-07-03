import React from 'react';
import { Loader2 } from 'lucide-react';

export function ComponentLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#013E37]" />
        <p className="text-sm text-gray-600 font-medium">Loading component...</p>
      </div>
    </div>
  );
}
