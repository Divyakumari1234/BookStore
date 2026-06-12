import ProductGrid from "../components/ProductGrid";

export default function ListingPage({ books, addToCart, cart }) {
  return (
    <main className="mx-auto my-8 grid w-[min(1400px,calc(100%_-_40px))] grid-cols-[260px_1fr] gap-7 max-[980px]:grid-cols-1">
      <aside className="rounded-lg border border-zinc-300 bg-white p-6">
        <h2 className="text-2xl font-black text-ebookDark">Filters</h2>
        {[
          ["Exam Category", ["All", "UPSC", "IIT-JEE"]],
          ["Price", ["All", "Under Rs. 300"]],
          ["Language", ["English"]],
          ["Subject", ["All", "Physics"]],
        ].map(([label, options]) => (
          <label className="my-4 grid gap-2 font-bold text-slate-600" key={label}>{label}<select className="h-10 rounded border border-zinc-300 px-2">{options.map((option) => <option key={option}>{option}</option>)}</select></label>
        ))}
      </aside>
      <section>
        <div className="mb-4 flex justify-between font-black text-ebookDark"><span>Sort by: Top Selling</span><span>Grid / List View</span></div>
        <ProductGrid books={books.slice(0, 8)} addToCart={addToCart} cart={cart} />
      </section>
    </main>
  );
}

