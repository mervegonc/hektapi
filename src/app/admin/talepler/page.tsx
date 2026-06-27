"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Inquiry } from "@/types";

export default function TaleplerPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    createClient().from("inquiries").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setInquiries(data || []));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-950">Teklif Talepleri</h1>
      <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Tarih</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Ürün</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Ad Soyad</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">E-posta</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Telefon</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Mesaj</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {inquiries.map(inq => (
              <tr key={inq.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                  {new Date(inq.created_at).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3 font-medium text-navy-950 max-w-[180px] truncate">{inq.product_name}</td>
                <td className="px-4 py-3">{inq.name}</td>
                <td className="px-4 py-3"><a href={`mailto:${inq.email}`} className="text-navy-700 hover:underline">{inq.email}</a></td>
                <td className="px-4 py-3 text-zinc-500">{inq.phone || "-"}</td>
                <td className="px-4 py-3 text-zinc-500 max-w-[200px] truncate">{inq.message || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {inquiries.length === 0 && <div className="py-12 text-center text-zinc-400">Henüz teklif talebi yok.</div>}
      </div>
    </div>
  );
}
