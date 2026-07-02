"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

async function handleLogout() {
  const supabase = createClient();
  await supabase.auth.signOut({ scope: "local" });
  // Tüm cookie'leri manuel temizle
  document.cookie.split(";").forEach(c => {
    document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
  });
  window.location.replace("/giris");
}
/*
slider*/
  const links = [
    { href: "/admin", label: "🏠 Dashboard" },
    { href: "/admin/kategoriler", label: "📁 Kategoriler" },
    { href: "/admin/urunler", label: "📦 Ürünler" },
    { href: "/admin/slider", label: "🖼️ Slider" },
    { href: "/admin/hizmetler", label: "🔧 Hizmetlerimiz" },
    { href: "/admin/cozumler", label: "💡 Çözümlerimiz" },
    { href: "/admin/talepler", label: "📩 Teklif Talepleri" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-navy-950 text-white flex flex-col">
        <div className="px-5 py-5 border-b border-navy-800">
          <p className="font-bold text-lg">HEKTAPİ</p>
          <p className="text-xs text-zinc-400 mt-0.5">Admin Paneli</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === href ? "bg-navy-700 text-white" : "text-zinc-300 hover:bg-navy-800 hover:text-white"
              }`}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-navy-800">
          <Link href="/" target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white mb-1">
            🌐 Siteyi Gör
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-red-400 transition-colors">
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      {/* İçerik */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
