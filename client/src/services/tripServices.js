const API_URL = "http://localhost:8000";

export async function generateTrip(description) {
    const response = await fetch(`${API_URL}/api/trip/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate trip");
    }

    return await response.json();
}