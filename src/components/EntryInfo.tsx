import { MOODS } from "../types";
import type { Entry, Mood } from "../types";

type EntryInfoProps = {
  setMood: (mood: Mood) => void;
  setText: (text: string) => void;
  entry: Entry;
  isEditing: boolean;
};
export function EntryInfo({
  entry,
  setMood,
  setText,
  isEditing,
}: EntryInfoProps) {
  if (isEditing) {
    return (
      <div className="edit-form">
        <textarea
          value={entry.text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          value={entry.mood}
          onChange={(e) => setMood(e.target.value as Mood)}
        >
          {MOODS.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <>
      <p>{entry.text}</p>
      <p>{entry.mood}</p>
      <p>{entry.createdAt.toLocaleString()}</p>
    </>
  );
}
