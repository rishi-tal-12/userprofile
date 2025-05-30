import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Landing';
import Register from './components/register';
import Persona from './components/persona';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/persona" element={<Persona />} />
      </Routes>
    </Router>
  );
}

export default App;
