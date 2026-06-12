import { useEffect, useState } from "react";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import CategoryDirectory from "../components/CategoryDirectory";
import SiteFooter from "../components/SiteFooter";
import { preloadBookCovers } from "../data/catalog";

export default function HomePage({ activeCategory, setActiveCategory, books, addToCart, cart, searchQuery }) {
  const sectionTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : activeCategory === "home"
      ? "Featured Books"
      : activeCategory;
  const [shownBooks, setShownBooks] = useState([]);
  const [shownTitle, setShownTitle] = useState(sectionTitle);
  const [coverMap, setCoverMap] = useState(new Map());
  const [loadingCovers, setLoadingCovers] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingCovers(true);
    preloadBookCovers(books).then((nextCoverMap) => {
      if (!active) return;
      setCoverMap(nextCoverMap);
      setShownBooks(books);
      setShownTitle(sectionTitle);
      setLoadingCovers(false);
    });
    return () => {
      active = false;
    };
  }, [books, sectionTitle]);

  return (
    <>
      <main className="grid grid-cols-[456px_1fr] bg-zinc-100 max-[900px]:grid-cols-1">
        <CategorySidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <section className="min-w-0 p-5">
          <div className="sticky top-0 z-20 mb-5 border-b-2 border-ebookGreen bg-white px-6 py-4 shadow-[0_1px_8px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-[28px] font-black text-ebookGreen">{shownTitle}</h1>
              {loadingCovers && <span className="text-sm font-black uppercase tracking-wide text-slate-400">Loading covers</span>}
            </div>
          </div>
          <div className="bg-white shadow-[0_1px_8px_rgba(0,0,0,0.12)]">
            {loadingCovers ? (
              <div className="grid min-h-[455px] place-items-center p-7 text-xl font-black text-ebookGreen">
                Loading real book covers...
              </div>
            ) : shownBooks.length ? (
              <ProductGrid books={shownBooks} addToCart={addToCart} cart={cart} coverMap={coverMap} />
            ) : (
              <div className="grid min-h-[455px] place-items-center p-7 text-center">
                <div>
                  <h2 className="text-2xl font-black text-ebookDark">No books found</h2>
                  <p className="mt-2 text-slate-500">Try another book name, author, or keyword.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <CategoryDirectory setActiveCategory={setActiveCategory} />
      <SiteFooter />
    </>
  );
}
