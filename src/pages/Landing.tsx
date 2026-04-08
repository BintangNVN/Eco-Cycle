import "../styles/css/landing.css";
import { FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type LandingProps = {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
};

const navIcons = [
  {
    title: "Recycle & Sell",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
        <path d="M7 19H4.5A2.5 2.5 0 0 1 2 16.5v0A2.5 2.5 0 0 1 4.5 14H7" />
        <path d="M17 5h2.5A2.5 2.5 0 0 1 22 7.5v0A2.5 2.5 0 0 1 19.5 10H17" />
        <path d="M3 10h18M3 14h18" />
        <path d="M12 2v20M9 5l3-3 3 3M9 19l3 3 3-3" />
      </svg>
    ),
  },
  {
    title: "Community Impact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Track & Reward",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Sustainable Tips",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="28" height="28">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
];

const educationCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="1.8" width="26" height="26">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Reduce Waste",
    desc: "Learn practical strategies to reduce daily waste at home.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="1.8" width="26" height="26">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" />
      </svg>
    ),
    title: "Recycle Properly",
    desc: "Understand how to sort and recycle waste correctly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="1.8" width="26" height="26">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <path d="M22 2L12 12" />
      </svg>
    ),
    title: "Organic Waste",
    desc: "Discover how to turn organic waste into compost.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="1.8" width="26" height="26">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Eco Lifestyle",
    desc: "Adopt simple habits that make a positive environmental impact.",
  },
];

export default function Landing({ onNavigateToLogin, onNavigateToRegister }: LandingProps) {
  return (
    <div className="lp">
      {/* NAVBAR */}
      <nav className="lp-nav">
        <div className="lp-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2" width="20" height="20">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          EcoCycle
        </div>

        <div className="lp-nav-links">
          <button className="lp-nav-link lp-nav-link--active">Home</button>
          <button className="lp-nav-link">About Us</button>
          <button className="lp-nav-link">Education</button>
        </div>

        <div className="lp-nav-right">
          <button className="btn-signup" onClick={onNavigateToRegister}>Sign Up</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="hero-left">
          <h1>Turn Waste into Value. Make Your Community Greener.</h1>
        </div>
        <div className="hero-right">
          <p>
            Join EcoCycle and contribute to a sustainable future.
            Sell, buy or recycle products responsibly with our eco-friendly marketplace.
          </p>
          <button className="hero-cta" onClick={onNavigateToRegister}>
            Discover Marketplace
          </button>
        </div>
      </section>

      {/* ICON STRIP */}
      <section className="lp-icon-strip">
        {navIcons.map((item) => (
          <div className="icon-strip-item" key={item.title}>
            <div className="icon-strip-icon">{item.icon}</div>
            <span>{item.title}</span>
          </div>
        ))}
      </section>

      {/* HERO IMAGE */}
      <section className="lp-hero-image">
        <img
          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200&q=80"
          alt="Waste on ground"
        />
      </section>

      {/* ABOUT / MISSION */}
      <section className="lp-mission">
        <div className="mission-text">
          <p className="section-label">About Us</p>
          <h2>Our Mission is Turning Waste into Valuable Resources</h2>
          <p className="mission-body">
            EcoCycle empowers communities to manage waste responsibly by connecting
            individuals, businesses, and recyclers. From plastic bottles to organic waste,
            every contribution helps create a cleaner and more sustainable environment.
          </p>
        </div>
        <div className="mission-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80"
            alt="Recycled bottles"
          />
        </div>
      </section>

      {/* EDUCATION */}
      <section className="lp-learn">
        <p className="section-label section-label--center">Education</p>
        <h2 className="learn-title">Learn Simple Ways to Manage Waste Effectively</h2>
        <p className="learn-sub">Simple guides to help you reduce, reuse, and recycle effectively.</p>
        <div className="features-grid">
          {educationCards.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="lp-cta">
        <h3>Start Making a Difference Today</h3>
        <p>Join EcoCycle and turn your waste into something valuable for a better environment.</p>
        <button className="cta-btn" onClick={onNavigateToRegister}>Get Started</button>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-left">
          <div className="footer-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1a8c7a" strokeWidth="2" width="18" height="18">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            EcoCycle
          </div>
          <p className="footer-desc">
            EcoCycle empowers communities to manage waste responsibly
            and turn it into valuable resources for a sustainable future.
          </p>
          <div className="footer-socials">
            <span className="social-icon">
              {FaLinkedin({})}
            </span>

            <span className="social-icon">
              {FaXTwitter({})}
            </span>

            <span className="social-icon">
              {FaTiktok({})}
            </span>

            <span className="social-icon">
              {FaInstagram({})}
            </span>
          </div>
        </div>  

        <div className="footer-right">
          <p className="footer-nav-title">Navigation</p>
          <button className="footer-nav-link">Home</button>
          <button className="footer-nav-link">About Us</button>
          <button className="footer-nav-link">Education</button>
        </div>
      </footer>

      <div className="footer-bottom">
        © 2026 EcoCycle. All rights reserved.
      </div>
    </div>
  );
}