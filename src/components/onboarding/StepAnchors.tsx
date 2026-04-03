import { useState, useRef, useEffect } from "react";

type Anchor = { title: string; externalId?: string; sourceApi?: string };

interface StepAnchorsProps {
  data: Anchor[];
  onNext: (anchors: Anchor[]) => void;
}

export default function StepAnchors({ data, onNext }: StepAnchorsProps) {
  const [anchors, setAnchors] = useState<Anchor[]>(data);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedForAdd, setSelectedForAdd] = useState<any | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Búsqueda en TMDB
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/onboarding/search-content?query=${encodeURIComponent(query)}`
        );
        const results = await response.json();
        setSearchResults(results.slice(0, 5)); // Top 5 results
      } catch (err) {
        console.error("Error searching:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleAddAnchor = (result: any) => {
    if (anchors.length >= 3) return;

    const newAnchor: Anchor = {
      title: result.title,
      externalId: String(result.id),
      sourceApi: result.format === "book" ? "google_books" : "tmdb",
    };

    setAnchors([...anchors, newAnchor]);
    setSearchInput("");
    setSearchResults([]);
    setSelectedForAdd(null);
  };

  const handleRemoveAnchor = (index: number) => {
    setAnchors(anchors.filter((_, i) => i !== index));
  };

  const canContinue = anchors.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          Tus obras favoritas
        </h2>
        <p className="text-slate-400">
          ¿Cuál fue la última obra que te enganchó de verdad? (serie, peli, libro...)
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Busca una película, serie o libro..."
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-800 transition-all"
        />

        {/* Search Results Dropdown */}
        {searchInput && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-slate-400">Buscando...</div>
            ) : searchResults.length > 0 ? (
              <ul className="divide-y divide-slate-700">
                {searchResults.map((result, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleAddAnchor(result)}
                    className="p-3 hover:bg-slate-700/50 cursor-pointer transition-colors flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold text-slate-100">
                        {result.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {result.format} • {result.year || ""}
                      </p>
                    </div>
                    {anchors.length < 3 && (
                      <span className="text-cyan-400 text-xs font-semibold">
                        + AÑADIR
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No se encontraron resultados
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Anchors */}
      {anchors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-indigo-300">
            Tus favoritos ({anchors.length}/3)
          </p>
          <div className="space-y-2">
            {anchors.map((anchor, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-indigo-900/30 border border-indigo-500/50 rounded-lg"
              >
                <p className="font-semibold text-slate-100">{anchor.title}</p>
                <button
                  onClick={() => handleRemoveAnchor(idx)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Notice */}
      {anchors.length < 3 && anchors.length > 0 && (
        <p className="text-sm text-slate-400 italic">
          Puedes añadir hasta {3 - anchors.length} más...
        </p>
      )}

      {/* Continue Button */}
      <button
        onClick={() => onNext(anchors)}
        disabled={!canContinue}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/50"
      >
        Continuar
      </button>

      {!canContinue && (
        <p className="text-sm text-red-400 text-center">
          Debes seleccionar al menos una obra
        </p>
      )}
    </div>
  );
}
