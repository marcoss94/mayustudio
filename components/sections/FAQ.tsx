export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQProps {
  title?: string;
  items: FAQItem[];
}

export function FAQ({ title = 'Preguntas frecuentes', items }: FAQProps) {
  return (
    <section className="py-20 md:py-24 px-4 md:px-8 max-w-3xl mx-auto">
      <h2 className="font-serif text-3xl mb-12 text-center italic">{title}</h2>
      <div className="space-y-4">
        {items.map((faq, i) => (
          <details
            key={faq.q}
            className="group bg-surface-container rounded-xl overflow-hidden"
            open={i === 0}
          >
            <summary className="list-none flex justify-between items-center p-6 cursor-pointer font-semibold text-base md:text-lg hover:bg-surface-container-high transition-colors min-h-[44px]">
              {faq.q}
              <svg
                className="w-5 h-5 shrink-0 ml-4 text-on-surface-variant group-open:rotate-180 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-6 pt-0 text-on-surface-variant leading-relaxed">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
