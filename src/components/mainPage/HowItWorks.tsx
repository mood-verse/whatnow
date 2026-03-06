export function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Cuéntanos qué te gusta',
      desc: 'Responde un breve cuestionario sobre tus gustos, géneros y estado de ánimo.'
    },
    {
      step: '2',
      title: 'Nosotros buscamos',
      desc: 'Rastreamos películas, series y libros que encajan con tu perfil.',
      arrow: true
    },
    {
      step: '3',
      title: 'Recibe una recomendación',
      desc: 'Una sola propuesta, adaptada a ti, justo para este momento.',
      arrow: true
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Tres pasos para empezar a recibir recomendaciones personalizadas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, i) => (
            <div key={i} className="relative">
              <div className="bg-white dark:bg-zinc-900 border-2 border-blue-500 rounded-xl p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
              {item.arrow && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
