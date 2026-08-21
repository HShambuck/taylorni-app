// src/pages/client/ClientMarketplace.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectCartItems } from "@/store/slices/cartSlice";

// Mock API for products and designers
const mockAPI = {
  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: "Classic Kente Dress",
            description: "Beautiful handwoven Kente fabric dress with modern styling",
            price: 450.00,
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
            category: "Dresses",
            designerId: 1,
            designerName: "Akua Designs",
            rating: 4.8,
            reviews: 124,
            featured: true,
            bestSeller: true,
          },
          {
            id: 2,
            name: "Modern Ankara Jacket",
            description: "Contemporary Ankara print jacket perfect for any occasion",
            price: 280.00,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
            category: "Jackets",
            designerId: 2,
            designerName: "Kofi Couture",
            rating: 4.5,
            reviews: 89,
            featured: true,
            bestSeller: false,
          },
          {
            id: 3,
            name: "Executive Business Suit",
            description: "Tailored business suit with African-inspired details",
            price: 650.00,
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
            category: "Suits",
            designerId: 1,
            designerName: "Akua Designs",
            rating: 4.9,
            reviews: 203,
            featured: false,
            bestSeller: true,
          },
          {
            id: 4,
            name: "Casual Friday Shirt",
            description: "Comfortable casual shirt with subtle African patterns",
            price: 120.00,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
            category: "Casual",
            designerId: 3,
            designerName: "Ama Fashion",
            rating: 4.3,
            reviews: 67,
            featured: false,
            bestSeller: false,
          },
          {
            id: 5,
            name: "Wedding Kente Set",
            description: "Elegant Kente outfit perfect for traditional weddings",
            price: 850.00,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
            category: "Dresses",
            designerId: 2,
            designerName: "Kofi Couture",
            rating: 5.0,
            reviews: 56,
            featured: true,
            bestSeller: true,
          },
          {
            id: 6,
            name: "Summer Ankara Dress",
            description: "Light and breezy Ankara dress for summer occasions",
            price: 320.00,
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80",
            category: "Dresses",
            designerId: 3,
            designerName: "Ama Fashion",
            rating: 4.6,
            reviews: 92,
            featured: false,
            bestSeller: false,
          },
          {
            id: 7,
            name: "Traditional Agbada",
            description: "Majestic flowing Agbada for special ceremonies",
            price: 550.00,
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80",
            category: "Suits",
            designerId: 1,
            designerName: "Akua Designs",
            rating: 4.7,
            reviews: 145,
            featured: true,
            bestSeller: false,
          },
          {
            id: 8,
            name: "Denim Fusion Jacket",
            description: "Modern denim jacket with African fabric accents",
            price: 220.00,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
            category: "Jackets",
            designerId: 2,
            designerName: "Kofi Couture",
            rating: 4.4,
            reviews: 78,
            featured: false,
            bestSeller: true,
          },
        ]);
      }, 500);
    });
  },

  getDesigners: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            firstName: "Akua",
            lastName: "Mensah",
            rating: 4.9,
            ordersCompleted: 234,
            image: null,
          },
          {
            id: 2,
            firstName: "Kofi",
            lastName: "Asante",
            rating: 4.7,
            ordersCompleted: 189,
            image: null,
          },
          {
            id: 3,
            firstName: "Ama",
            lastName: "Owusu",
            rating: 4.5,
            ordersCompleted: 156,
            image: null,
          },
        ]);
      }, 300);
    });
  },
};

// Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover object-center"
        />
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition-colors">
          <svg className="h-5 w-5 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {product.bestSeller && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
            Best Seller
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <span className="text-purple-900 font-bold whitespace-nowrap ml-2">
            ₵{product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center mb-2">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            by <span className="text-purple-900 font-medium">{product.designerName}</span>
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => onAddToCart(product)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add to cart"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            <button
              onClick={() => onViewDetails(product.id)}
              className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Designer Card Component
const DesignerCard = ({ designer, isSelected, onClick }) => {
  const initials = `${designer.firstName.charAt(0)}${designer.lastName.charAt(0)}`;

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-purple-100" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mr-3">
        <span className="text-sm font-medium text-purple-800">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {designer.firstName} {designer.lastName}
        </p>
        <div className="flex items-center">
          <svg className="h-3 w-3 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs text-gray-500 ml-1">
            {designer.rating} ({designer.ordersCompleted})
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ClientMarketplace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, designersData] = await Promise.all([
          mockAPI.getProducts(),
          mockAPI.getDesigners(),
        ]);
        setProducts(productsData);
        setDesigners(designersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Enhanced products with designer details
  const enhancedProducts = useMemo(() => {
    return products.map((product) => {
      const designer = designers.find((d) => d.id === product.designerId) || {};
      return {
        ...product,
        designerDetails: designer,
        designerFullName: `${designer.firstName || ""} ${designer.lastName || ""}`.trim() || product.designerName,
      };
    });
  }, [products, designers]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return enhancedProducts.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !product.name.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query) &&
          !product.designerName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (product.price < selectedPriceRange.min || product.price > selectedPriceRange.max) {
        return false;
      }

      // Rating filter
      if (product.rating < minRating) {
        return false;
      }

      // Designer filter
      if (selectedDesigner && product.designerId !== selectedDesigner) {
        return false;
      }

      return true;
    });
  }, [enhancedProducts, searchQuery, selectedCategory, selectedPriceRange, minRating, selectedDesigner]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "featured":
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      case "bestSellers":
        return sorted.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      case "priceHigh":
        return sorted.sort((a, b) => b.price - a.price);
      case "priceLow":
        return sorted.sort((a, b) => a.price - b.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Featured products for hero
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.featured).slice(0, 3);
  }, [products]);

  // Price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  // Handlers
  const handleAddToCart = (product) => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
  };

  const handleViewDetails = (productId) => {
    navigate(`/client/product/${productId}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedDesigner(null);
    setSelectedPriceRange({ min: 0, max: 10000 });
    setSortBy("featured");
    setMinRating(0);
    setCurrentPage(1);
  };

  const categories = ["Dresses", "Jackets", "Suits", "Casual"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Shop Unique Fashion Designs
              </h1>
              <p className="text-lg text-purple-100 mb-6">
                Find the perfect outfit for any occasion or request a custom design that expresses your unique style.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button className="px-6 py-3 bg-white text-purple-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Explore Collections
                </button>
                <button
                  onClick={() => navigate("/client/custom-order")}
                  className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Request Custom
                </button>
              </div>
            </div>

            {featuredProducts.length > 0 && (
              <div className="lg:w-1/2 grid grid-cols-2 gap-3 sm:gap-4">
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform ${
                      index === 0 ? "col-span-2 h-40 sm:h-48" : "h-32 sm:h-40"
                    }`}
                    onClick={() => handleViewDetails(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                      <p className="text-white font-semibold text-sm sm:text-base truncate">
                        {product.name}
                      </p>
                      <p className="text-white/80 text-xs sm:text-sm">
                        by {product.designerName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? "bg-purple-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(selectedCategory === category ? "" : category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-purple-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-purple-900">{sortedProducts.length}</p>
            <p className="text-xs text-gray-500">Available for purchase</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Products in Cart</p>
            <p className="text-2xl font-bold text-purple-900">{cartItems.length}</p>
            <p className="text-xs text-gray-500">Ready for checkout</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Price Range</p>
            <p className="text-2xl font-bold text-purple-900">
              ₵{priceRange.min} - ₵{priceRange.max}
            </p>
            <p className="text-xs text-gray-500">Min and max prices</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white rounded-lg shadow text-gray-700 font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters Sidebar */}
          <aside className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-purple-900 text-sm hover:underline"
                >
                  Reset all
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={selectedPriceRange.min}
                    onChange={(e) => {
                      setSelectedPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }));
                      setCurrentPage(1);
                    }}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={selectedPriceRange.max}
                    onChange={(e) => {
                      setSelectedPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }));
                      setCurrentPage(1);
                    }}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4, 0].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => {
                          setMinRating(rating);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 text-purple-900 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {rating === 0 ? "Show all" : `${rating}+ stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Designers */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Featured Designers</h4>
                <div className="space-y-2">
                  {designers.map((designer) => (
                    <DesignerCard
                      key={designer.id}
                      designer={designer}
                      isSelected={selectedDesigner === designer.id}
                      onClick={() => {
                        setSelectedDesigner(selectedDesigner === designer.id ? null : designer.id);
                        setCurrentPage(1);
                      }}
                    />
                  ))}
                </div>
                {selectedDesigner && (
                  <button
                    onClick={() => setSelectedDesigner(null)}
                    className="text-purple-900 text-sm mt-3 hover:underline"
                  >
                    Clear designer filter
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product Listings */}
          <section className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {sortedProducts.length} {sortedProducts.length === 1 ? "Product" : "Products"}
                  {selectedCategory && ` in ${selectedCategory}`}
                </h2>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Sort:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="bestSellers">Best Sellers</option>
                    <option value="newest">Newest</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No products found</p>
                  <button
                    onClick={resetFilters}
                    className="text-purple-900 font-medium hover:underline"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of{" "}
                      {sortedProducts.length} products
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Per page:</label>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {[6, 9, 12, 24].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      ←
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === i + 1
                            ? "bg-purple-900 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ClientMarketplace;