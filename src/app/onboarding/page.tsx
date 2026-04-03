"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StepAnchors from "@/components/onboarding/StepAnchors";
import StepGenres from "@/components/onboarding/StepGenres";
import StepAvailability from "@/components/onboarding/StepAvailability";
import StepMood from "@/components/onboarding/StepMood";

export type OnboardingData = {
  anchors: Array<{ title: string; externalId?: string; sourceApi?: string }>;
  genres: string[];
  availableTime: "SHORT" | "MEDIUM" | "LONG" | "VARIABLE";
  platforms: string[];
  primaryMood: "RELAX" | "HOOKED" | "LEARN" | "FUN";
};

const STEPS = [
  { id: 1, label: "Tus favoritos", description: "Obras que te encantan" },
  { id: 2, label: "Géneros", description: "Qué tipo de historias te gustan" },
  { id: 3, label: "Disponibilidad", description: "Tiempo y plataformas" },
  { id: 4, label: "Tu vibe", description: "Lo que buscas al consumir" },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<OnboardingData>({
    anchors: [],
    genres: [],
    availableTime: "MEDIUM",
    platforms: [],
    primaryMood: "HOOKED",
  });

  // Proteger ruta
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleNext = (newData: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Validar completitud de todos los pasos
  const validateAllSteps = (): boolean => {
    // Paso 1: Al menos 1 obra favorita
    if (formData.anchors.length === 0) {
      setError("Debes seleccionar al menos una obra favorita en el paso 1");
      return false;
    }

    // Paso 2: Al menos 2 géneros
    if (formData.genres.length < 2) {
      setError("Debes seleccionar al menos 2 géneros en el paso 2");
      return false;
    }

    // Paso 3: Disponibilidad (siempre tiene valor por defecto, así que está bien)
    // Paso 4: Vibe seleccionado
    if (!formData.primaryMood) {
      setError("Debes seleccionar tu vibe en el paso 4");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validar todos los pasos antes de enviar
    if (!validateAllSteps()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar el perfil");
      }

      // Redirigir al dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  // Validar paso actual antes de avanzar
  const validateCurrentStep = (): boolean => {
    setError("");
    
    if (currentStep === 1 && formData.anchors.length === 0) {
      setError("Debes seleccionar al menos una obra favorita");
      return false;
    }
    
    if (currentStep === 2 && formData.genres.length < 2) {
      setError("Debes seleccionar al menos 2 géneros");
      return false;
    }
    
    if (currentStep === 4 && !formData.primaryMood) {
      setError("Debes seleccionar tu vibe");
      return false;
    }
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header with animated accent */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            Bienvenido, <span className="text-indigo-400 animate-pulse">{session?.user?.name}!</span>
          </h1>
          <p className="text-slate-300 text-lg font-medium">Cuéntanos sobre tus gustos en 4 pasos rápidos</p>
        </div>

        {/* Progress indicator with glow effect */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-md transform hover:scale-110 relative group ${
                    step.id <= currentStep
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "bg-slate-800/50 text-slate-300 border-2 border-slate-600 hover:border-indigo-400 hover:bg-slate-700/50"
                  }`}
                  title="Click para ir al paso"
                >
                  {step.id <= currentStep && <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur opacity-75 group-hover:opacity-100 transition-all"></div>}
                  <span className="relative">{step.id < currentStep ? "✓" : step.id}</span>
                </button>
                <p className="text-xs font-semibold text-indigo-300 mt-2 text-center">{step.label}</p>
                <p className="text-xs text-slate-400 text-center">{step.description}</p>
              </div>
            ))}
          </div>
          {/* Progress bar with glow */}
          <div className="w-full bg-slate-800/50 h-2.5 rounded-full overflow-hidden shadow-lg border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 h-full transition-all duration-300 shadow-lg shadow-indigo-500/50 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card with animated border */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl p-10 mb-8 border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none rounded-3xl"></div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in shake duration-300">
              <p className="text-sm text-red-700 font-semibold">❌ {error}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none prose-headings:text-indigo-200 prose-p:text-slate-300 relative z-10">
            {/* Step content */}
            {currentStep === 1 && (
              <StepAnchors
                data={formData.anchors}
                onNext={(anchors) => handleNext({ anchors })}
              />
            )}

            {currentStep === 2 && (
              <StepGenres
                data={formData.genres}
                onNext={(genres) => handleNext({ genres })}
              />
            )}

            {currentStep === 3 && (
              <StepAvailability
                data={{
                  availableTime: formData.availableTime,
                  platforms: formData.platforms,
                }}
                onNext={(data) => handleNext(data)}
              />
            )}

            {currentStep === 4 && (
              <StepMood
                data={formData.primaryMood}
                onNext={(primaryMood) => handleNext({ primaryMood })}
              />
            )}
          </div>
        </div>

        {/* Buttons with glow effects */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="px-8 py-3 bg-slate-800/50 text-slate-200 font-semibold rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-slate-600 hover:border-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20"
          >
            ← Atrás
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (validateCurrentStep()) {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || formData.anchors.length === 0 || formData.genres.length < 2 || !formData.primaryMood}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Guardando...
                </span>
              ) : (
                "✓ Completar"
              )}
            </button>
          )}
        </div>

        {/* Validation message */}
        {currentStep === 4 && (formData.anchors.length === 0 || formData.genres.length < 2 || !formData.primaryMood) && (
          <div className="mt-4 p-4 bg-amber-900/30 border border-amber-500/50 rounded-lg">
            <p className="text-sm text-amber-300">
              ⚠️ Completa todos los pasos para poder continuar:
              {formData.anchors.length === 0 && " • Añade al menos 1 obra (paso 1)"}
              {formData.genres.length < 2 && " • Selecciona al menos 2 géneros (paso 2)"}
              {!formData.primaryMood && " • Elige tu vibe (paso 4)"}
            </p>
          </div>
        )}

        {/* Skip (opcional) */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-300 underline hover:no-underline"
          >
            Saltar por ahora
          </button>
        </div>
      </div>
    </div>
  );
}
