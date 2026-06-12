export default function SiteFooter() {
  return (
    <footer className="grid w-full grid-cols-2 gap-8 overflow-hidden bg-ebookGreen px-[7%] py-8 text-white max-sm:grid-cols-1 max-sm:px-5 max-sm:text-center">
      <div>
        <h3 className="text-3xl font-black">E-Books</h3>
        <p className="mt-2 text-lg">Exam focused e-books, online reading and instant digital access for students.</p>
      </div>
      <div>
        <h4 className="text-xl font-black">Support</h4>
        <p>Email: support@ebooks.com</p>
        <p>Call: 1111111111</p>
      </div>
    </footer>
  );
}
