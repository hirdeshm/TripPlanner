from pydantic import BaseModel, Field


class Stop(BaseModel):
    name: str
    description: str
    duration: str
    estimated_cost: float = Field(ge=0)


class ItineraryDay(BaseModel):
    day: int = Field(ge=1)
    title: str
    stops: list[Stop]


class TripItinerary(BaseModel):
    destination: str
    duration: int = Field(ge=1)
    total_estimated_cost: float = Field(ge=0)
    days: list[ItineraryDay]