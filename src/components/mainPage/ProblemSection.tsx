export function ProblemSection() {
  const problems = [
    {
      icon: '⏱️',
      title: '40 minutos buscando',
      desc: 'Abres Netflix y pasas casi una hora scrolleando sin decidirte.'
    },
    {
      icon: '😴',
      title: 'Ves lo mismo siempre',
      desc: 'Acabas viendo la misma serie por tercera vez o algo que no te engancha.'
    },
    {
      icon: '📱',
      title: 'Catálogos separados',
      desc: 'Las APIs están en Netflix, Prime, Spotify, Amazon... en todo lado menos en uno.'
    }
  ];

  return (
    <section id="solveProblem" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            El problema que resolvemos
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Tienes poco tiempo libre y no quieres desperdiciarlo en mala entretenimiento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((item, i) => (
            <div key={i} className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
