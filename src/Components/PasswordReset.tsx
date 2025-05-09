import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier komt straks de echte functionaliteit
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-2xl"
      >
        <p className="text-sm mb-6 text-center md:text-left">
          Wachtwoord vergeten? Kan gebeuren! Vul hieronder je mailadres in en je
          ontvangt een herstel link in je mail als je mailadres bekend is. Dit
          kan tot 10 minuten duren. Lukt het niet? Neem dan contact op via de{" "}
          <Link to="/contact" className="text-[#2D4739] underline">
            contactpagina
          </Link>
          .
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <input
            type="email"
            placeholder="E-mailadres invoeren"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739] mb-4 md:mb-0"
          />
          <button
            type="submit"
            className="bg-[#2D4739] text-white px-6 py-2 rounded-md hover:bg-[#244030] w-full md:w-auto"
          >
            Versturen
          </button>
        </div>
      </form>
    </div>
  );
}
