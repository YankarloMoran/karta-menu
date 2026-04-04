'use client';

import { useEffect } from 'react';
import { logRestaurantView } from '@/app/actions/analytics';

export default function AnalyticsTracker({ restaurantId }: { restaurantId: string }) {
  useEffect(() => {
    const trackView = async () => {
      // Capturamos datos bÃ¡sicos del navegador de forma segura
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      let device = 'Escritorio';
      if (/Mobi|Android/i.test(userAgent)) device = 'Móvil';
      if (/Tablet/i.test(userAgent)) device = 'Tablet';

      const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                      userAgent.includes('Firefox') ? 'Firefox' : 
                      userAgent.includes('Safari') ? 'Safari' : 'Otro';

      await logRestaurantView(restaurantId, { deviceType: device, browser });
    };

    trackView();
  }, [restaurantId]);

  return null; // El componente no renderiza nada visualmente
}
