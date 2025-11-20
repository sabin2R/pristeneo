export default function Footer() {
    return (
      <footer className="mt-16 border-t border-gray/10 bg-[--color-background]">
        <div className="container py-10 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 font-bold text-lg">
              <span className="size-2 rounded-full bg-mustard" />
              Pristeneo
            </div>
            <p className="mt-3 max-w-md opacity-80">
              Pure, cold-pressed mustard oil. From seed to seal—traceable, tested, and delicious.
            </p>
          </div>
  
          <nav>
            <h4 className="font-semibold">Explore</h4>
            <ul className="mt-3 space-y-2 opacity-90">
              <li><a href="/products" className="hover:text-mustard">Products</a></li>
              <li><a href="/process" className="hover:text-mustard">Process</a></li>
              <li><a href="/benefits" className="hover:text-mustard">Benefits</a></li>
              <li><a href="/about" className="hover:text-mustard">About</a></li>
              <li><a href="/contact" className="hover:text-mustard">Contact</a></li>
            </ul>
          </nav>
  
          <div>
            <h4 className="font-semibold">Contact</h4>
            <ul className="mt-3 space-y-2 opacity-90">
              <li>Email: <a href="mailto:pristeneo@gmail.com" className="hover:text-mustard">pristeneo@gmail.com</a></li>
              <li>Phone: <a href="tel:+9779824507783" className="hover:text-mustard">+977 9824507783</a></li>
              <li>Wholesale: <a href="/contact" className="hover:text-mustard">Become a distributor</a></li>
            </ul>
          </div>
        </div>
  
        <div className="border-t border-black/10">
          <div className="container py-4 text-sm opacity-70">
            © {new Date().getFullYear()} Pristeneo. All rights reserved.
          </div>
        </div>
      </footer>
    )
  }
  