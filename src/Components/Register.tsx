import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importeer useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importeer oog iconen

export default function Register() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate(); // Maak gebruik van useNavigate

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = () => {
    let passwordError = "";
    let confirmPasswordError = "";

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/;

    if (!passwordRegex.test(formValues.password)) {
      passwordError =
        "Wachtwoord moet minimaal 10 karakters lang zijn en minimaal 1 hoofdletter, 1 getal, en 1 speciaal teken bevatten.";
    }

    if (formValues.password !== formValues.confirmPassword) {
      confirmPasswordError = "Wachtwoorden komen niet overeen.";
    }

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !passwordError && !confirmPasswordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword()) {
      // Verzend de gegevens naar de backend
      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("User registered:", data);
          // Na succesvolle registratie, stuur de gebruiker door naar de login pagina
          navigate("/login");
        } else {
          console.error("Registration failed:", data);
        }
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
      <div className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Account aanmaken
        </h2>

        {/* Formulier velden */}
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            Voornaam
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Voornaam invoeren"
            value={formValues.firstName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Achternaam
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Achternaam invoeren"
            value={formValues.lastName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Adres
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Huisadres"
            value={formValues.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium mb-1"
          >
            Postcode
          </label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            placeholder="Postcode invoeren"
            value={formValues.postalCode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            Woonplaats
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Woonplaats invoeren"
            value={formValues.city}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="department"
            className="block text-sm font-medium mb-1"
          >
            Afdeling
          </label>
          <select
            id="department"
            name="department"
            value={formValues.department}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          >
            <option value="">Selecteer afdeling</option>
            <option value="loonwerk">Loonwerk</option>
            <option value="grondwerk">Grondwerk</option>
            <option value="kantoor">Kantoor</option>
            <option value="overige">Overige</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email invoeren"
            value={formValues.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        {/* Wachtwoord en Bevestig Wachtwoord velden */}
        <div className="mb-4 flex items-center relative">
          <input
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            placeholder="Kies een wachtwoord"
            value={formValues.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-4"
          >
            {passwordVisible ? (
              <FaEyeSlash className="text-gray-500" size={20} />
            ) : (
              <FaEye className="text-gray-500" size={20} />
            )}
          </button>
        </div>

        <div className="mb-6 flex items-center relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Bevestig wachtwoord"
            value={formValues.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
          <button
            type="button"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            className="absolute right-4"
          >
            {confirmPasswordVisible ? (
              <FaEyeSlash className="text-gray-500" size={20} />
            ) : (
              <FaEye className="text-gray-500" size={20} />
            )}
          </button>
        </div>

        {/* Footer: Login link + Register knop */}
        <div className="flex items-center justify-between">
          <Link to="/login" className="text-sm text-[#2D4739] hover:underline">
            Al een account? Login
          </Link>
          <button
            onClick={handleSubmit}
            className="bg-[#2D4739] text-white px-6 py-2 rounded-md hover:bg-[#244030]"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
