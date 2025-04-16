from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import grpc
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
import sys
import importlib.util

load_dotenv()

app = FastAPI(title="Mobile Gateway API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add proto directories to Python path
sys.path.append(os.path.abspath('../UserService/proto'))
sys.path.append(os.path.abspath('../OrderService/proto'))
sys.path.append(os.path.abspath('../OfferService/proto'))

# Import generated gRPC modules
def import_proto_module(proto_path, service_name):
    spec = importlib.util.spec_from_file_location(
        f"{service_name}_pb2",
        os.path.join(proto_path, f"{service_name}_pb2.py")
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Import proto modules
user_pb2 = import_proto_module('../UserService/proto', 'user')
order_pb2 = import_proto_module('../OrderService/proto', 'order')
offer_pb2 = import_proto_module('../OfferService/proto', 'offer')

# Create gRPC channels
user_channel = grpc.insecure_channel(
    os.getenv("USER_SERVICE_URL", "localhost:3001")
)
order_channel = grpc.insecure_channel(
    os.getenv("ORDER_SERVICE_URL", "localhost:3002")
)
offer_channel = grpc.insecure_channel(
    os.getenv("OFFER_SERVICE_URL", "localhost:3003")
)

# Create gRPC clients
user_client = user_pb2.UserServiceStub(user_channel)
order_client = order_pb2.OrderServiceStub(order_channel)
offer_client = offer_pb2.OfferServiceStub(offer_channel)

# Models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

class Order(BaseModel):
    id: Optional[int] = None
    user_id: int
    items: List[str]

class Offer(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    price: float

# User endpoints
@app.get("/mobile/users", response_model=List[User])
async def get_users():
    try:
        response = user_client.GetUsers(user_pb2.GetUsersRequest())
        return [User(**user.__dict__) for user in response.users]
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mobile/users", response_model=User)
async def create_user(user: User):
    try:
        request = user_pb2.CreateUserRequest(**user.dict())
        response = user_client.CreateUser(request)
        return User(**response.__dict__)
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# Order endpoints
@app.get("/mobile/orders", response_model=List[Order])
async def get_orders():
    try:
        response = order_client.GetOrders(order_pb2.GetOrdersRequest())
        return [Order(**order.__dict__) for order in response.orders]
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mobile/orders", response_model=Order)
async def create_order(order: Order):
    try:
        request = order_pb2.CreateOrderRequest(**order.dict())
        response = order_client.CreateOrder(request)
        return Order(**response.__dict__)
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# Offer endpoints
@app.get("/mobile/offers", response_model=List[Offer])
async def get_offers():
    try:
        response = offer_client.GetOffers(offer_pb2.GetOffersRequest())
        return [Offer(**offer.__dict__) for offer in response.offers]
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/mobile/offers", response_model=Offer)
async def create_offer(offer: Offer):
    try:
        request = offer_pb2.CreateOfferRequest(**offer.dict())
        response = offer_client.CreateOffer(request)
        return Offer(**response.__dict__)
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check endpoint
@app.get("/mobile/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 