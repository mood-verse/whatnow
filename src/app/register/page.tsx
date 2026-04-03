"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const router = useRouter();

  // Validar fortaleza de contraseña
  const evaluatePasswordStrength = (pwd: string) => {
    if (pwd.length < 6) return "weak";
    if (pwd.length < 10 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return "medium";
    return "strong";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd.length > 0) {
      setPasswordStrength(evaluatePasswordStrength(pwd) as "weak" | "medium" | "strong");
    } else {
      setPasswordStrength(null);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validaciones básicas
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      setError("Todos los campos son requeridos");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (nickname.length < 2 || nickname.length > 30) {
      setError("El nickname debe tener entre 2 y 30 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("¡Cuenta creada! Redirigiendo al login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6 text-sm text-slate-400 hover:text-white transition-all duration-300 group">
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">WhatNow</h1>
          <p className="text-slate-400">Dime qué buscas y te diré qué consumir</p>
        </div>

        {/* Tarjeta de registro */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 hover:border-white/40 transition-all duration-300">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Crea tu cuenta</h2>
            <p className="text-slate-400 text-sm mt-2">Simple y sin complicaciones</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Campo Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-sm font-semibold text-white mb-2">
                Nickname
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/20 disabled:bg-slate-500/10 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
                placeholder="Tu nombre de usuario"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              {nickname.length > 0 && (
                <p className="text-xs text-slate-300 mt-1">
                  {nickname.length}/30 caracteres
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/20 disabled:bg-slate-500/10 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/20 disabled:bg-slate-500/10 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={handlePasswordChange}
              />
              
              {/* Indicador de fortaleza */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2 animate-in fade-in duration-300">
                  <div className="flex gap-1 bg-white/5 p-2 rounded-md">
                    <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}></div>
                  </div>
                  <p className="text-xs text-slate-300">
                    Fortaleza:
                    <span className={`ml-1 font-semibold ${
                      passwordStrength === "weak" ? "text-red-400" :
                      passwordStrength === "medium" ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {passwordStrength === "weak" && "Débil"}
                      {passwordStrength === "medium" && "Media"}
                      {passwordStrength === "strong" && "Fuerte"}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-in shake duration-300">
                <p className="text-sm text-red-300 font-medium">❌ {error}</p>
              </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg animate-in fade-in duration-300">
                <p className="text-sm text-green-300 font-medium">✅ {success}</p>
              </div>
            )}

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creando cuenta...
                </span>
              ) : (
                "Registrarse"
              )}
            </button>

            {/* Enlace a login */}
            <div className="text-center pt-2">
              <p className="text-slate-300 text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors duration-300"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>

          {/* Pie de página */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-xs text-slate-500">
              Al registrarte, aceptas nuestros términos de servicio y política de privacidad
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}