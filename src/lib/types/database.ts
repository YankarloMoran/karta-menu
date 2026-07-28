export interface Restaurant {
  id: string;
  user_id?: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  banner_url: string;
  phone_whatsapp: string;
  currency: string;
  primary_color: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ItemOptionValue {
  id: string;
  option_id: string;
  name: string;
  extra_price: number;
  is_default: boolean;
}

export interface ItemOption {
  id: string;
  menu_item_id: string;
  title: string;
  is_required: boolean;
  max_selections: number;
  sort_order: number;
  values?: ItemOptionValue[];
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  image_url: string;
  allergens: string[];
  dietary_tags: string[];
  is_available: boolean;
  is_featured: boolean;
  preparation_time_mins: number;
  sort_order: number;
  options?: ItemOption[];
  created_at?: string;
  updated_at?: string;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: string;
  qr_code_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id?: string | null;
  item_name: string;
  unit_price: number;
  quantity: number;
  selected_options?: Array<{
    option_title: string;
    value_name: string;
    extra_price: number;
  }>;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'in_preparation' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  restaurant_id: string;
  table_number: string;
  customer_name?: string;
  customer_phone?: string;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  items?: OrderItem[];
  created_at: string;
}

export interface AnalyticsScan {
  id?: string;
  restaurant_id: string;
  table_number?: string;
  device_type?: string;
  created_at?: string;
}
