"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

interface SiteContextType {
  categories: Category[];
  loading: boolean;
}

const SiteContext = createContext<SiteContextType>({ categories: [], loading: true });

// Modül seviyesinde cache — sayfa yenilemede bile korunur
let cachedCategories: Category[] | null = null;
let fetchPromise: Promise<Category[]> | null = null as Promise<Category[]> | null;

async function fetchCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  if (fetchPromise) return fetchPromise;

fetchPromise = createClient()
  .from("categories")
  .select("*")
  .order("order")
  .then(({ data }) => {
    cachedCategories = data || [];
    fetchPromise = null;
    return cachedCategories as Category[];
  }) as Promise<Category[]>;

  return fetchPromise!;
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(cachedCategories || []);
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) return;
    fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <SiteContext.Provider value={{ categories, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}