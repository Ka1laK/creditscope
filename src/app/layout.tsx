import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreditScope | El Analista de Riesgo Transparente",
  description: "Plataforma de análisis de riesgo crediticio con enfoque en Explainable AI (XAI). Demostración interactiva de Regresión Logística como modelo de caja blanca para cumplimiento normativo SBS.",
  keywords: ["riesgo crediticio", "regresión logística", "XAI", "caja blanca", "SBS", "FinTech", "machine learning explicable"],
  authors: [{ name: "CreditScope Team" }],
  openGraph: {
    title: "CreditScope | El Analista de Riesgo Transparente",
    description: "Explora el funcionamiento interno de modelos de riesgo crediticio con transparencia total.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
