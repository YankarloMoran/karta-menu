import { Restaurant, Category, MenuItem, Order } from '@/lib/types/database';

export const SAMPLE_RESTAURANT: Restaurant = {
  id: 'rest-001',
  name: 'Bistró Gourmet & Grill',
  slug: 'bistro-gourmet',
  description: 'Fusión contemporánea de cocina urbana y carnes a la leña. Ingredientes orgánicos locales.',
  logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
  banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  phone_whatsapp: '+5215512345678',
  currency: 'USD',
  primary_color: '#f97316',
  is_active: true,
};

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'cat-entradas',
    restaurant_id: 'rest-001',
    name: 'Entradas & Tapas',
    icon: 'Sparkles',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'cat-fuertes',
    restaurant_id: 'rest-001',
    name: 'Platos Fuertes',
    icon: 'UtensilsCrossed',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'cat-burgers',
    restaurant_id: 'rest-001',
    name: 'Burgers & Artesanales',
    icon: 'Flame',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'cat-bebidas',
    restaurant_id: 'rest-001',
    name: 'Coctelería & Bebidas',
    icon: 'Wine',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'cat-postres',
    restaurant_id: 'rest-001',
    name: 'Postres de Autor',
    icon: 'Cake',
    sort_order: 5,
    is_active: true,
  },
];

