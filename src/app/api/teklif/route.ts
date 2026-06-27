import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName, name, email, phone, message, productId } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Ad ve e-posta zorunludur." }, { status: 400 });
    }

    // Veritabanına kaydet
    const supabase = await createClient();
    await supabase.from("inquiries").insert({
      product_id: productId || null,
      product_name: productName || "Genel",
      name, email,
      phone: phone || null,
      message: message || null,
    });

    // Mail gönder (Resend key varsa)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const to = process.env.QUOTE_NOTIFICATION_EMAIL || "info@hektapi.com.tr";
      await resend.emails.send({
        from: "Hektapi Website <onboarding@resend.dev>",
        to,
        replyTo: email,
        subject: `Teklif Talebi: ${productName}`,
        html: `
          <h2>Yeni Teklif Talebi</h2>
          <p><strong>Ürün:</strong> ${productName}</p>
          <p><strong>Ad Soyad:</strong> ${name}</p>
          <p><strong>E-posta:</strong> ${email}</p>
          <p><strong>Telefon:</strong> ${phone || "-"}</p>
          <p><strong>Mesaj:</strong> ${message || "-"}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}
