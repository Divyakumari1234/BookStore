export default function PaymentSummary({ total }) {
  const rows = [
    ["Total MRP", `${total.mrp} Rs.`],
    ["Discounted Price(incl. GST @ 5% on E books)", `${total.discounted} Rs.`],
    ["Coupon Discount", "0 Rs."],
    ["Total Saving", `${total.saving} Rs.`],
    ["Other Charges", `${total.charges} Rs.`],
    ["Amount Payable", `${total.payable} Rs.`],
  ];

  return (
    <section className="mx-auto mb-6 w-[min(1350px,calc(100%_-_32px))] rounded-md bg-white p-5 shadow-[0_2px_14px_rgba(0,0,0,0.18)]">
      <div className="border border-slate-300">
        <h3 className="flex items-center gap-2 border-b border-slate-200 p-3 text-xl font-bold text-ebookOrange">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="1.5" />
            <path d="M3 10h18" />
            <path d="M7 15h3" />
          </svg>
          Payment Summary
        </h3>
        {rows.map(([label, value]) => (
          <p className="flex justify-between gap-4 border-b border-slate-200 px-4 py-2 text-xl max-sm:text-base" key={label}>
            <span className={label === "Other Charges" || label === "Amount Payable" ? "font-black" : ""}>{label}</span>
            <strong className="shrink-0">{value}</strong>
          </p>
        ))}
        <div className="flex justify-end px-7 py-6 max-sm:justify-center">
          <a className="inline-flex min-h-20 min-w-60 items-center justify-center rounded-2xl bg-ebookGreen px-6 text-center text-base font-black text-white no-underline shadow-[0_12px_0_#20d44a]" href="#/payment">
            PROCEED TO<br />CHECKOUT
          </a>
        </div>
      </div>
    </section>
  );
}

export function InfoBox({ title, text }) {
  return (
    <article className="min-h-56 rounded-md border border-slate-300 bg-white p-5 text-center shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
      <div className="mx-auto grid h-14 w-14 place-items-center text-ebookOrange">
        <svg className="h-14 w-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="8" width="14" height="10" rx="1.5" />
          <path d="M7 8V6h12l2 8h-4" />
          <path d="M6 13h5" />
        </svg>
      </div>
      <h3 className="my-3 text-2xl font-medium text-ebookGreen">{title}</h3>
      <p className="text-base leading-relaxed text-black">{text}</p>
    </article>
  );
}
