import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (limit.count >= 5) return false;
  limit.count++;
  return true;
}

function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 500).replace(/<[^>]*>/g, "");
}

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("Telegram error:", err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
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
      return NextResponse.json({ error: "Ad ve e-posta zorunludur." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta giriniz." }, { status: 400 });
    }

    const supabase = await createClient();
    await supabase.from("inquiries").insert({
      product_name: productName,
      name, email,
      phone: phone || null,
      company: company || null,
      quantity: quantity || null,
      urgency: urgency || null,
      message: message || null,
      status: "yeni",
    });

    const urgencyLabels: Record<string, string> = {
      acil: "⚡ Acil",
      normal: "📅 Normal",
      planlama: "🔮 Planlama",
    };

    const telegramMsg = `🔔 <b>Yeni Teklif Talebi!</b>

📦 <b>Ürün:</b> ${productName}
👤 <b>Ad Soyad:</b> ${name}${company ? `\n🏢 <b>Firma:</b> ${company}` : ""}
📧 <b>E-posta:</b> ${email}${phone ? `\n📞 <b>Telefon:</b> ${phone}` : ""}${quantity ? `\n🔢 <b>Adet:</b> ${quantity}` : ""}${urgency ? `\n⏰ <b>Aciliyet:</b> ${urgencyLabels[urgency] || urgency}` : ""}${message ? `\n💬 <b>Mesaj:</b> ${message}` : ""}`;

    await sendTelegram(telegramMsg);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const to = process.env.QUOTE_NOTIFICATION_EMAIL || "info@hektapi.com.tr";
        await resend.emails.send({
          from: "Hektapi Website <onboarding@resend.dev>",
          to,
          replyTo: email,
          subject: `🔔 Yeni Teklif: ${productName}`,
          html: `<h2>Yeni Teklif Talebi</h2>
            <p><b>Ürün:</b> ${productName}</p>
            <p><b>Ad:</b> ${name}</p>
            ${company ? `<p><b>Firma:</b> ${company}</p>` : ""}
            <p><b>E-posta:</b> ${email}</p>
            ${phone ? `<p><b>Telefon:</b> ${phone}</p>` : ""}
            ${quantity ? `<p><b>Adet:</b> ${quantity}</p>` : ""}
            ${urgency ? `<p><b>Aciliyet:</b> ${urgencyLabels[urgency] || urgency}</p>` : ""}
            ${message ? `<p><b>Mesaj:</b> ${message}</p>` : ""}`,
        });
      } catch (err) {
        console.error("Mail error:", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Teklif API error:", err);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}