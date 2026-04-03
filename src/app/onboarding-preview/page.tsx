"use client";

import { useState } from "react";
import Link from "next/link";
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

export default function OnboardingPreviewPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<OnboardingData>({
    anchors: [],
    genres: [],
    availableTime: "MEDIUM",
    platforms: [],
    primaryMood: "HOOKED",
  });

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

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1 && formData.anchors.length === 0) {
      alert("Debes seleccionar al menos una obra favorita");
      return false;
    }

    if (currentStep === 2 && formData.genres.length < 2) {
      alert("Debes seleccionar al menos 2 géneros");
      return false;
    }

    if (currentStep === 4 && !formData.primaryMood) {
      alert("Debes seleccionar tu vibe");
      return false;
    }

    return true;
  };

  const handleComplete = () => {
    if (formData.anchors.length === 0) {
      alert("Paso 1: Debes añadir al menos 1 obra favorita");
      return;
    }
    if (formData.genres.length < 2) {
      alert("Paso 2: Debes seleccionar al menos 2 géneros");
      return;
    }
    if (!formData.primaryMood) {
      alert("Paso 4: Debes elegir tu vibe");
      return;
    }

    alert(
      "En la versión real, aquí se guardaría el perfil y se redireccionaría al dashboard."
    );
    setCurrentStep(1);
    setFormData({
      anchors: [],
      genres: [],
      availableTime: "MEDIUM",
      platforms: [],
      primaryMood: "HOOKED",
    });
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
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-300 mb-6 transition-all duration-300 group font-semibold"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Preview: Onboarding
          </h1>
          <p className="text-slate-300">
            Vista previa del cuestionario de personalización
          </p>
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
                <p className="text-xs font-semibold text-indigo-300 mt-2 text-center">
                  {step.label}
                </p>
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
            disabled={currentStep === 1}
            className="px-8 py-3 bg-slate-800/50 text-slate-200 font-semibold rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-2 border-slate-600 hover:border-indigo-500 shadow-md hover:shadow-lg hover:shadow-indigo-500/20"
          >
            ← Atrás
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => {
                if (validateCurrentStep()) {
                  handleNext({});
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={formData.anchors.length === 0 || formData.genres.length < 2 || !formData.primaryMood}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
            >
              ✓ Completar
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
      </div>
    </div>
  );
}
