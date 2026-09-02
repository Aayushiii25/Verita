'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function FinanceControllerChat() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setRunId(localStorage.getItem('verita_run_id'));
    sync();
    window.addEventListener('verita-run-changed', sync);
    return () => window.removeEventListener('verita-run-changed', sync);
  }, []);

  const ask = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const response = await fetch(`${API}/api/controller/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, run_id: runId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Controller request failed');
      if (!data.available) {
        setError(data.message || 'LLM is not configured.');
      } else {
        setAnswer(data.answer || 'No answer returned.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reach the Finance Controller.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
      >
        <Bot className="h-4 w-4 text-emerald-300" />
        Ask Finance Controller
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end bg-black/40 p-4 backdrop-blur-[2px] md:p-8">
          <div className="flex max-h-[min(760px,calc(100vh-32px))] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#090909]/95 text-white shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold"><Bot className="h-4 w-4 text-emerald-300" /> Finance Controller</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Grounded LLM · {runId ? 'your uploaded run' : 'demo dataset'}</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-white" aria-label="Close"><X className="h-4 w-4" /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {!answer && !error && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center gap-2 text-emerald-300"><Sparkles className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wider">Ask about the run</span></div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {['Why is the top exception unresolved?', 'Which matches are safe to auto-resolve?', 'What evidence supports the riskiest match?', 'What should a finance reviewer check next?'].map((q) => (
                      <button key={q} type="button" onClick={() => setQuestion(q)} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left text-xs text-zinc-300 transition hover:border-emerald-300/30 hover:bg-white/[0.05]">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {loading && <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-300"><Loader2 className="h-4 w-4 animate-spin text-emerald-300" /> Controller is reasoning over your reconciliation evidence…</div>}
              {error && <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5 text-sm text-amber-200"><div className="font-bold">LLM unavailable</div><div className="mt-2 text-xs leading-5 text-amber-100/70">{error}</div></div>}
              {answer && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5"><div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">Controller response</div><div className="whitespace-pre-wrap text-sm leading-7 text-zinc-100">{answer}</div></div>}
            </div>

            <form onSubmit={ask} className="border-t border-white/10 p-4">
              <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 focus-within:border-emerald-300/30">
                <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about a match, exception, risk, or next action…" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-600" />
                <button type="submit" disabled={!question.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300 text-black transition disabled:cursor-not-allowed disabled:opacity-30" aria-label="Ask Finance Controller"><Send className="h-4 w-4" /></button>
              </div>
              <div className="mt-2 text-[9px] uppercase tracking-[0.14em] text-zinc-600">The controller is grounded only in the loaded finance records and reconciliation results.</div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
