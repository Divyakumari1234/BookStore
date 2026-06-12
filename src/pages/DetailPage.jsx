import { fixCover, realCoverImage } from "../data/catalog";

export default function DetailPage({ book, addToCart }) {
  return (
    <main className="mx-auto my-8 grid w-[min(1400px,calc(100%_-_40px))] grid-cols-[260px_1fr] gap-7 rounded-lg border border-zinc-300 bg-white p-6 max-[980px]:grid-cols-1">
      <img className="h-[340px] w-[230px] object-cover" src={realCoverImage(book)} alt={book.title} loading="eager" decoding="sync" fetchPriority="high" onError={fixCover} />
      <section className="text-lg text-slate-700">
        <h1 className="mb-4 text-4xl font-black text-ebookGreen">{book.title}</h1>
        <p className="mb-3">{book.description}</p>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Price:</strong> Rs. {book.price}</p>
        <p><strong>Preview pages:</strong> Chapter 1, Chapter 2, Quick Revision</p>
        <p><strong>Ratings & Reviews:</strong> {"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}</p>
        <button className="mt-5 rounded-lg bg-ebookGreen px-6 py-3 text-xl font-black text-white" onClick={() => addToCart(book)}>Buy Now</button>
      </section>
    </main>
  );
}

