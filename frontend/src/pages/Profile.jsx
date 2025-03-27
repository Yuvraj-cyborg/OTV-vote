import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }

    fetchUserProfile(token)
      .then((response) => setUser(response.data))
      .catch(() => navigate("/login")); // Redirect if token invalid
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <img
          src={user.photo || "https://via.placeholder.com/150"} // Default image if photo is missing
          alt="Profile"
          className="w-32 h-32 mx-auto rounded-full mb-4"
        />
        <p className="font-bold text-xl">{user.username}</p>
      </div>
    </div>
  );
}
