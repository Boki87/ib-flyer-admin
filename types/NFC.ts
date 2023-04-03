export type NFC = {
  id?: string;
  venue_id: string;
  active_employee_id?: string;
  owner_id?: string;
  show_reviews?: boolean;
  title?: string;
  is_active?: boolean;
  device_type_id?: number;
  device_types?: {
    image?: string;
    title?: string;
    type?: string;
  };
  venues?: {
    title?: string;
    logo?: string;
  };
  created_at?: string;
};
