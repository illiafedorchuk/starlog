import { useState } from "react";
import type { Entry, Mood, EntryUpdate } from "../types";
import { mockEntries } from "../components/mock";

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);

  function addEntry(text: string, mood: Mood) {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date(),
      mood,
    };
    setEntries((prev) => [...prev, newEntry]);
  }

  function getEntry(id: string) {
    return entries.find((entry) => entry.id === id);
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, changes: EntryUpdate) {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)),
    );
  }
  function searchEntry(text: string) {
    return entries.filter((e) => e.text.includes(text));
  }

  return { entries, addEntry, getEntry, deleteEntry, updateEntry, searchEntry };
}
