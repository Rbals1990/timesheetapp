import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  // Login check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");

    if (isLoggedIn !== "true" || !storedUser) {
      navigate("/login");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-[#2D4739] text-white min-h-screen px-4 py-8">
      {/* Welkom sectie */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold">
          Welkom{user?.firstName ? `, ${user.firstName}` : ""}
        </h2>
      </div>

      {/* Grid met 3 secties */}
      <div className="grid gap-6 mb-8 sm:grid-cols-1 md:grid-cols-3">
        {/* Nieuwe registratie div */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold">Nieuwe registratie</h3>
          <Link
            to="/newregistration"
            className="text-[#2D4739] hover:underline"
          >
            <button className="mt-4 px-6 py-2 rounded-md bg-[#2D4739] text-white hover:bg-[#244030]">
              Ga naar registratie
            </button>
          </Link>
        </div>

        {/* Week overzicht div */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold">Week overzicht</h3>
          <Link to="/weeklyoverview" className="text-[#2D4739] hover:underline">
            <button className="mt-4 px-6 py-2 rounded-md bg-[#2D4739] text-white hover:bg-[#244030]">
              Ga naar overzicht
            </button>
          </Link>
        </div>

        {/* Profiel div */}
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold">Profiel</h3>
          <Link to="/profile" className="text-[#2D4739] hover:underline">
            <button className="mt-4 px-6 py-2 rounded-md bg-[#2D4739] text-white hover:bg-[#244030]">
              Ga naar profiel
            </button>
          </Link>
        </div>
      </div>

      {/* Container voor knoppen: Flex container voor mobiele apparaten, Absolute positionering voor grote schermen */}
      <div className="flex justify-between mt-8 sm:flex-col md:absolute md:bottom-8 md:right-8 md:flex-row w-full sm:w-auto">
        <div className="w-full sm:w-auto mb-4 md:mb-0">
          <Link to="/contact">
            <button className="w-full sm:w-auto px-6 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 mr-2">
              Contact
            </button>
          </Link>
        </div>

        <div className="w-full sm:w-auto">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 ml-2"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
