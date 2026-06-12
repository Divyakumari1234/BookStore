import { useState } from "react";
import { coverSources } from "../data/catalog";
import CategoryDirectory from "../components/CategoryDirectory";
import SiteFooter from "../components/SiteFooter";

function BookCover({ book, className, onMissing }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = coverSources(book);

  if (failed || !sources.length) {
    return null;
  }

  return (
    <img
      className={`${loaded ? "" : "hidden"} ${className} rounded-md object-cover shadow-md`}
      src={sources[sourceIndex]}
      alt={book.title}
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      onError={(event) => {
        if (sourceIndex < sources.length - 1) {
          setLoaded(false);
          setSourceIndex(sourceIndex + 1);
          return;
        }
        onMissing?.();
        setFailed(true);
      }}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= 20 || event.currentTarget.naturalHeight <= 20) {
          if (sourceIndex < sources.length - 1) {
            setLoaded(false);
            setSourceIndex(sourceIndex + 1);
            return;
          }
          onMissing?.();
          setFailed(true);
          return;
        }
        setLoaded(true);
      }}
    />
  );
}

function PurchasedBookCard({ book, readBook }) {
  const [coverMissing, setCoverMissing] = useState(false);

  return (
    <article className={`${coverMissing ? "grid-cols-[1fr_auto]" : "grid-cols-[72px_1fr_auto]"} grid items-center gap-4 rounded-md border border-zinc-200 bg-white p-4 transition hover:border-ebookGreen hover:shadow-md max-[720px]:grid-cols-1 max-[720px]:justify-items-center max-[720px]:text-center`}>
      {!coverMissing && <BookCover className="h-28 w-[72px]" book={book} onMissing={() => setCoverMissing(true)} />}
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-ebookOrange">{book.category}</p>
        <h3 className="mt-1 line-clamp-1 text-xl font-black leading-tight text-ebookDark">{book.title}</h3>
        <p className="mt-1 line-clamp-1 text-slate-500">{book.author}</p>
      </div>
      <button className="rounded-md bg-ebookGreen px-5 py-3 text-base font-black text-white hover:bg-emerald-700 max-[720px]:w-full" onClick={() => readBook(book)}>
        Read Now
      </button>
    </article>
  );
}

function historyBookEntries(history) {
  return history.flatMap((row) => {
    if (Array.isArray(row.items) && row.items.length) {
      return row.items.map((book, index) => ({
        id: `${row.id}-${index}`,
        title: book.title,
        author: book.author,
        date: row.date,
        amount: row.items.length === 1 ? row.amount : Math.round(Number(book.price || 0) * 0.9),
        status: row.status,
      }));
    }

    return String(row.books || "")
      .split(",")
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: `${row.id || "history"}-${index}`,
        title,
        date: row.date,
        amount: index === 0 ? row.amount : "",
        status: row.status,
      }));
  });
}

function PurchaseHistory({ history }) {
  const entries = historyBookEntries(history);

  return (
    <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-lg">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-ebookGreen">Paid Books</p>
          <h2 className="mt-1 text-2xl font-black text-ebookDark">Purchase History</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-lg font-black text-ebookGreen">{entries.length}</span>
      </div>
      <div className="grid gap-2.5">
        {entries.length ? entries.map((row, index) => (
          <article className="grid grid-cols-[34px_1fr] gap-3 rounded-md border border-zinc-100 bg-white p-3.5 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50/30" key={row.id}>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 text-sm font-black text-slate-500">{index + 1}</span>
            <div className="min-w-0">
            <p className="line-clamp-2 font-black leading-snug text-ebookDark">{row.title}</p>
            {row.author && <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-500">{row.author}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
              <span className="rounded bg-zinc-100 px-2 py-1">{row.date}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-ebookGreen">{row.status}</span>
            </div>
            </div>
          </article>
        )) : <p className="rounded-md bg-zinc-50 p-4 text-slate-500">No purchase history yet.</p>}
      </div>
    </section>
  );
}

function recoverBooksFromHistory(history, allBooks) {
  const catalogByTitle = new Map(allBooks.map((book) => [book.title.toLowerCase(), book]));
  return history.flatMap((row) => {
    if (Array.isArray(row.items) && row.items.length) return row.items;
    return String(row.books || "")
      .split(",")
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, index) => {
        const book = catalogByTitle.get(title.toLowerCase());
        return book ? { ...book, libraryId: `${row.id || "history"}-${index}-${book.id}` } : null;
      })
      .filter(Boolean);
  });
}

export default function LibraryPage({ library, history, readBook, allBooks = [] }) {
  const [query, setQuery] = useState("");
  const recoveredBooks = recoverBooksFromHistory(history, allBooks);
  const displayedBooks = recoveredBooks.length ? recoveredBooks : library;
  const filtered = displayedBooks.filter((book) => {
    const text = `${book.title} ${book.author} ${book.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <main className="bg-zinc-100 py-8">
      <div className="mx-auto w-[min(1120px,calc(100%_-_32px))]">
        <section className="mb-6 rounded-md border border-zinc-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between gap-5 max-sm:grid">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-ebookGreen">My E-Books</p>
              <h1 className="mt-1 text-4xl font-black text-ebookDark max-sm:text-3xl">My Library</h1>
            </div>
            <div className="rounded-md bg-emerald-50 px-5 py-3 text-center">
              <p className="text-3xl font-black text-ebookGreen">{displayedBooks.length}</p>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Books</p>
            </div>
          </div>

          <input
            className="mt-5 h-12 w-full rounded-md border border-zinc-300 bg-zinc-50 px-4 text-lg text-slate-700 outline-none focus:border-ebookGreen focus:bg-white"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search book name, author or category"
          />
        </section>

        <div className="mb-9 grid grid-cols-[1fr_360px] gap-6 max-[980px]:grid-cols-1">
          <section className="rounded-md border border-zinc-200 bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-center gap-4">
              <h2 className="text-2xl font-black text-ebookDark">Purchased Books</h2>
              <span className="h-px flex-1 bg-zinc-200" />
              <span className="font-black text-ebookGreen">{filtered.length}</span>
            </div>

            <div className="grid gap-3">
              {filtered.length ? filtered.map((book) => (
                <PurchasedBookCard book={book} readBook={readBook} key={book.libraryId || book.id} />
              )) : <p className="rounded-md bg-zinc-50 p-6 text-lg text-slate-500">No books found in your library.</p>}
            </div>
          </section>

          <PurchaseHistory history={history} />
        </div>
      </div>

      <CategoryDirectory />
      <SiteFooter />
    </main>
  );
}
