import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Stethoscope, Sparkles, ArrowRight, 
  PhoneOff, Video, MessageSquare, Star, Smile, Users, 
  Utensils, Brain
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate(`/register?email=${encodeURIComponent(email.trim())}`);
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="landing-wrapper">
      {/* Background Organic Ambient Shapes */}
      <div className="hero-bg-curve-left" />
      <div className="hero-bg-curve-right" />

      {/* Top Header / Navigation Bar */}
      <header className="landing-nav-container">
        <Link to="/" className="landing-brand">
          <div className="brand-icon-box">+</div>
          <span className="brand-text">NutriSphere</span>
        </Link>

        <nav>
          <ul className="landing-nav-links">
            <li><Link to="/" className="landing-nav-link active">Home</Link></li>
            <li><a href="#services" className="landing-nav-link">Services</a></li>
            <li><a href="#specialists" className="landing-nav-link">Specialists</a></li>
            <li><a href="#diet-plans" className="landing-nav-link">Diet Plans</a></li>
            <li><Link to="/contact" className="landing-nav-link">Contact Us</Link></li>
          </ul>
        </nav>

        <div className="landing-nav-actions">
          {user ? (
            <Link to={`/${user.role?.toLowerCase() || "patient"}`} className="landing-btn-primary">
              My Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="landing-btn-login">Login</Link>
              <Link to="/register" className="landing-btn-primary">Get App</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Left Content Column */}
        <div className="hero-content">
          <h1 className="hero-title">
            Save time.<br />
            Healthcare online
          </h1>

          <p className="hero-subtitle">
            Now you do not need to download thousands of applications when there is one unified clinical ecosystem for doctors, dietitians, and precision medical nutrition.
          </p>

          {/* Email CTA Pill Input */}
          <form onSubmit={handleGetStarted} className="hero-cta-pill">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="hero-cta-input"
            />
            <button type="submit" className="hero-cta-submit">
              Get Started
            </button>
          </form>

          {/* Metrics Social Proof */}
          <div className="hero-metrics-row">
            <div className="metric-item">
              <div className="metric-number">
                4.9 <span className="metric-star">★</span>
              </div>
              <div className="metric-label">
                Average platform specialist rating.
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-number">HHS</div>
              <div className="metric-label">
                All government licenses and certificates.
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-number">2M+</div>
              <div className="metric-label">
                Online consultations number last year.
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Column - Interactive Doctor Card Visual Stack */}
        <div className="hero-visual-wrapper">
          {/* Main Doctor Hero Card */}
          <div className="doctor-hero-card">
            <img
              src="/images/doctor_hero.jpg"
              alt="Dr. Marcus Sterling"
              className="doctor-photo"
            />

            {/* Doctor Card Bottom Overlay */}
            <div className="doctor-card-overlay">
              <div className="doctor-info-text">
                <span className="doctor-role-tag">Cardiology & Internal Medicine</span>
                <span className="doctor-name-title">Dr. Marcus Sterling, MD</span>
              </div>

              {/* Call Control Widget */}
              <div className="doctor-controls-row">
                <button type="button" className="ctrl-btn ctrl-btn-camera" title="Camera controls">
                  <Video size={18} />
                </button>
                <button type="button" className="ctrl-btn ctrl-btn-call" title="End / Start Consultation">
                  <PhoneOff size={20} />
                </button>
                <button type="button" className="ctrl-btn ctrl-btn-chat" title="Message doctor">
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Toast: Patient Incoming Note */}
          <div className="floating-patient-toast">
            <img
              src="/images/patient_avatar.jpg"
              alt="Sarah Ruby"
              className="patient-toast-avatar"
            />
            <div className="patient-toast-content">
              <span className="patient-toast-name">Sarah Ruby</span>
              <span className="patient-toast-sub">Doctor, I need your help with my low-sodium plan</span>
            </div>
          </div>

          {/* Floating Widget: Online Queue */}
          <div className="floating-queue-widget">
            <div className="queue-header">
              <span>Online queue</span>
              <Users size={14} color="#0284c7" />
            </div>
            <div className="queue-count">48</div>
            {/* SVG Area Pulse Chart */}
            <svg viewBox="0 0 100 30" className="queue-chart-svg">
              <defs>
                <linearGradient id="queueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,22 Q15,25 30,16 T60,18 T85,8 T100,12 L100,30 L0,30 Z"
                fill="url(#queueGrad)"
              />
              <path
                d="M0,22 Q15,25 30,16 T60,18 T85,8 T100,12"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="85" cy="8" r="3.5" fill="#ef4444" />
            </svg>
          </div>

          {/* Floating Ambient Circles & Badges */}
          <div className="floating-circle-badge badge-star">
            <Star size={20} fill="#ffffff" stroke="#ffffff" />
          </div>

          <div className="floating-circle-badge badge-user">
            <Users size={18} />
          </div>

          <div className="floating-circle-badge badge-smile">
            <Smile size={18} />
          </div>

          {/* Floating User Avatar Badge (Bottom Right) */}
          <div className="floating-user-circle">
            <img
              src="/images/user_avatar.jpg"
              alt="Connected User"
              className="user-circle-img"
            />
            <div className="user-circle-dot" />
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section id="services" className="landing-section">
        <div className="section-header">
          <span className="section-tag">Clinical Ecosystem</span>
          <h2 className="section-title">Everything Connected in One Place</h2>
          <p className="section-desc">
            Seamlessly linking patient data, doctor oversight, clinical dietitian guidance, and therapeutic nutrition.
          </p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box">
              <Stethoscope size={26} />
            </div>
            <h3 className="service-title">Board-Certified Doctors</h3>
            <p className="service-text">
              Direct access to licensed cardiologists, endocrinologists, gastroenterologists, and nephrologists with verified credentials.
            </p>
            <Link to="/register" style={{ color: "#0284c7", fontWeight: 600, textDecoration: "none", marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Explore Physicians <ArrowRight size={14} />
            </Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <Sparkles size={26} />
            </div>
            <h3 className="service-title">Clinical Dietitians</h3>
            <p className="service-text">
              20+ specialized Registered Dietitians (RD) linked directly under supervising physicians for hypertension, diabetes, and gastro health.
            </p>
            <Link to="/register" style={{ color: "#0284c7", fontWeight: 600, textDecoration: "none", marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Find a Dietitian <ArrowRight size={14} />
            </Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <Brain size={26} />
            </div>
            <h3 className="service-title">Multidimensional Reality Score</h3>
            <p className="service-text">
              Continuous feasibility algorithms evaluate dietary adherence, clinical safety, biological markers, and daily nutrition targets.
            </p>
            <Link to="/register" style={{ color: "#0284c7", fontWeight: 600, textDecoration: "none", marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              Learn More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="service-card">
            <div className="service-icon-box">
              <Utensils size={26} />
            </div>
            <h3 className="service-title">Therapeutic Meal Kitchens</h3>
            <p className="service-text">
              Verified clinical kitchens prepare doctor-prescribed, allergen-safe meals delivered directly to your doorstep.
            </p>
            <Link to="/register" style={{ color: "#0284c7", fontWeight: 600, textDecoration: "none", marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              View Menus <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Specialists Spotlight */}
      <section id="specialists" className="landing-section" style={{ background: "#f8fafc", borderRadius: "32px" }}>
        <div className="section-header">
          <span className="section-tag">Supervising Clinicians</span>
          <h2 className="section-title">Verified Specialists You Can Trust</h2>
          <p className="section-desc">
            All specialists hold verified medical licenses and oversee individualized patient protocols.
          </p>
        </div>

        <div className="doctors-preview-grid">
          <div className="doctor-preview-card">
            <div className="doctor-preview-avatar">MS</div>
            <div className="doctor-preview-body">
              <h4 className="doctor-preview-name">Dr. Marcus Sterling, MD</h4>
              <div className="doctor-preview-spec">Preventive Cardiology & Internal Med (FACC)</div>
              <div className="doctor-preview-hosp">Boston Cardiovascular Center • License: MD-MA-481920</div>
            </div>
          </div>

          <div className="doctor-preview-card">
            <div className="doctor-preview-avatar">EC</div>
            <div className="doctor-preview-body">
              <h4 className="doctor-preview-name">Dr. Eleanor Chen, MD, PhD</h4>
              <div className="doctor-preview-spec">Endocrinology & Diabetes Telemetry (FACE)</div>
              <div className="doctor-preview-hosp">New England Endocrine Institute • License: MD-MA-512034</div>
            </div>
          </div>

          <div className="doctor-preview-card">
            <div className="doctor-preview-avatar">TA</div>
            <div className="doctor-preview-body">
              <h4 className="doctor-preview-name">Dr. Tariq Al-Mansoor, MD</h4>
              <div className="doctor-preview-spec">Gastroenterology & Gut Microbiome (FACG)</div>
              <div className="doctor-preview-hosp">Tufts Digestive Disease Center • License: MD-MA-639102</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section id="diet-plans" className="landing-section">
        <div className="landing-cta-banner">
          <h2 className="cta-banner-title">Ready for Smarter Clinical Healthcare?</h2>
          <p className="cta-banner-desc">
            Join thousands of patients and leading medical practitioners today. Get your tailored clinical diet plan and access your health team online.
          </p>
          <Link to="/register" className="cta-banner-btn">
            Get Started Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 NutriSphere Clinical Intelligence Platform. HIPAA / HHS Compliant. All rights reserved.</p>
      </footer>
    </div>
  );
}
