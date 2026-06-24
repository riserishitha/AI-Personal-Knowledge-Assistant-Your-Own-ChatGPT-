from pydantic import BaseModel
from typing import List


class SummarizeRequest(BaseModel):
    document_id: int


class CompareRequest(BaseModel):
    document_ids: List[int]


class SummarizeResponse(BaseModel):
    summary: str
    document_id: int


class CompareResponse(BaseModel):
    comparison: str
    document_ids: List[int]
