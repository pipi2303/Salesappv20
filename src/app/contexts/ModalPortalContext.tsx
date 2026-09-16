import React, { createContext, useContext } from 'react';

/**
 * FIX: Modal/dialog positioning scope.
 * Menyediakan referensi ke elemen `#modal-portal-root` di dalam `.content-area`
 * (lihat App.tsx), supaya semua modal (Radix Dialog) di-render sebagai child dari
 * area content utama, bukan langsung ke document.body. Ini yang membuat modal &
 * backdrop selalu terbatas di area content (tidak menutupi sidebar/header) dan
 * "lock" (tidak ikut bergerak saat area content di-scroll), karena portal root
 * adalah sibling dari div yang di-scroll, bukan child-nya.
 *
 * Default null -> DialogPortal akan fallback ke document.body (misal di halaman
 * Login yang tidak punya sidebar/header/.content-area).
 */
const ModalPortalContext = createContext<HTMLElement | null>(null);

export function ModalPortalProvider({
  container,
  children,
}: {
  container: HTMLElement | null;
  children: React.ReactNode;
}) {
  return (
    <ModalPortalContext.Provider value={container}>
      {children}
    </ModalPortalContext.Provider>
  );
}

export function useModalPortalContainer(): HTMLElement | null {
  return useContext(ModalPortalContext);
}
