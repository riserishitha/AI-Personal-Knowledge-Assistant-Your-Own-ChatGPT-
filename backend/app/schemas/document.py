from pydantic import BaseModel
from datetime import datetime


class DocumentRead(BaseModel):
    id: int
    file_name: str
    file_type: str
    upload_date: datetime
    processing_status: str

    class Config:
        orm_mode = True
