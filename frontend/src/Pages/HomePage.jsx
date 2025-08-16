
import { motion } from "framer-motion";
import { CardCarousel } from "../components/ui/card-carousel.jsx"; // Skiper-UI importy
import { ShoppingCart, ArrowRight } from "lucide-react";

export default function HomePage() {
  const carouselImages = [
    { src: "/sh.jpeg", alt: "Stylish Product 1" },
    { src: "/hrx1.webp", alt: "Stylish Product 2" },
    { src: "/shoes.jpeg", alt: "Stylish Product 3" },
  ];

  const gallery = [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">ShopEase</h1>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </a>
          <a href="#gallery" className="text-gray-600 hover:text-gray-900">
            Gallery
          </a>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800">
            <ShoppingCart size={18} /> Cart
          </button>
        </div>
      </nav>

      {/* Hero + Carousel */}
      <section className="px-8 lg:px-16 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Discover <span className="text-indigo-600">Stylish</span> Trends
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Your one-stop destination for the latest fashion, electronics, and home essentials.
            </p>
            <div className="mt-6 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-full flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-200 text-gray-900 rounded-full"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Card Carousel from Skiper-UI */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 mt-10 lg:mt-0"
          >
            <CardCarousel
              images={carouselImages}
              autoplayDelay={2000}
              showPagination
              showNavigation
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section id="features" className="px-8 lg:px-16 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center mb-10">
          Why Shop With Us?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Free Shipping", desc: "On all orders above $50" },
            { title: "24/7 Support", desc: "Always here to help you" },
            { title: "Easy Returns", desc: "30-day money-back guarantee" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <h4 className="text-xl font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="px-8 lg:px-16 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((src, idx) => (
            <motion.img
              key={idx}
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="rounded-lg shadow-md w-full object-cover h-48"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 mt-auto">
        <div className="px-8 lg:px-16 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">ShopEase</h4>
            <p>Your favorite place for trendy fashion and electronics.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#gallery" className="hover:underline">Gallery</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 text-center py-4 text-sm">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
