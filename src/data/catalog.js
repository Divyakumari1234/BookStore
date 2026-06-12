export const CART_KEY = "ebooksCart";
export const LIBRARY_KEY = "ebooksLibrary";
export const HISTORY_KEY = "ebooksPurchaseHistory";
export const CURRENT_BOOK_KEY = "ebooksCurrentBook";

export const cover = (isbn, size = "M") => `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`;
export const titleCover = (title, size = "M") => `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-${size}.jpg?default=false`;
const coverOverrides = {
  "Indian Polity": ["https://img.thecdn.in/333220/SKU-0045_0-1709272450725.jpg?format=webp&width=600"],
  "Political Theory": ["https://www.brightlawhouse.com/image/428579539-OP%20GAUBA.jpg"],
  "An Introduction to Political Theory": [
    "https://www.brightlawhouse.com/image/428579539-OP%20GAUBA.jpg",
    "https://upsciastirupatibooks.in/wp-content/uploads/2025/05/political-theory-800x923.png",
    "https://pragationline.com/wp-content/uploads/2025/01/IMG_0002-4.jpg",
  ],
  "A Little Princess": ["https://covers.openlibrary.org/b/id/2328315-M.jpg"],
  "Pride and Prejudice": ["https://covers.openlibrary.org/b/id/14348537-M.jpg"],
  "Jane Eyre": ["https://covers.openlibrary.org/b/id/8235363-M.jpg"],
  "The Great Gatsby": ["https://covers.openlibrary.org/b/id/10590366-M.jpg"],
  "The Prince": ["https://covers.openlibrary.org/b/id/12726168-M.jpg"],
  "On Liberty": ["https://covers.openlibrary.org/b/id/966821-M.jpg"],
  "Democracy in America": ["https://covers.openlibrary.org/b/id/15186498-M.jpg"],
  "The Politics": ["https://covers.openlibrary.org/b/id/1277085-M.jpg"],
};
export const coverSources = (book) => Array.from(new Set([
  ...(coverOverrides[book.title] || []),
  ...(book.image ? [book.image] : []),
  ...(book.isbn ? [cover(book.isbn, "M"), cover(book.isbn, "L")] : []),
  ...(book.title ? [titleCover(book.title, "M")] : []),
].filter(Boolean)));
const loadedCoverCache = new Map();
export const loadBookCover = (book) => {
  if (loadedCoverCache.has(book.id)) return Promise.resolve(loadedCoverCache.get(book.id));
  const sources = coverSources(book);

  const trySource = (index = 0) =>
    new Promise((resolve) => {
      if (!sources[index]) {
        resolve("");
        return;
      }
      const image = new Image();
      image.decoding = "sync";
      image.onload = () => {
        if (image.naturalWidth > 20 && image.naturalHeight > 20) {
          loadedCoverCache.set(book.id, sources[index]);
          resolve(sources[index]);
          return;
        }
        resolve(trySource(index + 1));
      };
      image.onerror = () => resolve(trySource(index + 1));
      image.src = sources[index];
    });

  return trySource();
};
export const preloadBookCovers = async (books) => {
  const entries = await Promise.all(books.map(async (book) => [book.id, await loadBookCover(book)]));
  return new Map(entries.filter(([, source]) => source));
};
export const realCoverImage = (book) => {
  if (book.isbn) return cover(book.isbn);
  if (book.image?.includes("covers.openlibrary.org") && !book.image.includes("default=false")) {
    return `${book.image}${book.image.includes("?") ? "&" : "?"}default=false`;
  }
  return book.image;
};
export const fixCover = (event) => {
  const image = event.currentTarget;
  if (image.dataset.coverRetry !== "large" && image.src.includes("-M.jpg")) {
    image.dataset.coverRetry = "large";
    image.src = image.src.replace("-M.jpg", "-L.jpg");
    return;
  }
  event.currentTarget.onerror = null;
  image.hidden = true;
  image.removeAttribute("src");
};

export const categoryGroups = [
  { title: "Higher Education", items: ["Physics", "Chemistry", "Mathematics", "Political Science"] },
  { title: "Professional Courses", items: ["Engineering", "Management", "Computers", "BBA"] },
  { title: "Competitions", items: ["Banking", "UPSC", "IIT-JEE", "NEET/AIPMT", "SSC"] },
  { title: "General", items: ["Fiction", "Non-Fiction", "Story Books", "Personality Development", "Career Development", "Magazines"] },
];

