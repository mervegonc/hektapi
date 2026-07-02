import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Basit rate limiting (IP başına)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1 saat
    return true;
  }

  if (limit.count >= 5) return false; // Saatte max 5 teklif

  limit.count++;
  return true;
}

function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 500).replace(/<[^>]*>/g, "");
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const productName = sanitize(body.productName) || "Genel";
    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);
    const company = sanitize(body.company);
    const quantity = sanitize(body.quantity);
    const urgency = sanitize(body.urgency);
    const message = sanitize(body.message);

    if (!name || !email) {
      return NextResponse.json(
        { error: "Ad ve e-posta zorunludur." },
        { status: 400 }
      );
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // Veritabanına kaydet
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("inquiries").insert({
      product_name: productName,
      name,
      email,
      phone: phone || null,
      company: company || null,
      quantity: quantity || null,
      urgency: urgency || null,
      message: message || null,
      status: "yeni",
    });

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Kayıt hatası." }, { status: 500 });
    }

    // Mail gönder
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const to = process.env.QUOTE_NOTIFICATION_EMAIL || "info@hektapi.com.tr";

        const urgencyLabels: Record<string, string> = {
          acil: "⚡ Acil (1 hafta içinde)",
          normal: "📅 Normal (1 ay içinde)",
          planlama: "🔮 Planlama aşamasında",
        };

        await resend.emails.send({
          from: "Hektapi Website <onboarding@resend.dev>",
          to,
          replyTo: email,
          subject: `🔔 Yeni Teklif Talebi: ${productName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0a1b3d; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Yeni Teklif Talebi</h2>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #666; width: 140px;">Ürün</td><td style="padding: 8px 0; font-weight: bold;">${productName}</td></tr>
                  <tr><td style="padding: 8px 0; color: #666;">Ad Soyad</td><td style="padding: 8px 0;">${name}</td></tr>
                  ${company ? `<tr><td style="padding: 8px 0; color: #666;">Firma</td><td style="padding: 8px 0;">${company}</td></tr>` : ""}
                  <tr><td style="padding: 8px 0; color: #666;">E-posta</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  ${phone ? `<tr><td style="padding: 8px 0; color: #666;">Telefon</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
                  ${quantity ? `<tr><td style="padding: 8px 0; color: #666;">Adet/Miktar</td><td style="padding: 8px 0;">${quantity}</td></tr>` : ""}
                  ${urgency ? `<tr><td style="padding: 8px 0; color: #666;">Aciliyet</td><td style="padding: 8px 0;">${urgencyLabels[urgency] || urgency}</td></tr>` : ""}
                  ${message ? `<tr><td style="padding: 8px 0; color: #666; vertical-align: top;">Mesaj</td><td style="padding: 8px 0;">${message}</td></tr>` : ""}
                </table>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
                  Bu talep hektapi.com.tr üzerinden gönderilmiştir. Yanıtlamak için e-postayı yanıtlayın.
                </div>
              </div>
            </div>
          `,
        });
      } catch (mailErr) {
        console.error("Mail error:", mailErr);
        // Mail hatası olsa bile kullanıcıya başarı dön
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Teklif API error:", err);
    return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}