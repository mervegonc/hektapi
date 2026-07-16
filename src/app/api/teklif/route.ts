import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { escapeHtml, sanitizeText } from "@/lib/sanitize";
import { checkRateLimit, getRateLimitConfig } from "@/lib/rate-limit";

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
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { teklifPerHour } = getRateLimitConfig();
    const rate = checkRateLimit(`teklif:${ip}`, teklifPerHour, 60 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 });
    }

    const body = await request.json();
    const productName = sanitizeText(body.productName) || "Genel";
    const name = sanitizeText(body.name);
    const email = sanitizeText(body.email);
    const phone = sanitizeText(body.phone);
    const company = sanitizeText(body.company);
    const quantity = sanitizeText(body.quantity);
    const urgency = sanitizeText(body.urgency);
    const message = sanitizeText(body.message);

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

📦 <b>Ürün:</b> ${escapeHtml(productName)}
👤 <b>Ad Soyad:</b> ${escapeHtml(name)}${company ? `\n🏢 <b>Firma:</b> ${escapeHtml(company)}` : ""}
📧 <b>E-posta:</b> ${escapeHtml(email)}${phone ? `\n📞 <b>Telefon:</b> ${escapeHtml(phone)}` : ""}${quantity ? `\n🔢 <b>Adet:</b> ${escapeHtml(quantity)}` : ""}${urgency ? `\n⏰ <b>Aciliyet:</b> ${escapeHtml(urgencyLabels[urgency] || urgency)}` : ""}${message ? `\n💬 <b>Mesaj:</b> ${escapeHtml(message)}` : ""}`;

    await sendTelegram(telegramMsg);

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const to = process.env.QUOTE_NOTIFICATION_EMAIL || "info@hektapi.com.tr";
        const fromAddress = process.env.RESEND_FROM_EMAIL || "noreply@hektapi.com.tr";
        await resend.emails.send({
          from: `Hektapi <${fromAddress}>`,
          to,
          replyTo: email,
          subject: `🔔 Yeni Teklif: ${productName}`,
          html: `<h2>Yeni Teklif Talebi</h2>
            <p><b>Ürün:</b> ${escapeHtml(productName)}</p>
            <p><b>Ad:</b> ${escapeHtml(name)}</p>
            ${company ? `<p><b>Firma:</b> ${escapeHtml(company)}</p>` : ""}
            <p><b>E-posta:</b> ${escapeHtml(email)}</p>
            ${phone ? `<p><b>Telefon:</b> ${escapeHtml(phone)}</p>` : ""}
            ${quantity ? `<p><b>Adet:</b> ${escapeHtml(quantity)}</p>` : ""}
            ${urgency ? `<p><b>Aciliyet:</b> ${escapeHtml(urgencyLabels[urgency] || urgency)}</p>` : ""}
            ${message ? `<p><b>Mesaj:</b> ${escapeHtml(message)}</p>` : ""}`,
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
