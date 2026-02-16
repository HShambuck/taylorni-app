// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-500 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white animate-bounce">
            404
          </h1>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <div
              className="w-3 h-3 bg-amber-400 rounded-full animate-ping"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-3 h-3 bg-amber-400 rounded-full animate-ping"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            The page you're looking for seems to have wandered off the runway.
            Let's get you back to fashion!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn bg-amber-400 hover:bg-amber-500 text-gray-900 border-none font-semibold px-8 py-3 rounded-full transition-transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn bg-white/20 hover:bg-white/30 text-white border-white/30 font-semibold px-8 py-3 rounded-full transition-transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-8 text-white/60">
          <div className="text-center">
            <div className="text-2xl mb-2">👗</div>
            <p className="text-sm">Lost Design</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🧵</div>
            <p className="text-sm">Broken Thread</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">✂️</div>
            <p className="text-sm">Cut Link</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-white/60">
          <p className="mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about" className="hover:text-amber-400 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-amber-400 transition-colors">
              Contact
            </Link>
            <Link to="/client" className="hover:text-amber-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;