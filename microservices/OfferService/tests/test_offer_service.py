import pytest
from datetime import datetime, timedelta
from services.offer_service import OfferService
from models.offer import Offer
import asyncio
from unittest.mock import Mock, patch

@pytest.fixture
def offer_service():
    return OfferService()

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
    # Mock MongoDB operations
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        
        # Test successful creation
        result = await offer_service.create_offer(sample_offer)
        assert result == sample_offer
        mock_collection.insert_one.assert_called_once()

@pytest.mark.asyncio
async def test_get_offer(offer_service, sample_offer):
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        mock_collection.find_one.return_value = sample_offer.dict()
        
        result = await offer_service.get_offer(sample_offer.id)
        assert result == sample_offer
        mock_collection.find_one.assert_called_once_with({"id": sample_offer.id})

@pytest.mark.asyncio
async def test_get_all_offers(offer_service, sample_offer):
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        mock_collection.find.return_value = [sample_offer.dict()]
        
        result = await offer_service.get_all_offers()
        assert len(result) == 1
        assert result[0] == sample_offer

@pytest.mark.asyncio
async def test_update_offer(offer_service, sample_offer):
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        mock_collection.find_one.return_value = sample_offer.dict()
        
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
        mock_collection.update_one.assert_called_once()

@pytest.mark.asyncio
async def test_delete_offer(offer_service, sample_offer):
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        mock_collection.delete_one.return_value.deleted_count = 1
        
        result = await offer_service.delete_offer(sample_offer.id)
        assert result is True
        mock_collection.delete_one.assert_called_once_with({"id": sample_offer.id})

@pytest.mark.asyncio
async def test_offer_not_found(offer_service):
    with patch('services.offer_service.OfferService.get_database') as mock_db:
        mock_collection = Mock()
        mock_db.return_value = {'Offer': mock_collection}
        mock_collection.find_one.return_value = None
        
        result = await offer_service.get_offer("non-existent-id")
        assert result is None 