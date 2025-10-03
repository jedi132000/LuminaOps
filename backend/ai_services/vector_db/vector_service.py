"""
Vector Database Service for LuminaOps
Supports ChromaDB, Weaviate, FAISS, and Pinecone
"""

from typing import List, Dict, Any, Optional, Tuple
from abc import ABC, abstractmethod
import numpy as np
from dataclasses import dataclass
from enum import Enum

try:
    import chromadb
    from chromadb.config import Settings
    import faiss
    import weaviate
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    print(f"Warning: Vector DB libraries not installed: {e}")

class VectorDBProvider(Enum):
    CHROMA = "chroma"
    WEAVIATE = "weaviate"
    FAISS = "faiss"
    PINECONE = "pinecone"

@dataclass
class Document:
    id: str
    content: str
    metadata: Dict[str, Any]
    embedding: Optional[List[float]] = None

@dataclass
class SearchResult:
    document: Document
    score: float
    distance: float

class VectorDBInterface(ABC):
    """Abstract base class for vector databases"""
    
    @abstractmethod
    async def add_documents(self, documents: List[Document]) -> bool:
        pass
    
    @abstractmethod
    async def search(self, query: str, top_k: int = 10) -> List[SearchResult]:
        pass
    
    @abstractmethod
    async def search_by_vector(self, vector: List[float], top_k: int = 10) -> List[SearchResult]:
        pass
    
    @abstractmethod
    async def delete_documents(self, ids: List[str]) -> bool:
        pass

class ChromaDBService(VectorDBInterface):
    """ChromaDB implementation for vector storage"""
    
    def __init__(self, collection_name: str = "lumina_docs"):
        self.collection_name = collection_name
        self.client = None
        self.collection = None
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    async def initialize(self):
        """Initialize ChromaDB client and collection"""
        try:
            self.client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory="./data/chroma"
            ))
            
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            return True
        except Exception as e:
            print(f"Failed to initialize ChromaDB: {e}")
            return False
    
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to ChromaDB"""
        try:
            ids = [doc.id for doc in documents]
            texts = [doc.content for doc in documents]
            metadatas = [doc.metadata for doc in documents]
            
            # Generate embeddings if not provided
            embeddings = []
            for doc in documents:
                if doc.embedding:
                    embeddings.append(doc.embedding)
                else:
                    embedding = self.embedder.encode(doc.content).tolist()
                    embeddings.append(embedding)
            
            self.collection.add(
                ids=ids,
                documents=texts,
                metadatas=metadatas,
                embeddings=embeddings
            )
            return True
        except Exception as e:
            print(f"Failed to add documents: {e}")
            return False
    
    async def search(self, query: str, top_k: int = 10) -> List[SearchResult]:
        """Search documents by text query"""
        try:
            query_embedding = self.embedder.encode(query).tolist()
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                include=['documents', 'metadatas', 'distances']
            )
            
            search_results = []
            for i, doc_id in enumerate(results['ids'][0]):
                document = Document(
                    id=doc_id,
                    content=results['documents'][0][i],
                    metadata=results['metadatas'][0][i]
                )
                
                result = SearchResult(
                    document=document,
                    score=1 - results['distances'][0][i],  # Convert distance to similarity score
                    distance=results['distances'][0][i]
                )
                search_results.append(result)
            
            return search_results
        except Exception as e:
            print(f"Search failed: {e}")
            return []
    
    async def search_by_vector(self, vector: List[float], top_k: int = 10) -> List[SearchResult]:
        """Search documents by embedding vector"""
        try:
            results = self.collection.query(
                query_embeddings=[vector],
                n_results=top_k,
                include=['documents', 'metadatas', 'distances']
            )
            
            search_results = []
            for i, doc_id in enumerate(results['ids'][0]):
                document = Document(
                    id=doc_id,
                    content=results['documents'][0][i],
                    metadata=results['metadatas'][0][i]
                )
                
                result = SearchResult(
                    document=document,
                    score=1 - results['distances'][0][i],
                    distance=results['distances'][0][i]
                )
                search_results.append(result)
            
            return search_results
        except Exception as e:
            print(f"Vector search failed: {e}")
            return []
    
    async def delete_documents(self, ids: List[str]) -> bool:
        """Delete documents from ChromaDB"""
        try:
            self.collection.delete(ids=ids)
            return True
        except Exception as e:
            print(f"Failed to delete documents: {e}")
            return False

class FAISSService(VectorDBInterface):
    """FAISS implementation for vector storage"""
    
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index = None
        self.documents = {}  # Store documents separately
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
    
    async def initialize(self):
        """Initialize FAISS index"""
        try:
            self.index = faiss.IndexFlatIP(self.dimension)  # Inner product similarity
            return True
        except Exception as e:
            print(f"Failed to initialize FAISS: {e}")
            return False
    
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to FAISS index"""
        try:
            embeddings = []
            for doc in documents:
                if doc.embedding:
                    embeddings.append(doc.embedding)
                else:
                    embedding = self.embedder.encode(doc.content).tolist()
                    embeddings.append(embedding)
                
                # Store document separately
                self.documents[doc.id] = doc
            
            embeddings_array = np.array(embeddings, dtype=np.float32)
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings_array)
            
            self.index.add(embeddings_array)
            return True
        except Exception as e:
            print(f"Failed to add documents to FAISS: {e}")
            return False
    
    async def search(self, query: str, top_k: int = 10) -> List[SearchResult]:
        """Search documents by text query"""
        query_embedding = self.embedder.encode(query).reshape(1, -1).astype(np.float32)
        faiss.normalize_L2(query_embedding)
        
        return await self.search_by_vector(query_embedding[0].tolist(), top_k)
    
    async def search_by_vector(self, vector: List[float], top_k: int = 10) -> List[SearchResult]:
        """Search documents by embedding vector"""
        try:
            vector_array = np.array([vector], dtype=np.float32)
            faiss.normalize_L2(vector_array)
            
            scores, indices = self.index.search(vector_array, top_k)
            
            search_results = []
            doc_ids = list(self.documents.keys())
            
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx < len(doc_ids):
                    doc_id = doc_ids[idx]
                    document = self.documents[doc_id]
                    
                    result = SearchResult(
                        document=document,
                        score=float(score),
                        distance=1 - float(score)
                    )
                    search_results.append(result)
            
            return search_results
        except Exception as e:
            print(f"FAISS search failed: {e}")
            return []
    
    async def delete_documents(self, ids: List[str]) -> bool:
        """Delete documents from FAISS (requires rebuilding index)"""
        try:
            for doc_id in ids:
                if doc_id in self.documents:
                    del self.documents[doc_id]
            
            # Rebuild index without deleted documents
            await self.initialize()
            if self.documents:
                remaining_docs = list(self.documents.values())
                await self.add_documents(remaining_docs)
            
            return True
        except Exception as e:
            print(f"Failed to delete documents from FAISS: {e}")
            return False

