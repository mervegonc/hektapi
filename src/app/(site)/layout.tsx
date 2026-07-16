import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id,name,slug").order("order");
  const categories: Category[] = (data || []) as Category[];

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
