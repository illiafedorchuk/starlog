import { useState } from "react";
import type { Mood } from "../types";
import { MOODS } from "../types";

type EntryFormProps = {
  initialText?: string;
  initialMood?: Mood;
  onSubmit: (text: string, mood: Mood) => void;
  resetAfterSubmit?: boolean;
  editMode?: boolean;
};
export function EntryForm({
  onSubmit,
  initialMood,
  initialText,
  resetAfterSubmit,
}: EntryFormProps) {
  const [text, setText] = useState(initialText ?? "");
  const [mood, setMood] = useState<Mood>(initialMood ?? "happy");

  function handleSubmit() {
    onSubmit(text, mood);
    if (!resetAfterSubmit) {
      return;
    }
    setText("");
    setMood("happy");
  }

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)}/>
      <select value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
        {MOODS.map((m) => (
          <option value={m} key={m}>
            {m}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
