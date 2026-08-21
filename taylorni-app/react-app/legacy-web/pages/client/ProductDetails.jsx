// src/pages/client/ProductDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';

// Mock API - Replace with actual API calls
const mockAPI = {
  getProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Traditional Kente Cloth',
            description: 'Authentic handwoven Kente cloth featuring traditional Ashanti patterns. Perfect for special occasions and cultural celebrations. Each piece is unique and tells a story through its intricate patterns.',
            price: 450.00,
            image: '/images/kente-1.jpg',
            images: [
              '/images/kente-1.jpg',
              '/images/kente-2.jpg',
              '/images/kente-3.jpg',
              '/images/kente-4.jpg',
              '/images/kente-5.jpg',
            ],
            category: 'Traditional',
            rating: 4.8,
            reviews: 124,
            designerId: 1,
            availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
            availableColors: ['#8B4513', '#FFD700', '#228B22', '#000000'],
            materials: ['100% Cotton', 'Hand-dyed threads', 'Traditional weave'],
            careInstructions: ['Dry clean only', 'Store flat', 'Avoid direct sunlight', 'Iron on low heat'],
            reviewList: [
              { id: 1, user: { name: 'Kofi Mensah' }, rating: 5, comment: 'Absolutely beautiful craftsmanship!', date: '2025-01-15' },
              { id: 2, user: { name: 'Ama Serwaa' }, rating: 4, comment: 'Great quality, perfect for my wedding.', date: '2025-01-10' },
            ],
          },
          {
            id: 2,
            name: 'Modern African Print Dress',
            description: 'Contemporary dress featuring vibrant African prints. Flattering A-line silhouette suitable for both casual and formal occasions.',
            price: 280.00,
            image: '/images/dress-1.jpg',
            images: ['/images/dress-1.jpg'],
            category: 'Dresses',
            rating: 4.5,
            reviews: 89,
            designerId: 2,
            availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
            availableColors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            materials: ['Ankara fabric', 'Cotton lining'],
            careInstructions: ['Machine wash cold', 'Tumble dry low', 'Iron medium heat'],
            reviewList: [],
          },
        ]);
      }, 300);
    });
  },

  getDesigners: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, firstName: 'Kwame', lastName: 'Asante', specialty: 'Traditional Kente Weaving' },
          { id: 2, firstName: 'Akua', lastName: 'Mensah', specialty: 'Modern African Fashion' },
        ]);
      }, 200);
    });
  },
};

// Helper Functions
const getStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return { full: fullStars, half: hasHalfStar ? 1 : 0, empty: emptyStars };
};

// Star Icons
const StarIcon = ({ filled = true }) => (
  <svg
    className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRating = ({ rating }) => {
  const stars = getStarRating(rating);
  return (
    <div className="flex items-center">
      {[...Array(stars.full)].map((_, i) => (
        <StarIcon key={`full-${i}`} filled />
      ))}
      {stars.half > 0 && <StarIcon key="half" filled />}
      {[...Array(stars.empty)].map((_, i) => (
        <StarIcon key={`empty-${i}`} filled={false} />
      ))}
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-900" />
  </div>
);

// Not Found Component
const ProductNotFound = ({ onBack }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center px-4">
      <div className="mb-4">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
      <p className="text-gray-600 mb-6">
        The product you're looking for doesn't exist or may have been removed.
      </p>
      <button
        onClick={onBack}
        className="px-6 py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-colors"
      >
        Back to Marketplace
      </button>
    </div>
  </div>
);

// Main Component
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        
        const [products, designers] = await Promise.all([
          mockAPI.getProducts(),
          mockAPI.getDesigners(),
        ]);

        const foundProduct = products.find((p) => p.id.toString() === id.toString());

        if (foundProduct) {
          const designer = designers.find((d) => d.id === foundProduct.designerId);
          
          // Handle images
          const productImages = foundProduct.images?.length > 0 
            ? foundProduct.images 
            : [foundProduct.image];

          const enhancedProduct = {
            ...foundProduct,
            images: productImages,
            designerDetails: designer,
          };

          setProduct(enhancedProduct);
          setSelectedImage(productImages[0] || '');
          setSelectedSize(foundProduct.availableSizes?.[0] || '');
          
          if (foundProduct.availableColors?.length > 0) {
            setSelectedColor(foundProduct.availableColors[0]);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Handlers
  const increaseQuantity = () => {
    if (quantity < 10) setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      category: product.category,
      selectedSize,
      selectedColor,
      quantity,
    };
    
    dispatch(addItem(cartItem));
    setAddedToCart(true);
    
    // Reset notification after 3 seconds
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/client/cart');
  };

  const goToMarketplace = () => navigate('/client/marketplace');

  // Render states
  if (isLoading) return <LoadingSpinner />;
  if (!product) return <ProductNotFound onBack={goToMarketplace} />;

  return (
    <div className="bg-white min-h-screen">
      {/* Added to Cart Notification */}
      {addedToCart && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Added to cart!</span>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="mb-4">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`cursor-pointer border rounded-md overflow-hidden transition-all ${
                      selectedImage === image
                        ? 'border-purple-800 border-2 ring-2 ring-purple-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-14 sm:h-20 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4 flex-wrap gap-2">
              <StarRating rating={product.rating} />
              <span className="text-gray-600 text-sm">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-purple-800">
                ₵{product.price.toFixed(2)}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.availableSizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors text-sm sm:text-base ${
                        selectedSize === size
                          ? 'bg-purple-800 text-white border-purple-800'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.availableColors?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-purple-800 scale-110 ring-2 ring-purple-200'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= 10}
                  className="w-10 h-10 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-purple-800 text-white py-3 rounded-lg hover:bg-purple-900 active:bg-purple-950 transition-colors font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 border-2 border-purple-800 text-purple-800 py-3 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-colors font-medium"
              >
                Buy Now
              </button>
            </div>

            {/* Designer Info */}
            {product.designerDetails && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-3">Designer</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold">
                      {product.designerDetails.firstName?.charAt(0) || 'D'}
                      {product.designerDetails.lastName?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {product.designerDetails.firstName} {product.designerDetails.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {product.designerDetails.specialty || 'Fashion Designer'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 sm:mt-12">
          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex gap-4 sm:gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'details'
                    ? 'text-purple-800 border-b-2 border-purple-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-purple-800 border-b-2 border-purple-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({product.reviews || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6 pb-8">
            {activeTab === 'details' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Materials */}
                  {product.materials?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Materials</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Care Instructions */}
                  {product.careInstructions?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Care Instructions</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                
                {product.reviewList?.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviewList.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <span className="text-sm font-semibold text-gray-600">
                              {review.user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {review.user?.name || 'Anonymous'}
                            </h4>
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="h-4 w-4 text-yellow-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500">No reviews yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;