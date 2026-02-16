// src/pages/Contact.jsx
import { useState } from "react";

// Social Media Icons
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-6 md:w-6 text-blue-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-6 md:w-6 text-pink-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-6 md:w-6 text-blue-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
  </svg>
);

const PinterestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-6 md:w-6 text-red-600"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 md:h-12 md:w-12 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

// Store Locations Data
const storeLocations = [
  {
    name: "Pistis Ghana",
    address: "Accra, Ghana",
    phone: "(+233) 555-277 5673",
  },
  {
    name: "Sima Brew",
    address: "Accra, Ghana - East Legon",
    phone: "(+233) 563 87492",
  },
];

// Social Links Data
const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: <FacebookIcon />,
    hoverColor: "hover:bg-blue-100",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: <InstagramIcon />,
    hoverColor: "hover:bg-pink-100",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <TwitterIcon />,
    hoverColor: "hover:bg-blue-100",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    icon: <PinterestIcon />,
    hoverColor: "hover:bg-red-100",
  },
];

const Contact = () => {
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Admin state (replace with actual auth logic)
  const [isAdmin] = useState(false);

  // Admin panel data
  const [adminData] = useState({
    pendingCount: 12,
    activeChats: 3,
    resolvedCount: 8,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission handler
  const submitForm = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    // Show submission notification
    alert("Thank you for your message! We will get back to you soon.");

    // Reset form
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  // Start chat handler
  const handleStartChat = () => {
    console.log("Starting chat...");
    // Add chat logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 md:py-12 lg:py-20">
        {/* Hero Section */}
        <section className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-3 md:mb-4">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto px-4">
            We're here to support your style and answer any questions. Let's
            create fashion magic together!
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div>
            {/* Contact Form Section */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8 animate-slideInLeft">
              <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-4">
                Contact Form
              </h2>
              <form onSubmit={submitForm}>
                <div className="mb-4 transition duration-300 hover:translate-x-1">
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    required
                  />
                </div>
                <div className="mb-4 transition duration-300 hover:translate-x-1">
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    required
                  />
                </div>
                <div className="mb-4 transition duration-300 hover:translate-x-1">
                  <label htmlFor="message" className="block text-gray-700 mb-2">
                    Message:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-200 transform hover:scale-105 active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </section>

            {/* Chatbot Section */}
            <section
              className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-slideInLeft"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-4">
                Live Chat
              </h2>
              <div className="border border-gray-300 rounded-lg p-4 h-36 md:h-48 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="text-amber-500 mb-2 animate-pulse">
                    <ChatIcon />
                  </div>
                  <p className="text-sm md:text-base text-gray-600">
                    Chat with our fashion experts
                  </p>
                  <button
                    onClick={handleStartChat}
                    className="mt-2 px-3 py-1 md:px-4 md:py-2 bg-amber-500 text-white text-sm md:text-base rounded-md hover:bg-amber-600 transition duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div>
            {/* Store Locations Section */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8 animate-slideInRight">
              <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-4">
                Our Stores
              </h2>
              <div className="space-y-4 md:space-y-6">
                {storeLocations.map((store, index) => (
                  <div
                    key={store.name}
                    className={`
                      transition duration-300 hover:bg-gray-50 hover:shadow-sm p-2 rounded-md
                      ${index < storeLocations.length - 1 ? "border-b border-gray-200 pb-4" : ""}
                    `}
                  >
                    <h3 className="text-lg md:text-xl font-semibold text-amber-500">
                      {store.name}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700">
                      {store.address}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                      Phone: {store.phone}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media Links Section */}
            <section
              className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-slideInRight"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-4">
                Follow Us
              </h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      p-2 md:p-3 bg-gray-100 rounded-full transition duration-300 
                      transform hover:scale-110 ${social.hoverColor}
                    `}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Administrator Panel Section */}
        {isAdmin && (
          <section
            className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-4 md:p-6 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-purple-900 mb-3 md:mb-4">
              Administrator Dashboard
            </h2>
            <p className="text-sm md:text-base text-gray-700">
              Manage customer inquiries, chat logs, and other support
              interactions.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
                <h3 className="font-semibold text-purple-900 text-sm md:text-base">
                  Pending Inquiries
                </h3>
                <p className="text-xl md:text-2xl font-bold text-amber-500">
                  {adminData.pendingCount}
                </p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
                <h3 className="font-semibold text-purple-900 text-sm md:text-base">
                  Active Chats
                </h3>
                <p className="text-xl md:text-2xl font-bold text-amber-500">
                  {adminData.activeChats}
                </p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg transition-all duration-300 hover:shadow-md hover:bg-gray-100">
                <h3 className="font-semibold text-purple-900 text-sm md:text-base">
                  Today's Resolved
                </h3>
                <p className="text-xl md:text-2xl font-bold text-amber-500">
                  {adminData.resolvedCount}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Contact;