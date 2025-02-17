from fastapi import FastAPI, HTTPException, Query, Request
from pydantic import BaseModel, Field
from typing import List, Optional
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import os
from uuid import uuid4
import random
import logging
from fastapi import FastAPI, Request, Depends
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse
import os
from urllib.parse import unquote

# Setup Logging
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
    allow_origins=["*"],  # Allow frontend connection
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.add_middleware(SessionMiddleware, secret_key="your_secret_key")


# MongoDB Connection
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
    review_ideas: List[str] = []

# Idea Model
class IdeaForm(BaseModel):
    idea_id: str = Field(default_factory=lambda: str(uuid4()))
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
    comment_name: Optional[str] = None
    review_date: Optional[str] = None
    comments: Optional[str] = None
    grading: Optional[str] = None
    feedback: Optional[str] = None

# Assign Idea Request Model
class AssignIdeaRequest(BaseModel):
    assigned_user_email: str

# ✅ Fetch All Users (Fix: Removed `_id`)
@app.get("/users/", response_model=List[User])
async def get_users():
    users = list(users_collection.find({}, {"_id": 0}))  # Exclude `_id`
    return users

# ✅ Fetch All Ideas (Fix: Removed `_id`)
@app.get("/fetch_ideas/")
async def fetch_ideas():
    ideas = list(ideas_collection.find({}, {"_id": 0}))  # Exclude `_id`
    return ideas

