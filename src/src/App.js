import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";
import Station from "./pages/station/Station";
import Footer from "./components/footer/Footer";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <Router basename="/aclimate_susano">
      <Menu />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/estaciones" element={<Station />} />
        <Route path="/dashboard/:idWS" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
