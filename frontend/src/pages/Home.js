import Layout from "../components/Layout";
import "../styles/Home.css"; // Import the CSS file
import { Link } from "react-router-dom";


function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <br></br>
      <br></br>
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to HomeStock Management 🎉</h1>
          <p>Manage your household inventory, expenses, and more with ease!</p>
          <a href="#features" className="cta-button">Explore Features</a>
        </div>
      </div>

      {/* Features Section */}
      <div className="features" id="features">
        <h2>Why Use HomeStock?</h2>
        <div className="feature-container">
          {/* Feature 1 */}
          <div className="feature-box">
            <img src="https://img.icons8.com/ios-filled/100/4CAF50/box.png" alt="Inventory" />
            <h3>Easy Inventory Management</h3>
            <Link to="/inventory" className="cta-button">Let's Get Started</Link>
            <p>Track your items and update stock in real-time. Never run out of essentials again!</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-box">
            <img src="https://img.icons8.com/?size=100&id=W10pPgooqTRv&format=png&color=000000" alt="Expenses" />
            <h3>Expenses Management</h3>
            <Link to="/expenses" className="cta-button">Let's Get Started</Link>
            <p>Monitor your expenses and budget effectively. Stay in control of your finances.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-box">
            <img src="https://img.icons8.com/ios-filled/100/FF5722/settings.png" alt="Automation" />
            <h3>Automation</h3>
            <p>Automate inventory tracking and get alerts when stock is low. Save time and effort!</p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of users who are simplifying their household management with HomeStock.</p>
        <Link to="/register" className="cta-button">Sign Up Now</Link>
      </div>
    </Layout>
  );
}

export default Home;