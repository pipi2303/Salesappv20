import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#013E37]">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-[#FFEFB2]/20 animate-ping absolute"></div>
            <div className="h-24 w-24 rounded-full bg-[#FFEFB2] flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-[#013E37] animate-spin" />
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#FFEFB2] mb-2">Sales Monitoring Pro</h1>
        <p className="text-[#FFEFB2]/70">Memuat aplikasi...</p>
      </div>
    </div>
  );
}
