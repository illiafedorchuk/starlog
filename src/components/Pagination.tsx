type PaginationProps = {
  currentPage: string;
  pageCount: number;
  setCurrentPage: (page: string) => void;
};

export function Pagination({
  currentPage,
  setCurrentPage,
  pageCount,
}: PaginationProps) {
  if (Number(pageCount) <= 1) return null;

  function nextPage() {
    const page = Number(currentPage) + 1;
    setCurrentPage(page.toString());
  }
  function prevPage() {
    const page = Number(currentPage) - 1;
    setCurrentPage(page.toString());
  }

  return (
    <nav>
      <button type="button" disabled={currentPage === "1"} onClick={prevPage}>
        Previous
      </button>
      <span aria-live="polite">
        Page {Number(currentPage)} of {pageCount}
      </span>
      <button
        type="button"
        disabled={Number(currentPage) === pageCount}
        onClick={nextPage}
      >
        Next
      </button>
    </nav>
  );
}
