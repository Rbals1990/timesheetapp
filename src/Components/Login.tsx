import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../utils/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verstuur de login gegevens naar de server
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login succesvol, navigeer naar de homepagina
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);

        navigate("/"); // Je kunt hier de home route aanpassen naar de juiste route
      } else {
        // Toon foutmelding
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden. Probeer het later opnieuw.");
      console.error("Login fout:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
      <div className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Gebruikersnaam */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        {/* Wachtwoord */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        {/* Foutmelding */}
        {errorMessage && (
          <p className="text-red-500 text-xs mb-4">{errorMessage}</p>
        )}

        {/* Footer: Forgot password + Login knop */}
        <div className="flex items-center justify-between">
          <Link
            to="/passwordreset"
            className="text-sm text-[#2D4739] hover:underline"
          >
            Wachtwoord vergeten?
          </Link>
          <Link
            to="/register"
            className="text-sm text-[#2D4739] hover:underline"
          >
            Registreer hier
          </Link>

          <button
            onClick={handleSubmit}
            className="bg-[#2D4739] text-white px-6 py-2 rounded-md hover:bg-[#244030]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
