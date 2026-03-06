'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="font-bold text-xl text-black dark:text-white">WhatNow</span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <a href="#solveProblem" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition">¿Qué problema resolvemos?</a>
            <a href="#about" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition">¿Cómo funciona?</a>
            <a href="#features" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition">¿Qué nos hace diferentes?</a>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition hidden sm:block">
              Iniciar sesión
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition">
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a href="#solveProblem" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition py-2">¿Qué problema resolvemos?</a>
            <a href="#about" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition py-2">¿Cómo funciona?</a>
            <a href="#features" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition py-2">¿Qué nos hace diferente?</a>
            <Link href="/login" className="block text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition py-2">Iniciar sesión</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
