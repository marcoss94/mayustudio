export interface HowItWorksStep {
  n: string;
  title: string;
  desc: string;
}

export interface HowItWorksProps {
  title?: string;
  steps: HowItWorksStep[];
}

export function HowItWorks({ title = '¿Cómo funciona?', steps }: HowItWorksProps) {
  const gridCols =
    steps.length === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : 'grid-cols-2 md:grid-cols-4';

  return (
    <section className="py-20 md:py-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl italic text-center mb-16 md:mb-20">
          {title}
        </h2>
        <div className={`grid ${gridCols} gap-8 md:gap-12`}>
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                <span className="text-primary font-serif text-2xl md:text-3xl italic">
                  {step.n}
                </span>
              </div>
              <h4 className="font-bold mb-2 md:mb-3 uppercase text-xs tracking-widest">
                {step.title}
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
