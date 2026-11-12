# FlamTrip – AI Trip Planner
## Live Demo

- **Frontend:** [FlamTrip – AI Trip Planner](https://trip-planner-hdww.vercel.app)
- **Backend API Documentation:** [FastAPI Swagger Docs](https://trip-planner-tawny-xi.vercel.app/docs)

## GitHub Repository

[View Source Code on GitHub](https://github.com/hirdeshm/TripPlanner)
FlamTrip is an AI-powered trip planning application that generates structured travel itineraries based on a user's travel requirements. It uses the Groq API to generate personalized itineraries and provides an interactive Kanban-style board to manage destinations and activities.

## Features

- **AI-Powered Itinerary Generation:** Generate travel itineraries using natural language descriptions.
- **Structured Responses:** AI-generated results are validated using Pydantic models.
- **Interactive Itinerary Board:** View travel plans organized by day.
- **Drag and Drop:** Rearrange destinations and activities between days.
- **Add and Edit Destinations:** Add new stops or modify existing itinerary details.
- **Cost Estimation:** View estimated expenses for individual stops and the overall trip.
- **Dark and Light Mode:** Switch between themes.
- **Responsive Interface:** Use the application across different screen sizes.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- @dnd-kit (drag-and-drop functionality)

### Backend
- Python
- FastAPI
- Pydantic
- Uvicorn

### AI Integration
- Groq API
- Model: `openai/gpt-oss-20b`

## Project Structure

```text
Trip_Planner/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
├── server/
│   ├── app/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

## Getting Started

Follow these instructions to run FlamTrip locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Python 3.10 or later
- Git
- A Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/hirdeshm/Trip_Planner.git
cd Trip_Planner
```

### 2. Set Up the Backend

Navigate to the server directory:

```bash
cd server
```

Create and activate a virtual environment.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS:**

```bash
python -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `server` directory:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Replace `your_groq_api_key` with your actual Groq API key.

Start the FastAPI server from the `server` directory:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will run at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 3. Set Up the Frontend

Open another terminal and navigate to the client directory from the project root:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## How AI Is Used

FlamTrip uses the Groq API to generate travel itineraries from user-provided descriptions.

The AI integration follows this workflow:

1. The user enters a natural language description of their travel requirements.
2. The React frontend sends the description to the FastAPI backend.
3. The backend sends the request to the Groq API with instructions to generate a structured itinerary.
4. The AI returns the itinerary in JSON format.
5. Python's JSON parser and Pydantic models validate the generated response.
6. The validated itinerary is returned to the frontend.
7. React displays the itinerary in an interactive day-wise board.

**Important:** AI-generated destinations, activities, durations, and estimated costs are suggestions. They should be independently verified before making travel bookings or financial decisions.

## API Endpoint

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trip/generate` | Generates a travel itinerary |

Example request:

```json
{
  "description": "Plan a 3-day trip to Jaipur with historical places, local food, and a moderate budget."
}
```

The API returns a structured itinerary containing the destination, duration, estimated total cost, days, and individual stops.

## Known Limitations

- AI-generated information may occasionally be inaccurate or incomplete.
- Estimated travel costs are approximate and are not connected to live pricing services.
- The application does not currently provide real-time hotel, flight, or transport booking.
- Opening hours, availability, and travel restrictions are not independently verified.
- AI responses depend on the availability and behavior of the Groq API.
- Internet connectivity is required for AI itinerary generation.
- The quality and detail of the itinerary depend on the user's input and AI-generated response.

## Security Notes

- Never commit API keys or `.env` files to GitHub.
- Store API keys in environment variables.
- Use `.env.example` to document the required environment variables without exposing credentials.

## Time Spent

**Total development time:** [Add your actual development time]

The development time includes:
- Frontend development and UI design.
- FastAPI backend development.
- Groq API integration and prompt engineering.
- Pydantic schema design and response validation.
- Drag-and-drop itinerary management.
- Testing, debugging, and documentation.

## Future Improvements

- Real-time flight and hotel price integration.
- Google Maps integration for routes and distances.
- User authentication and saved itineraries.
- Weather information and travel recommendations.
- Export itineraries as PDF.
- Multi-language itinerary generation.

## Author

**FlamTrip – AI Trip Planner**

Developed as an AI-powered travel planning project.

GitHub Repository: https://github.com/hirdeshm/Trip_Planner
# TripPlanner
