import pytest
from datetime import datetime, timedelta
from services.offer_service import OfferService
from models.offer import Offer
import asyncio
from unittest.mock import Mock, patch

@pytest.fixture
def offer_service():
    service = OfferService()
    service.offers = {}  # Initialize the offers dictionary
    return service

@pytest.fixture
def sample_offer():
    return Offer(
        id="test-offer-1",
        product_id="product-1",
        discount_percentage=20.0,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=30),
        is_active=True
    )

@pytest.mark.asyncio
async def test_create_offer(offer_service, sample_offer):
    # Test successful creation
    result = await offer_service.create_offer(sample_offer)
    assert result == sample_offer
    assert offer_service.offers[sample_offer.id] == sample_offer

@pytest.mark.asyncio
async def test_get_offer(offer_service, sample_offer):
    # Add offer to service
    offer_service.offers[sample_offer.id] = sample_offer
    
    # Test retrieval
    result = await offer_service.get_offer(sample_offer.id)
    assert result == sample_offer

@pytest.mark.asyncio
async def test_get_all_offers(offer_service, sample_offer):
    # Add offer to service
    offer_service.offers[sample_offer.id] = sample_offer
    
    # Test retrieval
    result = await offer_service.get_all_offers()
    assert len(result) == 1
    assert result[0] == sample_offer

@pytest.mark.asyncio
async def test_update_offer(offer_service, sample_offer):
    # Add initial offer
    offer_service.offers[sample_offer.id] = sample_offer
    
    updated_offer = Offer(
        id=sample_offer.id,
        product_id="product-2",
        discount_percentage=30.0,
        start_date=sample_offer.start_date,
        end_date=sample_offer.end_date,
        is_active=False
    )
    
    result = await offer_service.update_offer(sample_offer.id, updated_offer)
    assert result == updated_offer
    assert offer_service.offers[sample_offer.id] == updated_offer

@pytest.mark.asyncio
async def test_delete_offer(offer_service, sample_offer):
    # Add offer to service
    offer_service.offers[sample_offer.id] = sample_offer
    
    # Test deletion
    result = await offer_service.delete_offer(sample_offer.id)
    assert result is True
    assert sample_offer.id not in offer_service.offers

@pytest.mark.asyncio
async def test_offer_not_found(offer_service):
    result = await offer_service.get_offer("non-existent-id")
    assert result is None 