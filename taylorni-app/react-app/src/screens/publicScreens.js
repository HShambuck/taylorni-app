import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import features from "../data/landingPage/features";
import steps from "../data/landingPage/steps";
import testimonials from "../data/landingPage/testimonials";
import heroBg from "../assets/hero-bg.png";
import aboutSec from "../assets/about-sec.jpg";
import aboutBg from "../assets/about-bg.jpg";
import aboutMission from "../assets/about-mission.jpg";
import aboutStory from "../assets/about-story.png";
import { login, signup, clearError, selectAuth } from "../store/slices/authSlice";

// Import African Print Image
import africanPrintImage from "../assets/African-print.png";
import africanPrintAltImage from "../assets/African-print-alt.jpg";

// ============================================
// COLOR THEME
// ============================================

const colors = {
  primary: "#FFD700",
  secondary: "#228B22",
  accent: "#FF8C00",
  
  bgPrimary: "#0A0A0A",
  bgSecondary: "#141414",
  bgCard: "#1A1A1A",
  bgElevated: "#222222",
  
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassLight: "rgba(255, 255, 255, 0.04)",
  glassMedium: "rgba(255, 255, 255, 0.06)",
  
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.4)",
  textAccent: "#FFD700",
  
  shadow: "rgba(0, 0, 0, 0.5)",
};

const ONBOARDING_KEY = "@taylorni_has_launched_v2";
const africanPrintPatterns = [africanPrintImage];
const getCardPrint = (index = 0) =>
  africanPrintPatterns[Math.abs(index) % africanPrintPatterns.length];
const valuesCardAccentOrder = [
  "accent-top",
  "accent-left",
  "accent-right",
  "accent-bottom",
];
const getValuesCardVariant = (index = 0) =>
  valuesCardAccentOrder[Math.abs(index) % valuesCardAccentOrder.length];
const aboutCardAccentOrder = [
  "accent-top",
  "accent-left",
  "accent-right",
  "accent-bottom",
  "accent-corner",
  "accent-frame",
];
const getAboutCardVariant = (index = 0) =>
  aboutCardAccentOrder[Math.abs(index) % aboutCardAccentOrder.length];
const loginBrandFontFamily = Platform.select({
  ios: "Lucida Handwriting",
  android: "cursive",
  web: "Lucida Handwriting",
  default: "cursive",
});

// ============================================
// DATA
// ============================================

const aboutValues = [
  { title: "Innovation", description: "Pushing the boundaries of fashion technology.", iconName: "lightbulb-outline" },
  { title: "Customer-Centricity", description: "Effortless experience for designers and clients.", iconName: "account-heart-outline" },
  { title: "Collaboration", description: "Connecting creatives and customers in one workflow.", iconName: "account-multiple-outline" },
  { title: "Sustainability", description: "Promoting efficient and ethical production.", iconName: "leaf" },
];

const contactStores = [
  { name: "Pistis Ghana", address: "Accra, Ghana", phone: "(+233) 555-277 5673" },
  { name: "Sima Brew", address: "Accra, Ghana - East Legon", phone: "(+233) 563 87492" },
];

const socials = [
  { name: "Facebook", iconName: "facebook" },
  { name: "Instagram", iconName: "instagram" },
  { name: "Twitter", iconName: "twitter" },
  { name: "Pinterest", iconName: "pinterest" },
];

// ============================================
// PROFESSIONAL CARD COMPONENT
// ============================================

const ProCard = ({
  children,
  style,
  variant = "default", // "default", "accent-left", "accent-right", "accent-top", "accent-bottom", "accent-corner", "accent-frame", "accent-diagonal"
  accentWidth = 5,
  accentInset = 0,
  printSource = africanPrintImage,
  surface = "dark", // "dark" | "light"
  cardRadius = 20,
  glass = false,
}) => {
  const isLightSurface = surface === "light";
  const innerCardRadius = Math.max(cardRadius - 4, 0);

  const renderAccent = () => {
    switch (variant) {
      case "accent-left":
        return (
          <Image
            source={printSource}
            style={[
              styles.accentLeft,
              { width: accentWidth },
              glass && styles.accentGlass,
            ]}
            resizeMode="cover"
          />
        );
      case "accent-top":
        return (
          <Image
            source={printSource}
            style={[
              styles.accentTop,
              { height: accentWidth },
              glass && styles.accentGlass,
            ]}
            resizeMode="cover"
          />
        );
      case "accent-right":
        return (
          <Image
            source={printSource}
            style={[
              styles.accentRight,
              { width: accentWidth },
              glass && styles.accentGlass,
            ]}
            resizeMode="cover"
          />
        );
      case "accent-bottom":
        return (
          <Image
            source={printSource}
            style={[
              styles.accentBottom,
              { height: accentWidth },
              glass && styles.accentGlass,
            ]}
            resizeMode="cover"
          />
        );
      case "accent-corner":
        return (
          <>
            <View style={styles.cornerTopLeft}>
              <Image
                source={printSource}
                style={[styles.cornerImageH, glass && styles.accentGlass]}
                resizeMode="cover"
              />
              <Image
                source={printSource}
                style={[styles.cornerImageV, glass && styles.accentGlass]}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cornerBottomRight}>
              <Image
                source={printSource}
                style={[styles.cornerImageH, glass && styles.accentGlass]}
                resizeMode="cover"
              />
              <Image
                source={printSource}
                style={[styles.cornerImageV, glass && styles.accentGlass]}
                resizeMode="cover"
              />
            </View>
          </>
        );
      case "accent-frame":
        return (
          <>
            <Image
              source={printSource}
              style={[
                styles.accentTop,
                { height: accentWidth, top: accentInset, left: accentInset, right: accentInset },
                glass && styles.accentGlass,
              ]}
              resizeMode="cover"
            />
            <Image
              source={printSource}
              style={[
                styles.accentBottom,
                { height: accentWidth, bottom: accentInset, left: accentInset, right: accentInset },
                glass && styles.accentGlass,
              ]}
              resizeMode="cover"
            />
            <Image
              source={printSource}
              style={[
                styles.accentLeftFrame,
                {
                  width: accentWidth,
                  left: accentInset,
                  top: accentWidth + accentInset,
                  bottom: accentWidth + accentInset,
                },
                glass && styles.accentGlass,
              ]}
              resizeMode="cover"
            />
            <Image
              source={printSource}
              style={[
                styles.accentRightFrame,
                {
                  width: accentWidth,
                  right: accentInset,
                  top: accentWidth + accentInset,
                  bottom: accentWidth + accentInset,
                },
                glass && styles.accentGlass,
              ]}
              resizeMode="cover"
            />
          </>
        );
      case "accent-diagonal":
        return (
          <View style={styles.diagonalAccent}>
            <Image
              source={printSource}
              style={[styles.diagonalImage, glass && styles.accentGlass]}
              resizeMode="cover"
            />
          </View>
        );
      default:
        return null;
    }
  };

  const getContentMargin = () => {
    switch (variant) {
      case "accent-left":
        return { marginLeft: accentWidth };
      case "accent-top":
        return { marginTop: accentWidth };
      case "accent-right":
        return { marginRight: accentWidth };
      case "accent-bottom":
        return { marginBottom: accentWidth };
      case "accent-frame":
        return { margin: accentWidth + accentInset };
      default:
        return {};
    }
  };

  return (
    <View
      style={[
        styles.proCard,
        isLightSurface && styles.proCardLight,
        glass && styles.proCardGlass,
        { borderRadius: cardRadius },
        style,
      ]}
    >
      {renderAccent()}
      <View style={[styles.proCardContent, getContentMargin()]}>
        {Platform.OS === "ios" ? (
          <BlurView
            intensity={isLightSurface ? 18 : glass ? 36 : 25}
            tint={isLightSurface ? "light" : "dark"}
            style={[
              styles.proCardBlur,
              { borderRadius: innerCardRadius },
              isLightSurface && styles.proCardBlurLight,
              glass && styles.proCardBlurGlass,
            ]}
          >
            <View style={styles.proCardInner}>{children}</View>
          </BlurView>
        ) : (
          <View
            style={[
              styles.proCardAndroid,
              { borderRadius: innerCardRadius },
              isLightSurface && styles.proCardAndroidLight,
              glass && styles.proCardAndroidGlass,
            ]}
          >
            <View style={styles.proCardInner}>{children}</View>
          </View>
        )}
      </View>
    </View>
  );
};

// Mini Accent Bar Component
const AccentBar = ({ position = "top", width = "30%", source = africanPrintImage }) => (
  <Image
    source={source}
    style={[
      styles.miniAccentBar,
      position === "top" && { alignSelf: "flex-start", width: width },
      position === "center" && { alignSelf: "center", width: width },
      position === "right" && { alignSelf: "flex-end", width: width },
    ]}
    resizeMode="cover"
  />
);

const LoginWordmark = () => (
  <View style={styles.loginWordmarkGlass}>
    {Platform.OS === "ios" ? (
      <BlurView intensity={34} tint="light" style={styles.loginWordmarkGlassInner}>
        <Text style={styles.loginWordmarkText}>Taylorni</Text>
      </BlurView>
    ) : (
      <View style={styles.loginWordmarkGlassInner}>
        <Text style={styles.loginWordmarkText}>Taylorni</Text>
      </View>
    )}
  </View>
);

