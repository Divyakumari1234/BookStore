import { cartTotal } from "../utils/storage";

export default function PaymentPage({ cart, completePayment }) {
  const total = cartTotal(cart);

  const submitPayment = (event) => {
    event.preventDefault();
    completePayment();
  };

  return (
    <main className="mx-auto my-16 grid w-[min(1500px,calc(100%_-_56px))] grid-cols-[1fr_420px] gap-8 max-[980px]:grid-cols-1">
      <form className="rounded-lg border border-zinc-300 bg-white p-7 shadow-lg" onSubmit={submitPayment}>
        <p className="text-sm font-black text-ebookGreen">DEMO PAYMENT</p>
        <h1 className="mt-8 text-4xl font-black text-ebookDark">Complete your purchase</h1>
        <label className="mt-6 grid gap-2 text-lg font-bold text-slate-600">
          Email address
          <input
            className="h-14 min-w-0 rounded-lg border border-zinc-300 px-4 outline-none invalid:border-red-500 focus:border-ebookGreen"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@example.com"
            pattern="[^\s@]+@[^\s@]+\.com"
            title="Enter a valid email address, for example name@example.com"
            required
          />
        </label>
        <fieldset className="mt-6 grid gap-4 rounded-lg border border-zinc-300 p-5 text-lg font-bold text-slate-600">
          <legend className="px-2 text-ebookDark">Payment options</legend>
          <label><input className="mr-2 accent-ebookGreen" type="radio" name="pay" defaultChecked /> UPI</label>
          <label><input className="mr-2 accent-ebookGreen" type="radio" name="pay" /> Debit/Credit Card</label>
          <label><input className="mr-2 accent-ebookGreen" type="radio" name="pay" /> Net Banking</label>
        </fieldset>
        <button className="mt-6 inline-flex min-h-16 min-w-60 items-center justify-center rounded-2xl bg-ebookGreen px-6 text-center text-base font-black text-white shadow-[0_12px_0_#20d44a]" type="submit">Pay Now</button>
      </form>
      <aside className="h-max rounded-lg border border-zinc-300 bg-white p-7 shadow-lg">
        <h2 className="text-4xl font-black text-ebookDark">Order summary</h2>
        <p className="mt-5 flex justify-between gap-5 text-lg text-slate-800"><span>Total amount</span><strong>Rs. {total.payable}</strong></p>
        <p className="mt-5 text-lg text-slate-600">After demo payment, purchased e-books will appear inside My Library.</p>
      </aside>
    </main>
  );
}

