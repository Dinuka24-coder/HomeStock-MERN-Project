import Layout from "../components/Layout";
import "../styles/Home.css"; 
import { Link } from "react-router-dom";


function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <br></br>
      <br></br>
      <div className="hero">
        <div className="hero-content">
          <h1>Home page for the system</h1>
         
          
        </div>
      </div>

      {/* Features Section */}
      <div className="features" id="features">
        <h2>Fucntions inside the system</h2>
        <div className="feature-container">
          
          <div className="feature-box">
            
          </div>

          
          <div className="feature-box">
            
          </div>

          
          <div className="feature-box">
            
          </div>
        </div>
      </div>

      
    </Layout>
  );
}

export default Home;