import { useNavigate, useMatch } from "react-router-dom";
import { useEntriesContext } from "../contexts/EntriesContext";
import type { Entry } from "../types";

export function EntryActions({
  entry,
  isEditing,
  setIsEditing,
  onCancel
}: {
  entry: Entry;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onCancel: ()=> void;
}) {
  const navigate = useNavigate();
  const { updateEntry, deleteEntry } = useEntriesContext();
  const match = useMatch(`/entry/${entry.id}`);

  function handleSave() {
    updateEntry(entry.id, { text: entry.text, mood: entry.mood });
    setIsEditing(false);
  }

  function handleCancel() {
    onCancel();
    setIsEditing(false);
  }

  function handleDelete() {
    deleteEntry(entry.id);
    navigate("/");
  }

  if (isEditing) {
    return (
      <>
        <button onClick={() => handleSave()}>Save</button>
        <button onClick={() => handleCancel()}>Cancel</button>
      </>
    );
  }

  return (
    <>
      {match ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <button onClick={() => navigate(`/entry/${entry.id}`)}>Open</button>
      )}
      <button onClick={() => handleDelete()}>Delete</button>
    </>
  );
}
