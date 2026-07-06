"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    document.cookie.split(";").forEach(c => {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });
    window.location.replace("/giris");
  }

  const links = [
    { href: "/admin", label: "🏠 Dashboard" },
    { href: "/admin/kategoriler", label: "📁 Kategoriler" },
    { href: "/admin/urunler", label: "📦 Ürünler" },
    { href: "/admin/slider", label: "🖼️ Slider" },
    { href: "/admin/hizmetler", label: "🔧 Hizmetlerimiz" },
    { href: "/admin/cozumler", label: "💡 Çözümlerimiz" },
    { href: "/admin/standartlar", label: "📋 Standartlar" },
    { href: "/admin/talepler", label: "📩 Teklif Talepleri" },
  ];

  return (
    <div className="min-h-screen bg-zinc-100">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-navy-950 text-white flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="px-5 py-5 border-b border-navy-800 flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">HEKTAPİ</p>
            <p className="text-xs text-zinc-400 mt-0.5">Admin Paneli</p>
          </div>
          <button className="lg:hidden text-zinc-400 hover:text-white p-1" onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === href ? "bg-navy-700 text-white" : "text-zinc-300 hover:bg-navy-800 hover:text-white"}`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-navy-800">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white mb-1">
            🌐 Siteyi Gör
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors">
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between bg-navy-950 px-4 py-3 text-white shadow-md">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="font-bold text-sm">{links.find(l => l.href === pathname)?.label || "Admin"}</span>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 text-xs">Çıkış</button>
        </header>
        <main className="flex-1 p-4 lg:p-6 bg-zinc-100">{children}</main>
      </div>
    </div>
  );
}