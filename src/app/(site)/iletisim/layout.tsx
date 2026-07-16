import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "İletişim",
  description: "Hektapi ile iletişime geçin. Ankara İvedik OSB adresimiz, telefon ve e-posta bilgilerimiz.",
  path: "/iletisim",
});

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
