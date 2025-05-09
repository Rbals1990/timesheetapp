import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import tractorAnimatie from "../animaties/tractorAnimatie.json";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2D4739] text-white text-center p-6">
      <div className="w-72 sm:w-96 mb-6">
        <Lottie animationData={tractorAnimatie} loop={true} />
      </div>
      <h2 className="text-3xl font-bold mb-4">Oops... Pagina niet gevonden!</h2>
      <p className="mb-6">Klik hieronder om terug te gaan naar de homepage.</p>
      <Link
        to="/"
        className="bg-white text-[#2D4739] px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition"
      >
        Terug naar Home
      </Link>
    </div>
  );
}
