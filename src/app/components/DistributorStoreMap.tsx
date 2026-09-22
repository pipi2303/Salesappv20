// Peta Distributor & Toko (Bab 11, Menu Dashboard Manajemen).
//
// Fase 1: peta GIS nyata (Leaflet + OpenStreetMap tiles) menampilkan
// seluruh Distributor & Toko dari distributorsRepository/storesRepository
// (gpsLat/gpsLng, prisma/schema.prisma) — menggantikan pendekatan lama di
// TerritoryMap.tsx (SVG statis dengan beberapa titik contoh, bukan peta
// GIS nyata). Tidak mengubah TerritoryMap.tsx sama sekali; menu itu tetap
// ada terpisah.
//
// Layer yang sudah didapat "gratis" dari data yang ada, tanpa kerja
// tambahan di backend:
// - Status approval per titik (Bab 9: pending/approved/rejected) ->
//   warna marker + ringkasan "Antrean Approval".
// Layer lain dari insight doc (heatmap performa/coverage gap terhadap
// Territory, recency-of-visit & status-kepatuhan dari Task check-in,
// penetrasi kategori produk) sengaja DITUNDA ke fase berikutnya -- masing
// -masing butuh agregasi lintas-tabel (Territory, Task, Opportunity/
// Product) yang lebih berat daripada menampilkan titik GPS yang sudah ada.
//
// Default tampilan hanya menampilkan titik berstatus "approved" (perilaku
// operasional yang sebenarnya). Untuk role approver (Super Admin/Sales
// Manager/Master Data Admin) tersedia toggle untuk menampilkan titik
// "pending" juga, sehingga peta ini sekaligus jadi satu tempat untuk
// melihat antrean approval secara spasial.

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Store as StoreIcon, Truck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';
import { distributorsRepository } from '@/services/distributorsRepository';
import { storesRepository } from '@/services/storesRepository';
import { formatDate } from '@/utils/formatters';
import type { Distributor } from '@/types/distributor';
import type { Store } from '@/types/store';
import type { ApprovalStatus } from '@/types/distributor';

const APPROVER_ROLES = new Set(['Super Admin', 'Sales Manager', 'Master Data Admin']);

// Default center: kira-kira tengah Indonesia, dipakai kalau belum ada titik
// dengan koordinat valid untuk dihitung rata-ratanya.
const DEFAULT_CENTER: [number, number] = [-2.5, 118];
const DEFAULT_ZOOM = 5;

const STATUS_COLOR: Record<ApprovalStatus, string> = {
  approved: '#10b981', // emerald-500
  pending: '#f59e0b', // amber-500
  rejected: '#ef4444', // red-500
};

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
};

type PointKind = 'distributor' | 'store';

interface MapPoint {
  kind: PointKind;
  id: string;
  code: string;
  name: string;
  address: string;
  status: ApprovalStatus;
  lat: number;
  lng: number;
  distributorName: string | null; // only meaningful for stores
  submittedAt: Date | null;
  decidedAt: Date | null;
  rejectionNote: string;
}

function divIcon(kind: PointKind, status: ApprovalStatus): L.DivIcon {
  const color = STATUS_COLOR[status];
  const size = kind === 'distributor' ? 26 : 20;
  const shape =
    kind === 'distributor'
      ? `border-radius:6px;` // square-ish = distributor
      : `border-radius:50%;`; // circle = toko
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};${shape}border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function toPoints(distributors: Distributor[], stores: Store[]): MapPoint[] {
  const distributorPoints: MapPoint[] = distributors
    .filter((d) => d.gpsLat !== null && d.gpsLng !== null)
    .map((d) => ({
      kind: 'distributor',
      id: d.id,
      code: d.code,
      name: d.name,
      address: d.address,
      status: d.status,
      lat: d.gpsLat as number,
      lng: d.gpsLng as number,
      distributorName: null,
      submittedAt: d.submittedAt,
      decidedAt: d.decidedAt,
      rejectionNote: d.rejectionNote,
    }));

  const storePoints: MapPoint[] = stores
    .filter((s) => s.gpsLat !== null && s.gpsLng !== null)
    .map((s) => ({
      kind: 'store',
      id: s.id,
      code: s.code,
      name: s.name,
      address: s.address,
      status: s.status,
      lat: s.gpsLat as number,
      lng: s.gpsLng as number,
      distributorName: s.distributor?.name ?? null,
      submittedAt: s.submittedAt,
      decidedAt: s.decidedAt,
      rejectionNote: s.rejectionNote,
    }));

  return [...distributorPoints, ...storePoints];
}

