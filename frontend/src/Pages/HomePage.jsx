import CategoryItem from "@/components/CategoryItem"; 
import { Link } from "react-router-dom";
import { ArrowRight, Star, Facebook, Twitter, Instagram } from "lucide-react"; 


const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
];

const featuredProducts = [
  { id: 1, name: "Eco-Friendly Denim Jeans", price: 79.99, rating: 5, reviewCount: 120, imageUrl: "/jeans.jpg" },
  { id: 2, name: "Organic Cotton Tee", price: 29.99, rating: 4, reviewCount: 88, imageUrl: "/tshirts.jpg" },
  { id: 3, name: "Vegan Leather Sneakers", price: 120.00, rating: 5, reviewCount: 210, imageUrl: "/shoes.jpg" },
  { id: 4, name: "Recycled Material Jacket", price: 149.99, rating: 4, reviewCount: 45, imageUrl: "/jackets.jpg" },
];

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:border-emerald-800">
      <div className="relative overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
        <div className="absolute top-0 left-0 m-3 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">New</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">{product.name}</h3>
        <p className="text-xl font-bold text-emerald-400 mt-2">${product.price}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
            ))}
          </div>
          <span className="text-gray-400 text-sm ml-2">({product.reviewCount} reviews)</span>
        </div>
      </div>
    </Link>
  );
}

function AppFooter() {
  return (
    <footer className="bg-gray-950/80 backdrop-blur-md text-gray-400 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link to='/' className='text-3xl font-bold text-emerald-400'>
              ShopEase
            </Link>
            <p className="mt-4 text-sm">Eco-friendly fashion for a sustainable future.</p>
          </div>
          {/* Shop Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/jeans" className="hover:text-emerald-400 transition-colors">Jeans</Link></li>
              <li><Link to="/t-shirts" className="hover:text-emerald-400 transition-colors">T-shirts</Link></li>
              <li><Link to="/shoes" className="hover:text-emerald-400 transition-colors">Shoes</Link></li>
              <li><Link to="/jackets" className="hover:text-emerald-400 transition-colors">Jackets</Link></li>
            </ul>
          </div>
          {/* About Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">About</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/sustainability" className="hover:text-emerald-400 transition-colors">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
          {/* Support Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-emerald-400 transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>
          {/* Social Column */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook size={24} /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter size={24} /></a>
              <a href="#" className="hover:text-emerald-400 transition-colors"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080808]">
      <main className="flex-grow">
        {/* Background Dotted Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-30" style={{
          backgroundImage: `radial-gradient(#ffffff22 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
        }} />

        <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] text-center overflow-hidden px-4 py-16"> {/* Height adjust ki gayi */}
          
          {/* Giant background text */}
          <span className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 text-[12rem] sm:text-[20rem] font-extrabold text-gray-800 opacity-40 select-none z-0">SHOP</span> {/* Text opacity aur color adjust kiya */}
          <span className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 text-[12rem] sm:text-[20rem] font-extrabold text-gray-800 opacity-40 select-none z-0">EASE</span>

          {/* Centered Model Image aur Text Group */}
          <div className="relative z-20 flex flex-col items-center">
            {/* <img 
              src="/hero-model.png" 
              alt="Fashion Model" 
              className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" // Increased shadow for better integration
            /> */}
            {/* ShopEase Branding ko image ke neeche add kiya */}
            <h2 className="text-6xl md:text-8xl font-extrabold text-white mt-8 mb-4">
              Shop<span className="text-emerald-400">Ease</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-md mb-8">
              Your destination for sustainable and stylish fashion.
            </p>
            <Link
              to="/products"
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-base rounded-lg shadow-lg shadow-emerald-500/30 transition-all duration-300 ease-in-out hover:bg-emerald-700 hover:shadow-emerald-500/50 hover:scale-105"
            >
              Explore Now
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
            </Link>
          </div>
          
          {/* Scroll Down prompt */}
          {/* <div className="absolute bottom-10 left-10 z-20 hidden sm:flex items-center space-x-2 text-gray-400">
             <div className="w-10 h-px bg-gray-400"></div>
             <span>Scroll Down</span>
          </div> */}
        </section>

        {/* --- 2. FEATURED PRODUCTS SECTION --- */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-center text-4xl sm:text-5xl font-bold text-white mb-4">
            Trending <span className="text-emerald-400">Now</span>
          </h2>
          <p className="text-center text-lg text-gray-400 mb-12">
            Check out our most popular and best-selling items this week.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>

        {/* --- 3. CATEGORY GRID SECTION --- */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-center text-4xl sm:text-5xl font-bold text-white mb-4">
            Shop by <span className="text-emerald-400">Category</span>
          </h2>
          <p className="text-center text-lg text-gray-400 mb-12">
            Find exactly what you're looking for in our curated collections.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <AppFooter />
      
    </div>
  );
}