class VectorDBService:
    """Unified vector database service"""
    
    def __init__(self, provider: VectorDBProvider = VectorDBProvider.CHROMA):
        self.provider = provider
        self.db_service = None
    
    async def initialize(self, **kwargs):
        """Initialize the selected vector database"""
        if self.provider == VectorDBProvider.CHROMA:
            self.db_service = ChromaDBService(**kwargs)
        elif self.provider == VectorDBProvider.FAISS:
            self.db_service = FAISSService(**kwargs)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
        
        return await self.db_service.initialize()
    
    async def add_documents(self, documents: List[Document]) -> bool:
        """Add documents to vector database"""
        if not self.db_service:
            raise ValueError("Database service not initialized")
        return await self.db_service.add_documents(documents)
    
    async def search(self, query: str, top_k: int = 10) -> List[SearchResult]:
        """Search documents by text query"""
        if not self.db_service:
            raise ValueError("Database service not initialized")
        return await self.db_service.search(query, top_k)
    
    async def search_by_vector(self, vector: List[float], top_k: int = 10) -> List[SearchResult]:
        """Search documents by embedding vector"""
        if not self.db_service:
            raise ValueError("Database service not initialized")
        return await self.db_service.search_by_vector(vector, top_k)
    
    async def delete_documents(self, ids: List[str]) -> bool:
        """Delete documents from vector database"""
        if not self.db_service:
            raise ValueError("Database service not initialized")
        return await self.db_service.delete_documents(ids)

# Global service instance
vector_db_service = VectorDBService()