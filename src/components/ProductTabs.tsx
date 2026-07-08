"use client";
import { useState } from "react";
import type { ProductSpec } from "@/types";

interface Props {
  description: string | null;
  specs: ProductSpec[];
  standards: string | null;
  useCases: string[];
}

export default function ProductTabs({ description, specs, standards, useCases }: Props) {
  const tabs = [
    { key: "aciklama", label: "Açıklama", show: !!description },
    { key: "specs", label: "Teknik Özellikler", show: specs.length > 0 },
    { key: "standartlar", label: "Standartlar", show: !!standards },
    { key: "kullanim", label: "Kullanım Alanları", show: useCases.length > 0 },
  ].filter(t => t.show);

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "aciklama");

  if (tabs.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key ? "bg-white text-navy-950 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === "aciklama" && description && (
          <div className="prose prose-sm max-w-none text-zinc-600 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: description }} />
        )}
        {activeTab === "specs" && specs.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="w-2/5 border-b border-gray-100 px-4 py-3 font-semibold text-navy-950">{spec.label}</td>
                    <td className="border-b border-gray-100 px-4 py-3 text-zinc-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "standartlar" && standards && (
          <div className="space-y-2">
            {standards.split(";").map((s) => s.trim()).filter(Boolean).map((std) => (
              <div key={std} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                <span className="text-sm font-medium text-navy-950">{std}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "kullanim" && useCases.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {useCases.map((u) => (
              <span key={u} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm">{u}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
