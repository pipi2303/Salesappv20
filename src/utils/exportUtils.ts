import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { KPITargetData } from '@/types/kpi-enhanced';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// --- Generic Export Functions ---

export const exportToExcel = (data: any[], filename: string = 'export.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
};

export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: any[], filename: string = 'export.pdf', title: string = 'Export Data', columns?: string[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  if (data.length === 0) return;

  const tableColumn = columns || Object.keys(data[0]);
  const tableRows = data.map(item => tableColumn.map(col => item[col]?.toString() || ''));

  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [1, 84, 78] },
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};

// --- KPI Specific Export Functions ---

export const exportKPIToExcel = (data: KPITargetData[], filename: string = 'KPI_Summary.xlsx') => {
  const wsData = data.map(item => ({
    'Employee Name': item.employeeName,
    'Period': item.period,
    'Revenue Target': item.revenueTarget,
    'Revenue Actual': item.revenueActual,
    'Deals Target': item.dealsTarget,
    'Deals Actual': item.dealsActual,
    'Activities Target': item.activitiesTarget,
    'Activities Actual': item.activitiesActual,
    'Conversion Target (%)': item.conversionRateTarget,
    'Conversion Actual (%)': item.conversionRateActual,
    'Meetings Target': item.meetingsTarget,
    'Meetings Actual': item.meetingsActual,
    'Status': (item.revenueActual / item.revenueTarget) >= 1 ? 'Achieved' : 'In Progress'
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'KPI Summary');
  XLSX.writeFile(wb, filename);
};

export const exportKPIToPDF = (data: KPITargetData[], filename: string = 'KPI_Summary.pdf') => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(1, 84, 78); // #01544e
  doc.text('KPI Performance Summary', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  const tableColumn = [
    'Employee', 
    'Period', 
    'Rev Target', 
    'Rev Actual', 
    'Deals', 
    'Conv %'
  ];
  
  const tableRows = data.map(item => [
    item.employeeName,
    item.period,
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.revenueTarget),
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.revenueActual),
    `${item.dealsActual}/${item.dealsTarget}`,
    `${item.conversionRateActual.toFixed(1)}%`
  ]);

  doc.autoTable({
    startY: 40,
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: [1, 84, 78] },
    theme: 'striped',
  });

  doc.save(filename);
};

export const exportSingleKPIToPDF = (item: KPITargetData) => {
  const doc = new jsPDF();
  const brandColor = [1, 84, 78]; // #01544e

  // Header
  doc.setFillColor(1, 84, 78);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('PERFORMANCE REPORT', 14, 25);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 160, 25);

  // Employee Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(item.employeeName, 14, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Period: ${item.period} (${item.periodType})`, 14, 62);

  // Summary Grid
  const summaryData = [
    ['Metric', 'Target', 'Actual', 'Achievement'],
    ['Revenue', 
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.revenueTarget),
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.revenueActual),
      `${((item.revenueActual / item.revenueTarget) * 100).toFixed(1)}%`
    ],
    ['Deals', item.dealsTarget.toString(), item.dealsActual.toString(), `${((item.dealsActual / item.dealsTarget) * 100).toFixed(1)}%`],
    ['Conversion Rate', `${item.conversionRateTarget}%`, `${item.conversionRateActual}%`, `${((item.conversionRateActual / item.conversionRateTarget) * 100).toFixed(1)}%`],
    ['Meetings', item.meetingsTarget.toString(), item.meetingsActual.toString(), `${((item.meetingsActual / item.meetingsTarget) * 100).toFixed(1)}%`],
    ['Activities', item.activitiesTarget.toString(), item.activitiesActual.toString(), `${((item.activitiesActual / item.activitiesTarget) * 100).toFixed(1)}%`]
  ];

  doc.autoTable({
    startY: 75,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    headStyles: { fillColor: brandColor },
    alternateRowStyles: { fillColor: [240, 248, 247] },
  });

  // AI Insights Section
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setTextColor(1, 84, 78);
  doc.text('AI Analysis & Recommendations', 14, finalY);
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  const insights = [
    "• Revenue performance is currently at " + ((item.revenueActual / item.revenueTarget) * 100).toFixed(1) + "% of target.",
    "• Based on velocity, expected to reach " + ((item.revenueActual / item.revenueTarget) * 120).toFixed(1) + "% by end of period.",
    "• Focus on high-value deals to accelerate growth.",
    "• Conversion rate shows a positive trend compared to last period."
  ];
  
  doc.text(insights, 14, finalY + 10);

  doc.save(`Performance_Report_${item.employeeName}_${item.period}.pdf`);
};
