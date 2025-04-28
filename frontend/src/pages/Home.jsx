import { useEffect, useState } from "react";
import { fetchCategories, fetchNominations, submitVote } from "../api";
import { ChevronDown, Search, Trophy, Instagram, Facebook, Twitter, Youtube, Loader, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import sponsors from "../sponsors";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [votingIds, setVotingIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
        toast.error("Failed to load categories");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Redirect to voting-over page
    navigate("/voting-over");
  }, [navigate]);

  const handleSearch = async () => {
    if (!selectedCategory) {
      toast("Please select a category first!", {
        icon: "⚠️",
        style: {
          background: "#ffb700",
          color: "#000",
        },
      });
      return;
    }
    setLoading(true);
    try {
      const nomineesData = await fetchNominations(selectedCategory.id);
      setNominees(nomineesData.filter((n) => n.status === "approved"));
      if (nomineesData.length === 0) {
        toast("No nominees found for this category", {
          icon: "ℹ️",
        });
      }
    } catch (error) {
      console.error("Error fetching nominees:", error);
      setNominees([]);
      toast.error("Failed to load nominees");
    }
    setLoading(false);
  };

  const handleVote = async (nomineeId) => {
    if (!selectedCategory) {
      toast("Please select a category first!", {
        icon: "⚠️",
        style: {
          background: "#ffb700",
          color: "#000",
        },
        duration: 2000,
      });
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to vote", {
        duration: 2000,
      });
      navigate("/login");
      return;
    }

    // Show immediate loading state
    setVotingIds(prev => [...prev, nomineeId]);
    
    // Show immediate toast
    const toastId = toast.loading("Submitting your vote...");

    try {
      const response = await submitVote({ nominationId: nomineeId, categoryId: selectedCategory.id });

      // Update the loading toast
      if (response.data.warning) {
        toast.dismiss(toastId);
        toast(response.data.warning, {
          icon: "⚠️",
          style: {
            background: "#ffb700",
            color: "#000",
          },
          duration: 2000,
        });
      } else {
        toast.dismiss(toastId);
        toast.success("Vote submitted successfully!", {
          duration: 2000,
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error submitting vote:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to submit vote.", {
        duration: 2000,
      });
    } finally {
      // Remove loading state
      setVotingIds(prev => prev.filter(id => id !== nomineeId));
    }
  };

  const filteredNominees = nominees.filter((nominee) =>
    nominee.nomineeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return null; // No need to render anything as we're redirecting
}