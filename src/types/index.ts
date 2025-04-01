
// Customer type
export type Customer = {
  id: string;
  full_name: string;
  phone_number: string;
  address: string;
  profile_picture?: string;
  created_at: string;
};

// Agent type
export type Agent = {
  id: string;
  full_name: string;
  phone_number: string;
  online_status: boolean;
  location?: string;
  profile_picture?: string;
  agent_code?: string;
  rating?: number;
};

// Order type
export type Order = {
  id: string;
  customer_id: string;
  agent_id?: string;
  service_type: 'Shopping' | 'Delivery' | 'Errand';
  delivery_address: string;
  instructions?: string;
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';
  base_charge: number;
  service_charge: number;
  delivery_charge: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_contact?: string;
};

// Notification type
export type Notification = {
  id: string;
  recipient_id: string;
  recipient_type: 'customer' | 'agent';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Tip type
export type Tip = {
  id: string;
  order_id: string;
  agent_id: string;
  customer_id: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

// Eldoret locations
export const ELDORET_LOCATIONS = [
  { value: "Eldoret CBD", label: "Eldoret CBD", isCBD: true },
  { value: "West Indies", label: "West Indies", isCBD: false },
  { value: "Langas", label: "Langas", isCBD: false },
  { value: "Kimumu", label: "Kimumu", isCBD: false },
  { value: "Kapsoya", label: "Kapsoya", isCBD: false },
  { value: "Pioneer", label: "Pioneer", isCBD: false },
  { value: "Elgon View", label: "Elgon View", isCBD: false },
  { value: "Annex", label: "Annex", isCBD: false },
  { value: "Moi University", label: "Moi University", isCBD: false },
  { value: "Chepkoilel", label: "Chepkoilel", isCBD: false },
];

// Service types
export const SERVICE_TYPES = [
  { value: "Shopping", label: "Shopping" },
  { value: "Delivery", label: "Delivery" },
  { value: "Errand", label: "Errand" },
];

// Calculate delivery charges
export const calculateDeliveryCharge = (location: string): number => {
  const locationObj = ELDORET_LOCATIONS.find(loc => loc.value === location);
  if (!locationObj) return 100; // Default to higher charge if location not found
  return locationObj.isCBD ? 60 : 100;
};

// Calculate service charge (10% of base charge)
export const calculateServiceCharge = (baseCharge: number): number => {
  return baseCharge * 0.1;
};

// Calculate total amount
export const calculateTotalAmount = (
  baseCharge: number, 
  serviceCharge: number, 
  deliveryCharge: number
): number => {
  return baseCharge + serviceCharge + deliveryCharge;
};
