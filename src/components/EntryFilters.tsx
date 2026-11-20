import { MOODS, type Mood } from "../types";

export const SORT_OPTIONS = ["-", "newest", "oldest"] as const;
export type SortBy = (typeof SORT_OPTIONS)[number];

type EntryFilterProps = {
  text: string;
  setText: (value: string) => void;
  mood: Mood | "all";
  setMood: (value: Mood | "all") => void;
  sortBy: SortBy;
  setSortBy: (value: SortBy) => void;
};

export function EntryFilters({
  text,
  setText,
  mood,
  setMood,
  sortBy,
  setSortBy,
}: EntryFilterProps) {
  function handleSetMood(e: React.ChangeEvent<HTMLSelectElement>) {
    setMood(e.target.value as Mood | "all");
  }

  function handleSetText(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function handleSetSortBy(e: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(e.target.value as SortBy);
  }

  return (
    <div>
      <input
        value={text}
        onChange={handleSetText}
        placeholder="Type to search..."
      />
      <select value={mood} onChange={handleSetMood}>
        <option value="all">All</option>
        {MOODS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select value={sortBy} onChange={handleSetSortBy}>
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}