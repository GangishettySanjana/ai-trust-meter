export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-neutral-50/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-neutral-500 sm:flex-row">
        <p>
          Designed &amp; built by{" "}
          <a
            href="https://gangishettysanjana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-accent-fg hover:decoration-accent"
          >
            Sanjana Gangishetty
          </a>
        </p>
        <p className="text-xs text-neutral-500">
          A concept demo · Meridian is fictional · no real data
        </p>
      </div>
    </footer>
  );
}
