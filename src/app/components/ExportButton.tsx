import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { exportToExcel, exportToPDF, exportToCSV } from '@/utils/exportUtils';
import { toast } from 'sonner';

interface ExportButtonProps<T> {
  data: T[];
  filename: string;
  title?: string;
  columns?: string[];
  disabled?: boolean;
}

export function ExportButton<T extends Record<string, any>>({
  data,
  filename,
  title = 'Data Export',
  columns,
  disabled = false,
}: ExportButtonProps<T>) {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(`Mengekspor data ke ${format.toUpperCase()}...`);

    try {
      switch (format) {
        case 'excel':
          exportToExcel(data, filename);
          toast.dismiss(loadingToast);
          toast.success('✅ Data berhasil diekspor ke Excel!');
          break;
        case 'pdf':
          exportToPDF(data, filename, title, columns);
          toast.dismiss(loadingToast);
          toast.success('✅ Data berhasil diekspor ke PDF!');
          break;
        case 'csv':
          exportToCSV(data, filename);
          toast.dismiss(loadingToast);
          toast.success('✅ Data berhasil diekspor ke CSV!');
          break;
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Gagal mengekspor data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 ${
            disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={disabled || loading}
        >
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Export ke Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
          <FileText className="h-4 w-4 text-red-600" />
          Export ke PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
          <File className="h-4 w-4 text-blue-600" />
          Export ke CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}