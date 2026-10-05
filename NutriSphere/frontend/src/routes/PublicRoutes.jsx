
import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Features from "../pages/public/Features";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import NotFound from "../pages/public/NotFound";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
