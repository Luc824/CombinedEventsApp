import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

/**
 * Hide tab hub content until after the native tab host has settled.
 * Avoids the visible jump from NativeTabs / safe-area first measurement.
 */
export function useStableTabPaint(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setReady(true);
        });
      });
    });
    return () => task.cancel();
  }, []);

  return ready;
}
