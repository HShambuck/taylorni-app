// src/pages/client/ShoppingCart.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  updateQuantity,
  removeItem,
  clearCart,
  initializeCart,
} from '@/store/slices/cartSlice';

// Constants
const SHIPPING_COST = 10;

// Empty Cart Component
const EmptyCart = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 sm:p-16 text-center">
    <div className="flex justify-center mb-6">
      <svg
        className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
      Your cart is empty
    </h2>
    <p className="text-gray-500 mb-6 sm:mb-8">
      Looks like you haven't added any items to your cart yet.
    </p>
    <Link
      to="/client/marketplace"
      className="inline-block px-6 sm:px-8 py-3 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium transition-colors"
    >
      Browse Products
    </Link>
  </div>
);

// Cart Item Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setLocalQuantity(value);
    if (value >= 1 && value <= 10) {
      onUpdateQuantity(item.id, value);
    }
  };

  const incrementQuantity = () => {
    if (localQuantity < 10) {
      const newQuantity = localQuantity + 1;
      setLocalQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <tr className="border-t border-gray-100">
      {/* Product Info */}
      <td className="py-4 px-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            {item.selectedSize && (
              <p className="text-xs sm:text-sm text-gray-500">
                Size: {item.selectedSize}
              </p>
            )}
            {item.selectedColor && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span>Color:</span>
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.selectedColor }}
                />
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Quantity */}
      <td className="py-4 px-3 sm:px-6">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <button
            onClick={decrementQuantity}
            disabled={localQuantity <= 1}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-purple-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={localQuantity}
            onChange={handleQuantityChange}
            className="w-10 sm:w-12 text-center border border-gray-200 rounded text-sm py-1"
            min="1"
            max="10"
          />
          <button
            onClick={incrementQuantity}
            disabled={localQuantity >= 10}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-purple-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-3 sm:px-6 text-center text-sm sm:text-base">
        ₵{item.price.toFixed(2)}
      </td>

      {/* Total */}
      <td className="py-4 px-3 sm:px-6 text-center font-medium text-sm sm:text-base">
        ₵{(item.quantity * item.price).toFixed(2)}
      </td>

      {/* Remove */}
      <td className="py-4 px-3 sm:px-6 text-center">
        <button
          onClick={() => onRemove(item.id)}
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

// Mobile Cart Item Component
const MobileCartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setLocalQuantity(value);
    if (value >= 1 && value <= 10) {
      onUpdateQuantity(item.id, value);
    }
  };

  const incrementQuantity = () => {
    if (localQuantity < 10) {
      const newQuantity = localQuantity + 1;
      setLocalQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const decrementQuantity = () => {
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
          {item.selectedSize && (
            <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize}</p>
          )}
          {item.selectedColor && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Color:</span>
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: item.selectedColor }}
              />
            </div>
          )}
          <p className="text-lg font-semibold text-purple-900 mt-2">
            ₵{item.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity and Remove */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={decrementQuantity}
            disabled={localQuantity <= 1}
            className="p-2 rounded-full hover:bg-gray-100 text-purple-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={localQuantity}
            onChange={handleQuantityChange}
            className="w-12 text-center border border-gray-200 rounded py-1"
            min="1"
            max="10"
          />
          <button
            onClick={incrementQuantity}
            disabled={localQuantity >= 10}
            className="p-2 rounded-full hover:bg-gray-100 text-purple-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

// Main Component
const ShoppingCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Initialize cart on mount
  useEffect(() => {
    dispatch(initializeCart());
  }, [dispatch]);

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  // Handlers
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      dispatch(clearCart());
      setIsCheckingOut(false);
      // Navigate to success page or show success message
      alert('Order placed successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-900">
            Your Shopping Cart
            {cartCount > 0 && (
              <span className="text-lg sm:text-xl text-gray-500 ml-2">
                ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
          <Link
            to="/client/marketplace"
            className="inline-flex items-center text-purple-900 hover:text-purple-700 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Cart Content */}
        {cartItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="py-4 px-6 text-left font-semibold">Product</th>
                    <th className="py-4 px-6 text-center font-semibold">Quantity</th>
                    <th className="py-4 px-6 text-center font-semibold">Price</th>
                    <th className="py-4 px-6 text-center font-semibold">Total</th>
                    <th className="py-4 px-6 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4">
              {cartItems.map((item) => (
                <MobileCartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 p-4 sm:p-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm sm:text-base text-gray-900">
                  <p>Subtotal:</p>
                  <p>₵{subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-900">
                  <p>Shipping:</p>
                  <p>₵{shipping.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t">
                  <p>Total:</p>
                  <p>₵{total.toFixed(2)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <button
                  onClick={handleClearCart}
                  className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
                    isCheckingOut
                      ? 'bg-purple-400 cursor-not-allowed'
                      : 'bg-purple-900 hover:bg-purple-800'
                  } text-white`}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;