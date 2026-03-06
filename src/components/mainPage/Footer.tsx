export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded"></div>
            <span className="font-bold text-black dark:text-white">WhatNow</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © 2026 WhatNow. El recomendador que te entiende.
          </p>
        </div>
      </div>
    </footer>
  );
}
