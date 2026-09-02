"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

const FAQS = [
  {
    question: "What does Verita reconcile?",
    answer: "Verita connects bank transactions, settlements, invoices, and ledger entries into one financial trail, then identifies matches, reviews, and exceptions.",
  },
  {
    question: "Can I use my own finance data?",
    answer: "Yes. Upload your own CSV files, PDFs, or clear screenshots. Verita creates a dedicated run and uses that same dataset throughout the reconciliation journey.",
  },
  {
    question: "How does the matching work?",
    answer: "The reconciliation engine combines deterministic checks with ML record-linking signals such as amount similarity, date proximity, references, counterparties, and currency.",
  },
  {
    question: "What happens when Verita is not confident?",
    answer: "Low-confidence or high-risk cases are escalated instead of being silently resolved. The controller surfaces the evidence, risk, and recommended action for human review.",
  },
  {
    question: "Can the Finance Controller explain a decision?",
    answer: "Yes. Verita exposes the evidence and reasoning behind a reconciliation decision, including the primary driver, confidence, risk assessment, and counterfactual checks.",
  },
  {
    question: "Does Verita fabricate missing accounting data?",
    answer: "No. Missing source types remain missing. Uploaded runs are kept separate from the synthetic demo data, so the results shown for your run are grounded in the records you provided.",
  },
];

export function VeritaFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative w-full bg-black text-white px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
            <ShieldCheck className="h-3.5 w-3.5" /> VERITA / FAQ
          </div>
          <h2 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">Questions, answered.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
            Everything you need to know before putting a reconciliation run through Verita.
          </p>
        </div>

        <div className="mx-auto max-w-3xl border-y border-white/10">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question} className="border-b border-white/10 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold md:text-lg">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-sm leading-6 text-zinc-400">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-28 border-t border-white/10 pt-12 text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Built with intent</div>
          <div className="mt-4 text-2xl font-black tracking-tight md:text-4xl">Verita</div>
          <p className="mt-3 text-sm text-zinc-500">Built by <span className="font-semibold text-zinc-200">Aayushi Dhurandhar</span></p>
          <p className="mt-2 text-xs text-zinc-600">Finance reconciliation · ML record linking · AI controller</p>
        </div>
      </div>
    </section>
  );
}
