import os
from pathlib import Path
from typing import List
import faiss
import pickle
import numpy as np
from dataclasses import dataclass


VECTOR_STORE_PATH = Path(os.getenv('VECTOR_STORE_PATH', 'backend/app/storage/faiss_store'))
VECTOR_STORE_PATH.mkdir(parents=True, exist_ok=True)


@dataclass
class StoredVectorData:
    user_id: int
    document_id: int
    chunk_index: int
    text: str


class VectorStoreManager:
    index_file = VECTOR_STORE_PATH / 'faiss_index.bin'
    metadata_file = VECTOR_STORE_PATH / 'metadata.pkl'

    @staticmethod
    def _load_index():
        if VectorStoreManager.index_file.exists():
            return faiss.read_index(str(VectorStoreManager.index_file))
        return None

    @staticmethod
    def _save_index(index):
        faiss.write_index(index, str(VectorStoreManager.index_file))

    @staticmethod
    def _load_metadata() -> list[StoredVectorData]:
        if VectorStoreManager.metadata_file.exists():
            with open(VectorStoreManager.metadata_file, 'rb') as f:
                return pickle.load(f)
        return []

    @staticmethod
    def _save_metadata(metadata: list[StoredVectorData]):
        with open(VectorStoreManager.metadata_file, 'wb') as f:
            pickle.dump(metadata, f)

    @staticmethod
    def add_document_vectors(user_id: int, document_id: int, chunks: list[str], embeddings: list[list[float]]):
        index = VectorStoreManager._load_index()
        metadata = VectorStoreManager._load_metadata()

        if not index:
            dimension = len(embeddings[0]) if embeddings else 1536
            index = faiss.IndexFlatL2(dimension)

        vectors = [embedding for embedding in embeddings]
        index.add(np.array(vectors, dtype='float32'))

        start_id = len(metadata)
        for idx, chunk in enumerate(chunks):
            metadata.append(StoredVectorData(user_id=user_id, document_id=document_id, chunk_index=start_id + idx, text=chunk))

        VectorStoreManager._save_index(index)
        VectorStoreManager._save_metadata(metadata)

    @staticmethod
    def search(query_embedding: list[float], user_id: int, top_k: int = 5) -> list[StoredVectorData]:
        index = VectorStoreManager._load_index()
        metadata = VectorStoreManager._load_metadata()
        if not index or index.ntotal == 0:
            return []

        search_k = min(index.ntotal, top_k * 3)
        D, I = index.search(np.array([query_embedding], dtype='float32'), search_k)
        filtered = [metadata[i] for i in I[0] if i < len(metadata) and metadata[i].user_id == user_id]
        return filtered[:top_k]
