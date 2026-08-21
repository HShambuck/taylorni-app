// src/pages/About.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Import assets
import aboutBg from "@/assets/about-bg.jpg";
import aboutMish from "@/assets/about-mission.jpg";
import aboutStory from "@/assets/about-story.png";

// Social Icons
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Value Card Data
const values = [
  {
    title: "Innovation",
    description: "Pushing the boundaries of fashion technology.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "Customer-Centricity",
    description: "Ensuring an effortless and enjoyable experience for both designers and clients.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    title: "Collaboration",
    description: "Connecting designers, businesses, and fashion enthusiasts in a unified space.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
  },
  {
    title: "Sustainability",
    description: "Promoting ethical and efficient fashion production through digital solutions.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.565M6 12.5V10a2 2 0 10-4 0v2.5"
      />
    ),
  },
];

// Team Members Data
const teamMembers = [
  {
    name: "Ruth Asiedua Nyarko",
    role: "GENERAL MANAGER",
    description:
      "The strategic brain of Taylorni, handling marketing, research, and business operations. Her expertise in market analysis and brand development ensures that Taylorni reaches the right audience and meets the industry's demands.",
    image: null,
  },
  {
    name: "Halifax Shambuck Yeboah",
    role: "CHIEF TECHNOLOGY OFFICER",
    description:
      "The tech mastermind behind Taylorni, responsible for programming and software development. With a strong passion for innovation, he ensures the platform is efficient, user-friendly, and future-proof.",
    image: null,
  },
];

// Custom hook for animation on scroll
const useScrollAnimation = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    const animatedElements = document.querySelectorAll(
      ".fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .scale-in"
    );

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
};

// Value Card Component
const ValueCard = ({ title, description, icon, delay = 0 }) => (
  <div
    className="bg-white border border-amber-200 rounded-lg p-4 text-center value-card fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 icon-pulse">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-amber-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
    </div>
    <h4 className="font-bold text-gray-800 py-2">{title}</h4>
    <p className="text-gray-700">{description}</p>
  </div>
);

// Team Card Component
const TeamCard = ({ member, animationClass }) => (
  <div
    className={`w-full md:w-1/2 max-w-md mx-auto border border-amber-200 rounded-lg p-6 md:p-8 text-center team-card ${animationClass}`}
  >
    <div className="flex justify-center mb-6">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden profile-pic bg-gray-200">
        {member.image && (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
      {member.name}
    </h3>
    <p className="text-amber-500 font-medium uppercase tracking-wider mb-4">
      {member.role}
    </p>
    <p className="text-gray-700 mb-6">{member.description}</p>
    <div className="flex justify-center space-x-4">
      <a
        href="#"
        className="text-gray-900 hover:text-purple-800 social-icon transition-transform"
      >
        <FacebookIcon />
      </a>
      <a
        href="#"
        className="text-gray-900 hover:text-purple-800 social-icon transition-transform"
      >
        <LinkedInIcon />
      </a>
    </div>
  </div>
);

const About = () => {
  useScrollAnimation();

  return (
    <main id="about" className="pb-16 bg-white">
      {/* Hero */}
      <section className="container mx-auto lg:flex items-center justify-center gap-5 py-8 md:py-12 lg:py-16 px-4 md:px-8 lg:px-20">
        <div className="lg:flex-1 fade-in mb-8 lg:mb-0">
          <h1 className="text-2xl md:text-3xl lg:text-7xl font-bold text-amber-500 text-center lg:text-start mb-6 lg:mb-12">
            About Taylorni
          </h1>
          <p className="text-gray-700 text-base md:text-lg mb-8">
            Taylorni is a digital fashion platform revolutionizing how designers
            and clients interact. We provide seamless custom orders, ready-made
            outfits, and virtual try-ons, blending fashion with technology.
          </p>
        </div>
        <div className="lg:flex-1 scale-in">
          <img
            src={aboutBg}
            alt="About Taylorni"
            className="w-full h-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-purple-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-20">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8">
            <div className="w-full lg:flex-1 slide-in-left">
              <img
                src={aboutMish}
                alt="Fashion workspace"
                className="rounded-lg shadow-lg w-full hover-lift"
              />
            </div>
            <div className="w-full lg:flex-1 lg:pl-12 slide-in-right">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4 md:mb-6">
                Our Mission: Helping Millions Grow Better
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                We aim to empower fashion designers and customers by providing
                an intuitive digital space where creativity meets convenience.
                By integrating smart technology with traditional tailoring, we
                ensure that clients receive quality garments that fit perfectly
                while enabling designers to manage their businesses efficiently.
              </p>
              <p className="text-base md:text-lg text-gray-700">
                We believe not just in growing bigger, but in growing better.
                And growing better means aligning the success of your own
                business with the success of your customers. Win-win!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-20">
          <div className="max-w-4xl mx-auto text-center slide-in-up">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4 md:mb-6">
              Our Vision
            </h2>
            <p className="text-base md:text-lg text-gray-700">
              To become the leading digital hub for fashion customization, where
              technology-driven solutions make fashion more accessible,
              personalized, and sustainable.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:flex-1 pb-8 lg:pb-0 lg:pr-12 slide-in-left">
              <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-4 md:mb-6">
                Our Story
              </h2>
              <p className="text-base md:text-lg text-gray-700 mb-4 md:mb-6">
                Taylorni began as a simple idea between two junior students at{" "}
                <span className="font-bold">Palm University College</span>
                —combining technology and fashion to make custom design more
                accessible. With Halifax leading software development and Ruth
                driving marketing and research, we are building a platform that
                streamlines the fashion experience for both designers and
                clients.
              </p>
              <p className="text-base md:text-lg text-gray-700">
                Though we're a startup still in its early stages, our passion
                and dedication push us to keep learning, improving, and turning
                Taylorni into something truly impactful.
              </p>
            </div>
            <div className="w-full lg:flex-1 slide-in-right">
              <img
                src={aboutStory}
                alt="Founders"
                className="rounded-lg shadow-lg w-full hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-12 pt-5 px-4 md:px-8 lg:px-20">
        <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-8 md:mb-12 text-center fade-in">
          Our Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((value, index) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              icon={value.icon}
              delay={index * 0.2}
            />
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-20">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-500 mb-8 md:mb-12 text-center fade-in">
            Meet The Team
          </h2>

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {teamMembers.map((member, index) => (
              <TeamCard
                key={member.name}
                member={member}
                animationClass={index === 0 ? "slide-in-left" : "slide-in-right"}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-purple-900 to-amber-500 py-8 md:py-12 mx-4 md:mx-8 lg:mx-20 rounded-xl text-center shadow-lg cta-section">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 px-4">
          Join <span className="italic">Taylorni</span> and experience the
          future of fashion. 🚀
        </h3>
        <button className="btn btn-lg bg-white border-none text-purple-900 hover:bg-gray-100 font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg shadow-md transition duration-300 pulse-btn">
          Sign up today!
        </button>
      </section>
    </main>
  );
};

export default About;