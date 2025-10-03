from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
import aiosqlite
from pathlib import Path

# Ensure database directory exists
db_path = Path("./data/lumina_ops.db")
db_path.parent.mkdir(parents=True, exist_ok=True)

# Create async database engine for SQLite
engine = create_async_engine(
    f"sqlite+aiosqlite:///{db_path}",
    echo=settings.DEBUG,
    future=True
)

# Create async session maker
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Create base class for models
Base = declarative_base()

# Simple in-memory cache (fallback for Redis)
class SimpleCache:
    def __init__(self):
        self._cache = {}
    
    async def get(self, key: str):
        return self._cache.get(key)
    
    async def set(self, key: str, value, expire: int = None):
        self._cache[key] = value
    
    async def delete(self, key: str):
        self._cache.pop(key, None)

# Cache client (fallback implementation)
cache_client = SimpleCache()

async def get_db_session():
    """Dependency to get database session."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_cache():
    """Dependency to get cache client."""
    return cache_client