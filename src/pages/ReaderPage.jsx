import { useState } from "react";
import { CURRENT_BOOK_KEY, booksByCategory } from "../data/catalog";
import { readStorage } from "../utils/storage";

export default function ReaderPage() {
  const book = readStorage(CURRENT_BOOK_KEY, booksByCategory.Mathematics[0]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const saveNotes = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#eef2f5] py-8 text-ebookDark">
      <section className="mx-auto flex w-[min(1120px,calc(100%_-_48px))] items-stretch gap-8 max-[640px]:w-[min(100%_-_32px)] max-[640px]:flex-col">
        <aside className="w-[360px] shrink-0 rounded-md border border-zinc-200 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.10)] max-[640px]:w-full">
          <div className="mb-4 border-b border-zinc-200 pb-3">
            <div>
            <p className="text-xs font-black uppercase tracking-wide text-ebookGreen">Study Notes</p>
            <h1 className="mt-1 text-3xl font-black">Notes</h1>
            </div>
          </div>
          <textarea
            className="min-h-[420px] w-full resize-y rounded-md border border-zinc-300 bg-zinc-50 p-4 text-lg leading-7 text-slate-900 outline-none transition focus:border-ebookGreen focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,136,102,0.10)] max-sm:min-h-[300px]"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Write notes for this book..."
          />
          <button className="mt-4 w-full rounded-md bg-ebookGreen px-5 py-3 text-lg font-black text-white shadow-[0_10px_18px_rgba(0,136,102,0.22)] transition hover:bg-emerald-700" type="button" onClick={saveNotes}>
            Save Notes
          </button>
          {saved && (
            <div className="mt-3 rounded-md bg-emerald-50 px-4 py-3 text-center font-black text-ebookGreen">
              Notes saved
            </div>
          )}
        </aside>

        <article className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.10)]">
          <div className="border-b border-zinc-200 pb-5">
            <p className="text-sm font-black uppercase tracking-wide text-ebookGreen">{book.category}</p>
            <h2 className="mt-2 text-[clamp(34px,5vw,54px)] font-black leading-none">{book.title}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-slate-600">{book.author}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-ebookGreen">Purchased</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-ebookOrange">Quick Read</span>
            </div>
          </div>

          <div className="mt-6 max-w-3xl space-y-5 text-xl leading-9 text-slate-900 max-sm:text-lg max-sm:leading-8">
            <p>
              <strong>{book.title}</strong> is a focused study book made for quick learning and revision. It explains the
              subject in a simple way so students can understand the main ideas without confusion.
            </p>
            <p>
              This reader page gives you a clean space to read about the purchased book and keep your own notes on the
              side. You can write important points, doubts, formulas, summaries, or anything you want to revise later.
            </p>
            <p>
              Start with the basic concepts, read slowly, and use the notes box to collect the lines that matter most.
              The goal is to keep the page simple, clear, and useful while studying.
            </p>
          </div>
          <div className="mt-8 rounded-md border border-emerald-100 bg-emerald-50 p-4 text-base font-bold leading-7 text-ebookGreen">
            Tip: write short points on the left while reading this summary, then revise only your notes later.
          </div>
        </article>
      </section>
    </main>
  );
}
