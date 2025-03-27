import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import PollAnalytics from "./pages/PollAnalytics";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import NominationPage from "./pages/Nomination";
import NominationCard from "./components/NomineeCard";
import About from "./pages/About"; // Import the About component
import Categories from "./pages/Categories"; // Import the Categories component
import NominationSuccess from "./pages/NominationSuccess";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/polls/:id/analytics" element={<PollAnalytics />} />
        <Route path="/vote" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nominate" element={<NominationPage />} />
        <Route path="/nomination-card/:id" element={<NominationCard />} />
        <Route path="/about" element={<About />} /> {/* Add About route */}
        <Route path="/categories" element={<Categories />} /> {/* Add Categories route */}
        <Route path="/nomination-success" element={<NominationSuccess />} />
      </Routes>
    </Router>
  );
}