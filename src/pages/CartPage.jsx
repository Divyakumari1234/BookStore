import { useState } from "react";
import { coverSources } from "../data/catalog";
import { cartTotal } from "../utils/storage";
import PaymentSummary, { InfoBox } from "../components/PaymentSummary";
import CategoryDirectory from "../components/CategoryDirectory";
import SiteFooter from "../components/SiteFooter";

function CartCover({ book }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [missing, setMissing] = useState(false);
  const sources = coverSources(book);

  if (missing || !sources.length) return null;

  return (
    <img
      className={`${loaded ? "" : "invisible"} mx-auto h-32 w-20 object-cover`}
      src={sources[sourceIndex]}
      alt=""
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      onError={() => {
        if (sourceIndex < sources.length - 1) {
          setLoaded(false);
          setSourceIndex(sourceIndex + 1);
          return;
        }
        setMissing(true);
      }}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= 20 || event.currentTarget.naturalHeight <= 20) {
          if (sourceIndex < sources.length - 1) {
            setLoaded(false);
            setSourceIndex(sourceIndex + 1);
            return;
          }
          setMissing(true);
          return;
        }
        setLoaded(true);
      }}
    />
  );
}

export default function CartPage({ cart, removeFromCart }) {
  const total = cartTotal(cart);
  return (
    <main className="bg-zinc-100 py-6">
      <div className="mx-auto mb-3 grid w-[min(1080px,calc(100%_-_32px))] grid-cols-2 gap-5 text-center max-sm:grid-cols-1">
        <a className="text-2xl font-black text-green-700 underline">Books Cart View</a>
        <a className="text-2xl text-ebookDark underline">Package Books Cart View</a>
      </div>
      <section className="mx-auto mb-7 w-[min(1390px,calc(100%_-_32px))] overflow-x-auto rounded-md bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.18)] max-sm:p-3">
        <table className="w-full min-w-[920px] border-collapse text-center">
          <thead>
            <tr className="bg-amber-400 text-black">
              {["S.No.", "Image", "Title", "MRP (₹)", "Discount %", "Price (₹)", "Delete"].map((head) => (
                <th className="border border-slate-300 px-4 py-3 text-base font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr><td className="border border-slate-300 py-10 text-lg" colSpan="7">Your cart is empty.</td></tr>
            ) : cart.map((book, index) => (
              <tr key={book.id}>
                <td className="border border-slate-300 px-4 py-5 font-black">{index + 1}</td>
                <td className="border border-slate-300 px-4 py-3"><CartCover book={book} /></td>
                <td className="border border-slate-300 px-4 py-5"><strong>{book.title}</strong><span className="mx-auto mt-2 block w-max bg-amber-400 px-2 py-1 text-xs font-bold">Ebook</span></td>
                <td className="border border-slate-300 px-4 py-5 font-black">{book.price}</td>
                <td className="border border-slate-300 px-4 py-5 font-black">{book.discount}</td>
                <td className="border border-slate-300 px-4 py-5 font-black">{(book.price * 0.9).toFixed(2)}</td>
                <td className="border border-slate-300 px-4 py-5">
                  <button className="inline-grid h-9 w-9 place-items-center text-slate-950 hover:text-orange-600" onClick={() => removeFromCart(book.id)} title="Delete" type="button">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v5" />
                      <path d="M14 11v5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <PaymentSummary total={total} />
      <section className="mx-auto mb-9 grid w-[min(1230px,calc(100%_-_36px))] grid-cols-3 gap-8 max-[980px]:max-w-xl max-[980px]:grid-cols-1 max-sm:gap-5">
        <InfoBox title="Digital Content" text="You can access all ebooks instantly in your account after successful payment. There is no door delivery." />
        <InfoBox title="Secure Payment" text="100% secure demo checkout flow for student project presentation." />
        <InfoBox title="Contact" text="Email: support@ebooks.com or call 1111111111 [10AM to 8PM]" />
      </section>
      <CategoryDirectory />
      <SiteFooter />
    </main>
  );
}

