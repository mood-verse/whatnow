"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">WhatNow</h1>
          <div className="text-right">
            <p className="text-sm text-slate-600">Hola, {session?.user?.name}</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            ¡Perfil completado!
          </h2>
          <p className="text-slate-600 mb-8">
            Tu perfil está listo. Pronto podrás recibir recomendaciones personalizadas.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Esta página es un placeholder. Las funcionalidades de recomendación se están desarrollando.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/onboarding"
              className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Editar perfil
            </Link>
            <button
              onClick={() => {
                // Logout
                window.location.href = "/api/auth/signout";
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
