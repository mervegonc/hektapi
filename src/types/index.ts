export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  order: number;
  created_at: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_ids: string[];
  short_description: string | null;
  description: string | null;
  standards: string | null;
  image_url: string | null;
  images: string[];
  specs: ProductSpec[];
  highlights: string[];
  use_cases: string[];
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  product_id: string | null;
  product_name: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}