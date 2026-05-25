// core/models/product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  active: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}