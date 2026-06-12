import { useEffect, useMemo, useState } from "react";
import { categoryGroups } from "../data/catalog";

export default function CategorySidebar({ activeCategory, setActiveCategory }) {
  const activeGroupTitle = useMemo(
    () => categoryGroups.find((group) => group.items.includes(activeCategory))?.title,
    [activeCategory]
  );
  const [openGroup, setOpenGroup] = useState(activeGroupTitle || "General");

  useEffect(() => {
    if (activeGroupTitle) setOpenGroup(activeGroupTitle);
  }, [activeGroupTitle]);

  return (
    <aside className="m-3 h-[650px] overflow-y-auto rounded border-r-2 border-ebookGreen bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.24)] max-[900px]:mx-auto max-[900px]:h-auto max-[900px]:max-h-[650px] max-[900px]:w-[min(calc(100%_-_24px),456px)]">
      <h2 className="mb-4 border-b-2 border-ebookGreen pb-2 text-center text-[26px] font-normal text-ebookGreen">
        Book Categories
      </h2>

      {categoryGroups.map((group) => {
        const isOpen = openGroup === group.title;

        return (
          <div className="mb-3" key={group.title}>
            <button
              className="mb-1 flex w-full items-center gap-5 py-1 text-left text-[21px] font-normal tracking-wide text-slate-900 hover:text-ebookGreen max-sm:text-[19px]"
              type="button"
              onClick={() => setOpenGroup(isOpen ? "" : group.title)}
              aria-expanded={isOpen}
            >
              <span className="w-5 text-center text-2xl font-black">{isOpen ? "-" : "+"}</span>
              <span>{group.title}</span>
            </button>

            {isOpen && (
              <div>
                {group.items.map((item) => (
                  <button
                    className={`block w-full px-10 py-[2px] text-left text-[20px] leading-8 max-sm:px-8 max-sm:text-[18px] ${
                      activeCategory === item
                        ? "bg-zinc-500 text-white"
                        : "bg-transparent text-slate-900 hover:text-ebookGreen"
                    }`}
                    key={item}
                    onClick={() => setActiveCategory(item)}
                    type="button"
                  >
                    &bull; {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
