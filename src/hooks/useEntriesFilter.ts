import { useMemo } from "react";
import type { Entry, Mood } from "../types";
import type { SortBy } from "../components/EntryFilters";

type Filters = {
  text: string;
  mood: Mood | "all";
  sortBy: SortBy;
};

export function useEntryFilters(
  entries: Entry[],
  { text, mood, sortBy }: Filters,
) {
  const filteredEntries = useMemo(() => {
    const search = text.toLocaleLowerCase();

    return entries
      .filter(
        (e) =>
          e.text.toLocaleLowerCase().includes(search) &&
          (mood === "all" || e.mood === mood),
      )
      .sort((a, b) => {
        if (sortBy === "newest") {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        if (sortBy === "oldest") {
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        return 0;
      });
  }, [entries, text, mood, sortBy]);

  const getPageItems = <T,>(items: T[], page: string, pageSize: number) => {
    if (pageSize <= 0) {
      throw new Error("pageSize має бути більшим за 0");
    }
    const pageCount = Math.ceil(items.length / pageSize);
    const safePage =
      pageCount === 0 ? 1 : Math.min(Math.max(Number(page), 1), pageCount);
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  };

  return { filteredEntries, getPageItems };
}