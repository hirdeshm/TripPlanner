const API_URL = import.meta.env.API_URL_VITE;

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
