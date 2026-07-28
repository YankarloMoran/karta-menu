import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cartly - Menú Digital QR & Gestión en Tiempo Real',
  description: 'Plataforma gastronómica de última generación para restaurantes. Menús QR interactivos, comanderos en vivo y pedidos por WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
