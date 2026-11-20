

export type Mood = 'Happy' | 'Sad' | 'Angry' | 'Excited' | 'Bored' | 'Confused' | 'Tired';
export const MOODS: Mood[] = ['Happy', 'Sad', 'Angry', 'Excited', 'Bored', 'Confused', 'Tired'];

export type Entry = {
    id: string;
    text: string;
    createdAt: Date;
    mood: Mood;
}

export type EntryCardProps = {
  entry: Entry;
};

export type EntryUpdate = Partial<Omit<Entry, "id">>;

export type EntriesContextValue = {
  entries: Entry[];
  addEntry: (text: string, mood: Mood) => void;
  getEntry: (id: string) => Entry | undefined;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, changes: EntryUpdate) => void;
  searchEntry: (text: string) => void;
};
