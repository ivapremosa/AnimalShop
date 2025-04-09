from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Offer(BaseModel):
    id: str
    product_id: str
    discount_percentage: float
    start_date: datetime
    end_date: datetime
    is_active: bool = True

    class Config:
        json_schema_extra = {
            "example": {
                "id": "offer-123",
                "product_id": "product-456",
                "discount_percentage": 20.0,
                "start_date": "2024-03-25T00:00:00",
                "end_date": "2024-04-25T00:00:00",
                "is_active": True
            }
        } 