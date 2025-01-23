from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust to your React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["idea_central"]
ideas_collection = db["ideas"]

class IdeaForm(BaseModel):
    name: str
    email: str
    ideaTitle: str
    ideaCategory: List[str]
    ideaDescription: str
    valueAdd: Optional[str]
    valueAddWords: Optional[str]
    toolsTechnologies: List[str]
    contributors: Optional[str]
    complexity: Optional[str]
    primaryBeneficiary: List[str]
    implementIdea: Optional[str]
    googleLink: Optional[str]

# New endpoint to fetch all ideas
@app.get("/fetch_ideas/", response_model=List[IdeaForm])
async def get_all_ideas():
    ideas = []
    for idea in ideas_collection.find():
        idea["_id"] = str(idea["_id"])  # Convert ObjectId to string
        ideas.append(idea)
    return ideas

@app.get("/ideas/{idea_id}")
async def get_idea(idea_id: str):
    idea = ideas_collection.find_one({"_id": ObjectId(idea_id)})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea["_id"] = str(idea["_id"])  # Convert ObjectId to string for JSON
    return idea

@app.put("/ideas/{idea_id}")
async def update_idea(idea_id: str, idea: IdeaForm):
    if not ObjectId.is_valid(idea_id):
        raise HTTPException(status_code=400, detail="Invalid idea ID")

    result = ideas_collection.update_one(
        {"_id": ObjectId(idea_id)},
        {"$set": idea.dict()}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Idea not found or not modified")
    
    return {"message": "Idea updated successfully!"}

@app.post("/ideas/")
async def create_idea(idea: IdeaForm):
    # Convert idea data to a dictionary and insert it into MongoDB
    idea_dict = idea.dict()
    result = ideas_collection.insert_one(idea_dict)
    
    # Return the created idea ID
    return {"message": "Idea created successfully!", "idea_id": str(result.inserted_id)}
