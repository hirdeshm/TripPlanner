
import { useEffect, useState } from "react";
import ItineraryBoard from "./components/ItineraryBoard";
import { generateTrip } from "./services/tripServices";
import "./App.css";

function App() {
  const [description, setDescription] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the saved theme, or use the system preference.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("flamtrip-theme");

    if (savedTheme) return savedTheme;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Save the theme whenever it changes.
  useEffect(() => {
    localStorage.setItem("flamtrip-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (description.trim().length < 10 || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await generateTrip(description.trim());

      const formattedItinerary = {
        ...result.data,
        days: result.data.days.map((day) => ({
          ...day,
          stops: day.stops.map((stop) => ({
            ...stop,
            id: crypto.randomUUID(),
          })),
        })),
      };

      setItinerary(formattedItinerary);
      setDescription("");
    } catch (err) {
      setError(
        err.message || "Something went wrong while generating your trip."
      );
    } finally {
      setLoading(false);
    }
  };

  const totalCost =
    itinerary?.days?.reduce(
      (total, day) =>
        total +
        day.stops.reduce(
          (dayTotal, stop) =>
            dayTotal + (Number(stop.estimated_cost) || 0),
          0
        ),
      0
    ) || 0;

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="logo">FlamTrip </h1>
           
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          </button>
        </div>
      </header>

      <main className="chat-content">
        {!itinerary && !loading && (
          <section className="welcome-message">
            <div className="welcome-icon">
             <img src="/white-earth.png" alt="FlamTrip Logo" />
            </div>
            <h2>Make your Trip Easy with Planning</h2>
            <p>
              Tell me about your dream trip, and i will guide you.
            </p>
          </section>
        )}

        {error && (
          <div className="error-message" role="alert">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="loading-message" role="status">
            <div className="loading-spinner" />
            <p>Creating your perfect itinerary...</p>
          </div>
        )}

        {itinerary && (
          <section className="itinerary-section">
            <div className="itinerary-header">
              <div>
                <h2>{itinerary.destination}</h2>
                <p>
                  {itinerary.duration} days · Your personalized travel plan
                </p>
              </div>

              <div className="itinerary-cost">
                <span>Estimated total</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(totalCost)}
                </strong>
              </div>
            </div>

            <ItineraryBoard
              itinerary={itinerary}
              setItinerary={setItinerary}
            />
          </section>
        )}
      </main>

      <footer className="chat-input-container">
        <form className="chat-input-form" onSubmit={handleGenerate}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your dream trip..."
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate(e);
              }
            }}
          />

          <button
            type="submit"
            disabled={loading || description.trim().length < 10}
            aria-label="Generate itinerary"
          >
            {loading ? "Planning..." : <div className="gen-button">Generate <span>➤</span></div>}
          </button>
        </form>

        <p className="input-disclaimer">
          FlamTrip AI can make mistakes. Please verify travel details and costs.
        </p>
      </footer>
    </div>
  );
}

export default App;
