'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Printer, Copy, Check, Sparkles } from 'lucide-react';

interface QRGeneratorProps {
  slug: string;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ slug }) => {
  const [tableNumber, setTableNumber] = useState('04');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const qrUrl = `${baseUrl}/menu/${slug}?table=${encodeURIComponent(tableNumber)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-orange-400" />
          <span>Generador de Códigos QR para Mesas</span>
        </h2>
        <p className="text-xs text-slate-400">
          Crea e imprime códigos QR personalizados para que tus clientes escaneen y abran el menú al instante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Controls Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Configuración de la Mesa
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Número de Mesa o Ubicación</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Ej. 04, Barra 1, Terraza"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Enlace Destino del QR</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={qrUrl}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-white transition-all"
                title="Copiar enlace"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs transition-all shadow-lg glow-accent active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir QR</span>
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95">
          <div className="flex items-center gap-1.5 text-xs text-orange-400 font-extrabold uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Escanea para Ver el Menú</span>
          </div>

          {/* QR Card Frame */}
          <div
            ref={qrRef}
            className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-orange-500/30 flex flex-col items-center gap-4 text-slate-900 w-64"
          >
            <span className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              Mesa #{tableNumber || '01'}
            </span>

            <div className="p-2 bg-white rounded-2xl shadow-inner">
              <QRCodeSVG
                value={qrUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="text-[10px] text-slate-500 font-semibold tracking-tight">
              MENU DIGITAL • ESCANEA EL CÓDIGO
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-xs">
            Coloca este diseño acrílico sobre la mesa para que tus clientes ordenen sin descargas ni demoras.
          </p>
        </div>
      </div>
    </div>
  );
};
