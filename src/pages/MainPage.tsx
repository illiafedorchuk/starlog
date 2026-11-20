import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { EntryForm } from "../components/EntryForm";
import EntryList from "../components/EntryList";
import {
  EntryFilters,
  SORT_OPTIONS,
  type SortBy,
} from "../components/EntryFilters";
import { Pagination } from "../components/Pagination";
import { useEntriesContext } from "../contexts/EntriesContext";
import { useEntryFilters } from "../hooks/useEntriesFilter";
import { MOODS, type Mood } from "../types";
import { WelcomeSection } from "../components/MainPageCopmonents/WelcomeSection";
import { PlanetSection } from "../components/MainPageCopmonents/PlanetSection";
import { PreviewPage } from "../components/MainPageCopmonents/PreviewPage";
import Border from "../components/Border";
import { StartNow } from "../components/MainPageCopmonents/StartNow";
import { Footer } from "../components/MainPageCopmonents/Footer";
import { InfoSection } from "../components/MainPageCopmonents/InfoSection";

const PAGE_SIZE = 2;

export default function MainPage() {
  const { entries, addEntry } = useEntriesContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- читаємо і валідуємо параметри з URL ----------
  const text = searchParams.get("text") ?? "";

  const moodParam = searchParams.get("mood");
  const mood: Mood | "all" = MOODS.includes(moodParam as Mood)
    ? (moodParam as Mood)
    : "all";

  const sortParam = searchParams.get("sortBy");
  const sortBy: SortBy = SORT_OPTIONS.includes(sortParam as SortBy)
    ? (sortParam as SortBy)
    : "-";

  // ---------- фільтрація ----------
  const { filteredEntries, getPageItems } = useEntryFilters(entries, {
    text,
    mood,
    sortBy,
  });

  // ---------- пагінація ----------
  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const parsedPage = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 1 && parsedPage <= pageCount
      ? String(parsedPage)
      : "1";

  // ---------- оновлення URL ----------
  function updateParams(
    updates: Record<string, string | null>,
    options: { resetPage?: boolean; replace?: boolean } = {},
  ) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === "") next.delete(key);
          else next.set(key, value);
        }
        if (options.resetPage) next.delete("page");
        return next;
      },
      { replace: options.replace },
    );
  }

  const setText = (value: string) =>
    updateParams({ text: value }, { resetPage: true, replace: true });

  const setMood = (value: Mood | "all") =>
    updateParams({ mood: value === "all" ? null : value }, { resetPage: true });

  const setSortBy = (value: SortBy) =>
    updateParams({ sortBy: value === "-" ? null : value }, { resetPage: true });

  const setCurrentPage = (page: string) =>
    updateParams({ page: page === "1" ? null : page });

  // ---------- нормалізація URL: невалідні значення замінюються дефолтами ----------
  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    const canonical: Record<string, string | null> = {
      text: text === "" ? null : text,
      mood: mood === "all" ? null : mood,
      sortBy: sortBy === "-" ? null : sortBy,
      page: currentPage === "1" ? null : currentPage,
    };

    for (const [key, value] of Object.entries(canonical)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, text, mood, sortBy, currentPage, setSearchParams]);

  const pageItems = getPageItems(filteredEntries, currentPage, PAGE_SIZE);

  return (
    <div className="relative">
      <Border />
      <WelcomeSection />
      <InfoSection/>
      <PlanetSection /> 
      <PreviewPage entries={entries} />
      <StartNow/>
      <Footer/>
    </div>
  );
}
