from pydantic import BaseModel, Field


class TripRequest(BaseModel):
    description: str = Field(
        min_length=10,
        max_length=2000,
        description="Describe your trip requirements"
    )

    