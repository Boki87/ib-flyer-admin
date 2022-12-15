export type NFC = {
  id?: string;
  venue_id: string;
  active_employee_id?: string;
  is_active?: boolean;
  device_type_id?: number;
  device_types?: {
    image?: string;
    title?: string;
    type?: string;
  };
  created_at?: string;
};
