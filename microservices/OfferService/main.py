from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import stomp
import json
from typing import List
from datetime import datetime
from services.offer_service import OfferService
from models.offer import Offer
from config.logging import setup_logging
import logging

# Trigger GitHub Actions workflow
# This service handles offers and discounts for products

# Setup logging
logger = setup_logging()

app = FastAPI(title="Offer Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
offer_service = OfferService()

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Offer Service...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Offer Service...")

@app.get("/offers", response_model=List[Offer])
async def get_offers():
    logger.info("Fetching all offers")
    return await offer_service.get_all_offers()

@app.get("/offers/{offer_id}", response_model=Offer)
async def get_offer(offer_id: str):
    logger.info(f"Fetching offer with ID: {offer_id}")
    offer = await offer_service.get_offer(offer_id)
    if not offer:
        logger.warning(f"Offer not found with ID: {offer_id}")
        raise HTTPException(status_code=404, detail="Offer not found")
    return offer

@app.post("/offers", response_model=Offer)
async def create_offer(offer: Offer):
    logger.info(f"Creating new offer: {offer.id}")
    try:
        return await offer_service.create_offer(offer)
    except ValueError as e:
        logger.error(f"Error creating offer: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/offers/{offer_id}", response_model=Offer)
async def update_offer(offer_id: str, offer: Offer):
    logger.info(f"Updating offer: {offer_id}")
    try:
        return await offer_service.update_offer(offer_id, offer)
    except ValueError as e:
        logger.error(f"Error updating offer: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))

@app.delete("/offers/{offer_id}")
async def delete_offer(offer_id: str):
    logger.info(f"Deleting offer: {offer_id}")
    success = await offer_service.delete_offer(offer_id)
    if not success:
        logger.warning(f"Offer not found for deletion: {offer_id}")
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"message": "Offer deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Offer Service on port 8002")
    uvicorn.run(app, host="0.0.0.0", port=8002) 