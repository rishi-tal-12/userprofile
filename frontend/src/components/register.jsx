import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './register.css';
import Header from "./Header";
import Footer from "./footer";
function Register() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch persona data.");
      }

      const data = await response.json();
      navigate("/persona", { state: { personaData: data } });
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <main className="m">
      <div className="tag">
        <p>Turn transactions into traits. Discover who you are on chain.</p>
      </div>
      <div className="container">
        <form className="wallet-box" onSubmit={handleRegister}>
          <h1>Connect wallet</h1>
          <input
            type="text"
            placeholder="0x1234...abcd"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            required
          />
          <button className="btn" type="submit" disabled={!isValidWallet || loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
          {!isValidWallet && walletAddress && (
            <p className="error" aria-live="polite">Invalid wallet address format.</p>
          )}
        </form>
        {error && <p className="error" aria-live="polite">{error}</p>}
      </div>
    </main>
    <Footer/>
    </>
  );
}

export default Register;
