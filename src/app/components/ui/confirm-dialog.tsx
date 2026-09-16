import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

// FIX: pengganti window.confirm() bawaan browser.
// window.confirm() adalah dialog NATIVE browser - selalu full-viewport, tidak
// bisa di-style/di-scope ke .content-area sama sekali (di luar kendali CSS/React).
// ConfirmDialog ini pakai <Dialog> yang sama dipakai di seluruh app, jadi otomatis
// ikut ter-scope ke .content-area (lihat ui/dialog.tsx & ModalPortalContext) -
// konsisten dengan aturan "semua modal/dialog dibatasi ke area content utama".
//
// API-nya sengaja dibuat mirip window.confirm() (fungsi confirm(message) yang
// me-resolve boolean) supaya penggantian call-site di komponen lain minim
// perubahan: `if (!confirm(msg)) return;` -> `if (!(await confirm(msg))) return;`

export type ConfirmOptions = {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  /** 'destructive' = tombol konfirmasi merah, untuk aksi hapus/tidak bisa dibatalkan. */
  variant?: 'default' | 'destructive';
};

type ConfirmFn = (message: string, options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; message: string; options: ConfirmOptions }>({
    open: false,
    message: '',
    options: {},
  });
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirmFn = useCallback<ConfirmFn>((message, options = {}) => {
    setState({ open: true, message, options });
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = useCallback((result: boolean) => {
    setState((s) => ({ ...s, open: false }));
    resolverRef.current?.(result);
    resolverRef.current = null;
  }, []);

  return (
    <ConfirmContext.Provider value={confirmFn}>
      {children}
      <Dialog open={state.open} onOpenChange={(open) => { if (!open) settle(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{state.options.title ?? 'Konfirmasi'}</DialogTitle>
            <DialogDescription className="whitespace-pre-line text-foreground/80">
              {state.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => settle(false)}>
              {state.options.cancelText ?? 'Batal'}
            </Button>
            <Button
              variant={state.options.variant === 'destructive' ? 'destructive' : 'default'}
              onClick={() => settle(true)}
            >
              {state.options.confirmText ?? 'Ya, Lanjutkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm() harus dipakai di dalam <ConfirmDialogProvider>');
  }
  return ctx;
}
