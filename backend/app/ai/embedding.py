import os
from langchain.embeddings import OpenAIEmbeddings


def get_embedding_client():
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise RuntimeError('Missing OPENAI_API_KEY environment variable')
    return OpenAIEmbeddings(openai_api_key=api_key)


class EmbeddingService:
    @staticmethod
    def generate_embeddings(texts: list[str]) -> list[list[float]]:
        embedder = get_embedding_client()
        return embedder.embed_documents(texts)
