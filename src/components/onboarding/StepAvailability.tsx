import { useState } from "react";

const PLATFORM_OPTIONS = [
  { id: "netflix", label: "Netflix" },
  { id: "prime-video", label: "Prime Video" },
  { id: "disney+", label: "Disney+" },
  { id: "hbo", label: "HBO Max" },
  { id: "game-pass", label: "Game Pass" },
  { id: "ps5", label: "PS5" },
  { id: "xbox", label: "Xbox" },
  { id: "steam", label: "Steam" },
  { id: "kindle", label: "Kindle" },
  { id: "apple-books", label: "Apple Books" },
];

interface StepAvailabilityProps {
  data: { availableTime: string; platforms: string[] };
  onNext: (data: {
    availableTime: "SHORT" | "MEDIUM" | "LONG" | "VARIABLE";
    platforms: string[];
  }) => void;
}

export default function StepAvailability({
  data,
  onNext,
}: StepAvailabilityProps) {
  const [availableTime, setAvailableTime] = useState(data.availableTime);
  const [platforms, setPlatforms] = useState<string[]>(data.platforms);

  const togglePlatform = (platformId: string) => {
    setPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContinue = () => {
    onNext({
      availableTime: availableTime as
        | "SHORT"
        | "MEDIUM"
        | "LONG"
        | "VARIABLE",
      platforms,
    });
  };

  return (
    <div className="space-y-8">
      {/* Time Available */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">
          Tu disponibilidad
        </h2>
        <p className="text-slate-400 mb-6">
          ¿Cuánto tiempo libre tienes normalmente?
        </p>

        <div className="space-y-3">
          {[
            {
              value: "SHORT",
              label: "Menos de 1 hora ⏱️",
              desc: "Algo para ver en una pausa",
            },
            {
              value: "MEDIUM",
              label: "1–2 horas ⏰",
              desc: "Un episodio o un buen rato",
            },
            {
              value: "LONG",
              label: "Más de 2 horas 🎬",
              desc: "Inmersión total",
            },
            {
              value: "VARIABLE",
              label: "Depende del día 📅",
              desc: "No siempre es lo mismo",
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setAvailableTime(option.value)}
              className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all text-left ${
                availableTime === option.value
                  ? "border-indigo-500 bg-indigo-900/30"
                  : "border-slate-700 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: availableTime === option.value ? '#6366f1' : '#64748b',
                    backgroundColor: availableTime === option.value ? '#6366f1' : 'transparent'
                  }}
                >
                  {availableTime === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500">{option.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h3 className="text-xl font-bold text-indigo-300 mb-4">
          ¿Qué plataformas tienes? (Opcional)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PLATFORM_OPTIONS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`p-3 rounded-lg font-semibold text-sm text-center transition-all ${
                platforms.includes(platform.id)
                  ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-2 border-indigo-400 shadow-lg shadow-indigo-500/50"
                  : "bg-slate-800/50 text-slate-200 border-2 border-slate-700 hover:border-indigo-500 hover:bg-slate-800/70"
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

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
