# API Gateways for Animal Shop

This project implements two API Gateways for the Animal Shop microservices architecture:

1. Web Gateway (Node.js/Express)
2. Mobile Gateway (Python/FastAPI)

## Web Gateway

The Web Gateway is designed for web clients and runs on port 3000 by default.

### Setup
1. Navigate to the WebGateway directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   USER_SERVICE_URL=http://localhost:3001
   ORDER_SERVICE_URL=http://localhost:3002
   OFFER_SERVICE_URL=http://localhost:3003
   ```
4. Start the service:
   ```bash
   npm start
   ```

### Available Endpoints
- GET `/api/users` - Get all users
- POST `/api/users` - Create a new user
- GET `/api/orders` - Get all orders
- POST `/api/orders` - Create a new order
- GET `/api/offers` - Get all offers
- POST `/api/offers` - Create a new offer
- GET `/health` - Health check endpoint

## Mobile Gateway

The Mobile Gateway is designed for mobile clients and runs on port 8000 by default.

### Setup
1. Navigate to the MobileGateway directory
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file with the following variables:
   ```
   USER_SERVICE_URL=http://localhost:3001
   ORDER_SERVICE_URL=http://localhost:3002
   OFFER_SERVICE_URL=http://localhost:3003
   ```
5. Start the service:
   ```bash
   python main.py
   ```

### Available Endpoints
- GET `/mobile/users` - Get all users
- POST `/mobile/users` - Create a new user
- GET `/mobile/orders` - Get all orders
- POST `/mobile/orders` - Create a new order
- GET `/mobile/offers` - Get all offers
- POST `/mobile/offers` - Create a new offer
- GET `/mobile/health` - Health check endpoint

## Testing with Postman

You can test both gateways using Postman:

1. Web Gateway:
   - Base URL: `http://localhost:3000`
   - Example: `GET http://localhost:3000/api/users`

2. Mobile Gateway:
   - Base URL: `http://localhost:8000`
   - Example: `GET http://localhost:8000/mobile/users`

Both gateways provide the same functionality but with different endpoints and implementations optimized for their respective client types. 