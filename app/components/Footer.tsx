export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 bg-neutral-50/50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
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
          <p className="text-center text-xs text-neutral-400 sm:text-right">
            Independent concept study. Not affiliated with or endorsed by
            Intercom, Zendesk, or Notion.
          </p>
        </div>
      </div>
    </footer>
  );
}
