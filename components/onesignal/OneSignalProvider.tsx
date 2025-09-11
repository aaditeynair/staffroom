"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalProvider() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.OneSignal) {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        OneSignal.Debug.setLogLevel("trace");
        OneSignal.Notifications.requestPermission();
      });
    }
  }, []);

  return null;
}
