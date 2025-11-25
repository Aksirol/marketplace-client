export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20 py-10 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container-width text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Marketplace. Всі права захищені.</p>
      </div>
    </footer>
  );
}