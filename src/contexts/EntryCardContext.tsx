import { createContext, useContext } from "react";
import type { Entry } from "../types";

type EntryCardContextType = {
isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  entry: Entry;
  onSave?: (updatedEntry: Entry) => void;
  onDelete?: (id: string) => void;
};

export const EntryCardContext = createContext<EntryCardContextType | null>(null);
export function useEntryCard() {
  const context = useContext(EntryCardContext);
  if (!context) {
    throw new Error("EntryCard sub-components must be rendered within an EntryCard");
  }
  return context;
}