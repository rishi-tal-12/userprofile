import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./persona.css";
import Header from "./Header";
import Footer from "./footer";
const attributeIcons = {
  Dexterity: "🦾",
  Wisdom: "🧠",
  Strength: "💪",
  Constitution: "🛡️",
  Charisma: "🌟",
  Intelligence: "📚",
};

function Persona() {
  const location = useLocation();
  const navigate = useNavigate();
  const personaData = location.state?.personaData;
   
  console.log("personaData", personaData);

  // Redirect to home if no persona data
  React.useEffect(() => {
    if (!personaData) {
      navigate("/", { replace: true });
    }
  }, [personaData, navigate]);

  if (!personaData) return null;

  const { persona, visualization } = personaData;
  const { attributes = [], personalityArchetype = {} } = persona || {};

  return (
    <>
    <Header/>
    <main className="persona">
      <div className="tag">
       <h1>{personalityArchetype.name || "No Archetype"}</h1>
      </div>
      <div className="display">
        
        {visualization && (
        <div className="image">
          <img
            src={`data:${visualization.mimeType};base64,${visualization.image}`}
            alt="Persona"
            className="im"
          />
          <p>{personalityArchetype.description || "No description available."}</p>
        </div>
      )}
        <div className="boxes">
          {Array.isArray(attributes) && attributes.length > 0 ? (
            attributes.map(attr => (
              <div className="box" key={attr.id}>
                <div className="info">
                  <h3>{attributeIcons[attr.name] || "❓"} {attr.name} : {attr.value}</h3>
                  <p className="desc">{attr.parentheticalDescription}</p>
                  <p className="detail">{attr.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No attributes available.</p>
          )}
        </div>

      </div>
    </main>
    <Footer/>
    </>
  );
}

export default Persona;