// ============================================
// CORE COMPONENTS
// ============================================

const SectionHeader = ({
  title,
  subtitle,
  accent = true,
  align = "left",
  accentSource = africanPrintImage,
}) => (
  <View style={[styles.sectionHeaderWrap, align === "center" && styles.sectionHeaderCenter]}>
    {accent && (
      <AccentBar
        position={align === "center" ? "center" : "top"}
        width={align === "center" ? "20%" : "25%"}
        source={accentSource}
      />
    )}
    <Text style={[styles.sectionTitle, align === "center" && styles.textCenter]}>{title}</Text>
    {subtitle && <Text style={[styles.sectionSubtitle, align === "center" && styles.textCenter]}>{subtitle}</Text>}
  </View>
);

const PrimaryButton = ({ onPress, title, disabled = false, fullWidth = false, size = "medium" }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.primaryButton,
      size === "large" && styles.primaryButtonLarge,
      size === "small" && styles.primaryButtonSmall,
      fullWidth && styles.buttonFullWidth,
      pressed && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ]}
  >
    <Text style={[styles.primaryButtonText, size === "small" && styles.primaryButtonTextSmall]}>{title}</Text>
  </Pressable>
);

const SecondaryButton = ({ onPress, title, disabled = false, fullWidth = false }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.secondaryButton,
      fullWidth && styles.buttonFullWidth,
      pressed && styles.buttonPressed,
      disabled && styles.buttonDisabled,
    ]}
  >
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </Pressable>
);

// ============================================
// HERO SECTION
// ============================================

const HeroSection = ({ onGetStarted, onLearnMore }) => (
  <View style={styles.heroWrapper}>
    <ImageBackground source={heroBg} style={styles.heroBg} resizeMode="cover">
      {/* African Print Accent */}
      <Image source={africanPrintImage} style={styles.heroAccentTop} resizeMode="cover" />
      <Image source={africanPrintImage} style={styles.heroAccentLeft} resizeMode="cover" />
      
      <View style={styles.heroOverlay}>
        <View style={styles.heroInner}>
          {/* Badge */}
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌍 African Fashion Platform</Text>
          </View>
          
          {/* Title */}
          <Text style={styles.heroTitle}>Your Fashion{"\n"}Way</Text>
          
          {/* Subtitle */}
          <Text style={styles.heroSubtitle}>
            Track orders, manage measurements, and experience virtual try-on — all in one seamless platform.
          </Text>
          
          {/* CTA Buttons */}
          <View style={styles.heroCTA}>
            <PrimaryButton title="Get Started" onPress={onGetStarted} size="large" />
            <SecondaryButton title="Learn More" onPress={onLearnMore} />
          </View>
          
          {/* Stats */}
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>500+</Text>
              <Text style={styles.heroStatLabel}>Designers</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>10K+</Text>
              <Text style={styles.heroStatLabel}>Orders</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNumber}>98%</Text>
              <Text style={styles.heroStatLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  </View>
);

// ============================================
// ABOUT SECTION
// ============================================

const AboutSection = ({ onLearnMore }) => (
  <ProCard variant="accent-left" accentWidth={6}>
    <View style={styles.aboutLayout}>
      <ImageBackground
        source={africanPrintImage}
        style={styles.aboutImageInvertedDFrame}
        imageStyle={styles.aboutImageInvertedDFrame}
      >
        <View style={styles.aboutImageInvertedDInner}>
          <Image source={aboutSec} style={styles.aboutImage} resizeMode="cover" />
          <View style={styles.aboutImageOverlay} />
        </View>
      </ImageBackground>
      <View style={styles.aboutContent}>
        <AccentBar position="top" width="20%" />
        <Text style={styles.aboutLabel}>ABOUT US</Text>
        <Text style={styles.aboutTitle}>Revolutionizing Fashion with Technology</Text>
        <Text style={styles.aboutText}>
          Taylorni bridges the gap between designers and clients. From order tracking and measurements to virtual try-on, we make custom fashion workflows simple.
        </Text>
        <SecondaryButton title="Learn More →" onPress={onLearnMore} />
      </View>
    </View>
  </ProCard>
);

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection = ({ tablet }) => {
  const variants = ["accent-top", "accent-left", "accent-corner", "accent-diagonal", "accent-frame"];
  
  return (
    <View style={styles.featuresWrapper}>
      {/* Background Accent */}
      <Image source={africanPrintImage} style={styles.featuresBgAccent} resizeMode="cover" />
      
      <View style={styles.featuresInner}>
        <SectionHeader 
          title="Powerful Features" 
          subtitle="Everything you need to manage your fashion business"
          align="center"
        />
        
        <View style={[styles.featuresGrid, tablet && styles.featuresGridTablet]}>
          {features.map((feature, index) => (
            <ProCard
              key={feature.title}
              style={[styles.featureCard, tablet && styles.featureCardTablet]}
              variant={variants[index % variants.length]}
              accentWidth={4}
              printSource={getCardPrint(index)}
            >
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{feature.title.charAt(0)}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </ProCard>
          ))}
        </View>
      </View>
    </View>
  );
};

// ============================================
// HOW IT WORKS SECTION
// ============================================

const HowItWorksSection = ({ tablet }) => (
  <ProCard variant="accent-frame" accentWidth={5}>
    <SectionHeader 
      title="How It Works" 
      subtitle="Simple steps to get started"
      align="center"
    />
    
    <View style={[styles.stepsContainer, tablet && styles.stepsContainerTablet]}>
      {/* Clients Column */}
      <View style={[styles.stepsColumn, tablet && styles.stepsColumnTablet]}>
        <View style={styles.stepsColumnHeader}>
          <Image source={africanPrintImage} style={styles.stepsColumnAccent} resizeMode="cover" />
          <View style={styles.stepsColumnTitleWrap}>
            <Text style={styles.stepsColumnIcon}>👤</Text>
            <Text style={styles.stepsColumnTitle}>For Clients</Text>
          </View>
        </View>
        
        <View style={styles.stepsList}>
          {steps.client.map((step, index) => (
            <View key={step.title} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
              {index < steps.client.length - 1 && <View style={styles.stepConnector} />}
            </View>
          ))}
        </View>
      </View>
      
      {/* Designers Column */}
      <View style={[styles.stepsColumn, tablet && styles.stepsColumnTablet, styles.stepsColumnAlt]}>
        <View style={styles.stepsColumnHeader}>
          <Image source={africanPrintImage} style={styles.stepsColumnAccent} resizeMode="cover" />
          <View style={styles.stepsColumnTitleWrap}>
            <Text style={styles.stepsColumnIcon}>✂️</Text>
            <Text style={styles.stepsColumnTitle}>For Designers</Text>
          </View>
        </View>
        
        <View style={styles.stepsList}>
          {steps.designer.map((step, index) => (
            <View key={step.title} style={styles.stepItem}>
              <View style={[styles.stepNumber, styles.stepNumberAlt]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.description}</Text>
              </View>
              {index < steps.designer.length - 1 && <View style={styles.stepConnector} />}
            </View>
          ))}
        </View>
      </View>
    </View>
  </ProCard>
);

// ============================================
// TESTIMONIALS SECTION
// ============================================

