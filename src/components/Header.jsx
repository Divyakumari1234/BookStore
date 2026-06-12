export default function Header({ cartCount }) {
  return (
    <header className="border-t-2 border-zinc-800 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto grid max-w-[1450px] grid-cols-[minmax(220px,1fr)_minmax(0,720px)] items-center gap-7 px-8 py-4 max-[980px]:grid-cols-1 max-[980px]:justify-items-center max-sm:px-4">
        <a className="inline-flex items-center gap-3 font-sans text-[42px] font-black leading-none text-ebookGreen no-underline max-sm:text-4xl" href="#/home" aria-label="E-Books Home">
          <span className="relative grid h-11 w-11 rotate-[-12deg] place-items-center rounded-lg border-[6px] border-ebookGreen bg-white text-lg font-black text-ebookOrange shadow-sm">
            e
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-ebookOrange" />
          </span>
          <span>E-Books</span>
        </a>

        <div className="min-w-0 w-full">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[15px] text-zinc-900">
            <strong>Search By:</strong>
            {["Books", "Author", "Keywords"].map((label, index) => (
              <label className="inline-flex items-center gap-1" key={label}>
                <input className="h-4 w-4 accent-blue-500" type="radio" name="searchBy" defaultChecked={index === 0} /> {label}
              </label>
            ))}
          </div>
          <div className="flex h-11 min-w-0 items-stretch max-sm:h-auto max-sm:flex-wrap max-sm:gap-3">
            <input className="min-w-0 flex-1 border border-ebookGreen px-4 text-lg text-slate-500 outline-none max-sm:h-11 max-sm:min-w-full" type="search" placeholder="Search" />
            <button className="bg-ebookGreen px-6 text-base font-black text-white shadow-[4px_5px_10px_rgba(0,0,0,0.20)] max-sm:h-11" type="button">Search</button>
            <a className="relative ml-5 inline-flex items-center gap-2 rounded-md px-2 text-base font-black leading-tight text-ebookGreen no-underline transition hover:bg-emerald-50 max-sm:ml-0 max-sm:h-11" href="#/cart">
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-ebookGreen text-white shadow-sm">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 6H6" />
                </svg>
                <span className="absolute -right-1 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-ebookOrange px-1 text-xs text-white">{cartCount}</span>
              </span>
              <span>My<br />Cart</span>
            </a>
            <a className="ml-5 inline-flex items-center rounded-md border border-ebookGreen px-5 text-lg font-black text-ebookGreen no-underline transition hover:bg-ebookGreen hover:text-white max-sm:ml-0 max-sm:h-11" href="#/library">My Library</a>
          </div>
        </div>
      </div>
    </header>
  );
}
