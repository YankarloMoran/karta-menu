'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QRClient({ 
  restaurant 
}: { 
  restaurant: { name: string, slug: string } 
}) {
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/m/${restaurant.slug}` 
    : '';

  const downloadQR = () => {
    const svg: any = document.getElementById('base-qr');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${restaurant.slug}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className='max-w-4xl mx-auto space-y-10'>
      <div>
        <h1 className='text-4xl font-serif font-bold mb-2 text-gradient-ember'>Tu Código QR</h1>
        <p className='text-foreground/60'>Tus clientes podrán escanear este código para ver tu menú digital.</p>
      </div>

      <div className='grid md:grid-cols-2 gap-10 items-start'>
        {/* QR Preview Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='glass p-10 rounded-[40px] flex flex-col items-center justify-center border-shadow border border-white/5'
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

        {/* Actions Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='space-y-6'
        >
          <div className='glass p-8 rounded-3xl space-y-4 border-shadow border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2'>
              <Download size={20} className='text-primary' /> Acciones Profesionales
            </h3>
            <p className='text-sm text-foreground/60'>Descarga tu código en alta resolución para tus mesas físicas.</p>
            
            <div className='grid grid-cols-1 gap-3 pt-4'>
              <button 
                onClick={downloadQR}
                className='w-full bg-gradient-ember text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-[0.98]'
              >
                Descargar PNG de Alta Calidad
              </button>
              <button 
                className='w-full glass py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/5'
                onClick={() => window.open(publicUrl, '_blank')}
              >
                <ExternalLink size={18} /> Ver mi Menú Público
              </button>
            </div>
          </div>

          <div className='glass p-8 rounded-3xl border-shadow border border-white/5'>
            <h3 className='text-lg font-bold flex items-center gap-2 mb-4 text-foreground/40'>
              <Share2 size={20} /> Compartir Enlace
            </h3>
            <div className='flex items-center gap-2 bg-surface-container-lowest p-4 rounded-xl border border-white/5'>
              <span className='flex-1 text-xs font-mono truncate text-foreground/60'>{publicUrl}</span>
              <button 
                className='bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors'
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl);
                  alert('¡Enlace copiado!');
                }}
              >
                Copiar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
