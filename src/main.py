from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import os
from uuid import uuid4
import random
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Log to a file
        logging.StreamHandler()         # Also output logs to the console
    ]
)

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["idea_central"]
ideas_collection = db["ideas"]
users_collection = db["users"]

# User Model
class User(BaseModel):
    name: str
    email: str
    is_reviewer: bool = False
    review_count: int = 0
    review_ideas: List[str] = []  # List of idea IDs assigned for review

# Idea Model
class IdeaForm(BaseModel):
    idea_id: str = str(uuid4())  # Generate a unique ID for each idea
    name: str
    email: str
    ideaTitle: str
    ideaCategory: List[str] = []
    ideaDescription: str
    valueAdd: Optional[str] = None
    valueAddWords: Optional[str] = None
    toolsTechnologies: List[str] = []
    contributors: Optional[str] = None
    complexity: Optional[str] = None
    primaryBeneficiary: List[str] = []
    implementIdea: Optional[str] = None
    googleLink: Optional[str] = None
    status: Optional[str] = None
    # Fields for comments and reviews (optional)
    comment_name: Optional[str] = None
    review_date: Optional[str] = None
    comments: Optional[str] = None
    grading: Optional[str] = None
    feedback: Optional[str] = None

# Create a new user if they don't exist
@app.post("/users/login/")
async def login_user(user: User):
    # Check if the user exists
    existing_user = users_collection.find_one({"email": user.email})
    
    if not existing_user:
        # Create a new user if not found
        user_dict = user.dict()
        users_collection.insert_one(user_dict)
        return {"message": "New user created", "user": user_dict}
    
    return {"message": "User already exists", "user": existing_user}

# Create a new idea
@app.post("/ideas/")
async def create_idea(idea: IdeaForm):
    # Check if the email belongs to an existing user
    user = users_collection.find_one({"email": idea.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Insert the idea into the database
    idea_dict = idea.dict()
    ideas_collection.insert_one(idea_dict)

    # Fetch users who are reviewers (is_reviewer: True)
    reviewers = list(users_collection.find({"is_reviewer": True}))  # Get all users with is_reviewer=True
    if not reviewers:
        raise HTTPException(status_code=404, detail="No reviewers available to assign the idea.")

    # Randomly select a reviewer from the list
    random_reviewer = random.choice(reviewers)

    # Update the randomly selected reviewer to add the idea_id to their review_ideas and increment review_count
    users_collection.update_one(
        {"_id": random_reviewer["_id"]},
        {
            "$inc": {"review_count": 1},  # Increment the review count for the reviewer
            "$addToSet": {"review_ideas": idea.idea_id},  # Add the idea_id to the review_ideas list of the reviewer
        }
    )

    # If the user submitting the idea is not a reviewer, you can update their review count if desired
    if not user.get("is_reviewer", False):
        # Optionally: you can add the idea to this user's list of ideas or increment their review_count
        # But you can leave this out if not needed
        users_collection.update_one(
            {"email": idea.email},
            {"$inc": {"review_count": 1}}  # This is optional
        )

    return {"message": f"Idea created successfully and randomly assigned to {random_reviewer['name']}!", "idea_id": idea.idea_id}

# Fetch all ideas
@app.get("/ideas/")
async def get_all_ideas():
    ideas = []
    for idea in ideas_collection.find():
        idea["_id"] = str(idea["_id"])  # Convert ObjectId to string
        ideas.append(idea)
    return ideas

# Fetch a single idea by ID
@app.get("/ideas/{idea_id}")
async def get_idea(idea_id: str):
    idea = ideas_collection.find_one({"idea_id": idea_id})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea

# Update an idea
@app.put("/ideas/{idea_id}")
async def update_idea(idea_id: str, idea: IdeaForm):
    result = ideas_collection.update_one(
        {"idea_id": idea_id},
        {"$set": idea.dict(exclude_unset=True)}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Idea not found or not modified")

    return {"message": "Idea updated successfully!"}

# Fetch user details
@app.get("/users/{email}")
async def get_user(email: str):
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return user

@app.get("/fetch_ideas")
async def fetch_ideas():
    ideas = []
    for idea in ideas_collection.find():
        idea["_id"] = str(idea["_id"])  # Convert ObjectId to string
        ideas.append(idea)
    return ideas

@app.post("/update-user")
async def update_user(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        # Update logic here (for example, updating user details)
        users_collection.update_one({"email": user.email}, {"$set": user.dict()})
        return {"message": "User updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

# Fetch review ideas for a user
@app.get("/api/review-ideas")
async def get_review_ideas(ids: str = Query(...)):
    idea_ids = ids.split(",")
    review_ideas = []

    for idea_id in idea_ids:
        idea = ideas_collection.find_one({"idea_id": idea_id})
        if idea:
            idea["_id"] = str(idea["_id"])  # Convert ObjectId to string
            review_ideas.append(idea)

    if not review_ideas:
        raise HTTPException(status_code=404, detail="No ideas found.")

    return {"ideas": review_ideas}

