import pytest
from datetime import datetime, timedelta
from services.offer_service import OfferService
from models.offer import Offer
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from unittest.mock import ANY

@pytest.fixture
def offer_service():
    with patch('stomp.Connection') as mock_connection:
        # Create a mock connection instance
        mock_conn = Mock()
        mock_connection.return_value = mock_conn
        
        # Setup the mock connection methods
        mock_conn.connect = Mock()
        mock_conn.subscribe = Mock()
        mock_conn.send = Mock()
        mock_conn.set_listener = Mock()
        
        # Create the service which will use our mock
        service = OfferService()
        service.offers = {}  # Initialize the offers dictionary
        
        # Return both the service and the mock for assertions if needed
        return service, mock_conn

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
    # Test creating a new offer
    service, mock_conn = offer_service
    created_offer = await service.create_offer(sample_offer)
    assert created_offer.id == sample_offer.id
    assert created_offer.product_id == sample_offer.product_id
    assert created_offer.discount_percentage == sample_offer.discount_percentage

@pytest.mark.asyncio
async def test_get_offer(offer_service, sample_offer):
    # First create an offer
    service, mock_conn = offer_service
    await service.create_offer(sample_offer)
    
    # Test getting the offer
    offer = await service.get_offer(sample_offer.id)
    assert offer.id == sample_offer.id
    assert offer.product_id == sample_offer.product_id

@pytest.mark.asyncio
async def test_get_all_offers(offer_service, sample_offer):
    # Create a test offer
    service, mock_conn = offer_service
    await service.create_offer(sample_offer)
    
    # Test getting all offers
    offers = await service.get_all_offers()
    assert len(offers) == 1
    assert offers[0].id == sample_offer.id

@pytest.mark.asyncio
async def test_update_offer(offer_service, sample_offer):
    service, mock_conn = offer_service
    # First create an offer
    await service.create_offer(sample_offer)
    
    # Update the offer
    updated_offer = Offer(
        id=sample_offer.id,
        product_id=sample_offer.product_id,
        discount_percentage=30.0,  # Changed discount
        start_date=sample_offer.start_date,
        end_date=sample_offer.end_date,
        is_active=sample_offer.is_active
    )
    
    result = await service.update_offer(sample_offer.id, updated_offer)
    assert result.discount_percentage == 30.0

@pytest.mark.asyncio
async def test_delete_offer(offer_service, sample_offer):
    service, mock_conn = offer_service
    # First create an offer
    await service.create_offer(sample_offer)
    
    # Delete the offer
    result = await service.delete_offer(sample_offer.id)
    assert result is True
    
    # Verify the offer is deleted
    retrieved_offer = await service.get_offer(sample_offer.id)
    assert retrieved_offer is None

@pytest.mark.asyncio
async def test_offer_not_found(offer_service):
    service, mock_conn = offer_service
    # Test getting a non-existent offer
    retrieved_offer = await service.get_offer("non-existent-id")
    assert retrieved_offer is None

@pytest.mark.asyncio
async def test_stomp_connection_setup(offer_service):
    service, mock_conn = offer_service
    # Verify that the connection was properly set up
    mock_conn.connect.assert_called_once()
    mock_conn.set_listener.assert_called_once()
    mock_conn.subscribe.assert_called_once_with(
        destination='/topic/offers',
        id=1,
        ack='auto'
    )

@pytest.mark.asyncio
async def test_message_sending(offer_service, sample_offer):
    service, mock_conn = offer_service
    # Create an offer which should trigger a message
    await service.create_offer(sample_offer)
    
    # Verify that a message was sent
    mock_conn.send.assert_called_with(
        destination='/topic/offers',
        body=ANY,  # We don't check the exact JSON, just that a message was sent
        headers={'persistent': 'true'}
    )

@pytest.mark.asyncio
async def test_connection_error_handling(offer_service):
    service, mock_conn = offer_service
    # Simulate connection error
    mock_conn.send.side_effect = Exception("Connection failed")
    
    # Create an offer - should not raise the connection error
    offer = Offer(
        id="test-id",
        product_id="product1",
        discount_percentage=10,
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=30),
        is_active=True
    )
    
    # Service should still create the offer even if message sending fails
    created_offer = await service.create_offer(offer)
    assert created_offer.id == "test-id"
    
    # Verify we can still get the offer
    retrieved_offer = await service.get_offer("test-id")
    assert retrieved_offer.id == "test-id"

@pytest.mark.asyncio
async def test_invalid_offer_data(offer_service):
    service, mock_conn = offer_service
    invalid_offer = Offer(
        id="test-id",
        product_id="product1",
        discount_percentage=-10,  # Invalid negative discount
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=30),
        is_active=True
    )
    
    with pytest.raises(ValueError):
        await service.create_offer(invalid_offer) 