import os
import json

from groq import AsyncGroq

from dotenv import load_dotenv
from pydantic import ValidationError

from app.schemas.itinerary import TripItinerary

load_dotenv()

client = AsyncGroq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = os.getenv("GROQ_MODEL")


async def generate_itinerary(description: str):

    system_prompt = """
    You are an expert travel planner.

    Generate a practical travel itinerary based on the user's
    trip description.

    Return ONLY a valid JSON object with this exact structure:

    {
        "destination": "string",
        "duration": 3,
        "total_estimated_cost": 10000,
        "days": [
            {
                "day": 1,
                "title": "string",
                "stops": [
                    {
                        "name": "string",
                        "description": "string",
                        "duration": "2 hours",
                        "estimated_cost": 500
                    }
                ]
            }
        ]
    }

    Rules:
    1. Generate the requested number of days.
    2. Include realistic travel activities.
    3. Keep estimated costs non-negative.
    4. Include multiple stops per day where practical.
    5. Do not invent exact opening hours or guaranteed availability.
    6. Use INR for cost estimates.
    7. Return JSON only, without Markdown.
    """

    try:

        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": description
                }
            ],
            response_format={
                "type": "json_object"
            },
            temperature=0.3
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError("AI returned an empty response")

        # Convert JSON string into Python dictionary
        data = json.loads(content)

        # Validate AI response using Pydantic
        itinerary = TripItinerary.model_validate(data)

        return itinerary.model_dump()

    except json.JSONDecodeError as error:
        raise ValueError("AI returned malformed JSON") from error

    except ValidationError as error:
        raise ValueError("AI returned an invalid itinerary structure") from error