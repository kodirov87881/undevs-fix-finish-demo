"use client";

import type { Item } from "@/types/database";

type ItemListProps = {
  items: Item[];
};

export function ItemList({ items }: ItemListProps) {
  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-sm">
      {items.map((item) => (
        <li key={item.id} className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium text-zinc-900">{item.title}</h3>
              {item.notes && (
                <p className="mt-1 text-sm text-zinc-600 whitespace-pre-wrap">
                  {item.notes}
                </p>
              )}
            </div>
            <time
              className="shrink-0 text-xs text-zinc-400"
              dateTime={item.created_at}
            >
              {new Date(item.created_at).toLocaleString()}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
