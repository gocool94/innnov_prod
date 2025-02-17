

import pandas as pd
from pymongo import MongoClient
import os
from uuid import uuid4

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["idea_central"]
ideas_collection = db["ideas"]
users_collection = db["users"]

# Read CSV File
csv_file = f"D:\\Projects\\React-Websites\\Kipi_Innovate2-main\\Kipi_Innovate2-main\\src\\Ideas.csv"  # Update with your actual file path

try:
    df = pd.read_csv(csv_file, encoding="ISO-8859-1")  # Handle encoding issue
except UnicodeDecodeError:
    df = pd.read_csv(csv_file, encoding="utf-8", errors='replace')  # Try another encoding if needed

# Process each row
for index, row in df.iterrows():
    email = row["Idea Submitter"].strip().lower()
    user = users_collection.find_one({"email": email})

    # If user does not exist, create a new one
    if not user:
        user_data = {
            "name": email.split("@")[0].capitalize(),  # Default name from email
            "email": email,
            "password": "password123",  # Default password (change as needed)
            "beans": 0,
            "admin": False,
            "is_reviewer": False,
            "review_count": 0,
            "review_ideas": [],
            "submitted_ideas": []
        }
        users_collection.insert_one(user_data)
        print(f"New user created: {email}")
    
    # Create idea entry
    idea_data = {
        "idea_id": str(uuid4()),
        "name": user["name"] if user else user_data["name"],
        "email": email,
        "ideaTitle": row["Idea Title"],
        "ideaCategory": [row["Idea Category"]],
        "ideaDescription": row["Idea Description"],
        "toolsTechnologies": [row["Tool/Technology"]],
        "status": row["Status and ETA"],
        "contributors": row["Contributors"],
        "googleLink": row["Google Drive link to resources"],
        "valueAddWords": row["Value Add in words"],
    }
    
    # Insert into MongoDB
    ideas_collection.insert_one(idea_data)
    print(f"Idea inserted: {row['Idea Title']}")

print("✅ CSV data successfully uploaded to MongoDB!")
