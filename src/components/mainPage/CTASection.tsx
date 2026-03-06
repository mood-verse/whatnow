import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 dark:from-blue-500/5 dark:to-purple-600/5">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-black dark:text-white">
          ¿Listo para dejar de perder tiempo?
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          Únete a personas que ya no desperdician su entretenimiento
        </p>
        <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition">
          Registrarse gratis
        </Link>
      </div>
    </section>
  );
}
