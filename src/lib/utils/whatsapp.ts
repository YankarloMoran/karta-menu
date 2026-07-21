interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export function getWhatsAppUrl({
  items,
  total,
  restaurantName,
  restaurantPhone,
  tableNumber,
  template,
  currency = 'Q',
  orderType = 'table',
  address = '',
  specialNotes = ''
}: {
  items: CartItem[];
  total: number;
  restaurantName: string;
  restaurantPhone: string;
  tableNumber: string;
  template: string;
  currency?: string;
  orderType?: 'table' | 'takeout' | 'delivery';
  address?: string;
  specialNotes?: string;
}) {
  // 1. Format the items list
  const itemsText = items
    .map(item => {
      const noteTxt = item.notes ? ` _(${item.notes})_` : '';
      return `• *${item.quantity}x* ${item.name}${noteTxt} - ${currency}${(item.price * item.quantity).toFixed(2)}`;
    })
    .join('\n');

  // 2. Order type label
  let orderTypeLabel = '🪑 En Mesa';
  if (orderType === 'takeout') orderTypeLabel = '🛍️ Para Llevar';
  if (orderType === 'delivery') orderTypeLabel = `🛵 Domicilio: ${address || 'Dirección no especificada'}`;
  if (orderType === 'table' && tableNumber) orderTypeLabel = `🪑 Mesa #${tableNumber}`;

  // 3. Build formatted message
  let message = `🍽️ *NUEVO PEDIDO - ${restaurantName}*\n\n`;
  message += `📌 *Tipo de Pedido:* ${orderTypeLabel}\n\n`;
  message += `🛒 *Detalle del Pedido:*\n${itemsText}\n\n`;
  message += `💰 *TOTAL:* *${currency}${total.toFixed(2)}*\n`;

  if (specialNotes.trim()) {
    message += `\n📝 *Notas para la cocina:* ${specialNotes.trim()}\n`;
  }

  message += `\n_Enviado desde el Menú Digital Kartá_`;

  // 4. Clean and encode phone
  const cleanPhone = restaurantPhone.replace(/\D/g, '');

  // 5. Generate URL
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
