import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import LibraryPage from "./pages/LibraryPage";
import ReaderPage from "./pages/ReaderPage";
import DetailPage from "./pages/DetailPage";
import { CART_KEY, CURRENT_BOOK_KEY, HISTORY_KEY, LIBRARY_KEY, booksByCategory, preloadBookCovers } from "./data/catalog";
import { readStorage, writeStorage } from "./utils/storage";

export default function App() {
  const [route, setRoute] = useState(location.hash.replace("#/", "") || "home");
  const [activeCategory, setActiveCategory] = useState("home");
  const [cart, setCart] = useState(() => readStorage(CART_KEY));
  const [library, setLibrary] = useState(() => readStorage(LIBRARY_KEY));
  const [history, setHistory] = useState(() => readStorage(HISTORY_KEY));
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onHash = () => setRoute(location.hash.replace("#/", "") || "home");
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => writeStorage(CART_KEY, cart), [cart]);
  useEffect(() => writeStorage(LIBRARY_KEY, library), [library]);
  useEffect(() => writeStorage(HISTORY_KEY, history), [history]);

  const allBooks = useMemo(() => Object.values(booksByCategory).flat(), []);
  const homeBooks = useMemo(() => Object.values(booksByCategory).map((books) => books[0]).slice(0, 8), []);
  const categoryBooks = activeCategory === "home" ? homeBooks : booksByCategory[activeCategory] || homeBooks;
  const visibleBooks = searchQuery ? searchResults : categoryBooks;

  useEffect(() => {
    Object.values(booksByCategory).forEach((books) => preloadBookCovers(books));
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 1800);
  };

  const addToCart = (book) => {
    if (cart.some((item) => item.id === book.id)) {
      showToast("Already added in cart");
      return;
    }
    setCart([...cart, book]);
    showToast("Book added to cart");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const searchBooks = (query, searchBy) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      showToast("Enter something to search");
      return;
    }

    const matches = allBooks.filter((book) => {
      if (searchBy === "author") return book.author.toLowerCase().includes(normalizedQuery);
      if (searchBy === "keywords") {
        return [
          book.title,
          book.author,
          book.category,
          book.description,
          book.language,
          book.isbn,
        ].some((value) => String(value).toLowerCase().includes(normalizedQuery));
      }
      return book.title.toLowerCase().includes(normalizedQuery);
    });

    const uniqueMatches = Array.from(new Map(matches.map((book) => [book.id, book])).values());
    setSearchResults(uniqueMatches);
    setSearchQuery(query.trim());
    location.hash = "#/home";
  };

  const selectCategory = (category) => {
    setSearchQuery("");
    setSearchResults([]);
    setActiveCategory(category);
  };

  const readBook = (book) => {
    localStorage.setItem(CURRENT_BOOK_KEY, JSON.stringify(book));
    location.hash = "#/reader";
  };

  const completePayment = () => {
    const purchased = cart.length ? cart : [allBooks[6]];
    const purchaseId = Date.now();
    const purchasedBooks = purchased.map((book, index) => ({
      ...book,
      libraryId: `${purchaseId}-${index}-${book.id}`,
      purchasedAt: purchaseId,
    }));
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const records = purchasedBooks.map((book, index) => ({
      id: `${purchaseId}-${index}`,
      books: book.title,
      items: [book],
      date,
      amount: book.price === 0 ? 0 : Math.round(Number(book.price || 0) * 0.9),
      status: "Paid",
    }));
    setLibrary([...purchasedBooks, ...library]);
    setHistory([...records, ...history]);
    setCart([]);
    showToast("Payment successful. E-book added to My Library");
    setTimeout(() => (location.hash = "#/library"), 700);
  };

  return (
    <>
      <Header cartCount={cart.length} onSearch={searchBooks} />
      {route === "home" && (
        <HomePage
          activeCategory={activeCategory}
          setActiveCategory={selectCategory}
          books={visibleBooks}
          addToCart={addToCart}
          cart={cart}
          searchQuery={searchQuery}
        />
      )}
      {route === "cart" && <CartPage cart={cart} removeFromCart={removeFromCart} />}
      {route === "payment" && <PaymentPage cart={cart} completePayment={completePayment} />}
      {route === "library" && <LibraryPage library={library} history={history} readBook={readBook} allBooks={allBooks} />}
      {route === "reader" && <ReaderPage />}
      {route === "detail" && <DetailPage book={allBooks[0]} addToCart={addToCart} />}
      {toast && <div className="fixed bottom-6 left-1/2 z-50 w-max max-w-[calc(100%_-_32px)] -translate-x-1/2 rounded-lg bg-ebookGreen px-6 py-3 text-center text-lg font-black text-white shadow-xl">{toast}</div>}
    </>
  );
}

