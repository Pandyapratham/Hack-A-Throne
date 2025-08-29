import type { Event } from "./fetchEvents"; // Adjust path as needed
import { supabase } from "../utils/supabaseClient";
/**
 * Compares scanned QR code with events' QR code data.
 * @param scannedQrData - The scanned QR data string from camera
 * @param events - Array of Event objects fetched from Supabase
 * @returns The matched Event if found, otherwise null
 */
export function findMatchingEvent(
    scannedQrData: string,
    events: Event[]
): Event | null {
    if (!scannedQrData || events.length === 0) {
        return null;
    }

    // Search for event where qr_code_data matches scanned data exactly
    const matched = events.find(
        (event) => event.event_id.trim() === scannedQrData.trim()
    );

    return matched || null;
}
export async function addParticipantToEventAttendees(event_id: string, participant_id: string) {
    // Fetch the current attendee array
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("attendee")
      .eq("event_id", event_id)
      .single();
  
    if (fetchError) {
      return { error: fetchError };
    }
  
    // If attendee is null (never set), initialize as empty array
    let attendeeArr: string[] = Array.isArray(event.attendee) ? [...event.attendee] : [];
  
    // Prevent duplicates
    if (!attendeeArr.includes(participant_id)) {
      attendeeArr.push(participant_id);
    }
  
    // Update the attendee array in the database
    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({ attendee: attendeeArr })
      .eq("event_id", event_id)
      .select()
      .single();
  
    return { data: updatedEvent, error: updateError };
  }