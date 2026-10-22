"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase/browser";

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

export default function OneSignalProvider() {
  const [isOneSignalInitialized, setIsOneSignalInitialized] = useState(false);

  useEffect(() => {
    if (!ONESIGNAL_APP_ID) return;

    const initializeOneSignal = async () => {
      if (isOneSignalInitialized) {
        return;
      }

      try {
        await OneSignal.init({
          appId: ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        });

        setIsOneSignalInitialized(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          OneSignal.login(user.id);
        }

        OneSignal.Notifications.requestPermission();
      } catch (error) {
        console.error("Failed to initialize OneSignal:", error);
      }
    };

    initializeOneSignal();
  }, [isOneSignalInitialized]);

  return null;
}
