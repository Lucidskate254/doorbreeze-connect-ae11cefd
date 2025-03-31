
import { supabase } from "@/integrations/supabase/client";

/**
 * Plays a notification sound
 * @param type The type of notification to play
 */
export const playNotificationSound = (type: 'success' | 'alert' | 'update' = 'success') => {
  try {
    // We'll use default sounds for now, but in a real app you'd have different sounds per type
    const audio = new Audio('/notification.mp3');
    audio.play().catch(error => {
      // This error is expected if user hasn't interacted with the page yet
      console.log("Audio playback error (may be expected if user hasn't interacted with page):", error);
    });
  } catch (error) {
    console.error("Failed to play notification sound:", error);
  }
};

/**
 * Shows a browser notification if permission is granted
 * @param title Notification title
 * @param body Notification body
 * @param icon Optional icon URL
 */
export const showBrowserNotification = (title: string, body: string, icon?: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body, icon });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body, icon });
      }
    });
  }
};

/**
 * Set up real-time listeners for order updates
 * @param orderId The ID of the order to listen for
 * @param onUpdate Callback that runs when an update is received
 * @returns A cleanup function to remove the listener
 */
export const setupOrderUpdateListener = (orderId: string, onUpdate: (update: any) => void) => {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders',
        filter: `id=eq.${orderId}` 
      }, 
      payload => {
        // Play sound and show notification when order status changes
        playNotificationSound('update');
        showBrowserNotification(
          "Order Update", 
          `Order #${orderId} status: ${payload.new.status}`
        );
        onUpdate(payload.new);
      }
    )
    .subscribe();

  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};
