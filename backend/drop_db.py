import motor.motor_asyncio
import asyncio

async def drop():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['plant_disease_db']
    await db['diseases'].drop()
    print('Successfully dropped diseases collection')

if __name__ == '__main__':
    asyncio.run(drop())
