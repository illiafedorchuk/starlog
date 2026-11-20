import EntryCard from "../components/EntryCard";
import { useParams } from "react-router-dom";
import { useEntriesContext } from "../contexts/EntriesContext";
import { useEffect } from "react";

function EntryPage() {
  const { id } = useParams();
  const { entries } = useEntriesContext();
  const entry = entries.find((entry) => entry.id === id);

  useEffect(() => {
    document.title = `STARLOG — ${entry?.mood ?? "Entry"}`;
  }, [entry?.mood]);

  if (!entry) {
    return <p>Entry not found</p>;
  }

  return (
    <div className="relative">
      <EntryCard entry={entry} />
    </div>
  );
}

export default EntryPage;
