"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

interface SiteContextType {
  categories: Category[];
  loading: boolean;
}

const SiteContext = createContext<SiteContextType>({ categories: [], loading: true });

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from("categories")
      .select("*")
      .order("order")
      .then(({ data }) => {
        setCategories(data || []);
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
