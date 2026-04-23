"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <section key={item.question} className="rounded-lg bg-white p-6 shadow-[0_14px_42px_rgba(47,80,61,0.07)]">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="focus-ring flex w-full cursor-pointer items-center gap-3 rounded-md text-left text-lg font-bold text-forest"
            >
              <HelpCircle size={20} className="shrink-0 text-leaf" aria-hidden="true" />
              <span className="min-w-0 flex-1">{item.question}</span>
              <ChevronDown
                size={20}
                className={["shrink-0 text-muted transition-transform duration-300", isOpen ? "rotate-180" : "rotate-0"].join(" ")}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={["grid transition-[grid-template-rows,opacity] duration-300 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="pt-4 pl-8 text-base leading-7 text-muted">{item.answer}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
