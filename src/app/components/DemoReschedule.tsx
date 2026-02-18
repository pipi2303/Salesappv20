import React, { useState } from 'react';
import { RotateCcw, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Demo } from '@/app/data/dummyData';
import { toast } from 'sonner';

interface DemoRescheduleProps {
  demo: Demo;
  onReschedule: (updatedDemo: Demo) => void;
}

export function DemoReschedule({ demo, onReschedule }: DemoRescheduleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');

  const formatDateForInput = (date: any): string => {
    if (!date) return '';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      toast.error('Harap isi tanggal dan waktu baru');
      return;
    }

    const previousDate = formatDateForInput(demo.date);
    const previousTime = demo.time;

    const rescheduleEntry = {
      previousDate,
      previousTime,
      newDate,
      newTime,
      reason,
      timestamp: new Date().toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedDemo: Demo = {
      ...demo,
      date: new Date(newDate),
      time: newTime,
      status: 'rescheduled',
      rescheduleHistory: [
        ...(demo.rescheduleHistory || []),
        rescheduleEntry
      ]
    };

    onReschedule(updatedDemo);
    toast.success('Demo berhasil dijadwal ulang!');
    setIsOpen(false);
    setNewDate('');
    setNewTime('');
    setReason('');
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700"
        onClick={() => setIsOpen(true)}
      >
        <RotateCcw className="h-4 w-4 mr-2" />
        Reschedule
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-yellow-600" />
              Reschedule Demo
            </DialogTitle>
            <DialogDescription>
              Jadwalkan ulang demo: {demo.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Schedule */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Current Schedule:</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatDateForInput(demo.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{demo.time}</span>
                </div>
              </div>
            </div>

            {/* New Schedule */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="newDate" className="text-sm font-semibold">
                    Tanggal Baru
                  </Label>
                  <Input
                    id="newDate"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newTime" className="text-sm font-semibold">
                    Waktu Baru
                  </Label>
                  <Input
                    id="newTime"
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-semibold">
                  Alasan Reschedule (opsional)
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Client requested different time"
                  rows={3}
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Demo akan dijadwal ulang dan status akan berubah menjadi "Rescheduled". 
                Riwayat perubahan akan tersimpan.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600"
              onClick={handleReschedule}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reschedule Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
