import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const NominationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Nomination Submitted Successfully!</h1>
          <p className="text-gray-300 mb-8">
            Thank you for your nomination to the Influencer Awards 2025.
          </p>
          <p className="text-gray-400 text-sm">
            You will be redirected to the home page shortly...
          </p>
        </div>
      </div>
    </div>
  );
};

export default NominationSuccess;