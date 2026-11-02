
export interface ProductCategorySeed {
  code: string;
  name: string;
}

export const productCategorySeeds: ProductCategorySeed[] = [];

export interface ProductFamilySeed {
  code: string;
  name: string;
  type: string;
  categoryCode: string;
}

export const productFamilySeeds: ProductFamilySeed[] = [];

export interface ProductInstanceSeed {
  familyCode: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  unitOfMeasure: string;
  weightKg?: number;
  description: string;
  features: string[];
  variantLabel?: string;
}

export const productInstanceSeeds: ProductInstanceSeed[] = [];
