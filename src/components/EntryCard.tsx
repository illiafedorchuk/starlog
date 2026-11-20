import { useState } from "react";
import type { EntryCardProps, Mood } from "../types";
import { EntryActions } from "./EntryActions";
import { EntryInfo } from "./EntryInfo";

function EntryCard({ entry }: EntryCardProps) {
  const [text, setUpdatedText] = useState(entry.text);
  const [mood, setUpdatedMood] = useState<Mood>(entry.mood);
  const [isEditing, setIsEditing] = useState(false);

  const updatedEntry = { ...entry, text, mood };

  return (
    <>
      <EntryInfo
        setMood={setUpdatedMood}
        setText={setUpdatedText}
        entry={updatedEntry}
        isEditing={isEditing}
      />
      <EntryActions
        entry={updatedEntry}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={() => {
          setUpdatedText(entry.text);
          setUpdatedMood(entry.mood);
          setIsEditing(false);
        }}
      />
    </>
  );
}

export default EntryCard;
