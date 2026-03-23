import "./App.css";

type LandingProps = {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
};

export default function Landing({ onNavigateToLogin, onNavigateToRegister }: LandingProps) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="brand">
          <span className="brand__icon" aria-hidden="true">♻️</span>
          <span className="brand__text">EcoCycle</span>
        </div>
        <nav className="landing-nav">
          <button onClick={onNavigateToLogin} className="landing-link">Login</button>
          <button onClick={onNavigateToRegister} className="landing-link landing-link--primary">Sign Up</button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-content">
            <h1>Turn Waste into Value. Make Your Community Greener.</h1>
            <p>
              Join EcoCycle to connect households, businesses, and recyclers in one
              sustainable ecosystem. Start your contribution from simple daily actions.
            </p>
          </div>
          <div className="landing-pill-grid" aria-hidden="true">
            <div className="landing-pill">Recycle &amp; Earn</div>
            <div className="landing-pill">Community Impact</div>
            <div className="landing-pill">Track &amp; Reward</div>
            <div className="landing-pill">Sustainable Step</div>
          </div>
        </section>

        <section className="landing-hero-image">
          <img
            src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1500&q=80"
            alt="Plastic waste and paper trash on the ground"
          />
        </section>

        <section className="landing-mission">
          <div className="mission-copy">
            <h2>Our Mission is Turning Waste into Valuable Resources</h2>
            <p>
              We believe every piece of waste can become useful material when managed
              properly. EcoCycle helps citizens and recycling partners collaborate
              through a simple digital workflow.
            </p>
          </div>
          <img
            className="mission-image"
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
            alt="Colorful recycled plastic materials"
          />
        </section>

        <section className="landing-learn">
          <h3>Learn Simple Ways to Manage Waste Effectively</h3>
          <p>Start from your home, influence your neighborhood.</p>
          <div className="landing-features">
            <div className="feature-card">
              <h4>Waste Drop</h4>
              <p>Record waste items and schedule drop-offs with nearby partners.</p>
            </div>
            <div className="feature-card">
              <h4>Recycle Partner</h4>
              <p>Find verified collectors and recycling centers around your area.</p>
            </div>
            <div className="feature-card">
              <h4>Impact Track</h4>
              <p>See your contribution with measurable recycling metrics.</p>
            </div>
            <div className="feature-card">
              <h4>Eco Activity</h4>
              <p>Join events and community programs to keep your city cleaner.</p>
            </div>
          </div>
        </section>

        <section className="landing-cta">
          <h3>Start Making a Difference Today</h3>
          <p>Ready to be part of the circular economy movement?</p>
          <div className="landing-actions">
            <button onClick={onNavigateToRegister} className="landing-button">Get Started</button>
            <button onClick={onNavigateToLogin} className="landing-button landing-button--secondary">Log In</button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div>© {new Date().getFullYear()} EcoCycle</div>
        <div className="footer-nav">
          <button onClick={onNavigateToLogin} className="footer-link">Login</button>
          <button onClick={onNavigateToRegister} className="footer-link">Sign Up</button>
        </div>
      </footer>
    </div>
  );
}
