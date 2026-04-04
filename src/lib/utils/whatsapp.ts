interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function getWhatsAppUrl({
  items,
  total,
  restaurantName,
  restaurantPhone,
  tableNumber,
  template
}: {
  items: CartItem[];
  total: number;
  restaurantName: string;
  restaurantPhone: string;
  tableNumber: string;
  template: string;
}) {
  // 1. Format the items list
  const itemsText = items
    .map(item => `*${item.quantity}x* ${item.name} ($${(item.price * item.quantity).toFixed(2)})`)
    .join('\n');

  // 2. Replace variables in template
  let message = template
    .replace('{restaurant}', restaurantName)
    .replace('{items}', itemsText)
    .replace('{total}', `$${total.toFixed(2)}`)
    .replace('{table}', tableNumber || 'N/A');

  // 3. Clean and encode phone
  const cleanPhone = restaurantPhone.replace(/\D/g, '');
  
  // 4. Generate URL
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
