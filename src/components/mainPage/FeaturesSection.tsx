export function FeaturesSection() {
  const features = [
    {
      title: '🎯 Una recomendación',
      desc: 'No es una lista de 50 opciones. Es una propuesta concreta que debería gustarte.',
    },
    {
      title: '🎬 Cross-formato',
      desc: 'No es "qué serie", es "qué entretenimiento". Películas, series, libros, todos juntos.',
    },
    {
      title: '💡 Te dice el por qué',
      desc: 'No es magia. Cada recomendación te explica por qué cree que te va a gustar.',
    },
    {
      title: '📈 Aprende de ti',
      desc: 'Cada "me gusta" o "no me convence" mejora las próximas recomendaciones.',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Lo que hace diferente a WhatNow
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
