import { createContext, useContext } from "react";
import { useEntries } from "../hooks/useEntries";
import type { EntriesContextValue } from "../types";

const EntriesContext = createContext<EntriesContextValue | undefined>(
  undefined,
);

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const { entries, addEntry, getEntry, deleteEntry, updateEntry, searchEntry } =
    useEntries();

  return (
    <EntriesContext.Provider
      value={{
        entries,
        addEntry,
        getEntry,
        deleteEntry,
        updateEntry,
        searchEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntriesContext() {
  const context = useContext(EntriesContext);

  if (!context) {
    throw new Error("useEntriesContext must be used inside EntriesProvider");
  }

  return context;
}
