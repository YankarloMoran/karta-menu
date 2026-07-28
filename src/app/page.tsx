import Link from 'next/link';
import { Sparkles, QrCode, ChefHat, ShoppingBag, ArrowRight, Utensils, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-[#090d16]">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto w-full p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black shadow-lg glow-accent">
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">Cartly</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white hover:border-orange-500/40 transition-all"
          >
            Panel Admin
          </Link>
          <Link
            href="/menu/bistro-gourmet"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg glow-accent hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span>Ver Menú Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>La Revolución del Menú Digital Interactivo</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Eleva la Experiencia de tu Restaurante con <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">Cartly</span>
        </h1>

        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Menús digitales optimizados para móviles, códigos QR por mesa, personalización de platillos, pedidos automáticos por WhatsApp y control de cocina en vivo.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/menu/bistro-gourmet"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-2xl glow-accent hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explorar Menú Digital (Vista Comensal)</span>
          </Link>

          <Link
            href="/admin"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 font-extrabold text-sm hover:border-orange-500/50 hover:text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <ChefHat className="w-4 h-4 text-orange-400" />
            <span>Abrir Dashboard Ejecutivo</span>
          </Link>
        </div>

        {/* Features Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">QRs Inteligentes por Mesa</h3>
            <p className="text-xs text-slate-400">
              Genera e imprime códigos con número de mesa integrado para atención rápida sin descargas.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Pedidos por WhatsApp</h3>
            <p className="text-xs text-slate-400">
              Los clientes envían el desglose exacto de su comanda directo al WhatsApp del negocio.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Comandero KDS & Analíticas</h3>
            <p className="text-xs text-slate-400">
              Visualiza en tiempo real las comandas en cocina y mide tus platillos más vendidos.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full p-6 text-center text-xs text-slate-500 border-t border-slate-800/60 z-10">
        © 2026 Cartly • Todos los derechos reservados.
      </footer>
    </div>
  );
}
