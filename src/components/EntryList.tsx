import EntryCard from "./EntryCard.tsx";
import type { Entry } from "../types.ts";

function EntryList({
  entries,
  searchParams,
}: {
  entries: Entry[];
  searchParams: URLSearchParams;
}) {

  return (
    <>
      {entries.length === 0 ? (
        searchParams.get("text") || searchParams.get("mood") ? (
          <p>🔭 Nothing found.</p>
        ) : (
          <p>The sky is clear today.</p>
        )
      ) : (

        entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
      )}
    </>
  );
}

export default EntryList;
