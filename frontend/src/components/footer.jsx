function Footer() {
  const footerStyle = {
  width:'100vw',
  color: '#ff9900',
};
 const astyle={
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    padding:'1rem',
    position:'relative',
    bottom:0,
 }

  return (
    <footer style={footerStyle}>
      <div className="a" style={astyle}>
        <p>&copy; {new Date().getFullYear()} Web3Persona. All rights reserved. Powered by Moralis, Chainlink & Gemini API</p>
      </div>
    </footer>
  );
}
export default Footer;