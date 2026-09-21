// Bab 16: "Katalog Lengkap Lini Atap (Roofing)" — 5 Product Family per
// kategori "Atap", ditranskripsi dari tabel dokumen. Hanya level Family
// yang dimodelkan (lihat komentar di schema.prisma untuk alasan scoping:
// Product/Variant/SKU/Packaging di bawah Family belum punya data contoh
// yang konkret di Bab 16, jadi belum dibuat tabelnya).

export interface ProductFamilySeed {
  code: string;
  name: string;
  type: string;
}

export const productFamilySeeds: ProductFamilySeed[] = [
  { code: 'ONDV', name: 'ONDUVILLA', type: 'Genteng Bitumen' },
  { code: 'ONDC', name: 'ONDULINE CLASSIC', type: 'Atap Bitumen Bergelombang' },
  { code: 'ONDT', name: 'ONDULINE TILE', type: 'Atap Bitumen Tile' },
  { code: 'ONDUC', name: 'ONDUCASA', type: 'Genteng Bitumen' },
  { code: 'BARD', name: 'BARDOLINE', type: 'Asphalt Shingles / Sirap Aspal' },
];
