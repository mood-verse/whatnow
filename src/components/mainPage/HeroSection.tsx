import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
                El recomendador que te entiende
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold text-black dark:text-white leading-tight">
                Dime cómo te sientes
              </h1>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
                y te digo qué consumir
              </h2>
            </div>

            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-md leading-relaxed">
              Series, películas, libros, juegos. Un único lugar para encontrar exactamente qué ver, leer o jugar en el momento exacto. Sin listas infinitas. Sin perder tiempo eligiendo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition inline-flex items-center justify-center gap-2">
                Empezar ahora
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎬</span>
                <span>Series & Películas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎌</span>
                <span>Anime</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span>Libros</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <span>Videojuegos</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
              
              {/* Card preview */}
              <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 shadow-2xl border border-zinc-800">
                <div className="space-y-4">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                  <h3 className="text-white font-bold text-lg">The Last of Us</h3>
                  <p className="text-zinc-400 text-sm">Serie • Drama, Thriller</p>
                  <p className="text-zinc-300 italic text-sm">
                    Te lo recomendamos porque te gustó Dark y buscas algo que te enganche
                  </p>
                  <div className="flex gap-2 text-xs text-zinc-400 pt-2">
                    <span>⭐ 9.1</span>
                    <span>•</span>
                    <span>~45min/ep</span>
                    <span>•</span>
                    <span>3 temporadas</span>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded text-sm transition">
                      👎 No me convence
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm transition font-semibold">
                      👍 Me apunto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