const rawCatalog = {
  Physics: [
    ["Fundamentals of Physics", "Halliday, Resnick, Walker", 799, "English", 5, "9781118230718"],
    ["University Physics", "Young and Freedman", 899, "English", 4, "9780321973610"],
    ["The Feynman Lectures on Physics", "Richard P. Feynman", 699, "English", 5, "9780465024933"],
    ["Six Easy Pieces", "Richard P. Feynman", 299, "English", 5, "9780465025275"],
    ["Brief History of Time", "Stephen Hawking", 349, "English", 5, "9780553380163"],
    ["QED", "Richard P. Feynman", 249, "English", 4, "9780691024172"],
    ["Cosmos", "Carl Sagan", 399, "English", 5, "9780345539434"],
    ["Astrophysics for People in a Hurry", "Neil deGrasse Tyson", 299, "English", 4, "9780393609394"],
  ],
  Chemistry: [
    ["Organic Chemistry", "Paula Yurkanis Bruice", 749, "English", 5, "9780321803221"],
    ["Chemistry: The Central Science", "Brown, LeMay, Bursten", 799, "English", 4, "9780321910417"],
    ["Physical Chemistry", "Peter Atkins", 899, "English", 4, "9780198769866"],
    ["Inorganic Chemistry", "Housecroft and Sharpe", 849, "English", 4, "9781292134147"],
    ["Biochemistry", "Jeremy M. Berg", 999, "English", 5, "9781319114671"],
    ["Morrison and Boyd Organic Chemistry", "Morrison and Boyd", 599, "English", 4, "9788131704813"],
    ["Concise Inorganic Chemistry", "J. D. Lee", 499, "English", 5, "9788126515547"],
    ["Problems in Physical Chemistry", "Narendra Awasthi", 399, "English", 4, "9789386323132"],
  ],
  Mathematics: [
    ["Higher Engineering Mathematics", "B. S. Grewal", 599, "English", 5, "9788193328491"],
    ["Calculus", "James Stewart", 799, "English", 5, "9781285740621"],
    ["Linear Algebra Done Right", "Sheldon Axler", 499, "English", 4, "9783319110790"],
    ["Discrete Mathematics", "Kenneth Rosen", 699, "English", 4, "9781259676512"],
    ["Introduction to Algorithms", "Cormen, Leiserson, Rivest", 999, "English", 5, "9780262033848"],
    ["Concrete Mathematics", "Graham, Knuth, Patashnik", 699, "English", 5, "9780201558029"],
    ["Fast Track Objective Arithmetic", "Rajesh Verma", 399, "English", 5, "9789351760146"],
    ["Quantitative Aptitude", "R. S. Aggarwal", 349, "English", 4, "9789352534029"],
  ],
  "Political Science": [
    ["Indian Polity", "M. Laxmikanth", 350, "English", 5, "9789355325341"],
    ["Political Theory", "O. P. Gauba", 349, "English", 4, "9789389538472"],
    ["An Introduction to Political Theory", "O. P. Gauba", 329, "English", 4, "9789389538465"],
    ["The Republic", "Plato", 199, "English", 5, "9780140455113"],
    ["The Prince", "Niccolo Machiavelli", 149, "English", 4, "9780140449150"],
    ["On Liberty", "John Stuart Mill", 129, "English", 4, "9780140432077"],
    ["Democracy in America", "Alexis de Tocqueville", 299, "English", 4, "9780140447606"],
    ["The Politics", "Aristotle", 199, "English", 5, "9780140444216"],
  ],
  Engineering: [
    ["Engineering Mechanics", "S. S. Bhavikatti", 449, "English", 4, "9788120342361"],
    ["Strength of Materials", "R. K. Bansal", 499, "English", 4, "9788131808146"],
    ["Thermodynamics", "P. K. Nag", 599, "English", 5, "9789339204044"],
    ["Fluid Mechanics", "R. K. Bansal", 529, "English", 4, "9788131808153"],
    ["Electrical Machines", "P. S. Bimbhra", 549, "English", 4, "9788174091734"],
    ["Digital Electronics", "Morris Mano", 499, "English", 5, "9780132774208"],
    ["Control Systems Engineering", "Nagrath and Gopal", 599, "English", 4, "9788120349933"],
    ["Signals and Systems", "Oppenheim and Willsky", 699, "English", 5, "9789332550230"],
  ],
  Management: [
    ["Principles of Management", "Peter Drucker", 349, "English", 5, "9780060878979"],
    ["The Effective Executive", "Peter Drucker", 299, "English", 5, "9780060833459"],
    ["Good to Great", "Jim Collins", 399, "English", 5, "9780066620992"],
    ["The Lean Startup", "Eric Ries", 399, "English", 4, "9780307887894"],
    ["Blue Ocean Strategy", "Kim and Mauborgne", 449, "English", 4, "9781625274496"],
    ["Marketing Management", "Philip Kotler", 899, "English", 5, "9780133856460"],
    ["Competitive Strategy", "Michael Porter", 499, "English", 4, "9780684841489"],
    ["High Output Management", "Andrew Grove", 349, "English", 5, "9780679762881"],
  ],
  Computers: [
    ["Clean Code", "Robert C. Martin", 599, "English", 5, "9780132350884"],
    ["Eloquent JavaScript", "Marijn Haverbeke", 299, "English", 5, "9781593279509"],
    ["You Don't Know JS Yet", "Kyle Simpson", 349, "English", 4, "9781491904244"],
    ["Design Patterns", "Gamma, Helm, Johnson", 699, "English", 5, "9780201633610"],
    ["Computer Networks", "Andrew S. Tanenbaum", 799, "English", 4, "9780132126953"],
    ["Database System Concepts", "Silberschatz", 899, "English", 4, "9780073523323"],
    ["Operating System Concepts", "Silberschatz", 899, "English", 5, "9781118063330"],
    ["Code Complete", "Steve McConnell", 699, "English", 5, "9780735619678"],
  ],
  BBA: [
    ["Business Studies", "C. B. Gupta", 299, "English", 4, "9788121903479"],
    ["Business Communication", "Meenakshi Raman", 349, "English", 4, "9780199457069"],
    ["Financial Accounting", "T. S. Grewal", 399, "English", 5, "9789354746611"],
    ["Business Economics", "H. L. Ahuja", 399, "English", 4, "9789352718597"],
    ["Organizational Behaviour", "Stephen Robbins", 549, "English", 4, "9789352862276"],
    ["Business Law", "N. D. Kapoor", 329, "English", 4, "9789352535385"],
    ["Cost Accounting", "M. N. Arora", 449, "English", 4, "9789327260045"],
    ["Principles of Marketing", "Philip Kotler", 599, "English", 5, "9780134492513"],
  ],
  Banking: [
    ["Banking Awareness", "Arihant Experts", 249, "English", 4, "9789325795419"],
    ["Objective Banking", "Disha Experts", 299, "English", 4, "9789389645378"],
    ["Bank PO Solved Papers", "Kiran Prakashan", 349, "English", 4, "9789389310016"],
    ["Quantitative Aptitude", "R. S. Aggarwal", 349, "English", 5, "9789352534029"],
    ["Verbal and Non-Verbal Reasoning", "R. S. Aggarwal", 399, "English", 4, "9788121929066"],
    ["English for Bank Exams", "S. C. Gupta", 249, "English", 4, "9789351768449"],
    ["Computer Awareness", "Arihant Experts", 199, "English", 4, "9789325790469"],
    ["General Awareness", "Lucent", 299, "English", 4, "9789384761547"],
  ],
  UPSC: [
    ["Indian Polity", "M. Laxmikanth", 350, "English", 5, "9789355325341"],
    ["India's Struggle for Independence", "Bipan Chandra", 399, "English", 5, "9780140107814"],
    ["Certificate Physical Geography", "G. C. Leong", 249, "English", 5, "9780195628166"],
    ["Indian Economy", "Ramesh Singh", 499, "English", 4, "9789355324573"],
    ["Ancient and Medieval India", "Poonam Dalal Dahiya", 449, "English", 4, "9789355321138"],
    ["Environment", "Shankar IAS Academy", 399, "English", 5, "9789389311211"],
    ["Ethics Integrity and Aptitude", "Lexicon", 349, "English", 4, "9788193292341"],
    ["India Year Book", "Publication Division", 299, "English", 4, "9788123030296"],
  ],
  "IIT-JEE": [
    ["Concepts of Physics Vol. 1", "H. C. Verma", 399, "English", 5, "9788177091878"],
    ["Concepts of Physics Vol. 2", "H. C. Verma", 399, "English", 5, "9788177092325"],
    ["Problems in General Physics", "I. E. Irodov", 349, "English", 5, "9788123903041"],
    ["Organic Chemistry", "Morrison and Boyd", 599, "English", 4, "9788131704813"],
    ["Problems in Physical Chemistry", "Narendra Awasthi", 399, "English", 4, "9789386323132"],
    ["Objective Mathematics", "R. D. Sharma", 699, "English", 4, "9789388704458"],
    ["Cengage Coordinate Geometry", "G. Tewani", 499, "English", 4, "9788131521533"],
    ["Arihant Algebra", "Arihant Experts", 449, "English", 4, "9789324196170"],
  ],
  "NEET/AIPMT": [
    ["Objective Biology", "Dinesh", 599, "English", 4, "9789388418782"],
    ["Trueman's Biology Vol. 1", "M. P. Tyagi", 549, "English", 4, "9788190458924"],
    ["Trueman's Biology Vol. 2", "M. P. Tyagi", 549, "English", 4, "9788190458931"],
    ["MTG NCERT Fingertips Biology", "MTG Editorial", 399, "English", 5, "9789388893565"],
    ["Concepts of Physics Vol. 1", "H. C. Verma", 399, "English", 5, "9788177091878"],
    ["Objective NCERT Chemistry", "MTG Editorial", 399, "English", 4, "9789388893572"],
    ["NEET 35 Years Papers", "Arihant Experts", 499, "English", 4, "9789325796355"],
    ["Medical Entrance Biology", "Pradeep", 599, "English", 4, "9788176710916"],
  ],
  SSC: [
    ["Fast Track Objective Arithmetic", "Rajesh Verma", 399, "English", 5, "9789351760146"],
    ["A Modern Approach to Verbal Reasoning", "R. S. Aggarwal", 399, "English", 4, "9788121905510"],
    ["Objective General English", "S. P. Bakshi", 299, "English", 4, "9789351768449"],
    ["Lucent General Knowledge", "Dr. Binay Karna", 299, "English", 4, "9789384761547"],
    ["SSC Mathematics", "Rakesh Yadav", 349, "English", 4, "9788190458900"],
    ["SSC English", "Kiran Prakashan", 299, "English", 4, "9789389310023"],
    ["SSC CGL Solved Papers", "Arihant Experts", 399, "English", 4, "9789325796461"],
    ["Computer Awareness", "Arihant Experts", 199, "English", 4, "9789325790469"],
  ],
  Fiction: [
    ["A Little Princess", "Frances Hodgson Burnett", 0, "English", 5, "9780141333106"],
    ["Twenty Thousand Leagues Under the Sea", "Jules Verne", 0, "English", 5, "9780141321042"],
    ["A Tale of Two Cities", "Charles Dickens", 0, "English", 5, "9780141439600"],
    ["Alice in Wonderland", "Lewis Carroll", 0, "English", 5, "9780141321073"],
    ["Pride and Prejudice", "Jane Austen", 149, "English", 5, "9780141439518"],
    ["Jane Eyre", "Charlotte Bronte", 149, "English", 5, "9780141441146"],
    ["The Great Gatsby", "F. Scott Fitzgerald", 149, "English", 4, "9780743273565"],
    ["The Alchemist", "Paulo Coelho", 249, "English", 5, "9780062315007"],
  ],
  "Non-Fiction": [
    ["Sapiens", "Yuval Noah Harari", 499, "English", 5, "9780062316097"],
    ["Atomic Habits", "James Clear", 399, "English", 5, "9780735211292"],
    ["Deep Work", "Cal Newport", 349, "English", 5, "9781455586691"],
    ["Ikigai", "Hector Garcia", 299, "English", 4, "9780143130727"],
    ["Thinking, Fast and Slow", "Daniel Kahneman", 499, "English", 5, "9780374533557"],
    ["The Psychology of Money", "Morgan Housel", 299, "English", 5, "9780857197689"],
    ["Outliers", "Malcolm Gladwell", 299, "English", 4, "9780316017930"],
    ["The 7 Habits", "Stephen Covey", 399, "English", 5, "9781982137274"],
  ],
  "Story Books": [
    ["The Jungle Book", "Rudyard Kipling", 149, "English", 5, "9780141325293"],
    ["Gulliver's Travels", "Jonathan Swift", 149, "English", 4, "9780141439495"],
    ["Treasure Island", "Robert Louis Stevenson", 149, "English", 5, "9780141321004"],
    ["Black Beauty", "Anna Sewell", 129, "English", 4, "9780141321035"],
    ["Heidi", "Johanna Spyri", 129, "English", 4, "9780141322568"],
    ["The Secret Garden", "Frances Burnett", 149, "English", 5, "9780141321066"],
    ["Peter Pan", "J. M. Barrie", 149, "English", 4, "9780141322575"],
    ["Robin Hood", "Howard Pyle", 149, "English", 4, "9780451529840"],
  ],
  "Personality Development": [
    ["How to Win Friends", "Dale Carnegie", 249, "English", 5, "9780671027032"],
    ["The Power of Positive Thinking", "Norman Peale", 249, "English", 4, "9780743234801"],
    ["Mindset", "Carol Dweck", 349, "English", 5, "9780345472328"],
    ["Grit", "Angela Duckworth", 349, "English", 5, "9781501111105"],
    ["The Confidence Code", "Kay and Shipman", 299, "English", 4, "9780062230638"],
    ["Awaken the Giant Within", "Tony Robbins", 399, "English", 4, "9780671791544"],
    ["Drive", "Daniel Pink", 299, "English", 4, "9781594484803"],
    ["The Magic of Thinking Big", "David Schwartz", 249, "English", 4, "9780671646783"],
  ],
  "Career Development": [
    ["What Color Is Your Parachute?", "Richard Bolles", 399, "English", 4, "9781984861207"],
    ["Designing Your Life", "Bill Burnett", 349, "English", 5, "9781101875322"],
    ["So Good They Can't Ignore You", "Cal Newport", 349, "English", 5, "9781455509126"],
    ["The Start-up of You", "Reid Hoffman", 299, "English", 4, "9780307888907"],
    ["Cracking the Coding Interview", "Gayle Laakmann", 699, "English", 5, "9780984782857"],
    ["Lean In", "Sheryl Sandberg", 299, "English", 4, "9780385349949"],
    ["The First 90 Days", "Michael Watkins", 399, "English", 4, "9781422188613"],
    ["Do What You Are", "Tieger and Barron", 299, "English", 4, "9780316167260"],
  ],
  Magazines: [
    ["Competition Success Review", "CSR Editorial", 149, "English", 4, "9788190458917"],
    ["Pratiyogita Darpan", "PD Editorial", 129, "English", 4, "9788189301569"],
    ["Yojana", "Publication Division", 99, "English", 4, "9788123029566"],
    ["Kurukshetra", "Publication Division", 99, "English", 4, "9788123029573"],
    ["Frontline", "The Hindu Group", 149, "English", 4, "9788184757309"],
    ["India Today", "India Today Group", 149, "English", 4, "9788172234980"],
    ["National Geographic Kids Almanac", "National Geographic", 299, "English", 5, "9781426375323"],
    ["Science Reporter", "CSIR-NIScPR", 99, "English", 4, "9788123029580"],
  ],
};

export const booksByCategory = Object.fromEntries(
  Object.entries(rawCatalog).map(([category, books]) => [
    category,
    books.map(([title, author, price, language, rating, isbn], index) => ({
      id: `${category}-${index}-${isbn}`,
      category,
      title,
      author,
      price,
      language,
      rating,
      isbn,
      image: cover(isbn),
      discount: price === 0 ? 0 : 10,
      description: `${title} is a focused e-book for students who want clean notes, quick revision and exam-ready practice.`,
    })),
  ])
);
