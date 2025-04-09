# Offer Service

A microservice for managing product offers in the Animal Shop system. This service is built with FastAPI and uses reactive programming patterns with asyncio.

## Features

- CRUD operations for offers
- Reactive event handling using ActiveMQ message broker
- RESTful API endpoints
- Async/await pattern for non-blocking operations

## Prerequisites

- Python 3.8+
- ActiveMQ message broker
- pip (Python package manager)

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start ActiveMQ message broker

## Running the Service

```bash
uvicorn main:app --reload --port 8002
```

The service will be available at `http://localhost:8002`

## API Endpoints

- `GET /offers` - Get all offers
- `GET /offers/{offer_id}` - Get a specific offer
- `POST /offers` - Create a new offer
- `PUT /offers/{offer_id}` - Update an existing offer
- `DELETE /offers/{offer_id}` - Delete an offer

## Message Broker Integration

The service integrates with ActiveMQ for event-driven communication:
- Topic: `/topic/offers`
- Events: `offer_created`, `offer_updated`

## Testing

Run tests using pytest:
```bash
pytest
```

___

![Screenshot](/microservices/OfferService/OfferService.png "Organized Layerd using DDD")

___

* Funkcionalne zahteve
    * Ustvaranje izdelkov: Mikrostoritev mora omočoga ustvarjanje novih izdelkov.
    * Brisanje izdelkov: Mikrostoritev mora omogočati brisanje izdelkov.
    * Posodabljanje izdelkov: Mikrostoritev mora omogočati posodabljanje izdelkov.
    

* Nefunkcionalne zahteve
    * Mikrostoritev mora biti sposobna obvladati vsaj 1000 zahtev na sekundo.
    * Vsaka zahteva mora biti obdelana v manj kot 10 sekund.
    * Mikrostoritev mora biti na volju v vsakem primeru, 24/7.

___
    



