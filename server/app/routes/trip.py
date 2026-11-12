from fastapi import APIRouter, HTTPException

from fastapi import APIRouter

router = APIRouter(prefix="/api/trip", tags=["Trip"])

from app.schemas.trip import TripRequest
from app.services.trip_generator import generate_itinerary

router = APIRouter(
    prefix="/api/trip",
    tags=["Trip Planner"]
)


@router.post("/generate")
async def generate_trip(request: TripRequest):

    try:

        itinerary = await generate_itinerary(
            request.description
        )

        return {
            "success": True,
            "data": itinerary
        }

    except ValueError as error:

        raise HTTPException(
            status_code=502,
            detail=str(error)
        )

    except Exception:

        raise HTTPException(
            status_code=502,
            detail="Unable to generate itinerary. Please try again."
        )
