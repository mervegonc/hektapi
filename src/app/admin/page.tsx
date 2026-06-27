"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ cats: 0, products: 0, inquiries: 0 });

  useEffect(() => {
    const sb = createClient();
    Promise.all([
      sb.from("categories").select("id", { count: "exact", head: true }),
      sb.from("products").select("id", { count: "exact", head: true }),
      sb.from("inquiries").select("id", { count: "exact", head: true }),
    ]).then(([c, p, i]) => setStats({ cats: c.count || 0, products: p.count || 0, inquiries: i.count || 0 }));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-950">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Kategori", value: stats.cats, href: "/admin/kategoriler", emoji: "📁" },
          { label: "Ürün", value: stats.products, href: "/admin/urunler", emoji: "📦" },
          { label: "Teklif Talebi", value: stats.inquiries, href: "/admin/talepler", emoji: "📩" },
        ].map(({ label, value, href, emoji }) => (
          <Link key={label} href={href}
            className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
            <p className="text-3xl mb-2">{emoji}</p>
            <p className="text-3xl font-bold text-navy-950">{value}</p>
            <p className="text-sm text-zinc-500 mt-1">{label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Link href="/admin/urunler/yeni"
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Ürün Ekle
        </Link>
        <Link href="/admin/kategoriler"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-zinc-50 transition-colors">
          Kategorileri Yönet
        </Link>
      </div>
    </div>
  );
}