# ✅ Assign an Idea to a Specific User (Fix: Using Pydantic Model)
@app.put("/api/update-idea/{idea_id}")
async def assign_idea_to_user(idea_id: str, request: AssignIdeaRequest):
    assigned_user_email = request.assigned_user_email

    # Check if the user exists
    user = users_collection.find_one({"email": assigned_user_email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Add the idea to the user's `review_ideas` list (if not already present)
    users_collection.update_one(
        {"email": assigned_user_email},
        {"$addToSet": {"review_ideas": idea_id}}  # Prevent duplicate assignments
    )

    return {"message": f"Idea {idea_id} assigned to {assigned_user_email} successfully!"}

# ✅ Create New User if Not Exists
@app.post("/users/login/")
async def login_user(user: User):
    existing_user = users_collection.find_one({"email": user.email})
    
    if not existing_user:
        user_dict = user.dict()
        users_collection.insert_one(user_dict)
        return {"message": "New user created", "user": user_dict}
    
    return {"message": "User already exists", "user": existing_user}

from urllib.parse import unquote

@app.get("/users/{email}")
async def get_user(email: str):
    decoded_email = unquote(email)  # Fix email encoding issue
    user = users_collection.find_one({"email": decoded_email})

    if not user:
        raise HTTPException(status_code=404, detail=f"User {decoded_email} not found")

    user["_id"] = str(user["_id"])  # Convert MongoDB ObjectId to string
    return user


# ✅ Create New Idea and Assign a Random Reviewer
@app.post("/ideas/")
async def create_idea(idea: IdeaForm):
    new_idea_id = str(uuid4())  # Generate unique ID
    idea.idea_id = new_idea_id

    # Ensure user exists
    user = users_collection.find_one({"email": idea.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Insert idea into database
    idea_dict = idea.dict()
    ideas_collection.insert_one(idea_dict)

    # Find reviewers
    reviewers = list(users_collection.find({"is_reviewer": True}))
    if not reviewers:
        raise HTTPException(status_code=404, detail="No reviewers available")

    # Assign a random reviewer
    random_reviewer = random.choice(reviewers)

    # Update reviewer's assigned ideas
    users_collection.update_one(
        {"_id": random_reviewer["_id"]},
        {"$addToSet": {"review_ideas": idea.idea_id}, "$inc": {"review_count": 1}}
    )

    # 🛠️ Update the submitter's data and add 100 beans
    update_result = users_collection.update_one(
        {"email": idea.email},
        {
            "$push": {"submitted_ideas": idea.idea_id},
            "$setOnInsert": {"review_count": 0},
            "$inc": {"beans": 100}  # Increment beans by 100
        },
        upsert=True
    )

    # 🛠️ Debugging: Log the update result
    logging.info(f"MongoDB Update Result: {update_result.raw_result}")

    return {
        "message": f"Idea assigned to {random_reviewer['name']}!",
        "idea_id": idea.idea_id,
        "beans_added": 100,
        "update_result": update_result.raw_result
    }


# ✅ Fetch Idea by ID
@app.get("/ideas/{idea_id}")
async def get_idea(idea_id: str):
    idea = ideas_collection.find_one({"idea_id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea

# ✅ Fetch Review Ideas for a User
@app.get("/api/review-ideas")
async def get_review_ideas(ids: str = Query(...)):
    idea_ids = ids.split(",")
    review_ideas = [
        {**idea, "_id": str(idea["_id"])}
        for idea in ideas_collection.find({"idea_id": {"$in": idea_ids}})
    ]

    if not review_ideas:
        raise HTTPException(status_code=404, detail="No ideas found.")

    return {"ideas": review_ideas}

# ✅ Update an Idea
@app.put("/ideas/{idea_id}")
async def update_idea(idea_id: str, idea: IdeaForm):
    logging.info(f"Received payload: {idea.dict()}")  

    result = ideas_collection.update_one(
        {"idea_id": idea_id},
        {"$set": idea.dict(exclude_unset=True)}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Idea not modified or not found")

    return {"message": "Idea updated successfully!"}


@app.put("/api/edit-idea-fields/{idea_id}")
async def edit_idea_fields(idea_id: str, updated_fields: dict):
    idea_id = idea_id.strip()  # Remove any trailing spaces

    logging.info(f"Checking if idea with ID {idea_id} exists in database...")

    # Ensure idea_id is a string when querying
    existing_idea = ideas_collection.find_one({"idea_id": str(idea_id)})

    if not existing_idea:
        logging.error(f"Idea ID {idea_id} NOT found in MongoDB!")
        raise HTTPException(status_code=404, detail="Idea not found in database")

    logging.info(f"Idea found: {existing_idea}, updating fields: {updated_fields}")

    update_result = ideas_collection.update_one(
        {"idea_id": str(idea_id)},  # Force match as string
        {"$set": updated_fields}
    )

    if update_result.modified_count == 0:
        logging.warning(f"Idea {idea_id} was not modified (same values or error).")

    return {"message": "Idea updated successfully!"}

@app.get("/api/top-submitters")
async def get_top_submitters():
    top_submitters = list(
        users_collection.find({}, {"_id": 0, "name": 1, "email": 1, "beans": 1})
        .sort("beans", -1)  # Sort by beans (highest first)
        .limit(5)  # Get top 5 users
    )

    if not top_submitters:
        raise HTTPException(status_code=404, detail="No top submitters found")

    return {"submitters": top_submitters}

@app.get("/api/user-ideas/{email}")
async def get_user_ideas(email: str):
    user_ideas = list(ideas_collection.find({"email": email}, {"_id": 0}))  # Exclude _id for cleaner response
    if not user_ideas:
        raise HTTPException(status_code=404, detail="No ideas found for this user")
    return user_ideas

@app.get("/users/{email}")
async def get_user(email: str):
    decoded_email = unquote(email)  # Fix email encoding issue
    user = users_collection.find_one({"email": decoded_email})

    if not user:
        raise HTTPException(status_code=404, detail=f"User {decoded_email} not found")

    user["_id"] = str(user["_id"])  # Convert MongoDB ObjectId to string
    return user


@app.get("/fetch_ideas/{user_email}")
async def fetch_user_ideas(user_email: str):
    decoded_email = unquote(user_email)  # Ensure email is properly decoded
    user_ideas = list(ideas_collection.find({"email": decoded_email}, {"_id": 0}))

    if not user_ideas:
        raise HTTPException(status_code=404, detail="No ideas found for this user")

    return user_ideas



oauth = OAuth()
oauth.register(
    name="google",
    client_id="YOUR_GOOGLE_CLIENT_ID",
    client_secret="YOUR_GOOGLE_CLIENT_SECRET",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://oauth2.googleapis.com/token",
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri="http://127.0.0.1:8000/auth/google/callback",
    client_kwargs={"scope": "openid email profile"},
)

@app.get("/auth/google")
async def login_via_google(request: Request):
    redirect_uri = "http://127.0.0.1:8000/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    
    # Store user details in session or DB
    request.session["user"] = user
    return RedirectResponse(url=f"http://localhost:3000/mainhomepage?email={user['email']}")