const TestimonialsSection = () => {
  const { width } = useWindowDimensions();
  const slideWidth = Math.max(width - 32, 280);
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!testimonials.length) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % testimonials.length;
        scrollRef.current?.scrollTo({ x: next * slideWidth, animated: true });
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [slideWidth]);

  const onScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / slideWidth);
    setActiveIndex(index);
  };

  return (
    <View style={styles.testimonialsWrapper}>
      <SectionHeader
        title="What People Say"
        subtitle="Trusted by designers and clients across Africa"
        align="center"
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={styles.testimonialCarousel}
      >
        {testimonials.map((item, index) => (
          <View key={item.name} style={[styles.testimonialSlide, { width: slideWidth }]}>
            <ProCard
              style={styles.testimonialCard}
              variant={index % 2 === 0 ? "accent-left" : "accent-top"}
              accentWidth={4}
              printSource={getCardPrint(index)}
            >
              <View style={styles.testimonialHeader}>
                <View
                  style={[
                    styles.testimonialAvatar,
                    index % 2 === 0 ? styles.avatarPrimary : styles.avatarSecondary,
                  ]}
                >
                  <Text style={styles.testimonialAvatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>{item.name}</Text>
                  <Text style={styles.testimonialRole}>{item.role}</Text>
                </View>
              </View>
              <Text style={styles.testimonialQuote}>"{item.quote}"</Text>
              <View style={styles.testimonialRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text key={star} style={styles.testimonialStar}>⭐</Text>
                ))}
              </View>
            </ProCard>
          </View>
        ))}
      </ScrollView>

      <View style={styles.testimonialDots}>
        {testimonials.map((item, index) => (
          <View
            key={item.name}
            style={[styles.testimonialDot, index === activeIndex && styles.testimonialDotActive]}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================
// CTA SECTION
// ============================================

const CTASection = ({ onPress, printSource = africanPrintImage }) => (
  <View style={styles.ctaWrapper}>
    <Image source={printSource} style={styles.ctaAccentTop} resizeMode="cover" />
    
    <View style={styles.ctaInner}>
      <View style={styles.ctaContent}>
        <Text style={styles.ctaTitle}>Ready to Transform Your Fashion Experience?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of designers and clients already using Taylorni
        </Text>
        <View style={styles.ctaButtons}>
          <PrimaryButton title="Start Free Trial" onPress={onPress} size="large" />
          <SecondaryButton title="Contact Sales" onPress={() => {}} />
        </View>
      </View>
    </View>
    
    <Image source={printSource} style={styles.ctaAccentBottom} resizeMode="cover" />
  </View>
);

// ============================================
// FOOTER
// ============================================

const Footer = ({ printSource = africanPrintImage }) => (
  <View style={styles.footerWrapper}>
    <Image source={printSource} style={styles.footerAccent} resizeMode="cover" />
    <View style={styles.footerContent}>
      <Text style={styles.footerLogo}>🌍 Taylorni</Text>
      <Text style={styles.footerTagline}>Celebrating African Fashion Heritage</Text>
      <Text style={styles.footerCopyright}>© 2024 Taylorni. All rights reserved.</Text>
    </View>
  </View>
);

// ============================================`r`n// SCREENS`r`n// ============================================

// ============================================
// ONBOARDING SCREEN — PROFESSIONAL REDESIGN
// ============================================

export const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 5;

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    navigation.replace("Landing");
  };

  const goNext = () => {
    if (currentIndex < totalSlides - 1) {
      flatListRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollTo({
        x: (currentIndex - 1) * width,
        animated: true,
      });
    }
  };

  const skip = () => completeOnboarding();

  const isLast = currentIndex === totalSlides - 1;
  const isFirst = currentIndex === 0;

  const WelcomeSlide = () => (
    <View style={[ob.slideContainer, { width }]}>
      <ImageBackground source={heroBg} style={ob.slideBgImage} resizeMode="cover">
        <Image source={africanPrintImage} style={ob.slideTopPrint} resizeMode="cover" />

        <View style={ob.slideDarkOverlay}>
          <ScrollView contentContainerStyle={ob.slideScrollInner} showsVerticalScrollIndicator={false}>
            <View style={ob.welcomeLogoArea}>
              <View style={ob.welcomeLogoBorder}>
                <View style={ob.welcomeLogoInner}>
                  <Text style={ob.welcomeLogoEmoji}>🌍</Text>
                </View>
              </View>
              <Text style={ob.welcomeBrand}>Taylorni</Text>
              <AccentBar position="center" width="25%" />
            </View>

            <View style={ob.welcomeTextArea}>
              <Text style={ob.welcomeTagline}>Welcome to</Text>
              <Text style={ob.welcomeTitle}>
                The Future of{"\n"}
                <Text style={ob.welcomeTitleGold}>African Fashion</Text>
              </Text>
              <Text style={ob.welcomeDesc}>
                Discover a seamless platform connecting designers and clients for
                custom fashion — from measurements to virtual try-on.
              </Text>
            </View>

            <ProCard variant="accent-frame" accentWidth={4} style={ob.welcomeStatsCard}>
              <View style={ob.welcomeStatsRow}>
                {[
                  { num: "500+", label: "Designers", icon: "✂️" },
                  { num: "10K+", label: "Orders", icon: "📦" },
                  { num: "98%", label: "Happy Clients", icon: "⭐" },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    {i > 0 && <View style={ob.welcomeStatDivider} />}
                    <View style={ob.welcomeStatItem}>
                      <Text style={ob.welcomeStatIcon}>{stat.icon}</Text>
                      <Text style={ob.welcomeStatNum}>{stat.num}</Text>
                      <Text style={ob.welcomeStatLabel}>{stat.label}</Text>
                    </View>
                  </React.Fragment>
                ))}
              </View>
            </ProCard>

            <View style={ob.welcomePillsWrap}>
              {["Order Tracking", "Virtual Try-On", "Measurements", "Marketplace"].map(
                (pill) => (
                  <View key={pill} style={ob.welcomePill}>
                    <View style={ob.welcomePillDot} />
                    <Text style={ob.welcomePillText}>{pill}</Text>
                  </View>
                )
              )}
            </View>
          </ScrollView>
        </View>

        <Image source={africanPrintImage} style={ob.slideBottomPrint} resizeMode="cover" />
      </ImageBackground>
    </View>
  );

  const AboutVisionSlide = () => (
    <View style={[ob.slideContainer, { width }]}>
      <View style={ob.slideBackground}>
        <Image source={africanPrintImage} style={ob.slideTopPrint} resizeMode="cover" />

        <ScrollView contentContainerStyle={ob.slideScrollInner} showsVerticalScrollIndicator={false}>
          <View style={ob.slideHeader}>
            <View style={ob.slideHeaderChip}>
              <Text style={ob.slideHeaderChipText}>DISCOVER</Text>
            </View>
            <Text style={ob.slideHeaderTitle}>About Taylorni</Text>
            <Text style={ob.slideHeaderSubtitle}>
              Bridging fashion and technology across Africa
            </Text>
          </View>

          <ProCard variant="accent-corner" accentWidth={4} style={ob.slideCard}>
            <View style={ob.slideImageWrap}>
              <Image source={aboutSec} style={ob.slideImage} resizeMode="cover" />
              <View style={ob.slideImageGradient} />
              <Image source={africanPrintImage} style={ob.slideImagePrint} resizeMode="cover" />
            </View>
            <Text style={ob.slideCardText}>
              Taylorni bridges the gap between designers and clients — from order
              tracking to virtual try-on, we make custom fashion simple.
            </Text>
          </ProCard>

          <ProCard
            variant="default"
            accentWidth={4}
            style={ob.slideCard}
          >
            <View style={ob.visionRow}>
              <View style={ob.visionIconRing}>
                <Image source={africanPrintImage} style={ob.visionIconRingPrint} resizeMode="cover" />
                <View style={ob.visionIconCircle}>
                  <Text style={ob.visionIconText}>{"\u2726"}</Text>
                </View>
              </View>
              <View style={ob.visionContent}>
                <Text style={ob.visionLabel}>OUR VISION</Text>
                <Text style={ob.visionHeading}>Leading Digital Fashion Hub</Text>
                <Text style={ob.slideCardText}>
                  Become the go-to platform for personalized and sustainable
                  fashion customization across Africa.
                </Text>
              </View>
            </View>
          </ProCard>

          <ProCard
            variant="accent-top"
            accentWidth={4}
            style={ob.slideCard}
            printSource={africanPrintImage}
          >
            <View style={ob.missionRow}>
              <View style={[ob.visionIconCircle, { backgroundColor: colors.secondary }]}>
                <Text style={ob.visionIconText}>🎯</Text>
              </View>
              <View style={ob.visionContent}>
                <Text style={ob.visionLabel}>OUR MISSION</Text>
                <Text style={ob.slideCardText}>
                  An intuitive fashion workflow where creativity meets
                  convenience — designers manage efficiently, clients get better
                  fit outcomes.
                </Text>
              </View>
            </View>
          </ProCard>
        </ScrollView>

        <Image source={africanPrintImage} style={ob.slideBottomPrint} resizeMode="cover" />
      </View>
    </View>
  );

  const FeaturesSlide = () => {
    const iconColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      "#8B5CF6",
      "#EC4899",
    ];

    return (
      <View style={[ob.slideContainer, { width }]}>
        <View style={ob.slideBackground}>
          <Image source={africanPrintImage} style={ob.slideTopPrint} resizeMode="cover" />

          <ScrollView contentContainerStyle={ob.slideScrollInner} showsVerticalScrollIndicator={false}>
            <View style={ob.slideHeader}>
              <View style={ob.slideHeaderChip}>
                <Text style={ob.slideHeaderChipText}>✨ FEATURES</Text>
              </View>
              <Text style={ob.slideHeaderTitle}>Powerful Tools</Text>
              <Text style={ob.slideHeaderSubtitle}>
                Everything to manage your fashion business
              </Text>
            </View>

            {features.map((feature, index) => {
              const iconBg = iconColors[index % iconColors.length];
              return (
                <ProCard
                  key={feature.title}
                  variant={
                    index % 3 === 0
                      ? "accent-left"
                      : index % 3 === 1
                      ? "accent-top"
                      : "accent-corner"
                  }
                  accentWidth={4}
                  style={ob.featureSlideCard}
                  printSource={getCardPrint(index)}
                >
                  <View style={ob.featureSlideRow}>
                    <View style={[ob.featureSlideIconOuter, { backgroundColor: `${iconBg}18` }]}>
                      <View style={[ob.featureSlideIconInner, { backgroundColor: iconBg }]}>
                        <Text style={ob.featureSlideIconText}>
                          {feature.title.charAt(0)}
                        </Text>
                      </View>
                    </View>
                    <View style={ob.featureSlideText}>
                      <Text style={ob.featureSlideTitle}>{feature.title}</Text>
                      <Text style={ob.featureSlideDesc} numberOfLines={2}>
                        {feature.description}
                      </Text>
                    </View>
                    <Text style={[ob.featureSlideArrow, { color: iconBg }]}>→</Text>
                  </View>
                </ProCard>
              );
            })}
          </ScrollView>

          <Image source={africanPrintImage} style={ob.slideBottomPrint} resizeMode="cover" />
        </View>
      </View>
    );
  };

  const HowItWorksSlide = () => (
    <View style={[ob.slideContainer, { width }]}>
      <View style={ob.slideBackground}>
        <Image source={africanPrintImage} style={ob.slideTopPrint} resizeMode="cover" />

        <ScrollView contentContainerStyle={ob.slideScrollInner} showsVerticalScrollIndicator={false}>
          <View style={ob.slideHeader}>
            <View style={ob.slideHeaderChip}>
              <Text style={ob.slideHeaderChipText}>📋 PROCESS</Text>
            </View>
            <Text style={ob.slideHeaderTitle}>How It Works</Text>
            <Text style={ob.slideHeaderSubtitle}>
              Simple steps to get started
            </Text>
          </View>

          <ProCard variant="accent-top" accentWidth={4} style={ob.slideCard}>
            <View style={ob.stepsHeader}>
              <View style={[ob.stepsHeaderIcon, { backgroundColor: `${colors.primary}18` }]}>
                <Text style={{ fontSize: 20 }}>👤</Text>
              </View>
              <View>
                <Text style={ob.stepsHeaderTitle}>For Clients</Text>
                <Text style={ob.stepsHeaderSub}>Start your fashion journey</Text>
              </View>
            </View>
            <View style={ob.stepsDivider} />
            {steps.client.map((step, i) => (
              <View key={step.title} style={ob.stepRow}>
                <View style={ob.stepTimelineCol}>
                  <View style={ob.stepCircle}>
                    <Text style={ob.stepCircleText}>{i + 1}</Text>
                  </View>
                  {i < steps.client.length - 1 && (
                    <View style={ob.stepLine}>
                      <Image source={africanPrintImage} style={ob.stepLinePrint} resizeMode="cover" />
                    </View>
                  )}
                </View>
                <View style={ob.stepBody}>
                  <Text style={ob.stepBodyTitle}>{step.title}</Text>
                  <Text style={ob.stepBodyDesc} numberOfLines={2}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </ProCard>

          <ProCard variant="accent-top" accentWidth={4} style={ob.slideCard}>
            <View style={ob.stepsHeader}>
              <View style={[ob.stepsHeaderIcon, { backgroundColor: `${colors.secondary}20` }]}>
                <Text style={{ fontSize: 20 }}>✂️</Text>
              </View>
              <View>
                <Text style={ob.stepsHeaderTitle}>For Designers</Text>
                <Text style={ob.stepsHeaderSub}>Manage your craft</Text>
              </View>
            </View>
            <View style={ob.stepsDivider} />
            {steps.designer.map((step, i) => (
              <View key={step.title} style={ob.stepRow}>
                <View style={ob.stepTimelineCol}>
                  <View style={[ob.stepCircle, { backgroundColor: colors.secondary }]}>
                    <Text style={ob.stepCircleText}>{i + 1}</Text>
                  </View>
                  {i < steps.designer.length - 1 && (
                    <View style={ob.stepLine}>
                      <Image source={africanPrintImage} style={ob.stepLinePrint} resizeMode="cover" />
                    </View>
                  )}
                </View>
                <View style={ob.stepBody}>
                  <Text style={ob.stepBodyTitle}>{step.title}</Text>
                  <Text style={ob.stepBodyDesc} numberOfLines={2}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </ProCard>
        </ScrollView>

        <Image source={africanPrintImage} style={ob.slideBottomPrint} resizeMode="cover" />
      </View>
    </View>
  );

  const GetStartedSlide = () => (
    <View style={[ob.slideContainer, { width }]}>
      <ImageBackground source={heroBg} style={ob.slideBgImage} resizeMode="cover">
        <Image source={africanPrintImage} style={ob.slideTopPrint} resizeMode="cover" />

        <View style={ob.slideDarkOverlay}>
          <ScrollView contentContainerStyle={ob.slideScrollInner} showsVerticalScrollIndicator={false}>
            <View style={ob.slideHeader}>
              <View style={ob.slideHeaderChip}>
                <Text style={ob.slideHeaderChipText}>🎯 VALUES</Text>
              </View>
              <Text style={ob.slideHeaderTitle}>What We Stand For</Text>
            </View>

            <View style={ob.valuesGrid}>
              {aboutValues.map((value, i) => (
                <ProCard
                  key={value.title}
                  variant={getValuesCardVariant(i)}
                  accentWidth={3}
                  style={ob.valueGridCard}
                  printSource={getCardPrint(i)}
                >
                  <View style={ob.valueGridInner}>
                    <View
                      style={[
                        ob.valueGridIconWrap,
                        {
                          backgroundColor:
                            i % 2 === 0 ? `${colors.primary}15` : `${colors.secondary}18`,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={value.iconName}
                        size={22}
                        color={i % 2 === 0 ? colors.primary : colors.secondary}
                        style={ob.valueGridIcon}
                      />
                    </View>
                    <Text style={ob.valueGridTitle}>{value.title}</Text>
                    <Text style={ob.valueGridDesc} numberOfLines={2}>
                      {value.description}
                    </Text>
                  </View>
                </ProCard>
              ))}
            </View>

            <ProCard variant="accent-frame" accentWidth={4} style={ob.sidebarHint}>
              <View style={ob.sidebarHintHeader}>
                <Text style={ob.sidebarHintIcon}>📱</Text>
                <Text style={ob.sidebarHintTitle}>Everything in Your Sidebar</Text>
              </View>
              <Text style={ob.sidebarHintDesc}>
                After onboarding, access all modules from your menu — About,
                Features, How It Works, Contact, and more.
              </Text>
              <View style={ob.sidebarHintList}>
                {[
                  { icon: "📖", label: "About — Mission, Story, Team" },
                  { icon: "👤", label: "Client — Orders, Marketplace" },
                  { icon: "✂️", label: "Designer — Products, Portfolio" },
                  { icon: "💬", label: "Contact — Chat, Locations" },
                ].map((item) => (
                  <View key={item.label} style={ob.sidebarHintRow}>
                    <Text style={ob.sidebarHintRowIcon}>{item.icon}</Text>
                    <Text style={ob.sidebarHintRowText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </ProCard>

            <View style={ob.finalCTA}>
              <AccentBar position="center" width="20%" />
              <Text style={ob.finalCTATitle}>Ready to Get Started?</Text>
              <Text style={ob.finalCTADesc}>Your fashion journey begins now.</Text>
              <View style={ob.finalCTATrust}>
                <Text style={ob.finalCTATrustItem}>✓ Free to start</Text>
                <Text style={ob.finalCTATrustItem}>✓ No credit card</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <Image source={africanPrintImage} style={ob.slideBottomPrint} resizeMode="cover" />
      </ImageBackground>
    </View>
  );

  const slidesData = [{ id: "0" }, { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

  const renderSlide = ({ item }) => {
    switch (item.id) {
      case "0":
        return <WelcomeSlide />;
      case "1":
        return <AboutVisionSlide />;
      case "2":
        return <FeaturesSlide />;
      case "3":
        return <HowItWorksSlide />;
      case "4":
        return <GetStartedSlide />;
      default:
        return null;
    }
  };

  return (
    <View style={ob.screen}>
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(idx);
          }}
        >
          {slidesData.map((item) => (
            <React.Fragment key={item.id}>{renderSlide({ item })}</React.Fragment>
          ))}
        </ScrollView>
      </View>

      <View style={ob.controlBar}>
        <View style={ob.progressTrack}>
          <View
            style={[
              ob.progressFill,
              {
                width: `${((currentIndex + 1) / totalSlides) * 100}%`,
              },
            ]}
          />
        </View>

        <View style={ob.dots}>
          {slidesData.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                flatListRef.current?.scrollTo({
                  x: i * width,
                  animated: true,
                });
                setCurrentIndex(i);
              }}
            >
              <View style={[ob.dot, currentIndex === i && ob.dotActive]} />
            </Pressable>
          ))}
        </View>

        <Text style={ob.slideCounter}>
          {currentIndex + 1} / {totalSlides}
        </Text>

        <View style={ob.controlButtons}>
          {isFirst ? (
            <Pressable onPress={skip} style={ob.skipBtn}>
              <Text style={ob.skipBtnText}>Skip</Text>
            </Pressable>
          ) : (
            <Pressable onPress={goBack} style={ob.backBtn}>
              <Text style={ob.backBtnText}>← Back</Text>
            </Pressable>
          )}

          <Pressable onPress={goNext} style={[ob.nextBtn, isLast && ob.nextBtnFinal]}>
            <Text style={ob.nextBtnText}>
              {isLast ? "Get Started 🚀" : "Next →"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export const PublicLandingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          onGetStarted={() => navigation.navigate("Login")}
          onLearnMore={() => navigation.navigate("About")}
        />
        <View style={styles.mainContent}>
          <AboutSection onLearnMore={() => navigation.navigate("About")} />
          <TestimonialsSection />
          <CTASection onPress={() => navigation.navigate("Login")} />
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
};
export const PublicAboutScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const tablet = width >= 768;
  const aboutCardCount = 5 + aboutValues.length;
  
  // Scroll reference
  const scrollY = useMemo(() => new Animated.Value(0), []);
  
  // Card entrance animations
  const aboutCardAnims = useMemo(
    () => Array.from({ length: aboutCardCount }, () => new Animated.Value(0)),
    [aboutCardCount]
  );
  
  // Rotation animations for value icons
  const rotationAnims = useMemo(
    () => Array.from({ length: aboutValues.length }, () => new Animated.Value(0)),
    []
  );
  
  // Continuous animations
  const pulseAnim = useMemo(() => new Animated.Value(1), []);
  const floatAnim = useMemo(() => new Animated.Value(0), []);
  const shimmerAnim = useMemo(() => new Animated.Value(0), []);
  const bgRotation = useMemo(() => new Animated.Value(0), []);
  const wobbleAnim = useMemo(() => new Animated.Value(0), []);
  const bounceAnim = useMemo(() => new Animated.Value(0), []);
  const glowAnim = useMemo(() => new Animated.Value(0), []);
  const waveAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    // Reset and start entrance animations with spring physics
    aboutCardAnims.forEach((anim) => anim.setValue(0));
    Animated.stagger(
      100,
      aboutCardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();
    
    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    // Background rotation (slow)
    Animated.loop(
      Animated.timing(bgRotation, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();
    
    // Wobble animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(wobbleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: -0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(wobbleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
      ])
    ).start();
    
    // Bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
    
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Wave animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
    
    // Icon rotation animations (different speeds for each)
    rotationAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000 + index * 800,
          useNativeDriver: true,
        })
      ).start();
    });
  }, [aboutCardAnims, rotationAnims, pulseAnim, floatAnim, shimmerAnim, bgRotation, wobbleAnim, bounceAnim, glowAnim, waveAnim]);

  // Crazy entrance animation style per card
  const getAboutCardAnimStyle = (index) => {
    const anim = aboutCardAnims[index];
    const direction = index % 6;
    
    let translateXStart = 0;
    let translateYStart = 0;
    let rotateStart = '0deg';
    
    switch(direction) {
      case 0: // Slide from left with rotation
        translateXStart = -200;
        rotateStart = '-45deg';
        break;
      case 1: // Slide from right with rotation
        translateXStart = 200;
        rotateStart = '45deg';
        break;
      case 2: // Slide from bottom with flip
        translateYStart = 150;
        rotateStart = '180deg';
        break;
      case 3: // Zoom in with spin
        rotateStart = '720deg';
        break;
      case 4: // Slide from top
        translateYStart = -100;
        rotateStart = '-30deg';
        break;
      case 5: // Diagonal slide
        translateXStart = -150;
        translateYStart = 150;
        rotateStart = '90deg';
        break;
    }
    
    return {
      opacity: anim,
      transform: [
        {
          translateX: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [translateXStart, 0],
          }),
        },
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [translateYStart, 0],
          }),
        },
        {
          scale: anim.interpolate({
            inputRange: [0, 0.5, 0.8, 1],
            outputRange: [0.1, 1.3, 0.9, 1],
          }),
        },
        {
          rotate: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [rotateStart, '0deg'],
          }),
        },
      ],
    };
  };
  
  // Crazy animation for value cards
  const getValueCardAnimStyle = (index) => {
    const cardIndex = index + 4;
    const anim = aboutCardAnims[cardIndex] || new Animated.Value(1);
    
    const patterns = [
      { rotateStart: '-180deg', scalePattern: [0, 1.5, 0.8, 1] },
      { rotateStart: '180deg', scalePattern: [0, 0.5, 1.2, 1] },
      { rotateStart: '-360deg', scalePattern: [0, 1.1, 0.95, 1] },
      { rotateStart: '360deg', scalePattern: [0, 1.3, 0.9, 1] },
    ];
    
    const pattern = patterns[index % patterns.length];
    
    return {
      opacity: anim,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [100 + index * 30, 0],
          }),
        },
        {
          translateX: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [index % 2 === 0 ? -80 : 80, index % 2 === 0 ? 20 : -20, 0],
          }),
        },
        {
          scale: anim.interpolate({
            inputRange: [0, 0.4, 0.7, 1],
            outputRange: pattern.scalePattern,
          }),
        },
        {
          rotate: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [pattern.rotateStart, '0deg'],
          }),
        },
      ],
    };
  };
  
  // Spinning icon animation
  const getIconAnimStyle = (index) => {
    const rotationAnim = rotationAnims[index];
    return {
      transform: [
        {
          rotate: rotationAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', index % 2 === 0 ? '360deg' : '-360deg'],
          }),
        },
        {
          scale: pulseAnim.interpolate({
            inputRange: [1, 1.1],
            outputRange: [1, 1.2],
          }),
        },
      ],
    };
  };

  // Floating style
  const floatStyle = {
    transform: [
      {
        translateY: floatAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -20],
        }),
      },
    ],
  };

  // Wobble style for header
  const wobbleStyle = {
    transform: [
      {
        rotate: wobbleAnim.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-3deg', '0deg', '3deg'],
        }),
      },
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -15],
        }),
      },
    ],
  };

  // Background rotation style
  const bgRotationStyle = {
    position: 'absolute',
    width: width * 2.5,
    height: width * 2.5,
    top: -width * 0.75,
    left: -width * 0.75,
    opacity: 0.06,
    transform: [
      {
        rotate: bgRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  // Wave style for images
  const getWaveStyle = (offset = 0) => ({
    transform: [
      {
        translateY: waveAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -10 - offset, 0],
        }),
      },
      {
        rotate: waveAnim.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: ['0deg', '1deg', '0deg', '-1deg', '0deg'],
        }),
      },
    ],
  });

  // Glow opacity style
  const glowStyle = {
    opacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    }),
  };

  // Shimmer translate style
  const shimmerStyle = {
    transform: [
      {
        translateX: shimmerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-width, width],
        }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={africanPrintAltImage} style={styles.pageBackground} resizeMode="cover">
        {/* Animated rotating background */}
        <Animated.Image 
          source={africanPrintImage} 
          style={bgRotationStyle}
          resizeMode="cover" 
        />
        
        <View style={styles.pageBackgroundOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {/* Animated Page Header with wobble and bounce */}
            <Animated.View style={[styles.pageHeader, styles.pageHeaderGlass, wobbleStyle, glowStyle]}>
              <Animated.Text style={[styles.pageTitle, { transform: [{ scale: pulseAnim }] }]}>
                About Taylorni
              </Animated.Text>
              <Animated.Text style={[styles.pageSubtitle, floatStyle]}>
                Empowering African fashion through technology
              </Animated.Text>
              {/* Shimmer effect overlay */}
              <Animated.View 
                style={[
                  { 
                    position: 'absolute', 
                    top: 0, 
                    bottom: 0, 
                    width: 60, 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                  shimmerStyle
                ]} 
              />
            </Animated.View>

            <View style={styles.mainContent}>
              {/* About Card - Crazy slide from left */}
              <Animated.View style={[styles.aboutAnimatedCard, getAboutCardAnimStyle(0)]}>
                <ProCard
                  variant={getAboutCardVariant(0)}
                  accentWidth={5}
                  printSource={africanPrintImage}
                  glass
                >
                  <Animated.View style={[styles.aboutPageImageWrap, getWaveStyle(0)]}>
                    <Image source={aboutBg} style={styles.aboutPageImage} resizeMode="cover" />
                  </Animated.View>
                  <Animated.Text style={[styles.aboutPageText, glowStyle]}>
                    Taylorni is a digital fashion platform improving how designers and clients interact around custom orders, ready-made outfits, and virtual try-on.
                  </Animated.Text>
                </ProCard>
              </Animated.View>

              {/* Mission Card - Flip in from right */}
              <Animated.View style={[styles.aboutAnimatedCard, getAboutCardAnimStyle(1)]}>
                <ProCard
                  variant={getAboutCardVariant(1)}
                  accentWidth={6}
                  printSource={africanPrintImage}
                  glass
                >
                  <Animated.Text style={[styles.cardLabel, { transform: [{ scale: pulseAnim }] }]}>
                    OUR MISSION
                  </Animated.Text>
                  <Animated.View style={[styles.aboutPageImageWrap, getWaveStyle(5)]}>
                    <Image source={aboutMission} style={styles.aboutPageImage} resizeMode="cover" />
                  </Animated.View>
                  <Text style={styles.aboutPageText}>
                    We provide an intuitive fashion workflow where creativity meets convenience. Designers manage efficiently while clients receive better fit outcomes.
                  </Text>
                </ProCard>
              </Animated.View>

              {/* Vision Card - Spin in with pulsing icon */}
              <Animated.View style={[styles.aboutAnimatedCard, getAboutCardAnimStyle(2)]}>
                <ProCard
                  variant={getAboutCardVariant(2)}
                  accentWidth={5}
                  printSource={africanPrintImage}
                  glass
                >
                  <View style={styles.visionLayout}>
                    <Animated.View 
                      style={[
                        styles.visionIconRing, 
                        { 
                          transform: [
                            { 
                              rotate: bgRotation.interpolate({ 
                                inputRange: [0, 1], 
                                outputRange: ['0deg', '360deg'] 
                              }) 
                            }
                          ] 
                        }
                      ]}
                    >
                      <Image source={africanPrintImage} style={styles.visionIconRingPrint} resizeMode="cover" />
                      <Animated.View 
                        style={[
                          styles.visionIconWrap, 
                          { 
                            transform: [
                              { scale: pulseAnim },
                              { 
                                rotate: bgRotation.interpolate({ 
                                  inputRange: [0, 1], 
                                  outputRange: ['360deg', '0deg'] 
                                }) 
                              }
                            ] 
                          }
                        ]}
                      >
                        <Text style={styles.visionIcon}>{"\u2726"}</Text>
                      </Animated.View>
                    </Animated.View>
                    <View style={styles.visionContent}>
                      <Animated.Text style={[styles.cardLabel, glowStyle]}>OUR VISION</Animated.Text>
                      <Text style={styles.aboutPageText}>
                        Become the leading digital hub for personalized and sustainable fashion customization across client and designer communities.
                      </Text>
                    </View>
                  </View>
                </ProCard>
              </Animated.View>

              {/* Story Card - Zoom in with bounce */}
              <Animated.View style={[styles.aboutAnimatedCard, getAboutCardAnimStyle(3)]}>
                <ProCard
                  variant={getAboutCardVariant(3)}
                  accentWidth={5}
                  printSource={africanPrintImage}
                  glass
                >
                  <Animated.View style={floatStyle}>
                    <AccentBar position="center" width="20%" source={africanPrintImage} />
                  </Animated.View>
                  <Animated.Text style={[styles.cardLabel, styles.textCenter, { transform: [{ scale: pulseAnim }] }]}>
                    OUR STORY
                  </Animated.Text>
                  <Animated.View style={[styles.aboutPageImageWrap, getWaveStyle(10)]}>
                    <Image source={aboutStory} style={styles.aboutPageImage} resizeMode="cover" />
                  </Animated.View>
                  <Text style={[styles.aboutPageText, styles.textCenter]}>
                    Taylorni started from a student-led idea to combine technology and fashion, now built into a platform designed for practical, high-quality tailoring.
                  </Text>
                </ProCard>
              </Animated.View>

              {/* Values Section with crazy staggered animations */}
              <View style={styles.valuesSection}>
                <Animated.View style={[floatStyle, wobbleStyle]}>
                  <SectionHeader title="Our Values" align="center" accent={false} />
                </Animated.View>
                <View style={[styles.valuesGrid, tablet && styles.valuesGridTablet]}>
                  {aboutValues.map((value, index) => (
                    <Animated.View
                      key={value.title}
                      style={[
                        styles.aboutAnimatedValueCard,
                        tablet && styles.aboutAnimatedValueCardTablet,
                        getValueCardAnimStyle(index),
                      ]}
                    >
                      <ProCard
                        variant={getValuesCardVariant(index)}
                        accentWidth={4}
                        printSource={africanPrintImage}
                        glass
                      >
                        {/* Spinning and pulsing icon */}
                        <Animated.View style={getIconAnimStyle(index)}>
                          <MaterialCommunityIcons
                            name={value.iconName}
                            size={30}
                            color={index % 2 === 0 ? colors.primary : colors.secondary}
                            style={styles.valueIcon}
                          />
                        </Animated.View>
                        <Animated.Text style={[styles.valueTitle, glowStyle]}>
                          {value.title}
                        </Animated.Text>
                        <Text style={styles.valueDesc}>{value.description}</Text>
                      </ProCard>
                    </Animated.View>
                  ))}
                </View>
              </View>

              {/* CTA with combined animations */}
              <Animated.View 
                style={[
                  styles.aboutAnimatedCard, 
                  getAboutCardAnimStyle(aboutCardCount - 1),
                ]}
              >
                <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, glowStyle]}>
                  <CTASection onPress={() => navigation.navigate("Login")} printSource={africanPrintImage} />
                </Animated.View>
              </Animated.View>
            </View>
            <Animated.View style={floatStyle}>
              <Footer printSource={africanPrintImage} />
            </Animated.View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export const PublicContactScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <View style={styles.screen}>
      <ImageBackground source={africanPrintImage} style={styles.loginBackground} resizeMode="cover">
        <View style={styles.loginBackgroundOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contactScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.pageHeader, styles.pageHeaderGlass, styles.contactHeader]}>
              <Text style={styles.contactTitle}>Get in Touch</Text>
              <Text style={styles.contactSubtitle}>We would love to hear from you</Text>
            </View>

            <View style={styles.mainContent}>
              <ProCard
                variant="accent-frame"
                accentWidth={6}
                printSource={africanPrintImage}
                glass
                style={styles.contactMessageCard}
              >
                <Text style={styles.cardLabel}>SEND US A MESSAGE</Text>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    value={form.email}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Message</Text>
                  <TextInput
                    value={form.message}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, message: text }))}
                    placeholder="How can we help you?"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    style={[styles.input, styles.textArea]}
                  />
                </View>

                <PrimaryButton
                  title="Send Message"
                  onPress={() => navigation.navigate("DesignerMessages")}
                  fullWidth
                />
              </ProCard>

              <ProCard
                variant="accent-left"
                accentWidth={5}
                printSource={africanPrintImage}
                glass
                style={styles.contactMessageCard}
              >
                <View style={styles.chatSection}>
                  <View style={styles.chatIconWrap}>
                    <MaterialCommunityIcons
                      name="message-processing-outline"
                      size={30}
                      color={colors.bgPrimary}
                    />
                  </View>
                  <Text style={styles.chatTitle}>Live Chat</Text>
                  <Text style={styles.chatDesc}>Chat with our fashion experts in real-time</Text>
                  <SecondaryButton
                    title="Start Chat"
                    onPress={() => navigation.navigate("DesignerMessages")}
                  />
                </View>
              </ProCard>

              <ProCard
                variant="accent-frame"
                accentWidth={5}
                printSource={africanPrintImage}
                glass
                style={styles.contactMessageCard}
              >
                <SectionHeader title="Our Locations" />
                <View style={styles.storesList}>
                  {contactStores.map((store, index) => (
                    <View key={store.name} style={[styles.storeItem, index > 0 && styles.storeItemBorder]}>
                      <View style={[styles.storeIcon, index === 0 ? styles.avatarPrimary : styles.avatarSecondary]}>
                        <MaterialCommunityIcons name="map-marker-outline" size={22} color={colors.bgPrimary} />
                      </View>
                      <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>{store.name}</Text>
                        <Text style={styles.storeDetail}>{store.address}</Text>
                        <Text style={styles.storeDetail}>{store.phone}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ProCard>

              <ProCard
                variant="accent-top"
                accentWidth={5}
                printSource={africanPrintImage}
                glass
                style={styles.contactMessageCard}
              >
                <SectionHeader title="Follow Us" align="center" />
                <View style={styles.socialGrid}>
                  {socials.map((social, index) => (
                    <Pressable
                      key={social.name}
                      style={[styles.socialItem, index % 2 === 0 ? styles.avatarPrimary : styles.avatarSecondary]}
                    >
                      <MaterialCommunityIcons
                        name={social.iconName}
                        size={18}
                        color={colors.bgPrimary}
                        style={styles.socialIcon}
                      />
                      <Text style={styles.socialName}>{social.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </ProCard>
            </View>
            <Footer printSource={africanPrintImage} />
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export const PublicLoginScreen = () => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "client",
  });

  const title = useMemo(
    () => (mode === "login" ? "Welcome Back" : "Create Account"),
    [mode]
  );

  const onSubmit = () => {
    dispatch(clearError());
    if (mode === "login") {
      dispatch(login({ email: form.email.trim(), password: form.password }));
      return;
    }
    dispatch(
      signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email.trim(),
        password: form.password,
        userType: form.userType,
      })
    );
  };

  return (
    <View style={styles.screen}>
      <ImageBackground source={africanPrintImage} style={styles.loginBackground} resizeMode="cover">
        <View style={styles.loginBackgroundOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.loginScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo Section */}
            <View style={styles.loginHeader}>
              <View style={styles.loginWordmarkWrap}>
                <LoginWordmark />
              </View>
              <Text style={styles.loginTagline}>Your African Fashion Way</Text>
            </View>

        {/* Auth Card */}
        <ProCard style={styles.authCard} variant="accent-frame" accentWidth={6}>
          <Text style={styles.authTitle}>{title}</Text>
          <Text style={styles.authSubtitle}>
            {mode === "login" 
              ? "Sign in to continue to your account" 
              : "Join the fashion revolution"}
          </Text>

          {/* Mode Toggle */}
          <View style={styles.authToggle}>
            <Pressable
              onPress={() => setMode("login")}
              style={[styles.authToggleBtn, mode === "login" && styles.authToggleBtnActive]}
            >
              <Text style={[styles.authToggleText, mode === "login" && styles.authToggleTextActive]}>
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMode("signup")}
              style={[styles.authToggleBtn, mode === "signup" && styles.authToggleBtnActive]}
            >
              <Text style={[styles.authToggleText, mode === "signup" && styles.authToggleTextActive]}>
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Signup Fields */}
          {mode === "signup" && (
            <>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <TextInput
                    value={form.firstName}
                    onChangeText={(text) => setForm((p) => ({ ...p, firstName: text }))}
                    placeholder="John"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                  />
                </View>
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    value={form.lastName}
                    onChangeText={(text) => setForm((p) => ({ ...p, lastName: text }))}
                    placeholder="Doe"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>I am a</Text>
                <View style={styles.roleToggle}>
                  {["client", "designer"].map((role) => (
                    <Pressable
                      key={role}
                      onPress={() => setForm((p) => ({ ...p, userType: role }))}
                      style={[
                        styles.roleBtn,
                        form.userType === role && styles.roleBtnActive,
                      ]}
                    >
                      <Text style={styles.roleIcon}>{role === "client" ? "👤" : "✂️"}</Text>
                      <Text style={[styles.roleText, form.userType === role && styles.roleTextActive]}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Common Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm((p) => ({ ...p, email: text }))}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              value={form.password}
              onChangeText={(text) => setForm((p) => ({ ...p, password: text }))}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Error Message */}
          {auth.error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{String(auth.error)}</Text>
            </View>
          )}

          {/* Submit Button */}
          <PrimaryButton
            title={auth.loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            onPress={onSubmit}
            disabled={auth.loading}
            fullWidth
            size="large"
          />

          {/* Footer Link */}
          {mode === "login" && (
            <Pressable style={styles.forgotLink}>
              <Text style={styles.forgotLinkText}>Forgot your password?</Text>
            </Pressable>
          )}
        </ProCard>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loginScrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: "100%",
  },
  contactScrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
    minHeight: "100%",
  },
  loginBackground: {
    flex: 1,
  },
  loginBackgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.78)",
  },
  pageBackground: {
    flex: 1,
  },
  pageBackgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.74)",
  },
  onboardingScrollContent: {
    paddingBottom: 140,
  },
  mainContent: {
    padding: 16,
    gap: 20,
  },

  // Pro Card
  proCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.bgCard,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  proCardLight: {
    backgroundColor: "#FFFFFF",
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOpacity: 0.14,
  },
  proCardGlass: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(0, 0, 0, 0.45)",
    shadowOpacity: 0.3,
  },
  proCardContent: {
    flex: 1,
  },
  proCardBlur: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  proCardBlurLight: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  proCardBlurGlass: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  proCardAndroid: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: 16,
  },
  proCardAndroidLight: {
    backgroundColor: "#FFFFFF",
  },
  proCardAndroidGlass: {
    backgroundColor: "rgba(17, 17, 17, 0.7)",
  },
  proCardInner: {
    padding: 20,
  },

  // Accent Styles
  accentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  accentBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  accentLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  accentRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  accentLeftFrame: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  accentRightFrame: {
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
  accentGlass: {
    opacity: 0.82,
  },
  
  // Corner Accents
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10,
    transform: [{ rotate: "180deg" }],
  },
  cornerImageH: {
    width: 60,
    height: 5,
  },
  cornerImageV: {
    width: 5,
    height: 40,
    position: "absolute",
    top: 5,
    left: 0,
  },

  // Diagonal Accent
  diagonalAccent: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    transform: [{ rotate: "45deg" }],
    overflow: "hidden",
    zIndex: 10,
  },
  diagonalImage: {
    width: "100%",
    height: "100%",
  },

  // Mini Accent Bar
  miniAccentBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },

  // Section Header
  sectionHeaderWrap: {
    marginBottom: 20,
  },
  sectionHeaderCenter: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 22,
  },
  textCenter: {
    textAlign: "center",
  },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  primaryButtonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: colors.bgPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  primaryButtonTextSmall: {
    fontSize: 13,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Hero Section
  heroWrapper: {
    marginBottom: 20,
  },
  heroBg: {
    minHeight: 520,
  },
  heroOverlay: {
    flex: 1,
    minHeight: 520,
    backgroundColor: "rgba(10, 10, 10, 0.7)",
    justifyContent: "flex-end",
  },
  heroAccentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  heroAccentLeft: {
    position: "absolute",
    top: 8,
    left: 0,
    width: 8,
    height: 150,
  },
  heroInner: {
    padding: 24,
    paddingBottom: 40,
  },
  heroBadge: {
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  heroBadgeText: {
    color: colors.bgPrimary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 54,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 28,
    maxWidth: "90%",
  },
  heroCTA: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  heroStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glassMedium,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
  },
  heroStatNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  heroStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.glassBorder,
  },

  // About Section
  aboutLayout: {
    gap: 20,
  },
  aboutImageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  aboutImageInvertedDFrame: {
    borderTopLeftRadius: 120,
    borderBottomLeftRadius: 120,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    overflow: "hidden",
    padding: 5,
  },
  aboutImageInvertedDInner: {
    borderTopLeftRadius: 112,
    borderBottomLeftRadius: 112,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  aboutImage: {
    width: "100%",
    height: 200,
  },
  aboutImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.3)",
  },
  aboutContent: {
    gap: 12,
  },
  aboutLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1.5,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    lineHeight: 32,
  },
  aboutText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Features Section
  featuresWrapper: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 10,
  },
  featuresBgAccent: {
    width: "100%",
    height: 8,
  },
  featuresInner: {
    padding: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featuresGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureCard: {
    width: "100%",
  },
  featureCardTablet: {
    width: "48%",
  },
  featureIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.bgPrimary,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Steps Section
  stepsContainer: {
    gap: 16,
  },
  stepsContainerTablet: {
    flexDirection: "row",
  },
  stepsColumn: {
    flex: 1,
    backgroundColor: colors.glassLight,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  stepsColumnTablet: {
    flex: 1,
  },
  stepsColumnAlt: {},
  stepsColumnHeader: {
    overflow: "hidden",
  },
  stepsColumnAccent: {
    width: "100%",
    height: 4,
  },
  stepsColumnTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  stepsColumnIcon: {
    fontSize: 20,
  },
  stepsColumnTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textAccent,
  },
  stepsList: {
    padding: 16,
  },
  stepItem: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
    position: "relative",
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberAlt: {
    backgroundColor: colors.secondary,
  },
  stepNumberText: {
    color: colors.bgPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  stepConnector: {
    position: "absolute",
    left: 17,
    top: 40,
    width: 2,
    height: 20,
    backgroundColor: colors.glassBorder,
  },

  // Testimonials Section
  testimonialsWrapper: {
    marginVertical: 10,
  },
  testimonialCarousel: {
    marginTop: 20,
  },
  testimonialSlide: {
    justifyContent: "center",
  },
  testimonialsGrid: {
    gap: 16,
    marginTop: 20,
  },
  testimonialsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  testimonialCard: {
    width: "100%",
  },
  testimonialCardTablet: {
    width: "48%",
  },
  testimonialDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  testimonialDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.glassBorder,
  },
  testimonialDotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPrimary: {
    backgroundColor: colors.primary,
  },
  avatarSecondary: {
    backgroundColor: colors.secondary,
  },
  testimonialAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.bgPrimary,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  testimonialRole: {
    fontSize: 13,
    color: colors.textAccent,
    marginTop: 2,
  },
  testimonialQuote: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonialRating: {
    flexDirection: "row",
    gap: 4,
  },
  testimonialStar: {
    fontSize: 14,
  },

  // CTA Section
  ctaWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.bgSecondary,
    marginVertical: 10,
  },
  ctaAccentTop: {
    width: "100%",
    height: 8,
  },
  ctaAccentBottom: {
    width: "100%",
    height: 8,
  },
  ctaInner: {
    padding: 32,
    alignItems: "center",
  },
  ctaContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 36,
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  ctaButtons: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  // Footer
  footerWrapper: {
    marginTop: 20,
    paddingTop: 20,
  },
  footerAccent: {
    width: "100%",
    height: 6,
    marginBottom: 24,
  },
  footerContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerLogo: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 14,
    color: colors.textAccent,
    marginBottom: 16,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Page Header
  pageHeader: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  pageHeaderGlass: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.22)",
  },
  contactHeader: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 20,
    paddingTop: 28,
    paddingBottom: 26,
  },
  contactTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  contactSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  contactMessageCard: {
    marginHorizontal: -16,
  },
  pageHeaderAccent: {
    width: 120,
    height: 6,
    borderRadius: 3,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },

  // About Page
  aboutAnimatedCard: {
    width: "100%",
  },
  aboutAnimatedValueCard: {
    width: "100%",
  },
  aboutAnimatedValueCardTablet: {
    width: "48%",
  },
  aboutPageImageWrap: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  aboutPageImage: {
    width: "100%",
    height: 180,
  },
  aboutPageText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // Vision
  visionLayout: {
    flexDirection: "row",
    gap: 16,
  },
  visionIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  visionIconRingPrint: {
    ...StyleSheet.absoluteFillObject,
  },
  visionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  visionIcon: {
    fontSize: 24,
    color: colors.bgPrimary,
  },
  visionContent: {
    flex: 1,
  },

  // Values
  valuesSection: {
    marginTop: 10,
  },
  valuesGrid: {
    gap: 16,
  },
  valuesGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  valueCard: {
    width: "100%",
  },
  valueCardTablet: {
    width: "48%",
  },
  valueIcon: {
    marginBottom: 12,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  valueDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Team
  teamSection: {
    marginTop: 10,
  },
  teamGrid: {
    gap: 16,
  },
  teamGridTablet: {
    flexDirection: "row",
  },
  teamCard: {
    width: "100%",
  },
  teamCardTablet: {
    width: "48%",
  },
  teamAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  teamAvatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.bgPrimary,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textAccent,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  teamDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Forms
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputLabelLight: {
    color: "#374151",
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
    color: "#111827",
    borderRadius: 18,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  // Chat Section
  chatSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  chatIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  chatIcon: {
    fontSize: 32,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  chatDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },

  // Stores
  storesList: {},
  storeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 16,
  },
  storeItemBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  storeIconText: {
    fontSize: 20,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  storeDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Social
  socialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  socialIcon: {
    fontSize: 16,
  },
  socialName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.bgPrimary,
  },

  // Auth Screen
  loginHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  loginAccent: {
    width: 100,
    height: 5,
    borderRadius: 3,
    marginVertical: 16,
  },
  loginWordmarkWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  loginWordmarkGlass: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
    shadowColor: "rgba(255, 255, 255, 0.35)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },
  loginWordmarkGlassInner: {
    paddingHorizontal: 26,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  loginWordmarkText: {
    fontSize: 56,
    lineHeight: 64,
    color: "rgba(255, 255, 255, 0.96)",
    fontFamily: loginBrandFontFamily,
    fontStyle: "italic",
    letterSpacing: 0.3,
    textShadowColor: "rgba(255, 255, 255, 0.45)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  loginTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  loginTaglineLight: {
    color: "#1F2937",
  },
  authCard: {
    marginBottom: 24,
  },
  authCardLight: {
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.08)",
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  authTitleLight: {
    color: "#111827",
  },
  authSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  authSubtitleLight: {
    color: "#4B5563",
  },
  authToggle: {
    flexDirection: "row",
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  authToggleLight: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
  },
  authToggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  authToggleBtnLight: {
    backgroundColor: "transparent",
    borderRadius: 14,
  },
  authToggleBtnActive: {
    backgroundColor: colors.primary,
  },
  authToggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  authToggleTextLight: {
    color: "#374151",
  },
  authToggleTextActive: {
    color: colors.bgPrimary,
  },
  roleToggle: {
    flexDirection: "row",
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.bgSecondary,
  },
  roleBtnLight: {
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  roleBtnActive: {
    backgroundColor: colors.glassLight,
    borderColor: colors.primary,
  },
  roleBtnActiveLight: {
    backgroundColor: "#FFFBEB",
  },
  roleIcon: {
    fontSize: 18,
  },
  roleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  roleTextLight: {
    color: "#374151",
  },
  roleTextActive: {
    color: colors.primary,
  },
  errorBox: {
    backgroundColor: "rgba(220, 38, 38, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.3)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorBoxLight: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderRadius: 16,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 14,
    textAlign: "center",
  },
  forgotLink: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  forgotLinkTextLight: {
    color: "#B45309",
  },
  termsText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },
  termsTextLight: {
    color: "#4B5563",
  },

  // Onboarding
  onboardingIntroBody: {
    gap: 14,
  },
  onboardingIntroText: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
  },
  onboardingIntroPills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  onboardingPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassLight,
  },
  onboardingPillText: {
    color: colors.textAccent,
    fontWeight: "600",
    fontSize: 12,
  },
  onboardingFinalWrap: {
    gap: 18,
  },
  onboardingMenuList: {
    gap: 8,
  },
  onboardingMenuItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  onboardingFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    backgroundColor: colors.bgSecondary,
    gap: 10,
  },
  onboardingSkipBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  onboardingSkipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  onboardingDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  onboardingDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.glassBorder,
  },
  onboardingDotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  onboardingActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  onboardingBackBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 10,
    backgroundColor: colors.bgCard,
  },
  onboardingBackText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  onboardingBackPlaceholder: {
    width: 74,
  },
  onboardingNextBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: colors.primary,
  },
  onboardingNextText: {
    color: colors.bgPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
});

