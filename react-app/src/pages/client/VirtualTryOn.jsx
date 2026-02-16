// src/pages/client/VirtualTryOn.jsx
import { useState, useEffect, useRef } from 'react';

// Loading Skeleton Component
const AvatarSkeleton = () => (
  <div className="w-full h-96 sm:h-[600px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
      <p className="text-gray-500">Loading Avatar Creator...</p>
    </div>
  </div>
);

// Avatar Display Component
const AvatarDisplay = ({ avatarUrl, onTryOutfit }) => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg overflow-hidden animate-fade-in">
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-4 text-center">
        Your Customized Avatar
      </h2>
      
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={avatarUrl}
              alt="Ready Player Me Avatar"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          {/* Decorative gradient overlay on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onTryOutfit}
          className="px-6 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 active:bg-purple-950 transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          Try Outfit on Avatar
        </button>
        <a
          href={avatarUrl}
          download="my-avatar.glb"
          className="px-6 py-3 border-2 border-purple-900 text-purple-900 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
        >
          Download Avatar
        </a>
      </div>
    </div>
  </div>
);

// Main Component
const VirtualTryOn = () => {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://readyplayer.me/avatar?frameApi';
    iframe.className = 'w-full h-96 sm:h-[600px] rounded-lg border-0';
    iframe.allow = 'camera; microphone';
    iframe.title = 'Ready Player Me Avatar Creator';

    // Handle iframe load
    iframe.onload = () => {
      if (mounted) {
        setIsLoading(false);
        // Subscribe to avatar export events
        try {
          iframe.contentWindow?.postMessage(
            {
              target: 'readyplayerme',
              type: 'subscribe',
              eventName: 'v1.avatar.exported',
            },
            '*'
          );
        } catch (err) {
          console.error('Failed to subscribe to avatar events:', err);
          setError('Failed to initialize avatar creator');
        }
      }
    };

    // Handle iframe error
    iframe.onerror = () => {
      if (mounted) {
        setIsLoading(false);
        setError('Failed to load avatar creator');
      }
    };

    // Add iframe to container
    if (containerRef.current) {
      containerRef.current.appendChild(iframe);
      iframeRef.current = iframe;
    }

    // Listen for messages from Ready Player Me
    const handleMessage = (event) => {
      // Security check - only accept messages from Ready Player Me
      if (event.origin !== 'https://readyplayer.me') return;

      const { source, eventName, data } = event.data || {};

      if (source === 'readyplayerme') {
        switch (eventName) {
          case 'v1.avatar.exported':
            if (mounted && data?.url) {
              setAvatarUrl(data.url);
              console.log('Avatar exported successfully:', data.url);
            }
            break;
          case 'v1.frame.ready':
            console.log('Ready Player Me frame is ready');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      mounted = false;
      window.removeEventListener('message', handleMessage);
      if (iframeRef.current && containerRef.current?.contains(iframeRef.current)) {
        containerRef.current.removeChild(iframeRef.current);
      }
    };
  }, []);

  const handleTryOutfit = () => {
    // Navigate to marketplace or open outfit selection modal
    console.log('Try outfit clicked with avatar:', avatarUrl);
    alert('This feature will allow you to try different outfits on your avatar!');
    // You can implement actual outfit trying logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl sm:text-5xl" role="img" aria-label="Sunglasses">
                🕶️
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Virtual Try-On
              </h1>
            </div>
            <p className="text-purple-100 text-sm sm:text-base">
              Customize your avatar and try on our latest collections
            </p>
          </div>

          {/* Avatar Creator Container */}
          <div className="p-4 sm:p-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-red-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="relative">
                {isLoading && <AvatarSkeleton />}
                <div
                  ref={containerRef}
                  className={`rounded-lg overflow-hidden border border-gray-200 ${
                    isLoading ? 'hidden' : 'block'
                  }`}
                />
              </div>
            )}

            {/* Instructions */}
            {!error && (
              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  How it works:
                </h3>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>Create your personalized avatar using the editor above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>Customize your avatar's appearance, hairstyle, and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Click "Done" when you're happy with your avatar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>Try on different outfits from our collection</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Display Avatar when available */}
        {avatarUrl && (
          <AvatarDisplay avatarUrl={avatarUrl} onTryOutfit={handleTryOutfit} />
        )}

        {/* Features Grid */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-3xl mb-2">👔</div>
            <h3 className="font-semibold text-gray-900 mb-1">Try Outfits</h3>
            <p className="text-sm text-gray-600">
              See how different styles look on you
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-3xl mb-2">📏</div>
            <h3 className="font-semibold text-gray-900 mb-1">Perfect Fit</h3>
            <p className="text-sm text-gray-600">
              Visualize how clothes will fit your body
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-1">Mix & Match</h3>
            <p className="text-sm text-gray-600">
              Create unique combinations effortlessly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;