export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    restaurant_id: 'rest-001',
    category_id: 'cat-entradas',
    name: 'Tacos de Entraña Trufados',
    description: 'Tres tacos en tortilla azul artesanal con entraña angus marinada, emulsión de trufa y aguacate fresco.',
    price: 16.50,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    allergens: ['Lácteos'],
    dietary_tags: ['Sin Gluten'],
    is_available: true,
    is_featured: true,
    preparation_time_mins: 12,
    sort_order: 1,
    options: [
      {
        id: 'opt-1',
        menu_item_id: 'item-1',
        title: 'Término de la carne',
        is_required: true,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'v1', option_id: 'opt-1', name: 'Término Medio (Recomendado)', extra_price: 0, is_default: true },
          { id: 'v2', option_id: 'opt-1', name: 'Tres Cuartos', extra_price: 0, is_default: false },
          { id: 'v3', option_id: 'opt-1', name: 'Bien Cocido', extra_price: 0, is_default: false },
        ]
      },
      {
        id: 'opt-2',
        menu_item_id: 'item-1',
        title: 'Extras & Adiciones',
        is_required: false,
        max_selections: 3,
        sort_order: 2,
        values: [
          { id: 'v4', option_id: 'opt-2', name: 'Guacamole extra', extra_price: 2.50, is_default: false },
          { id: 'v5', option_id: 'opt-2', name: 'Queso Oaxaca derretido', extra_price: 2.00, is_default: false },
        ]
      }
    ]
  },
  {
    id: 'item-2',
    restaurant_id: 'rest-001',
    category_id: 'cat-entradas',
    name: 'Burrata con Higos & Jamón Serrano',
    description: 'Burrata artesanal cremosa, reducción de balsámico viejo, higos caramelizados y nuez garapiñada.',
    price: 18.00,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a81?auto=format&fit=crop&w=600&q=80',
    allergens: ['Lácteos', 'Nueces'],
    dietary_tags: ['Vegetariano'],
    is_available: true,
    is_featured: true,
    preparation_time_mins: 10,
    sort_order: 2,
  },
  {
    id: 'item-3',
    restaurant_id: 'rest-001',
    category_id: 'cat-burgers',
    name: 'Black Angus Truffle Burger',
    description: '200g de carne Angus, queso Gruyère madurado, cebolla caramelizada al vino tinto y mayonesa de trufa negra.',
    price: 19.50,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietary_tags: ['Especial del Chef'],
    is_available: true,
    is_featured: true,
    preparation_time_mins: 18,
    sort_order: 1,
    options: [
      {
        id: 'opt-3',
        menu_item_id: 'item-3',
        title: 'Término de la carne',
        is_required: true,
        max_selections: 1,
        sort_order: 1,
        values: [
          { id: 'v6', option_id: 'opt-3', name: 'Término Medio', extra_price: 0, is_default: true },
          { id: 'v7', option_id: 'opt-3', name: 'Bien Cocido', extra_price: 0, is_default: false },
        ]
      },
      {
        id: 'opt-4',
        menu_item_id: 'item-3',
        title: 'Acompañamiento',
        is_required: true,
        max_selections: 1,
        sort_order: 2,
        values: [
          { id: 'v8', option_id: 'opt-4', name: 'Papas a la francesa con hierbas', extra_price: 0, is_default: true },
          { id: 'v9', option_id: 'opt-4', name: 'Papas camote (Sweet potato)', extra_price: 1.50, is_default: false },
          { id: 'v10', option_id: 'opt-4', name: 'Ensalada verde de la casa', extra_price: 0, is_default: false },
        ]
      }
    ]
  },
  {
    id: 'item-4',
    restaurant_id: 'rest-001',
    category_id: 'cat-fuertes',
    name: 'Salmón Glaseado al Miso & Sésamo',
    description: 'Filete de salmón fresco noruego a la parrilla sobre cama de puré de camote y espárragos al vapor.',
    price: 24.00,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    allergens: ['Pescado', 'Sésamo', 'Soya'],
    dietary_tags: ['Saludable'],
    is_available: true,
    is_featured: false,
    preparation_time_mins: 15,
    sort_order: 1,
  },
  {
    id: 'item-5',
    restaurant_id: 'rest-001',
    category_id: 'cat-bebidas',
    name: 'Smoked Mezcalita de Pasión',
    description: 'Mezcal artesanal, maracuyá fresco, licor de chile ancho, escarchado con sal de gusano y humo de romero.',
    price: 13.50,
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    allergens: [],
    dietary_tags: ['Cóctel de Autor'],
    is_available: true,
    is_featured: true,
    preparation_time_mins: 5,
    sort_order: 1,
  },
  {
    id: 'item-6',
    restaurant_id: 'rest-001',
    category_id: 'cat-postres',
    name: 'Volcán de Chocolate Belga & Helado Matcha',
    description: 'Bizcocho tibio de chocolate 70% cacao con centro líquido y helado cremoso de té verde matcha.',
    price: 11.00,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    allergens: ['Lácteos', 'Huevo', 'Gluten'],
    dietary_tags: ['Vegetariano'],
    is_available: true,
    is_featured: false,
    preparation_time_mins: 12,
    sort_order: 1,
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-9841',
    restaurant_id: 'rest-001',
    table_number: '04',
    customer_name: 'Carlos Mendoza',
    customer_phone: '+5215598765432',
    status: 'in_preparation',
    total_amount: 52.50,
    notes: 'Poco picante por favor',
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    items: [
      {
        item_name: 'Tacos de Entraña Trufados',
        unit_price: 16.50,
        quantity: 2,
        selected_options: [
          { option_title: 'Término', value_name: 'Término Medio', extra_price: 0 },
          { option_title: 'Extras', value_name: 'Guacamole extra', extra_price: 2.50 }
        ],
        subtotal: 35.50
      },
      {
        item_name: 'Smoked Mezcalita de Pasión',
        unit_price: 13.50,
        quantity: 1,
        selected_options: [],
        subtotal: 13.50
      }
    ]
  },
  {
    id: 'ORD-9842',
    restaurant_id: 'rest-001',
    table_number: '07',
    customer_name: 'Sofía Ramos',
    status: 'pending',
    total_amount: 37.50,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    items: [
      {
        item_name: 'Black Angus Truffle Burger',
        unit_price: 19.50,
        quantity: 1,
        selected_options: [
          { option_title: 'Acompañamiento', value_name: 'Papas camote', extra_price: 1.50 }
        ],
        subtotal: 21.00
      },
      {
        item_name: 'Tacos de Entraña Trufados',
        unit_price: 16.50,
        quantity: 1,
        selected_options: [],
        subtotal: 16.50
      }
    ]
  },
  {
    id: 'ORD-9839',
    restaurant_id: 'rest-001',
    table_number: '02',
    customer_name: 'Alejandro G.',
    status: 'ready',
    total_amount: 29.00,
    created_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    items: [
      {
        item_name: 'Burrata con Higos & Jamón Serrano',
        unit_price: 18.00,
        quantity: 1,
        selected_options: [],
        subtotal: 18.00
      },
      {
        item_name: 'Volcán de Chocolate Belga',
        unit_price: 11.00,
        quantity: 1,
        selected_options: [],
        subtotal: 11.00
      }
    ]
  }
];
