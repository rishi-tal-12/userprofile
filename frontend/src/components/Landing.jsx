import { useNavigate } from "react-router-dom";
import "./Landing.css";
import img1 from "../assets/im1.png";
import img2 from "../assets/im2.png";
import img3 from "../assets/im3.png";
import img4 from "../assets/im4.png";
import Footer from "./footer";
function LandingPage() {
  const navigate = useNavigate();

  const handleConnectWalletClick = () => {
    navigate('/register');
  };

  return (
    <>
    <div className="app">
      <header className="header">
        <button className="connect-wallet" onClick={handleConnectWalletClick}>
          Connect Wallet
        </button>
        <button className="demo-mode">Demo mode</button>
      </header>

      <main className="main">
        <h1 className="title">Web3 Personas</h1>
        <p className="subtitle">Discover who you are on-chain</p>

        <div className="personas">
          <div className="per">
            <img src={img1} />
          </div>
          <div className="per">
            <img src={img2}/>
          </div>
          <div className="per">
            <img src={img3}/>
          </div>
          <div className="per">
            <img src={img4}/>
          </div>
        </div>

        
      </main>
      <footer>
        <section className="about">
          <h2>About</h2>
          <h3>HOW IT WORKS</h3>
          <ol>
            <li>Sign in with your wallet</li>
            <li>Get your persona</li>
            <li>Explore others</li>
          </ol>
        </section>
      </footer>
      
    </div>
    <Footer/>
    </>
    
  );
}

export default LandingPage;