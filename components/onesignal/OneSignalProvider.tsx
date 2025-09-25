"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { supabase } from "@/lib/supabase/browser";

export default function OneSignalProvider() {
  const [isOneSignalInitialized, setIsOneSignalInitialized] = useState(false);

  useEffect(() => {
    const initializeOneSignal = async () => {
      if (isOneSignalInitialized) {
        return;
      }

      await OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
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
    };

    initializeOneSignal();
  }, [isOneSignalInitialized]);

  return null;
}

