import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inquiryId, toEmail, toName, productName, replyText } = body;

    if (!toEmail || !replyText) {
      return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
    }

    // Supabase'den admin kontrolü
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Mail servisi yapılandırılmamış." }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Hektapi <onboarding@resend.dev>",
      to: toEmail,
      subject: `Teklif Talebiniz Hakkında: ${productName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a1b3d; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Hektapi</h2>
          </div>
          <div style="padding: 24px; background: #fff; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
            <p style="color: #333;">Sayın <strong>${toName}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">${replyText.replace(/\n/g, "<br>")}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">
              Bu mail <strong>${productName}</strong> ürünü için gönderdiğiniz teklif talebine yanıt olarak gönderilmiştir.<br>
              Sorularınız için: <a href="mailto:info@hektapi.com.tr">info@hektapi.com.tr</a> | 0534 611 12 71
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Mail gönderilemedi." }, { status: 500 });
    }

    // Yanıt zamanını kaydet
    await supabase.from("inquiries").update({
      replied_at: new Date().toISOString(),
      status: "yanitlandi",
    }).eq("id", inquiryId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Yanıt API error:", err);
    return NextResponse.json({ error: "Beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}