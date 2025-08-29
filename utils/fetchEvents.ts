// utils/fetchEvents.ts

import { supabase } from "./supabaseClient";

export type Event = {
  event_id: string;
  title: string;
  description: string;
  company_name: string;
  event_date: string;
  start_time: string;
  location_latitude: number;
  location_longitude: number;
  valid_radius_meters: number;
  qr_code_data: string;
  created_by_admin_id: string;
  created_at: string;
  attendee: string[]; // New column for array of UUIDs
};

/**
 * Fetches all event records from Supabase 'events' table.
 * @returns Promise resolving to array of Event or throwing an error.
 */
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from<Event>("events").select("*");

  if (error) {
    console.error("Error fetching events:", error.message);
    throw new Error(error.message);
  }

  return data || [];
}
