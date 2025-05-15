import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import API_URL from "../utils/config";

const defaultDay = { start: "", end: "", break: "", travel: "" };
const weekDays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

export default function NewRegistration() {
  const navigate = useNavigate();
  const [weekNumber, setWeekNumber] = useState<string>("");
  const [form, setForm] = useState(
    Object.fromEntries(weekDays.map((day) => [day, { ...defaultDay }]))
  );
  const [remarks, setRemarks] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState<ErrorsState>({});

  const contractHours = 40;
  type DayField = "start" | "end" | "break" | "travel";
  type ErrorFields = Partial<Record<DayField, boolean>>;
  type ErrorsState = Partial<Record<string, ErrorFields>>;

  const handleChange = (day: string, field: DayField, value: string) => {
    setForm((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const validateField = (day: string, field: DayField, value: string) => {
    setErrors((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: !value,
      },
    }));
  };

  const calculateTotalTime = (start: string, end: string, pause: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    let totalMinutes = (h2 - h1) * 60 + (m2 - m1);
    totalMinutes -= parseInt(pause) || 0;
    return Math.max(totalMinutes, 0);
  };

  const totalWorkedMinutes = Object.values(form).reduce((sum, entry) => {
    const worked = calculateTotalTime(entry.start, entry.end, entry.break);
    const travel = parseInt(entry.travel) || 0;
    return sum + worked + travel;
  }, 0);

  const totalBreakMinutes = Object.values(form).reduce((sum, entry) => {
    return sum + parseInt(entry.break || "0");
  }, 0);

  const hoursWorked = ((totalWorkedMinutes - totalBreakMinutes) / 60).toFixed(
    2
  );
  const overUnder = (parseFloat(hoursWorked) - contractHours).toFixed(2);

  const isFormValid = () =>
    weekNumber &&
    weekDays.every(
      (day) => form[day].start && form[day].end && form[day].break
    );

  type DayEntry = {
    start: string;
    end: string;
    break: string;
    travel: string;
  };

  type Payload = {
    userId: string;
    weekNumber: string;
    data: Record<string, DayEntry>;
    remarks: string;
    totalHours: string;
    overUnderHours: string;
    createdAt: string;
  };

  type User = {
    firstName: string;
    lastName: string;
  };

  const exportToExcel = (_payload: Payload, user: User) => {
    const year = new Date().getFullYear();
    const headerText = `Week ${weekNumber} ${year} ingediend door: ${user.firstName} ${user.lastName}`;

    const sheetData = [];

    // Titel op de eerste rij
    sheetData.push([headerText]);
    // Lege rij
    sheetData.push([]);

    // Kolomkoppen
    sheetData.push([
      "Dag",
      "Starttijd",
      "Eindtijd",
      "Pauze",
      "Reistijd",
      "Gewerkte uren",
    ]);

    // Gegevens per dag
    weekDays.forEach((day) => {
      const entry = form[day];
      const totalHours = (
        calculateTotalTime(entry.start, entry.end, entry.break) / 60
      ).toFixed(2);
      sheetData.push([
        day,
        entry.start,
        entry.end,
        `${entry.break} min`,
        `${entry.travel} min`,
        totalHours,
      ]);
    });

    // Lege rij
    sheetData.push([]);

    // Footer
    sheetData.push(["Totaal gewerkte uren", "", "", "", "", hoursWorked]);
    sheetData.push(["Over/onder contract", "", "", "", "", overUnder]);
    sheetData.push(["Opmerkingen", "", "", "", "", remarks]);

    // Maak sheet en werkboek
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Urenregistratie");

    const blob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const filename = `urenregistratie-week-${weekNumber}-${user.firstName}-${user.lastName}.xlsx`;
    saveAs(new Blob([blob]), filename);
  };

  const handleSubmit = async () => {
    const newErrors: ErrorsState = {};
    let hasError = false;

    weekDays.forEach((day) => {
      const dayErrors: Partial<Record<DayField, boolean>> = {};
      (["start", "end", "break"] as DayField[]).forEach((field) => {
        if (!form[day][field]) {
          dayErrors[field] = true;
          hasError = true;
        }
      });
      if (Object.keys(dayErrors).length > 0) {
        newErrors[day] = dayErrors;
      }
    });

    setErrors(newErrors);

    if (hasError || !weekNumber) {
      alert("Vul alle verplichte velden in.");
      return;
    }

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const userId = parsedUser?.id;

    const payload = {
      userId,
      weekNumber,
      data: form,
      remarks,
      totalHours: hoursWorked,
      overUnderHours: overUnder,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_URL}/urenregistratie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        exportToExcel(payload, parsedUser); // <-- Excel export hier
        setShowSuccess(true);
        //mailto link, open in email client
        const subject = `Uren week ${weekNumber} ${new Date().getFullYear()} ${
          parsedUser.firstName
        } ${parsedUser.lastName}`;
        const body = `Geachte,\n\nHierbij de urenregistratie voor week ${weekNumber}.\n\nMet vriendelijke groet,\n${parsedUser.firstName} ${parsedUser.lastName}`;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
        setTimeout(() => navigate("/"), 3000);
      } else {
        console.error("Fout bij verzenden:", await response.text());
        alert("Er is een fout opgetreden bij het versturen.");
      }
    } catch (error) {
      console.error("Netwerkfout:", error);
      alert("Netwerkfout bij het versturen van de gegevens.");
    }
  };

  const handleCancel = () => setShowCancelConfirm(true);
  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate("/");
  };

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white text-black rounded">
      {/* Weeknummer */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Weeknummer</label>
        <input
          type="number"
          value={weekNumber}
          onChange={(e) => setWeekNumber(e.target.value.toString())}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Invoer per dag */}
      <div className="grid md:grid-cols-6 gap-4 mb-8">
        {weekDays.map((day) => (
          <div key={day} className="md:col-span-6 border rounded p-4">
            <p className="font-bold mb-4">{day}</p>
            <div className="flex flex-col md:flex-row md:items-end md:gap-4">
              {/* Starttijd */}
              <div className="flex flex-col mb-2 md:mb-0 md:w-40">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Starttijd
                </label>
                <input
                  type="time"
                  value={form[day].start}
                  onChange={(e) => handleChange(day, "start", e.target.value)}
                  onBlur={(e) => validateField(day, "start", e.target.value)}
                  className={`border px-3 py-2 rounded ${
                    errors[day]?.start ? "ring-2 ring-red-500" : ""
                  }`}
                />
              </div>

              {/* Eindtijd */}
              <div className="flex flex-col mb-2 md:mb-0 md:w-40">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Eindtijd
                </label>
                <input
                  type="time"
                  value={form[day].end}
                  onChange={(e) => handleChange(day, "end", e.target.value)}
                  onBlur={(e) => validateField(day, "end", e.target.value)}
                  className={`border px-3 py-2 rounded ${
                    errors[day]?.end ? "ring-2 ring-red-500" : ""
                  }`}
                />
              </div>

              {/* Pauze */}
              <div className="flex flex-col mb-2 md:mb-0 md:w-40">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Pauze
                </label>
                <select
                  value={form[day].break}
                  onChange={(e) => handleChange(day, "break", e.target.value)}
                  onBlur={(e) => validateField(day, "break", e.target.value)}
                  className={`border px-3 py-2 rounded ${
                    errors[day]?.break ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <option value=""></option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                </select>
              </div>

              {/* Reistijd */}
              <div className="flex flex-col mb-2 md:mb-0 md:w-40">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Reistijd (min)
                </label>
                <input
                  type="number"
                  value={form[day].travel}
                  onChange={(e) => handleChange(day, "travel", e.target.value)}
                  className="border px-3 py-2 rounded"
                  placeholder="Reistijd"
                />
              </div>

              {/* Totaal werktijd */}
              <div className="flex flex-col md:w-40">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Totaal werktijd
                </label>
                <span className="px-3 py-2 rounded bg-gray-100 border text-sm">
                  {(
                    calculateTotalTime(
                      form[day].start,
                      form[day].end,
                      form[day].break
                    ) / 60
                  ).toFixed(2)}{" "}
                  uur
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overzicht */}
      <div className="mb-6 text-lg">
        <p>
          Totaal gewerkt:{" "}
          <span className="font-semibold">{hoursWorked} uur</span>
        </p>
        <p>
          {parseFloat(overUnder) >= 0 ? (
            <span className="text-green-600">
              +{overUnder} uur over gewerkt
            </span>
          ) : (
            <span className="text-red-600">
              {overUnder} uur te weinig gewerkt
            </span>
          )}
        </p>
      </div>

      {/* Opmerkingen */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Opmerkingen</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={4}
          className="w-full border px-4 py-2 rounded-md"
          maxLength={250}
        />
        <p className="text-sm text-gray-500">{remarks.length}/250 tekens</p>
      </div>

      {/* Actiebuttons */}
      <div className="flex justify-between">
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-6 py-2 rounded-md"
        >
          Annuleren
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className={`${
              isFormValid()
                ? "bg-green-600 text-white"
                : "bg-gray-400 text-white"
            } px-6 py-2 rounded-md`}
          >
            Versturen en exporteren
          </button>
        </div>
      </div>

      {/* Successmelding */}
      {showSuccess && (
        <div className="mt-4 text-green-600 font-semibold">
          Gegevens succesvol verstuurd en geëxporteerd!
        </div>
      )}

      {/* Annuleer bevestiging */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg mb-4">Weet je zeker dat je wilt annuleren?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmCancel}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Ja
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Nee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
