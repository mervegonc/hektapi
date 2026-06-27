-- =============================================
-- HEKTAPI VERİTABANI ŞEMASI
-- Supabase SQL Editor'e yapıştır ve çalıştır
-- =============================================

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description TEXT,
  standards TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  specs JSONB DEFAULT '[]',
  highlights TEXT[] DEFAULT '{}',
  use_cases TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teklif talepleri tablosu
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Kategoriler: herkes okuyabilir
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (TRUE);

-- Kategoriler: sadece giriş yapmış kullanıcı yazabilir
CREATE POLICY "categories_auth_write" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Ürünler: herkes aktif ürünleri okuyabilir
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = TRUE);

-- Ürünler: sadece giriş yapmış kullanıcı tüm ürünleri okuyabilir ve yazabilir
CREATE POLICY "products_auth_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Teklif talepleri: herkes ekleyebilir (form submit)
CREATE POLICY "inquiries_public_insert" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

-- Teklif talepleri: sadece giriş yapmış kullanıcı okuyabilir
CREATE POLICY "inquiries_auth_read" ON inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE POLİCİES
-- (Bucket'ları UI'dan oluşturduktan sonra çalıştır)
-- =============================================

-- Storage: herkes okuyabilir (public bucket)
CREATE POLICY "storage_public_read_products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "storage_public_read_categories" ON storage.objects
  FOR SELECT USING (bucket_id = 'categories');

-- Storage: sadece giriş yapmış kullanıcı yükleyebilir/silebilir
CREATE POLICY "storage_auth_write_products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "storage_auth_delete_products" ON storage.objects
  FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "storage_auth_write_categories" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

CREATE POLICY "storage_auth_delete_categories" ON storage.objects
  FOR DELETE USING (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- =============================================
-- BAŞLANGIÇ VERİSİ (Kategoriler)
-- =============================================

INSERT INTO categories (name, slug, description, "order") VALUES
  ('Asfalt', 'asfalt', 'Asfalt ve bitümlü malzeme test cihazları', 1),
  ('Beton', 'beton', 'Beton dayanım ve kalite kontrol test cihazları', 2),
  ('Çimento', 'cimento', 'Çimento kalite kontrol ve mekanik test ekipmanları', 3),
  ('Tartma, Kurutma ve Sınıflandırma', 'tartma-kurutma-siniflandirma', 'Numune tartma, kurutma ve elek analiz sistemleri', 4),
  ('Tekstil', 'tekstil', 'Tekstil yüzey aşınma ve dayanıklılık test cihazları', 5),
  ('Universal Testing Machine', 'universal-testing-machine', 'Çekme, basma ve eğme testleri için üniversal test makineleri', 6),
  ('Zemin', 'zemin', 'Zemin mekaniği ve geoteknik laboratuvar test cihazları', 7)
ON CONFLICT (slug) DO NOTHING;
