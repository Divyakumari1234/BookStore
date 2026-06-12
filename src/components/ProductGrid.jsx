import { useEffect } from "react";
import { coverSources } from "../data/catalog";

export default function ProductGrid({ books, addToCart, cart = [], coverMap = new Map() }) {
  const cartIds = new Set(cart.map((item) => item.id));

  useEffect(() => {
    books.forEach((book) => {
      const [firstSource] = coverSources(book);
      if (!firstSource) return;
      const image = new Image();
      image.decoding = "sync";
      image.src = firstSource;
    });
  }, [books]);

  return (
    <div className="grid grid-cols-4 justify-items-center gap-8 p-7 max-[1450px]:grid-cols-3 max-[1120px]:grid-cols-2 max-sm:grid-cols-1 max-sm:p-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} addToCart={addToCart} isAdded={cartIds.has(book.id)} coverUrl={coverMap.get(book.id)} />
      ))}
    </div>
  );
}

function BookCard({ book, addToCart, isAdded, coverUrl }) {
  const imageSource = coverUrl || coverSources(book)[0];

  return (
    <article className="flex min-h-[455px] w-full max-w-[280px] flex-col items-center rounded bg-white p-5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.24)] max-[360px]:max-w-full">
      <div className="grid h-[230px] w-[154px] place-items-center overflow-hidden">
        {imageSource && (
          <img
            className="h-full w-full object-cover"
            src={imageSource}
            srcSet={imageSource.includes("covers.openlibrary.org") ? `${imageSource.replace("-M.jpg", "-S.jpg")} 80w, ${imageSource} 180w, ${imageSource.replace("-M.jpg", "-L.jpg")} 380w` : undefined}
            sizes="154px"
            alt=""
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
        )}
      </div>
      <h3 className="mt-5 line-clamp-2 min-h-[50px] text-[19px] font-black uppercase leading-tight text-ebookGreen">
        {book.title}
      </h3>
      <p className="mt-1 min-h-[26px] text-[16px] text-slate-600">{book.author}</p>
      <strong className="mt-1 text-[16px] font-black uppercase text-ebookGreen">{book.language}</strong>
      <div className="my-1 text-xl text-slate-500" aria-label={`${book.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index}>{index < book.rating ? "\u2605" : "\u2606"}</span>
        ))}
      </div>
      <h4 className="text-[20px] font-black text-slate-900">Price: Rs. {book.price}</h4>
      <button
        className={`mt-3 rounded px-6 py-2 text-[19px] font-black text-white shadow-[-6px_7px_0_#777] ${
          isAdded ? "cursor-not-allowed bg-zinc-500 shadow-[-6px_7px_0_#999]" : "bg-ebookGreen"
        }`}
        type="button"
        disabled={isAdded}
        onClick={() => addToCart(book)}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
    </article>
  );
}
