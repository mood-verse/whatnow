import { useState } from "react";

const MOOD_OPTIONS = [
  {
    id: "RELAX",
    label: "Desconectar y relajarme 🧘",
    desc: "Algo ligero que me permita desconectar del día",
  },
  {
    id: "HOOKED",
    label: "Que me enganche y no pueda parar 🎬",
    desc: "Quiero estar pegado a la pantalla",
  },
  {
    id: "LEARN",
    label: "Aprender o pensar 🧠",
    desc: "Contenido que me haga reflexionar",
  },
  {
    id: "FUN",
    label: "Reírme o pasar un buen rato 😄",
    desc: "Entretenimiento puro y simple",
  },
];

interface StepMoodProps {
  data: string;
  onNext: (mood: "RELAX" | "HOOKED" | "LEARN" | "FUN") => void;
}

export default function StepMood({ data, onNext }: StepMoodProps) {
  const [selectedMood, setSelectedMood] = useState(data);

  const handleContinue = () => {
    onNext(selectedMood as "RELAX" | "HOOKED" | "LEARN" | "FUN");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          ¿Cuál es tu vibe?
        </h2>
        <p className="text-slate-400">
          ¿Qué buscas normalmente cuando tienes tiempo libre?
        </p>
      </div>

      {/* Mood Cards */}
      <div className="space-y-3">
        {MOOD_OPTIONS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`w-full p-6 rounded-lg border-2 text-left transition-all transform ${
              selectedMood === mood.id
                ? "border-indigo-500 bg-indigo-900/30 scale-105 shadow-lg shadow-indigo-500/50"
                : "border-slate-700 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50"
            }`}
          >
            <p className="font-bold text-lg text-slate-100 mb-1">
              {mood.label}
            </p>
            <p className="text-sm text-slate-500">{mood.desc}</p>
          </button>
        ))}
      </div>

      {/* Selected indicator */}
      {selectedMood && (
        <div className="p-4 bg-cyan-900/30 border border-cyan-500/50 rounded-lg">
          <p className="text-sm text-cyan-300 font-semibold">
            ✓ Vibe seleccionado
          </p>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/50"
      >
        Continuar
      </button>
    </div>
  );
}
