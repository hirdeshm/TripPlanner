
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.trip import router as trip_router

app = FastAPI(title="FlamTrip API")

frontend_url = os.getenv("FRONTEND_URL", "")

allowed_origins = [
    "http://localhost:5173",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in allowed_origins if origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register trip API routes
app.include_router(trip_router)
