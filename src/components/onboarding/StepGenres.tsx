import { useState } from "react";

const GENRE_OPTIONS = [
  { id: "terror", label: "Terror 😱" },
  { id: "thriller", label: "Thriller 🔪" },
  { id: "drama", label: "Drama 😢" },
  { id: "comedia", label: "Comedia 😂" },
  { id: "ciencia-ficcion", label: "Ciencia Ficción 🚀" },
  { id: "fantasia", label: "Fantasía 🧙" },
  { id: "romance", label: "Romance 💕" },
  { id: "accion", label: "Acción 💥" },
  { id: "documental", label: "Documental 🎬" },
];

interface StepGenresProps {
  data: string[];
  onNext: (genres: string[]) => void;
}

export default function StepGenres({ data, onNext }: StepGenresProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(data);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((g) => g !== genreId)
        : [...prev, genreId]
    );
  };

  const canContinue = selectedGenres.length >= 2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          ¿Qué tipo de historias te gustan?
        </h2>
        <p className="text-slate-400">
          Selecciona al menos 2 géneros (puedes cambiar esto después)
        </p>
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GENRE_OPTIONS.map((genre) => (
          <button
            key={genre.id}
            onClick={() => toggleGenre(genre.id)}
            className={`p-4 rounded-lg font-semibold text-center transition-all ${
              selectedGenres.includes(genre.id)
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-indigo-400 scale-105 shadow-lg shadow-indigo-500/50"
                : "bg-slate-800/50 text-slate-200 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-800/70"
            }`}
          >
            {genre.label}
          </button>
        ))}
      </div>

      {/* Selected Count */}
      <div className="flex justify-between items-center p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
        <p className="text-indigo-300 font-semibold">
          Géneros seleccionados:
        </p>
        <span className="text-2xl font-bold text-cyan-400">
          {selectedGenres.length}/9
        </span>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onNext(selectedGenres)}
        disabled={!canContinue}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/50"
      >
        Continuar
      </button>

      {!canContinue && (
        <p className="text-sm text-red-400 text-center">
          Debes seleccionar al menos 2 géneros
        </p>
      )}
    </div>
  );
}