// ============================================
// ONBOARDING STYLES (ob)
// ============================================

const ob = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  slideContainer: {
    flex: 1,
  },
  slideBgImage: {
    flex: 1,
  },
  slideBackground: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  slideDarkOverlay: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.78)",
  },
  slideTopPrint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    zIndex: 20,
  },
  slideBottomPrint: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    zIndex: 20,
  },
  slideScrollInner: {
    paddingTop: 60,
    paddingBottom: 180,
    paddingHorizontal: 20,
  },

  slideHeader: {
    marginBottom: 24,
  },
  slideHeaderChip: {
    alignSelf: "flex-start",
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}25`,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
  },
  slideHeaderChipText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1.5,
  },
  slideHeaderTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  slideHeaderSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  slideCard: {
    marginBottom: 16,
  },
  slideImageWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },
  slideImage: {
    width: "100%",
    height: 160,
  },
  slideImageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.2)",
  },
  slideImagePrint: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  slideCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  welcomeLogoArea: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  welcomeLogoBorder: {
    width: 100,
    height: 100,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeLogoInner: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeLogoEmoji: {
    fontSize: 38,
  },
  welcomeBrand: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 8,
  },
  welcomeTextArea: {
    marginBottom: 28,
  },
  welcomeTagline: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.textPrimary,
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: 14,
  },
  welcomeTitleGold: {
    color: colors.primary,
  },
  welcomeDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  welcomeStatsCard: {
    marginBottom: 24,
  },
  welcomeStatsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeStatItem: {
    flex: 1,
    alignItems: "center",
  },
  welcomeStatIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  welcomeStatNum: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.primary,
    letterSpacing: -0.5,
  },
  welcomeStatLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  welcomeStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.glassBorder,
  },
  welcomePillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  welcomePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  welcomePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  welcomePillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  visionRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  missionRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  visionIconRing: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  visionIconRingPrint: {
    ...StyleSheet.absoluteFillObject,
  },
  visionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  visionIconText: {
    fontSize: 20,
    color: colors.bgPrimary,
  },
  visionContent: {
    flex: 1,
  },
  visionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  visionHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },

  featureSlideCard: {
    marginBottom: 12,
  },
  featureSlideRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  featureSlideIconOuter: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  featureSlideIconInner: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureSlideIconText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.bgPrimary,
  },
  featureSlideText: {
    flex: 1,
  },
  featureSlideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  featureSlideDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  featureSlideArrow: {
    fontSize: 18,
    fontWeight: "700",
  },

  stepsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  stepsHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepsHeaderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textAccent,
  },
  stepsHeaderSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  stepsDivider: {
    height: 1,
    backgroundColor: colors.glassBorder,
    marginVertical: 12,
  },
  stepRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  stepTimelineCol: {
    alignItems: "center",
    width: 36,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleText: {
    color: colors.bgPrimary,
    fontWeight: "800",
    fontSize: 14,
  },
  stepLine: {
    width: 3,
    height: 20,
    borderRadius: 1.5,
    overflow: "hidden",
    marginTop: 4,
  },
  stepLinePrint: {
    width: "100%",
    height: "100%",
  },
  stepBody: {
    flex: 1,
    paddingTop: 2,
  },
  stepBodyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 3,
  },
  stepBodyDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  valuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  valueGridCard: {
    width: "47%",
    flexGrow: 1,
  },
  valueGridInner: {
    alignItems: "center",
  },
  valueGridIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  valueGridIcon: {
    opacity: 0.95,
  },
  valueGridTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  valueGridDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },

  sidebarHint: {
    marginBottom: 20,
  },
  sidebarHintHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sidebarHintIcon: {
    fontSize: 22,
  },
  sidebarHintTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },
  sidebarHintDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  sidebarHintList: {
    gap: 10,
  },
  sidebarHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.glassLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  sidebarHintRowIcon: {
    fontSize: 16,
  },
  sidebarHintRowText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
    flex: 1,
  },

  finalCTA: {
    alignItems: "center",
    paddingTop: 8,
  },
  finalCTATitle: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  finalCTADesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  finalCTATrust: {
    flexDirection: "row",
    gap: 20,
  },
  finalCTATrustItem: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },

  controlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10, 10, 10, 0.95)",
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 36 : 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.glassBorder,
    borderRadius: 1.5,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.glassBorder,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  slideCounter: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  controlButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  skipBtnText: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "600",
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backBtnText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    shadowColor: "rgba(255, 215, 0, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  nextBtnFinal: {
    flex: 1,
    marginLeft: 16,
    alignItems: "center",
  },
  nextBtnText: {
    color: colors.bgPrimary,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
