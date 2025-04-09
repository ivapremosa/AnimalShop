import asyncio
import stomp
from typing import List, Optional
from datetime import datetime
from ..models.offer import Offer
from ..config.database import get_database, get_sync_database, COLLECTION_NAME
import json

class OfferService:
    def __init__(self):
        self.conn = None
        self._setup_message_broker()

    def _setup_message_broker(self):
        self.conn = stomp.Connection([('localhost', 61613)])
        self.conn.set_listener('', self.OfferListener(self))
        self.conn.connect('admin', 'admin', wait=True)
        self.conn.subscribe(destination='/topic/offers', id=1, ack='auto')

    class OfferListener(stomp.ConnectionListener):
        def __init__(self, service):
            self.service = service
            self.db = get_sync_database()
            self.collection = self.db[COLLECTION_NAME]

        def on_message(self, frame):
            try:
                message = json.loads(frame.body)
                if message.get('type') == 'offer_created':
                    self.service._handle_offer_created(message)
                elif message.get('type') == 'offer_updated':
                    self.service._handle_offer_updated(message)
            except Exception as e:
                print(f"Error processing message: {e}")

    async def create_offer(self, offer: Offer) -> Offer:
        db = await get_database()
        collection = db[COLLECTION_NAME]
        
        # Check if offer already exists
        existing_offer = await collection.find_one({"id": offer.id})
        if existing_offer:
            raise ValueError("Offer already exists")
        
        # Convert offer to dict and insert
        offer_dict = offer.dict()
        await collection.insert_one(offer_dict)
        
        await self._publish_offer_event('offer_created', offer)
        return offer

    async def update_offer(self, offer_id: str, offer: Offer) -> Offer:
        db = await get_database()
        collection = db[COLLECTION_NAME]
        
        # Check if offer exists
        existing_offer = await collection.find_one({"id": offer_id})
        if not existing_offer:
            raise ValueError("Offer not found")
        
        # Update offer
        offer_dict = offer.dict()
        await collection.update_one({"id": offer_id}, {"$set": offer_dict})
        
        await self._publish_offer_event('offer_updated', offer)
        return offer

    async def get_offer(self, offer_id: str) -> Optional[Offer]:
        db = await get_database()
        collection = db[COLLECTION_NAME]
        offer_dict = await collection.find_one({"id": offer_id})
        return Offer(**offer_dict) if offer_dict else None

    async def get_all_offers(self) -> List[Offer]:
        db = await get_database()
        collection = db[COLLECTION_NAME]
        offers = []
        async for offer_dict in collection.find():
            offers.append(Offer(**offer_dict))
        return offers

    async def delete_offer(self, offer_id: str) -> bool:
        db = await get_database()
        collection = db[COLLECTION_NAME]
        result = await collection.delete_one({"id": offer_id})
        return result.deleted_count > 0

    async def _publish_offer_event(self, event_type: str, offer: Offer):
        message = {
            'type': event_type,
            'data': {
                'id': offer.id,
                'product_id': offer.product_id,
                'discount_percentage': offer.discount_percentage,
                'start_date': offer.start_date.isoformat(),
                'end_date': offer.end_date.isoformat(),
                'is_active': offer.is_active
            }
        }
        self.conn.send(body=json.dumps(message), destination='/topic/offers')

    def _handle_offer_created(self, message):
        data = message['data']
        offer = Offer(
            id=data['id'],
            product_id=data['product_id'],
            discount_percentage=data['discount_percentage'],
            start_date=datetime.fromisoformat(data['start_date']),
            end_date=datetime.fromisoformat(data['end_date']),
            is_active=data['is_active']
        )
        self.collection.insert_one(offer.dict())

    def _handle_offer_updated(self, message):
        data = message['data']
        offer = Offer(
            id=data['id'],
            product_id=data['product_id'],
            discount_percentage=data['discount_percentage'],
            start_date=datetime.fromisoformat(data['start_date']),
            end_date=datetime.fromisoformat(data['end_date']),
            is_active=data['is_active']
        )
        self.collection.update_one({"id": offer.id}, {"$set": offer.dict()}) 