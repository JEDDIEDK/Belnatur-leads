"use client";

import { useEffect, useState } from "react";
import { AppSettings, defaultAppSettings, normalizeSettings, SETTINGS_STORAGE_KEY } from "@/lib/app-settings";

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultAppSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<AppSettings>) : null;
    setSettings(normalizeSettings(parsed));
    setReady(true);
  }, []);

  function saveSettings(nextSettings: AppSettings) {
    setSettings(nextSettings);
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
  }

  function resetSettings() {
    saveSettings(defaultAppSettings);
  }

  return {
    settings,
    ready,
    saveSettings,
    resetSettings
  };
}
