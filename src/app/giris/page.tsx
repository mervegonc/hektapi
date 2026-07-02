"use client";
import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";


export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");
  console.log("Submit başladı, email:", email);
  const supabase = createClient();
  const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
  console.log("Sonuç:", data, err);
  if (err) { setError("Email veya şifre hatalı."); setLoading(false); return; }
  window.location.href = "/admin";
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-navy-950">HEKTAPİ</h1>
        <p className="mb-6 text-center text-sm text-zinc-500">Admin Paneli Girişi</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-950">E-posta</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-950">Şifre</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-navy-900 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
