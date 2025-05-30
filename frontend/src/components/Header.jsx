import { Link } from "react-router-dom";
import "./header.css";
function Header() {
  return (
    <header className="h">
      
        <nav>
            <ul className="list">
            <li><h4>Web3Persona</h4></li>
            <div className="b">
              <li><Link to="/" className="l">Home</Link></li>
            <li><Link to="/register" className="l" id="demo-mode">Demo Mode</Link></li>
            </div>
            
        </ul>
        </nav>

    </header>
  );
}
export default Header;