export function DistributorStoreMap() {
  const { user } = useAuth();
  const isApprover = !!user?.role && APPROVER_ROLES.has(user.role);

  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState<'all' | PointKind>('all');
  const [searchText, setSearchText] = useState('');
  const [showPending, setShowPending] = useState(false); // approver-only, default off

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [distRes, storeRes] = await Promise.all([
        distributorsRepository.getAll(),
        storesRepository.getAll(),
      ]);
      if (cancelled) return;
      if (distRes.success && distRes.data) {
        setDistributors(distRes.data);
      } else {
        toast.error(distRes.success ? 'Gagal memuat data distributor' : distRes.error);
      }
      if (storeRes.success && storeRes.data) {
        setStores(storeRes.data);
      } else {
        toast.error(storeRes.success ? 'Gagal memuat data toko' : storeRes.error);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allPoints = useMemo(() => toPoints(distributors, stores), [distributors, stores]);

  const visiblePoints = useMemo(() => {
    return allPoints.filter((p) => {
      if (p.status === 'rejected') return false;
      if (p.status === 'pending' && !(isApprover && showPending)) return false;
      if (typeFilter !== 'all' && p.kind !== typeFilter) return false;
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const haystack = `${p.name} ${p.code} ${p.address}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allPoints, isApprover, showPending, typeFilter, searchText]);

  const mapCenter = useMemo((): [number, number] => {
    if (allPoints.length === 0) return DEFAULT_CENTER;
    const sum = allPoints.reduce(
      (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
      { lat: 0, lng: 0 }
    );
    return [sum.lat / allPoints.length, sum.lng / allPoints.length];
  }, [allPoints]);

  const summary = useMemo(() => {
    const totalDistributor = distributors.length;
    const totalStore = stores.length;
    const pendingCount = allPoints.filter((p) => p.status === 'pending').length;
    const approvedCount = allPoints.filter((p) => p.status === 'approved').length;
    return { totalDistributor, totalStore, pendingCount, approvedCount };
  }, [distributors, stores, allPoints]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#013E37]">Peta Distributor & Toko</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sebaran lokasi Distributor dan Toko berdasarkan koordinat GPS, beserta status approval (Bab 9).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#013E37]/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#013E37]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.totalDistributor}</p>
                <p className="text-xs text-muted-foreground">Total Distributor</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#013E37]/10 flex items-center justify-center">
                <StoreIcon className="w-5 h-5 text-[#013E37]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.totalStore}</p>
                <p className="text-xs text-muted-foreground">Total Toko</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.approvedCount}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={summary.pendingCount > 0 ? 'border-amber-300 bg-amber-50/50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Antrean Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-base">Peta Sebaran</CardTitle>
              <CardDescription>
                Kotak = Distributor, lingkaran = Toko. Hijau = approved, kuning = pending.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Input
                placeholder="Cari nama, kode, atau alamat..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-56"
              />
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as 'all' | PointKind)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="store">Toko</SelectItem>
                </SelectContent>
              </Select>
              {isApprover && (
                <div className="flex items-center gap-2">
                  <Switch id="show-pending" checked={showPending} onCheckedChange={setShowPending} />
                  <Label htmlFor="show-pending" className="text-sm whitespace-nowrap">
                    Tampilkan Pending
                  </Label>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[520px] flex items-center justify-center text-muted-foreground text-sm">
              Memuat data peta...
            </div>
          ) : (
            <div className="h-[520px] rounded-xl overflow-hidden border border-gray-100">
              <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {visiblePoints.map((p) => (
                  <Marker key={`${p.kind}-${p.id}`} position={[p.lat, p.lng]} icon={divIcon(p.kind, p.status)}>
                    <Popup>
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          {p.kind === 'distributor' ? (
                            <Truck className="w-4 h-4 text-[#013E37]" />
                          ) : (
                            <StoreIcon className="w-4 h-4 text-[#013E37]" />
                          )}
                          <span className="font-semibold">{p.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Kode: {p.code}</p>
                        {p.address && <p className="text-xs text-muted-foreground">{p.address}</p>}
                        {p.distributorName && (
                          <p className="text-xs text-muted-foreground">Distributor: {p.distributorName}</p>
                        )}
                        <div className="flex items-center gap-1 pt-1">
                          {p.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {p.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {p.status === 'rejected' && <XCircle className="w-3 h-3 text-red-600" />}
                          <Badge
                            variant="outline"
                            className={
                              p.status === 'approved'
                                ? 'text-emerald-700 border-emerald-300'
                                : p.status === 'pending'
                                ? 'text-amber-700 border-amber-300'
                                : 'text-red-700 border-red-300'
                            }
                          >
                            {STATUS_LABEL[p.status]}
                          </Badge>
                        </div>
                        {p.status === 'pending' && p.submittedAt && (
                          <p className="text-xs text-muted-foreground">Diajukan: {formatDate(p.submittedAt)}</p>
                        )}
                        {p.status === 'rejected' && p.rejectionNote && (
                          <p className="text-xs text-red-600">Alasan ditolak: {p.rejectionNote}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && allPoints.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          Belum ada Distributor/Toko dengan koordinat GPS.
        </div>
      )}
    </div>
  );
}
