'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ExternalLink, MessageCircle } from 'lucide-react';
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

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/m/${restaurant.slug}`
    : '';

  const downloadQR = () => {
    const svg: any = document.getElementById('base-qr');
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
      downloadLink.download = `QR-${restaurant.slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success('QR descargado');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`¡Mira nuestro menú digital! 🍽️\n${publicUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className='max-w-4xl mx-auto space-y-10'>
      <div>
        <h1 className='text-3xl md:text-4xl font-serif font-bold mb-2 text-gradient-ember'>{t('qr_title')}</h1>
        <p className='text-foreground/50'>{t('qr_subtitle')}</p>
      </div>

      <div className='grid md:grid-cols-2 gap-10 items-start'>
        {/* QR Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='glass p-10 rounded-[40px] flex flex-col items-center justify-center border border-white/5'
        >
          <div className='bg-white p-6 rounded-3xl shadow-2xl mb-8'>
            <QRCodeSVG
              id='base-qr'
              value={publicUrl}
              size={240}
              level='H'
              fgColor='#131314'
              includeMargin={false}
            />
          </div>
          <div className='text-center'>
            <h3 className='text-xl font-bold mb-1'>{restaurant.name}</h3>
            <p className='text-xs font-mono text-foreground/40 break-all'>{publicUrl}</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='space-y-6'
        >
          <div className='glass p-8 rounded-3xl space-y-4 border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2'>
              <Download size={20} className='text-primary' /> {t('qr_pro_actions')}
            </h3>
            <p className='text-sm text-foreground/50'>{t('qr_pro_desc')}</p>

            <div className='grid grid-cols-1 gap-3 pt-4'>
              <button
                onClick={downloadQR}
                className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]'
              >
                <Download size={18} /> {t('qr_download')}
              </button>
              <button
                className='w-full glass py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5'
                onClick={() => window.open(publicUrl, '_blank')}
              >
                <ExternalLink size={18} /> {t('qr_view_menu')}
              </button>
              <button
                className='w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-500 transition-colors'
                onClick={shareWhatsApp}
              >
                <MessageCircle size={18} /> {t('share_whatsapp')}
              </button>
            </div>
          </div>

          <div className='glass p-8 rounded-3xl border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2 mb-4 text-foreground/40'>
              <Share2 size={20} /> {t('qr_share_title')}
            </h3>
            <div className='flex items-center gap-2 bg-surface-container-lowest p-4 rounded-xl border border-white/5'>
              <span className='flex-1 text-xs font-mono truncate text-foreground/60'>{publicUrl}</span>
              <button
                className='bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors'
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
