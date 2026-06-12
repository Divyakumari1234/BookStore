import { categoryGroups } from "../data/catalog";

export default function CategoryDirectory({ setActiveCategory }) {
  const openCategory = (item) => {
    setTimeout(() => {
      setActiveCategory && setActiveCategory(item);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  };

  return (
    <section className="border-y border-ebookGreen bg-zinc-100 py-12 text-slate-400">
      <div className="mx-auto grid w-[min(1400px,calc(100%_-_32px))] grid-cols-4 gap-8 max-[980px]:grid-cols-2 max-sm:grid-cols-1 max-sm:justify-items-center max-sm:text-center">
        {categoryGroups.map((group) => (
          <div className="w-full rounded-md border border-transparent p-4 transition hover:border-zinc-200 hover:bg-white hover:shadow-sm" key={group.title}>
            <h3 className="mb-4 border-b border-zinc-200 pb-2 text-xl font-semibold text-slate-900">{group.title}</h3>
            {group.items.map((item) => (
              <a
                className="block rounded px-2 py-1 text-lg text-slate-400 no-underline transition hover:bg-emerald-50 hover:text-ebookGreen"
                href="#/home"
                key={item}
                onClick={() => openCategory(item)}
              >
                {item}
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

