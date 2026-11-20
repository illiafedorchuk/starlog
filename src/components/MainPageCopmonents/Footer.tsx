export function Footer() {
  return (
    <footer>
      <p className="py-10 text-center text-xs tracking-[0.3em] text-[var(--muted-foreground)]">
{"STARLOG" + " " + new Date().getFullYear()}
      </p>
    </footer>
  );
}
