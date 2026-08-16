import { supabase } from "./supabase";

/**
 * Fetch a single site setting from Supabase with a fallback
 */
export async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (!error && data) {
      return data.value;
    }
  } catch (err) {
    console.warn(`[Settings] Failed to fetch key ${key}:`, err);
  }
  return defaultValue;
}

/**
 * Update or insert a site setting
 */
export async function updateSetting(key: string, value: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value });

    if (error) throw error;
  } catch (err) {
    console.error(`[Settings] Failed to update key ${key}:`, err);
    throw err;
  }
}

/**
 * Fetch multiple site settings at once
 */
export async function getSettings(keys: string[], defaultValues: Record<string, string>): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...defaultValues };
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", keys);

    if (!error && data) {
      data.forEach((row) => {
        result[row.key] = row.value;
      });
    }
  } catch (err) {
    console.warn("[Settings] Failed to batch fetch keys:", err);
  }
  return result;
}

/**
 * Batch update site settings
 */
export async function updateSettings(settings: Record<string, string>): Promise<void> {
  try {
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from("site_settings")
      .upsert(upserts);

    if (error) throw error;
  } catch (err) {
    console.error("[Settings] Failed to batch update settings:", err);
    throw err;
  }
}
