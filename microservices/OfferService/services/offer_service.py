import asyncio
import stomp
from typing import List, Optional
from datetime import datetime
from models.offer import Offer
import json

class OfferService:
    def __init__(self):
        self.conn = None
        self.offers = {}
        self._setup_message_broker()

    def _setup_message_broker(self):
        self.conn = stomp.Connection([('localhost', 61613)])
        self.conn.set_listener('', self.OfferListener(self))
        self.conn.connect('admin', 'admin', wait=True)
        self.conn.subscribe(destination='/topic/offers', id=1, ack='auto')

    class OfferListener(stomp.ConnectionListener):
        def __init__(self, service):
            self.service = service

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
        if offer.id in self.offers:
            raise ValueError("Offer already exists")
        
        if offer.discount_percentage < 0:
            raise ValueError("Discount percentage cannot be negative")
        
        self.offers[offer.id] = offer
        await self._publish_offer_event('offer_created', offer)
        return offer

    async def update_offer(self, offer_id: str, offer: Offer) -> Offer:
        if offer_id not in self.offers:
            raise ValueError("Offer not found")
        
        self.offers[offer_id] = offer
        await self._publish_offer_event('offer_updated', offer)
        return offer

    async def get_offer(self, offer_id: str) -> Optional[Offer]:
        return self.offers.get(offer_id)

    async def get_all_offers(self) -> List[Offer]:
        return list(self.offers.values())

    async def delete_offer(self, offer_id: str) -> bool:
        if offer_id in self.offers:
            del self.offers[offer_id]
            return True
        return False

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
        try:
            self.conn.send(
                body=json.dumps(message),
                destination='/topic/offers',
                headers={'persistent': 'true'}
            )
        except Exception as e:
            # Log the error but don't let it affect the offer creation/update
            print(f"Failed to send message: {e}")

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
        self.offers[offer.id] = offer

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
        self.offers[offer.id] = offer 