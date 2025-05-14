import { useEffect, useState } from "react";
import API_URL from "../utils/config";

export default function WeeklyOverview() {
  const [registrations, setRegistrations] = useState<WeekRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  interface DayData {
    start: string;
    end: string;
    break: string;
    travel: string;
  }

  interface WeekRegistration {
    weekNumber: number;
    createdAt: string;
    data: {
      [day: string]: DayData;
    };
    totalHours: number;
    overUnderHours: number;
    remarks?: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/urenregistraties?userId=${userId}`);
        const data = await res.json();

        setRegistrations(data);
      } catch (error) {
        console.error("Fout bij laden uren:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-center text-white">Laden...</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white text-black rounded">
      <h1 className="text-2xl font-bold mb-6">
        Weekoverzicht {user.firstName} {user.lastName}
      </h1>

      {registrations.length === 0 ? (
        <p>Er zijn nog geen registraties beschikbaar.</p>
      ) : (
        registrations
          .sort((a, b) => b.weekNumber - a.weekNumber) // Laatste week eerst
          .map((week, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded p-4 mb-6 shadow"
            >
              <h2 className="text-xl font-semibold mb-2">
                Week {week.weekNumber} {new Date(week.createdAt).getFullYear()}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Ingediend op: {new Date(week.createdAt).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(week.data).map(([day, values]) => {
                  const workedMinutes =
                    (new Date(`1970-01-01T${values.end}`).getTime() -
                      new Date(`1970-01-01T${values.start}`).getTime()) /
                      60000 -
                    (parseInt(values.break) || 0);

                  const workedHours =
                    (workedMinutes + (parseInt(values.travel) || 0)) / 60;

                  return (
                    <div
                      key={day}
                      className="border border-gray-200 rounded p-3 bg-gray-50"
                    >
                      <h3 className="font-semibold text-md mb-2">{day}</h3>
                      <p>
                        <strong>Start:</strong> {values.start || "-"}
                      </p>
                      <p>
                        <strong>Einde:</strong> {values.end || "-"}
                      </p>
                      <p>
                        <strong>Pauze:</strong> {values.break || 0} min
                      </p>
                      <p>
                        <strong>Reistijd:</strong> {values.travel || 0} min
                      </p>
                      <p>
                        <strong>Totaal:</strong> {workedHours.toFixed(2)} uur
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-sm">
                <p>
                  <strong>Totaal gewerkt:</strong> {week.totalHours} uur
                </p>
                <p>
                  <strong>Afwijking contract:</strong>{" "}
                  <span
                    className={
                      week.overUnderHours >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {week.overUnderHours} uur
                  </span>
                </p>
                {week.remarks && (
                  <p className="mt-2">
                    <strong>Opmerkingen:</strong> {week.remarks}
                  </p>
                )}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
