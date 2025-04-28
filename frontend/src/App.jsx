import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import NominationPage from "./pages/Nomination";
import NominationCard from "./components/NomineeCard";
import About from "./pages/About"; // Import the About component
import Categories from "./pages/Categories"; // Import the Categories component
import NominationSuccess from "./pages/NominationSuccess";
import AboutUs from "./pages/AboutUs"; // Import the new AboutUs component
import ContactUs from "./pages/ContactUs"; // Import the ContactUs component
import Terms from "./pages/Terms"; // Import the Terms component
import PriceDetail from "./pages/PriceDetail"; // Import the PriceDetail component
import RefundPolicy from "./pages/RefundPolicy"; // Import the RefundPolicy component
import PrivacyPolicy from "./pages/Privay"; // Import the PrivacyPolicy component
import Rules from "./pages/Rules"; // Import the Rules component
import VotingOver from "./pages/VotingOver"; // Import the VotingOver component

// Protected Route component
const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  
  // Check if the token is valid (matches our specific admin credentials)
  const isValidAdmin = adminToken === btoa("admin@odishatv.in:Odishatv@password");
  
  if (!isValidAdmin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

export default function App() {
  // No longer need subdomain checking - we're redirecting at the Vercel level
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
        <Route path="/vote" element={<VotingOver />} /> {/* Redirect vote to voting-over */}
        <Route path="/voting-over" element={<VotingOver />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nominate" element={<VotingOver />} /> {/* Redirect nominate to voting-over */}
        <Route path="/nomination-card/:id" element={<NominationCard />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/categories" element={<Categories />} />
        <Route path="/nomination-success" element={<NominationSuccess />} />
        <Route path="/about-us" element={<AboutUs />} /> 
        <Route path="/contact-us" element={<ContactUs />} /> 
        <Route path="/terms" element={<Terms />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/price-detail" element={<PriceDetail />} /> 
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}