"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAuthExpiredError, logSupabaseError } from "@/lib/auth/errors";
import type { Item, ItemInsert } from "@/types/database";

type UseItemsOptions = {
  userId: string | undefined;
  onAuthExpired: () => Promise<void>;
};

type UseItemsResult = {
  items: Item[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  refetch: () => Promise<void>;
  createItem: (input: ItemInsert) => Promise<{ error: string | null }>;
};

/**
 * Loads items for the logged-in user, filtered by user_id (RLS-friendly).
 */
export function useItems({
  userId,
  onAuthExpired,
}: UseItemsOptions): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;
    const supabase = createClient();

    void (async () => {
      const { data, error: fetchError } = await supabase
        .from("items")
        .select("id, user_id, title, notes, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        logSupabaseError("fetch items", fetchError, { userId });
        if (isAuthExpiredError(fetchError)) {
          await onAuthExpired();
          return;
        }
        setError(fetchError.message || "Failed to load items.");
        setItems([]);
        setLoading(false);
        return;
      }

      setItems((data as Item[]) ?? []);
      setError(null);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey, onAuthExpired]);

  const refetch = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, [userId]);

  const createItem = useCallback(
    async (input: ItemInsert) => {
      if (!userId) {
        return { error: "Not signed in." };
      }

      setSaving(true);
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("items")
        .insert({
          user_id: userId,
          title: input.title,
          notes: input.notes ?? null,
        })
        .select("id, user_id, title, notes, created_at")
        .single();

      setSaving(false);

      if (insertError) {
        logSupabaseError("insert item", insertError, {
          userId,
          title: input.title,
        });
        if (isAuthExpiredError(insertError)) {
          await onAuthExpired();
          return { error: "Session expired." };
        }
        return { error: insertError.message || "Failed to save item." };
      }

      if (data) {
        setItems((prev) => [data as Item, ...prev]);
      }
      return { error: null };
    },
    [userId, onAuthExpired],
  );

  return { items, loading, error, saving, refetch, createItem };
}
