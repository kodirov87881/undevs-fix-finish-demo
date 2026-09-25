"use client";

import { FormEvent, useState } from "react";
import type { ItemInsert } from "@/types/database";

type ItemFormProps = {
  onSubmit: (input: ItemInsert) => Promise<{ error: string | null }>;
  saving: boolean;
};

export function ItemForm({ onSubmit, saving }: ItemFormProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || saving) return;

    setError(null);
    const { error: saveError } = await onSubmit({
      title: title.trim(),
      notes: notes.trim() || null,
    });

    if (saveError) {
      setError(saveError);
      return;
    }

    setTitle("");
    setNotes("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Add item</h2>
      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Title
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal text-zinc-900 outline-none focus:border-zinc-900"
            disabled={saving}
            placeholder="e.g. Ship dashboard fix"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal text-zinc-900 outline-none focus:border-zinc-900"
            disabled={saving}
            placeholder="Optional details"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
