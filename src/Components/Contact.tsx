import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Toon de pop-up
    setPopupVisible(true);

    // Na 3 seconden terugsturen naar de homepagina
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    setCharCount(newMessage.length);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black rounded-2xl shadow-lg p-8 w-full max-w-2xl"
      >
        <p className="text-sm mb-6 text-center md:text-left">
          Mis je iets of loop je ergens tegenaan? Vervelend om te horen. Laat je
          naam en bericht achter en we nemen zo snel mogelijk contact op om je
          uit de brand te helpen. Liever niet wachten? Dan kun je ons bereiken
          op het mailadres of telefoonnummer onderaan de pagina.
        </p>

        {/* Naam */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Je naam
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vul je naam in"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739]"
          />
        </div>

        {/* Bericht */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Je bericht
          </label>
          <textarea
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Vul je bericht in (max 250 tekens)"
            maxLength={250}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2D4739] h-32 resize-none"
          />
          <p className="text-xs text-right mt-1">{charCount} / 250</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <button
            type="submit"
            className="bg-[#2D4739] text-white px-6 py-2 rounded-md hover:bg-[#244030] w-full md:w-auto"
          >
            Versturen
          </button>
        </div>

        {/* Contact info */}
        <div className="mt-4 text-sm text-center md:text-left">
          <p>
            Tel. nr: <span className="text-[#2D4739]">06-12345678</span>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:testmail@gmail.com" className="text-[#2D4739]">
              testmail@gmail.com
            </a>
          </p>
        </div>
      </form>

      {/* Popup voor bevestiging */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-[#2D4739] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-semibold text-[#2D4739]">
              Uw bericht is verstuurd!
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              U keert nu terug naar de homepagina.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Dit venster verdwijnt over 3 seconden...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
