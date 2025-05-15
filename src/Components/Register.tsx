import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API_URL from "../utils/config";

export default function Register() {
  const [formValues, setFormValues] = useState<Record<string, string>>({
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

  const navigate = useNavigate();

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
      try {
        const response = await fetch(`${API_URL}/register`, {
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
          navigate("/login");
        } else {
          alert(data.message || "Registratie mislukt.");
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

        {/* Algemene gegevens */}
        {[
          {
            label: "Voornaam",
            name: "firstName",
            type: "text",
            placeholder: "Voornaam",
          },
          {
            label: "Achternaam",
            name: "lastName",
            type: "text",
            placeholder: "Achternaam",
          },
          {
            label: "Adres",
            name: "address",
            type: "text",
            placeholder: "Straatnaam en huisnummer",
          },
          {
            label: "Postcode",
            name: "postalCode",
            type: "text",
            placeholder: "1234 AB",
          },
          {
            label: "Stad",
            name: "city",
            type: "text",
            placeholder: "Woonplaats",
          },
          {
            label: "Afdeling",
            name: "department",
            type: "text",
            placeholder: "Bijv. Loonwerk, Grondwerk",
          },
          {
            label: "Email",
            name: "email",
            type: "email",
            placeholder: "Email invoeren",
          },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium mb-1"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formValues[field.name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
            />
          </div>
        ))}

        {/* Wachtwoord */}
        <div className="mb-1 flex items-center relative">
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
        {errors.password && (
          <p className="text-sm text-red-600 mb-4">{errors.password}</p>
        )}

        {/* Bevestig wachtwoord */}
        <div className="mb-1 flex items-center relative">
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
        <p className="text-sm text-gray-500">
          Let op! Wachtwoord moet minimaal 10 karakters lang zijn en minimaal 1
          hoofdletter, 1 getal, en 1 speciaal teken bevatten.{" "}
        </p>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 mb-6">{errors.confirmPassword}</p>
        )}

        {/* Footer */}
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
