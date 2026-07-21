'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ExternalLink, MessageCircle, Printer, Palette, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/context/ToastContext';
import { useTranslations } from 'next-intl';

export default function QRClient({
  restaurant
}: {
  restaurant: { name: string, slug: string }
}) {
  const toast = useToast();
  const t = useTranslations('Dashboard');

  const [qrColor, setQrColor] = useState('#FF6B35');
  const [tableNumber, setTableNumber] = useState('');

  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/m/${restaurant.slug}`
    : '';

  const publicUrl = tableNumber.trim()
    ? `${baseUrl}?table=${encodeURIComponent(tableNumber.trim())}`
    : baseUrl;

  const downloadQR = () => {
    const svg = document.getElementById('base-qr') as unknown as SVGSVGElement | null;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const fileTag = tableNumber ? `-Mesa-${tableNumber}` : '';
      downloadLink.download = `QR-${restaurant.slug}${fileTag}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('QR descargado');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Mira el menú digital de ${restaurant.name}! 🍽️\n${publicUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const colorOptions = [
    { label: 'Ember Orange', value: '#FF6B35' },
    { label: 'Deep Emerald', value: '#10B981' },
    { label: 'Midnight Blue', value: '#3B82F6' },
    { label: 'Charcoal Dark', value: '#18181B' },
  ];

  return (
    <div className='max-w-4xl mx-auto space-y-10 pb-20'>
      <div>
        <h1 className='text-3xl md:text-4xl font-serif font-bold mb-2 text-gradient-ember'>{t('qr_title')}</h1>
        <p className='text-foreground/50'>{t('qr_subtitle')}</p>
      </div>

      <div className='grid md:grid-cols-2 gap-10 items-start'>
        {/* Printable Stand Card Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='glass p-8 md:p-10 rounded-[40px] flex flex-col items-center justify-center border border-white/5 relative print:shadow-none'
        >
          <div className='w-full max-w-sm bg-white text-zinc-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-4 print:w-full print:max-w-none'>
            <span className='text-[10px] font-bold tracking-[0.25em] text-zinc-400 uppercase'>Menú Digital</span>
            <h2 className='text-2xl font-serif font-bold text-zinc-900'>{restaurant.name}</h2>
            {tableNumber && (
              <span className='bg-zinc-100 text-zinc-900 text-xs font-extrabold px-4 py-1.5 rounded-full border border-zinc-200'>
                MESA #{tableNumber}
              </span>
            )}

            <div className='p-4 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-inner'>
              <QRCodeSVG
                id='base-qr'
                value={publicUrl}
                size={210}
                level='H'
                fgColor={qrColor}
                includeMargin={false}
              />
            </div>

            <p className='text-xs text-zinc-500 font-medium px-4'>
              Escanea con la cámara de tu teléfono para ver la carta y ordenar
            </p>
          </div>

          <div className='text-center mt-6'>
            <p className='text-xs font-mono text-foreground/40 break-all px-4'>{publicUrl}</p>
          </div>
        </motion.div>

        {/* Customization & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='space-y-6'
        >
          {/* Customization Panel */}
          <div className='glass p-8 rounded-3xl space-y-6 border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2 text-foreground/80'>
              <Palette size={20} className='text-primary' /> Personalizar QR
            </h3>

            {/* Color selector */}
            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase tracking-widest text-foreground/40'>Color del Código</label>
              <div className='flex items-center gap-3'>
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setQrColor(c.value)}
                    className={`w-9 h-9 rounded-full transition-transform cursor-pointer border-2 ${
                      qrColor === c.value ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Table selector */}
            <div className='space-y-2 pt-2 border-t border-white/5'>
              <label className='text-xs font-bold uppercase tracking-widest text-foreground/40 flex items-center gap-1.5'>
                <Hash size={14} /> Número de Mesa (Opcional)
              </label>
              <input
                type='text'
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder='Ej. 1, 2, Terraza 5...'
                className='w-full bg-surface-container-lowest border border-white/5 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all'
              />
              <p className='text-[11px] text-foreground/40'>
                Al ingresar el número de mesa, el cliente al escanear tendrá la mesa seleccionada automáticamente.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='glass p-8 rounded-3xl space-y-4 border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2'>
              <Download size={20} className='text-primary' /> {t('qr_pro_actions')}
            </h3>

            <div className='grid grid-cols-1 gap-3 pt-2'>
              <button
                onClick={downloadQR}
                className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98] cursor-pointer shadow-lg'
              >
                <Download size={18} /> {t('qr_download')}
              </button>

              <button
                onClick={handlePrint}
                className='w-full glass py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5 cursor-pointer'
              >
                <Printer size={18} /> Imprimir Tarjeta de Mesa
              </button>

              <button
                className='w-full glass py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5 cursor-pointer'
                onClick={() => window.open(publicUrl, '_blank')}
              >
                <ExternalLink size={18} /> {t('qr_view_menu')}
              </button>

              <button
                className='w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-500 transition-colors cursor-pointer'
                onClick={shareWhatsApp}
              >
                <MessageCircle size={18} /> {t('share_whatsapp')}
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div className='glass p-6 rounded-3xl border border-white/5'>
            <h3 className='text-sm font-bold flex items-center gap-2 mb-3 text-foreground/40'>
              <Share2 size={16} /> {t('qr_share_title')}
            </h3>
            <div className='flex items-center gap-2 bg-surface-container-lowest p-3 rounded-xl border border-white/5'>
              <span className='flex-1 text-xs font-mono truncate text-foreground/60'>{publicUrl}</span>
              <button
                className='bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors cursor-pointer'
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  toast.success(t('qr_copied'));
                }}
              >
                {t('qr_copy')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

