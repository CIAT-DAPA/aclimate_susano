import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Station from "./pages/station/Station";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/estaciones" element={<Station />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
