// src/views/LandingPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useIntersectionObserver,
  useStaggeredAnimation,
} from "@/hooks/useIntersectionObserver";

// Import data
import features from "@/data/landingPage/features";
import steps from "@/data/landingPage/steps";
import testimonials from "@/data/landingPage/testimonials";

// Import assets
import heroBg from "@/assets/hero-bg.png";
import aboutSec from "@/assets/about-sec.jpg";

// Hero Section Component
const HeroSection = ({ isVisible }) => {
  const hero = {
    title: "Your Fashion Way",
    description:
      "Track your orders, document measurements, and try on outfits — all in one place.",
    buttonText: "Get Started",
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-0" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-16 flex items-center min-h-screen">
        <div className="w-full md:w-3/4 lg:w-1/2 z-10 my-auto">
          <h1
            className={`
              text-3xl sm:text-4xl lg:text-7xl font-bold text-purple-300 mb-4 
              transition-all duration-1000
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
            `}
          >
            {hero.title}
          </h1>
          <p
            className={`
              text-lg sm:text-xl lg:text-4xl font-semibold text-white mb-8 
              transition-all duration-1000 delay-300
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
            `}
          >
            {hero.description}
          </p>
          <button
            className={`
              border-none bg-amber-400 hover:bg-amber-300 text-white 
              px-4 sm:px-6 py-3 sm:py-5 rounded-md font-semibold 
              text-base sm:text-lg lg:text-xl transition-all duration-500 
              delay-600 hover:scale-105
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            {hero.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  const about = {
    title: "Revolutionizing Fashion with Technology",
    description:
      "Taylorni bridges the gap between designers and clients, making custom fashion seamless and transparent. From order tracking and body documentation to a virtual try-on experience, we bring innovation to every step of the fashion process.",
    buttonText: "Learn more",
  };

  return (
    <section ref={ref} className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2
          className={`
            text-2xl sm:text-3xl font-bold text-amber-500 text-center 
            mb-8 md:mb-12 relative transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
          `}
        >
          About Us
          <span
            className={`
              absolute bottom-0 left-1/2 transform -translate-x-1/2 
              h-1 bg-amber-500 mt-2 transition-all duration-1000 delay-300
              ${isVisible ? "w-24" : "w-0"}
            `}
          />
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          <div
            className={`
              w-full lg:w-1/2 transition-all duration-1000 delay-300
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}
            `}
          >
            <img
              src={aboutSec}
              alt="about us"
              className="w-full h-full rounded-lg shadow-md"
            />
          </div>
          <div
            className={`
              w-full lg:w-1/2 transition-all duration-1000 delay-500
              ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}
            `}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 mt-4 lg:mt-0">
              {about.title}
            </h3>
            <p className="text-gray-600 mb-6">{about.description}</p>
            <Link
              to="/about"
              className="btn bg-amber-400 border-none hover:bg-amber-300 text-white px-4 py-2 rounded-md hover:scale-105 transition duration-300 inline-block"
            >
              {about.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const visibleFeatures = useStaggeredAnimation(isVisible, features.length, 150);

  return (
    <section className="bg-gradient-to-r from-purple-900 to-amber-500 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 md:mb-12 relative">
          Key Features
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 sm:w-24 bg-amber-500 mt-2" />
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-700
                ${
                  visibleFeatures.includes(index)
                    ? "opacity-100 translate-y-0 hover:shadow-lg hover:-translate-y-2"
                    : "opacity-0 translate-y-16"
                }
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-purple-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Steps Section Component
const StepsSection = ({ title, steps, direction = "left" }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const visibleSteps = useStaggeredAnimation(isVisible, steps.length, 200);

  const translateClass =
    direction === "left" ? "-translate-x-16" : "translate-x-16";

  return (
    <div ref={ref} className="w-full lg:w-1/2">
      <h3 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-4 md:mb-6">
        {title}
      </h3>
      <div className="space-y-4 sm:space-y-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`
              flex items-start transition-all duration-700
              ${
                visibleSteps.includes(index)
                  ? "opacity-100 translate-x-0"
                  : `opacity-0 ${translateClass}`
              }
            `}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center mr-3 sm:mr-4">
              <span className="font-bold text-purple-800 text-sm sm:text-base">
                {index + 1}
              </span>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                {step.title}
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// How It Works Section Component
const HowItWorksSection = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 text-center mb-2 sm:mb-4">
          How It Works
        </h2>
        <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
          Our simple process makes custom fashion accessible to everyone
        </p>

        <div className="flex flex-col lg:flex-row gap-8 mb-8 md:mb-12">
          <StepsSection
            title="For Clients"
            steps={steps.client}
            direction="left"
          />
          <StepsSection
            title="For Designers"
            steps={steps.designer}
            direction="right"
          />
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const visibleTestimonials = useStaggeredAnimation(
    isVisible,
    testimonials.length,
    150
  );

  return (
    <section className="bg-gray-100 py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 text-center mb-8 md:mb-12 relative">
          What Our Users Say
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 sm:w-24 bg-amber-500 mt-2" />
        </h2>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`
                bg-white p-4 sm:p-6 rounded-lg shadow-md transition-all duration-700
                ${
                  visibleTestimonials.includes(index)
                    ? "opacity-100 translate-y-0 hover:shadow-lg hover:-translate-y-2"
                    : "opacity-0 translate-y-16"
                }
              `}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full overflow-hidden mr-3 sm:mr-4">
                  <img
                    src={testimonial.avatar || `/api/placeholder/${50 + index}/${50 + index}`}
                    alt={`${testimonial.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm sm:text-base">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section ref={ref} className="bg-purple-800 py-12 md:py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 text-center">
        <h2
          className={`
            text-2xl sm:text-3xl font-bold mb-4 transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          Ready to Transform Your Fashion Experience?
        </h2>
        <p
          className={`
            text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto transition-all 
            duration-700 delay-300 text-sm sm:text-base
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          Join thousands of designers and clients who are revolutionizing the
          custom fashion industry.
        </p>
        <button
          className={`
            bg-amber-400 hover:bg-amber-300 text-gray-900 px-6 sm:px-8 
            py-2 sm:py-3 rounded-md font-semibold text-base sm:text-lg 
            transition-all duration-700 delay-600 hover:scale-110
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          Sign Up for Free
        </button>
      </div>
    </section>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  // Set hero as visible after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHeroVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <HeroSection isVisible={isHeroVisible} />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
};

export default LandingPage;