from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os

MONGODB_URL = "mongodb+srv://admin:admin@ita.vittz13.mongodb.net/"
DATABASE_NAME = "ITA3"
COLLECTION_NAME = "Offer"

# Async client for FastAPI
async def get_database():
    client = AsyncIOMotorClient(MONGODB_URL)
    database = client[DATABASE_NAME]
    return database

# Sync client for message broker
def get_sync_database():
    client = MongoClient(MONGODB_URL)
    database = client[DATABASE_NAME]
    return database 