import { OrderItem } from '@/lib/types/database';

export function generateWhatsAppOrderUrl(params: {
  phone: string;
  restaurantName: string;
  tableNumber?: string;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  notes?: string;
}): string {
  const {
    phone,
    restaurantName,
    tableNumber,
    customerName,
    items,
    totalAmount,
    currency = 'USD',
    notes,
  } = params;

  const cleanPhone = phone.replace(/[^0-9]/g, '');

  let text = `👋 *¡Hola! Quisiera realizar un nuevo pedido en ${restaurantName}*\n\n`;

  if (tableNumber) {
    text += `📍 *Mesa:* #${tableNumber}\n`;
  }
  if (customerName) {
    text += `👤 *Cliente:* ${customerName}\n`;
  }

  text += `\n🛒 *Detalle del Pedido:*\n`;

  items.forEach((item, index) => {
    text += `\n${index + 1}. *${item.quantity}x ${item.item_name}* ($${item.unit_price.toFixed(2)} c/u)`;

    if (item.selected_options && item.selected_options.length > 0) {
      item.selected_options.forEach((opt) => {
        const extra = opt.extra_price > 0 ? ` (+$${opt.extra_price.toFixed(2)})` : '';
        text += `\n   └ _${opt.option_title}:_ ${opt.value_name}${extra}`;
      });
    }

    text += `\n   *Subtotal:* $${item.subtotal.toFixed(2)}`;
  });

  if (notes) {
    text += `\n\n📝 *Notas especiales:* ${notes}`;
  }

  text += `\n\n💰 *Total a Pagar:* *$${totalAmount.toFixed(2)} ${currency}*`;
  text += `\n\n_Enviado desde Cartly App_ 🚀`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
