"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

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
          <p className="text-slate-400">Bienvenido de vuelta</p>
        </div>

        {/* Tarjeta de login */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 hover:border-white/40 transition-all duration-300">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Inicia sesión</h2>
            <p className="text-slate-400 text-sm mt-2">Accede a tu cuenta</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
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
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg animate-in shake duration-300">
                <p className="text-sm text-red-300 font-medium">❌ {error}</p>
              </div>
            )}

            {/* Botón de login */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transform hover:-translate-y-0.5"
            >
              Iniciar sesión
            </button>

            {/* Enlace a registro */}
            <div className="text-center pt-2">
              <p className="text-slate-300 text-sm">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors duration-300"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>

          {/* Info */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-xs text-slate-500">
              Para probar usa: test@whatnow.com / Test123456!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}